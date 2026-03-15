import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const role = (session.user as Record<string, unknown>).role as string
  if (!["DIRECTOR", "PROJECT_MANAGER"].includes(role)) {
    return NextResponse.json({ error: "Managers only" }, { status: 403 })
  }

  const { id } = await params

  const timesheet = await db.timesheet.findUnique({ where: { id } })
  if (!timesheet) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (timesheet.status !== "SUBMITTED") {
    return NextResponse.json({ error: "Can only approve SUBMITTED timesheets" }, { status: 400 })
  }

  const updated = await db.timesheet.update({
    where: { id },
    data: { status: "APPROVED" },
  })

  return NextResponse.json({ timesheet: updated })
}
