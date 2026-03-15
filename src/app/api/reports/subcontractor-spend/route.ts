import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as { companyId: string }

  const subs = await db.subcontractor.findMany({
    where: { companyId: user.companyId },
    include: {
      orders: {
        where: { status: { not: "DRAFT" } },
        include: { job: { select: { title: true, reference: true } } },
      },
    },
  })

  const data = subs.map((sub) => {
    const totalSpend = sub.orders.reduce((s, o) => s + Number(o.value || 0), 0)
    const ordersByJob = sub.orders.reduce((acc, o) => {
      const key = o.job.reference
      if (!acc[key]) acc[key] = { jobTitle: o.job.title, jobRef: o.job.reference, total: 0, orderCount: 0 }
      acc[key].total += Number(o.value || 0)
      acc[key].orderCount++
      return acc
    }, {} as Record<string, { jobTitle: string; jobRef: string; total: number; orderCount: number }>)

    return {
      id: sub.id,
      name: sub.name,
      trade: sub.trade,
      totalSpend,
      orderCount: sub.orders.length,
      jobBreakdown: Object.values(ordersByJob),
    }
  }).filter((s) => s.totalSpend > 0).sort((a, b) => b.totalSpend - a.totalSpend)

  return NextResponse.json(data)
}
