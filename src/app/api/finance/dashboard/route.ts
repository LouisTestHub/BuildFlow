import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1)

  // All invoices for company
  const invoices = await db.invoice.findMany({ where: { companyId } })

  // KPIs
  const salesInvoices = invoices.filter(i => i.type === "SALES")
  const purchaseInvoices = invoices.filter(i => i.type === "PURCHASE" || i.type === "CIS")

  const paidSales = salesInvoices.filter(i => i.status === "PAID")
  const outstandingInvoices = salesInvoices.filter(i => i.status === "SENT" || i.status === "OVERDUE")
  const overdueInvoices = salesInvoices.filter(i => i.status === "OVERDUE")
  const totalPaidCosts = purchaseInvoices.filter(i => i.status === "PAID").reduce((s, i) => s + Number(i.total), 0)
  const totalPaidIncome = paidSales.reduce((s, i) => s + Number(i.total), 0)

  const cashPosition = totalPaidIncome - totalPaidCosts
  const outstandingTotal = outstandingInvoices.reduce((s, i) => s + Number(i.total), 0)
  const overdueCount = overdueInvoices.length

  // CIS deductions this month
  const cisDeductions = await db.cISDeduction.findMany({
    where: { subcontractor: { companyId }, taxMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}` },
  })
  const cisThisMonth = cisDeductions.reduce((s, d) => s + Number(d.deductionAmount), 0)

  // Revenue MTD
  const revenueMTD = salesInvoices
    .filter(i => i.status === "PAID" && i.updatedAt >= monthStart)
    .reduce((s, i) => s + Number(i.total), 0)

  // Cash flow — 6 months
  const cashFlow: { month: string; income: number; costs: number }[] = []
  for (let m = 0; m < 6; m++) {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - m), 1)
    const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59)
    const label = d.toLocaleDateString("en-GB", { month: "short", year: "2-digit" })

    const income = salesInvoices
      .filter(i => i.status === "PAID" && i.updatedAt >= d && i.updatedAt <= end)
      .reduce((s, i) => s + Number(i.total), 0)

    const costs = purchaseInvoices
      .filter(i => i.status === "PAID" && i.updatedAt >= d && i.updatedAt <= end)
      .reduce((s, i) => s + Number(i.total), 0)

    cashFlow.push({ month: label, income, costs })
  }

  // Ageing report (receivables)
  const ageing = { current: 0, thirty: 0, sixty: 0, ninety: 0 }
  for (const inv of outstandingInvoices) {
    if (!inv.dueDate) { ageing.current += Number(inv.total); continue }
    const daysOverdue = Math.floor((now.getTime() - new Date(inv.dueDate).getTime()) / 86400000)
    if (daysOverdue <= 0) ageing.current += Number(inv.total)
    else if (daysOverdue <= 30) ageing.thirty += Number(inv.total)
    else if (daysOverdue <= 60) ageing.sixty += Number(inv.total)
    else ageing.ninety += Number(inv.total)
  }

  return NextResponse.json({
    kpis: { cashPosition, outstandingTotal, overdueCount, cisThisMonth, revenueMTD },
    cashFlow,
    ageing,
  })
}
