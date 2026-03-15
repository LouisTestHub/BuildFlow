import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params

  const timesheet = await db.timesheet.findUnique({
    where: { id },
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

  if (!timesheet) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ timesheet })
}
