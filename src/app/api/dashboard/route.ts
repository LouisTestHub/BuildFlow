import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as { companyId: string }
  const companyId = user.companyId

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1)

  // Financial KPIs
  const [salesInvoices, purchaseInvoices, paidThisMonth, allJobs, activeJobs, openSnagItems, teamCertsExpiring, subbieCertsExpiring, pendingTimesheets, overdueInvoices, recentAuditLogs] = await Promise.all([
    // Receivables (SENT/OVERDUE sales invoices)
    db.invoice.findMany({
      where: { companyId, type: "SALES", status: { in: ["SENT", "OVERDUE"] } },
      select: { total: true, dueDate: true },
    }),
    // Payables (SENT/OVERDUE purchase invoices due within 30 days)
    db.invoice.findMany({
      where: { companyId, type: { in: ["PURCHASE", "CIS"] }, status: { in: ["SENT", "OVERDUE"] }, dueDate: { lte: thirtyDaysFromNow } },
      select: { total: true },
    }),
    // Revenue MTD
    db.invoice.findMany({
      where: { companyId, type: "SALES", status: "PAID", updatedAt: { gte: monthStart } },
      select: { total: true },
    }),
    // All live jobs with phases and invoices for margin calc
    db.job.findMany({
      where: { companyId, status: "LIVE" },
      include: {
        phases: { select: { budget: true } },
        invoices: { where: { type: "PURCHASE", status: { not: "VOID" } }, select: { total: true } },
        subcontractOrders: { select: { value: true } },
      },
    }),
    // Active jobs count
    db.job.count({ where: { companyId, status: "LIVE" } }),
    // Open snag items
    db.snagItem.count({
      where: { status: "OPEN", snagList: { job: { companyId } } },
    }),
    // Team certs expiring
    db.user.findMany({
      where: { companyId, cscsExpiry: { lte: thirtyDaysFromNow, gte: now } },
      select: { name: true, cscsExpiry: true },
    }),
    // Subbie certs expiring
    db.subcontractorCert.findMany({
      where: { subcontractor: { companyId }, expiryDate: { lte: thirtyDaysFromNow, gte: now } },
      include: { subcontractor: { select: { name: true } } },
    }),
    // Pending timesheets
    db.timesheet.findMany({
      where: { status: "SUBMITTED", user: { companyId } },
      include: { user: { select: { name: true } } },
    }),
    // Overdue invoices
    db.invoice.findMany({
      where: { companyId, type: "SALES", status: "OVERDUE" },
      include: { job: { select: { clientName: true } } },
    }),
    // Recent audit logs
    db.auditLog.findMany({
      where: { companyId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: { user: { select: { name: true } } },
    }),
  ])

  // Calculate financial KPIs
  const receivables = salesInvoices.reduce((sum, i) => sum + Number(i.total), 0)
  const payables = purchaseInvoices.reduce((sum, i) => sum + Number(i.total), 0)
  const cashPosition = receivables - payables
  const revenueMTD = paidThisMonth.reduce((sum, i) => sum + Number(i.total), 0)
  const outstandingTotal = salesInvoices.reduce((sum, i) => sum + Number(i.total), 0)
  const overdueCount = overdueInvoices.length

  // Average job margin
  const jobMargins = allJobs.map((job) => {
    const budget = job.phases.reduce((s, p) => s + Number(p.budget || 0), 0)
    const costs = job.invoices.reduce((s, i) => s + Number(i.total), 0) +
      job.subcontractOrders.reduce((s, o) => s + Number(o.value || 0), 0)
    const contractValue = Number(job.contractValue || budget)
    const margin = contractValue > 0 ? ((contractValue - costs) / contractValue) * 100 : 0
    return { id: job.id, title: job.title, reference: job.reference, margin: Math.round(margin * 10) / 10, contractValue, costs }
  })
  const avgMargin = jobMargins.length > 0
    ? Math.round((jobMargins.reduce((s, j) => s + j.margin, 0) / jobMargins.length) * 10) / 10
    : 0

  // Cash flow data (3 months)
  const cashFlowData = await db.cashFlowForecast.findMany({
    where: { job: { companyId }, month: { gte: threeMonthsAgo } },
    select: { month: true, incomeForecast: true, costForecast: true },
  })

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  const cashFlowByMonth: Record<string, { income: number; costs: number }> = {}
  for (let i = 0; i < 3; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 2 + i, 1)
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
    cashFlowByMonth[key] = { income: 0, costs: 0 }
  }
  cashFlowData.forEach((cf) => {
    const d = new Date(cf.month)
    const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
    if (cashFlowByMonth[key]) {
      cashFlowByMonth[key].income += Number(cf.incomeForecast)
      cashFlowByMonth[key].costs += Number(cf.costForecast)
    }
  })

  // If no cash flow forecasts, derive from invoices
  if (cashFlowData.length === 0) {
    for (let i = 0; i < 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - 2 + i, 1)
      const end = new Date(now.getFullYear(), now.getMonth() - 1 + i, 1)
      const key = `${monthNames[d.getMonth()]} ${d.getFullYear()}`
      const income = await db.invoice.aggregate({
        where: { companyId, type: "SALES", createdAt: { gte: d, lt: end } },
        _sum: { total: true },
      })
      const costs = await db.invoice.aggregate({
        where: { companyId, type: { in: ["PURCHASE", "CIS"] }, createdAt: { gte: d, lt: end } },
        _sum: { total: true },
      })
      cashFlowByMonth[key] = {
        income: Number(income._sum.total || 0),
        costs: Number(costs._sum.total || 0),
      }
    }
  }

  const certExpiries = [
    ...teamCertsExpiring.map((u) => ({ name: u.name, type: "CSCS Card", expiryDate: u.cscsExpiry })),
    ...subbieCertsExpiring.map((c) => ({ name: c.subcontractor.name, type: c.type, expiryDate: c.expiryDate })),
  ]

  const overdueList = overdueInvoices.map((inv) => {
    const daysOverdue = inv.dueDate ? Math.floor((now.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24)) : 0
    return { number: inv.number, client: inv.job?.clientName || "Unknown", amount: Number(inv.total), daysOverdue }
  })

  const pendingTimesheetList = pendingTimesheets.map((ts) => ({
    id: ts.id,
    name: ts.user.name,
    weekStart: ts.weekStart,
  }))

  const recentActivity = recentAuditLogs.map((log) => ({
    id: log.id,
    action: log.action,
    entity: log.entity,
    entityId: log.entityId,
    details: log.details,
    userName: log.user?.name || "System",
    createdAt: log.createdAt,
  }))

  return NextResponse.json({
    financial: {
      cashPosition,
      revenueMTD,
      outstandingTotal,
      overdueCount,
      avgMargin,
    },
    operational: {
      activeJobs,
      openSnags: openSnagItems,
      certExpiries: certExpiries.length,
      pendingTimesheets: pendingTimesheets.length,
    },
    charts: {
      jobProfitability: jobMargins.sort((a, b) => b.margin - a.margin),
      cashFlow: Object.entries(cashFlowByMonth).map(([month, data]) => ({ month, ...data })),
    },
    actionItems: {
      overdueInvoices: overdueList,
      expiringCerts: certExpiries,
      pendingTimesheets: pendingTimesheetList,
    },
    recentActivity,
  })
}
