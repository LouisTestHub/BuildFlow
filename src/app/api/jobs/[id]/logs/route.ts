import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const url = req.nextUrl.searchParams
  const page = Math.max(1, parseInt(url.get("page") || "1"))
  const limit = Math.min(100, Math.max(1, parseInt(url.get("limit") || "20")))

  const job = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
    select: { id: true },
  })
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  const [logs, total] = await Promise.all([
    db.dailyLog.findMany({
      where: { jobId: id },
      orderBy: { date: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: { user: { select: { name: true } } },
    }),
    db.dailyLog.count({ where: { jobId: id } }),
  ])

  return NextResponse.json({
    logs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const job = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
    select: { id: true },
  })
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  // Combine separate note fields into structured notes
  const notesParts: string[] = []
  if (body.work_completed) notesParts.push(`[WORK] ${body.work_completed}`)
  if (body.issues_delays) notesParts.push(`[ISSUES] ${body.issues_delays}`)
  if (body.hs_notes) notesParts.push(`[H&S] ${body.hs_notes}`)
  const combinedNotes = notesParts.length > 0 ? notesParts.join("\n") : (body.notes || null)

  const log = await db.dailyLog.create({
    data: {
      jobId: id,
      userId: session.user.id,
      date: body.date ? new Date(body.date) : new Date(),
      weather: body.weather || null,
      labourCount: body.labour_count ? parseInt(body.labour_count) : null,
      visitors: body.visitors || null,
      notes: combinedNotes,
    },
  })

  return NextResponse.json({ log }, { status: 201 })
}
