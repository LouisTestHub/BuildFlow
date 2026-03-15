import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as { companyId: string }
  const now = new Date()

  const invoices = await db.invoice.findMany({
    where: { companyId: user.companyId, type: "SALES", status: { in: ["SENT", "OVERDUE"] } },
    include: { job: { select: { title: true, clientName: true, reference: true } } },
    orderBy: { dueDate: "asc" },
  })

  const data = invoices.map((inv) => {
    const dueDate = inv.dueDate ? new Date(inv.dueDate) : null
    const daysOutstanding = dueDate ? Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)) : 0
    let ageingBand = "Current"
    if (daysOutstanding > 90) ageingBand = "90+ days"
    else if (daysOutstanding > 60) ageingBand = "61-90 days"
    else if (daysOutstanding > 30) ageingBand = "31-60 days"
    else if (daysOutstanding > 0) ageingBand = "1-30 days"

    return {
      id: inv.id,
      number: inv.number,
      client: inv.job?.clientName || "Unknown",
      jobTitle: inv.job?.title || "N/A",
      jobRef: inv.job?.reference || "N/A",
      amount: Number(inv.amount),
      vat: Number(inv.vat),
      total: Number(inv.total),
      status: inv.status,
      dueDate: inv.dueDate,
      daysOutstanding: Math.max(0, daysOutstanding),
      ageingBand,
    }
  })

  // Ageing summary
  const summary = {
    current: data.filter((d) => d.ageingBand === "Current").reduce((s, d) => s + d.total, 0),
    "1-30": data.filter((d) => d.ageingBand === "1-30 days").reduce((s, d) => s + d.total, 0),
    "31-60": data.filter((d) => d.ageingBand === "31-60 days").reduce((s, d) => s + d.total, 0),
    "61-90": data.filter((d) => d.ageingBand === "61-90 days").reduce((s, d) => s + d.total, 0),
    "90+": data.filter((d) => d.ageingBand === "90+ days").reduce((s, d) => s + d.total, 0),
    total: data.reduce((s, d) => s + d.total, 0),
  }

  return NextResponse.json({ invoices: data, summary })
}
