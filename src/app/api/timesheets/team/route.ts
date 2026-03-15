import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const role = (session.user as Record<string, unknown>).role as string
  if (!["DIRECTOR", "PROJECT_MANAGER"].includes(role)) {
    return NextResponse.json({ error: "Managers only" }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const weekStart = searchParams.get("weekStart")
  const companyId = (session.user as Record<string, unknown>).companyId as string

  if (!weekStart) {
    return NextResponse.json({ error: "weekStart required" }, { status: 400 })
  }

  const weekDate = new Date(weekStart)

  // Get all team members
  const users = await db.user.findMany({
    where: { companyId },
    select: { id: true, name: true, role: true },
    orderBy: { name: "asc" },
  })

  // Get all timesheets for this week
  const timesheets = await db.timesheet.findMany({
    where: {
      weekStart: weekDate,
      user: { companyId },
    },
    include: {
      user: { select: { id: true, name: true, role: true } },
      entries: {
        include: {
          job: { select: { id: true, reference: true, title: true } },
        },
        orderBy: { date: "asc" },
      },
    },
  })

  // Map users to their timesheets
  const teamTimesheets = users.map((u) => {
    const ts = timesheets.find((t) => t.userId === u.id)
    const totalHours = ts
      ? ts.entries.reduce(
          (sum, e) => sum + Number(e.hoursNormal) + Number(e.hoursOvertime),
          0
        )
      : 0
    return {
      user: u,
      timesheet: ts || null,
      totalHours,
      status: ts?.status || "NOT_STARTED",
    }
  })

  return NextResponse.json({ teamTimesheets, weekStart: weekDate })
}
