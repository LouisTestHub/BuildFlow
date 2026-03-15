import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const weekStart = searchParams.get("weekStart")
  const userId = searchParams.get("userId") || session.user.id

  const where: Record<string, unknown> = { userId }
  if (weekStart) {
    where.weekStart = new Date(weekStart)
  }

  const timesheets = await db.timesheet.findMany({
    where,
    include: {
      entries: {
        include: {
          job: { select: { id: true, reference: true, title: true } },
        },
      },
      user: { select: { id: true, name: true } },
    },
    orderBy: { weekStart: "desc" },
    take: 10,
  })

  return NextResponse.json({ timesheets })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const userId = body.userId || session.user.id
  const weekStart = new Date(body.weekStart)

  // Upsert timesheet
  let timesheet = await db.timesheet.findFirst({
    where: { userId, weekStart },
  })

  if (!timesheet) {
    timesheet = await db.timesheet.create({
      data: { userId, weekStart, status: "DRAFT" },
    })
  }

  // Update entries
  if (body.entries && Array.isArray(body.entries)) {
    // Delete existing entries for this timesheet
    await db.timesheetEntry.deleteMany({ where: { timesheetId: timesheet.id } })

    // Create new entries
    for (const entry of body.entries) {
      if (entry.jobId && entry.date) {
        const hours = parseFloat(entry.hours || "0")
        await db.timesheetEntry.create({
          data: {
            timesheetId: timesheet.id,
            jobId: entry.jobId,
            date: new Date(entry.date),
            hoursNormal: Math.min(hours, 8),
            hoursOvertime: Math.max(0, hours - 8),
            travel: entry.travel || false,
            notes: entry.notes || null,
          },
        })
      }
    }
  }

  const result = await db.timesheet.findUnique({
    where: { id: timesheet.id },
    include: {
      entries: {
        include: {
          job: { select: { id: true, reference: true, title: true } },
        },
      },
    },
  })

  return NextResponse.json({ timesheet: result })
}
