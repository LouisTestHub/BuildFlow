import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const url = new URL(req.url)
  const year = parseInt(url.searchParams.get("year") || String(new Date().getFullYear()))
  const month = parseInt(url.searchParams.get("month") || String(new Date().getMonth() + 1))
  const taxMonth = `${year}-${String(month).padStart(2, "0")}`

  const deductions = await db.cISDeduction.findMany({
    where: {
      taxMonth,
      subcontractor: { companyId },
    },
    include: {
      subcontractor: { select: { id: true, name: true, cisUtr: true, cisTaxStatus: true } },
      invoice: { select: { number: true, createdAt: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  // Group by subcontractor
  const bySubbie: Record<string, {
    subcontractor: { id: string; name: string; cisUtr: string | null; cisTaxStatus: string }
    gross: number
    materials: number
    cisLiable: number
    rate: number
    deduction: number
    net: number
    entries: typeof deductions
  }> = {}

  for (const d of deductions) {
    const key = d.subcontractorId
    if (!bySubbie[key]) {
      bySubbie[key] = {
        subcontractor: d.subcontractor,
        gross: 0, materials: 0, cisLiable: 0, rate: Number(d.deductionRate), deduction: 0, net: 0,
        entries: [],
      }
    }
    const gross = Number(d.gross)
    const deductionAmt = Number(d.deductionAmount)
    const netAmt = Number(d.net)
    const materials = gross - (gross - (deductionAmt / (Number(d.deductionRate) / 100 || 1)))

    bySubbie[key].gross += gross
    bySubbie[key].deduction += deductionAmt
    bySubbie[key].net += netAmt
    bySubbie[key].cisLiable += gross - materials
    bySubbie[key].materials += materials
    bySubbie[key].entries.push(d)
  }

  const summary = Object.values(bySubbie)
  const totals = {
    gross: summary.reduce((s, r) => s + r.gross, 0),
    materials: summary.reduce((s, r) => s + r.materials, 0),
    cisLiable: summary.reduce((s, r) => s + r.cisLiable, 0),
    deduction: summary.reduce((s, r) => s + r.deduction, 0),
    net: summary.reduce((s, r) => s + r.net, 0),
  }

  return NextResponse.json({ taxMonth, summary, totals })
}
