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
    where: { taxMonth, subcontractor: { companyId } },
    include: { subcontractor: { select: { name: true, cisUtr: true, cisTaxStatus: true } } },
  })

  const headers = ["Subcontractor", "UTR", "Verification Status", "Gross (£)", "Deduction Rate (%)", "Deduction Amount (£)", "Net (£)", "Tax Month"]
  const rows = deductions.map(d => [
    d.subcontractor.name,
    d.subcontractor.cisUtr || "",
    d.subcontractor.cisTaxStatus,
    Number(d.gross).toFixed(2),
    Number(d.deductionRate).toFixed(0),
    Number(d.deductionAmount).toFixed(2),
    Number(d.net).toFixed(2),
    d.taxMonth,
  ])

  const csv = [headers.join(","), ...rows.map(r => r.map(c => `"${c}"`).join(","))].join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="CIS-Return-${taxMonth}.csv"`,
    },
  })
}
