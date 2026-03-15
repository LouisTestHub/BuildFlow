import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const timesheet = await db.timesheet.findUnique({ where: { id } })
  if (!timesheet) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (timesheet.status !== "DRAFT") {
    return NextResponse.json({ error: "Can only submit DRAFT timesheets" }, { status: 400 })
  }

  const updated = await db.timesheet.update({
    where: { id },
    data: { status: "SUBMITTED" },
  })

  return NextResponse.json({ timesheet: updated })
}
