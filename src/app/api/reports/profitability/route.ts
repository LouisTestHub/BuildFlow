import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as { companyId: string }

  const jobs = await db.job.findMany({
    where: { companyId: user.companyId },
    include: {
      phases: { select: { budget: true } },
      invoices: { where: { type: "PURCHASE", status: { not: "VOID" } }, select: { total: true } },
      subcontractOrders: { where: { status: { not: "DRAFT" } }, select: { value: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  const data = jobs.map((job) => {
    const totalBudget = job.phases.reduce((s, p) => s + Number(p.budget || 0), 0)
    const purchaseCosts = job.invoices.reduce((s, i) => s + Number(i.total), 0)
    const subCosts = job.subcontractOrders.reduce((s, o) => s + Number(o.value || 0), 0)
    const totalCosts = purchaseCosts + subCosts
    const contractValue = Number(job.contractValue || totalBudget)
    const profit = contractValue - totalCosts
    const margin = contractValue > 0 ? (profit / contractValue) * 100 : 0

    return {
      id: job.id,
      reference: job.reference,
      title: job.title,
      status: job.status,
      contractValue,
      totalBudget,
      totalCosts,
      profit,
      margin: Math.round(margin * 10) / 10,
    }
  })

  return NextResponse.json(data)
}
