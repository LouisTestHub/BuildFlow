import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const url = req.nextUrl.searchParams
  const jobId = url.get("jobId") || ""
  const severity = url.get("severity") || ""
  const dateFrom = url.get("dateFrom") || ""
  const dateTo = url.get("dateTo") || ""

  const where: Record<string, unknown> = { job: { companyId: session.user.companyId } }
  if (jobId) where.jobId = jobId
  if (severity) where.severity = severity
  if (dateFrom || dateTo) {
    const dateFilter: Record<string, Date> = {}
    if (dateFrom) dateFilter.gte = new Date(dateFrom)
    if (dateTo) dateFilter.lte = new Date(dateTo)
    where.date = dateFilter
  }

  const incidents = await db.incident.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      job: { select: { id: true, reference: true, title: true } },
      user: { select: { id: true, name: true } },
    },
  })

  return NextResponse.json({ incidents })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.companyId || !session.user.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const body = await req.json()

  const job = await db.job.findFirst({
    where: { id: body.jobId, companyId: session.user.companyId },
  })
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const incident = await db.incident.create({
    data: {
      jobId: body.jobId,
      userId: session.user.id,
      date: new Date(body.date),
      severity: body.severity,
      description: body.description,
      investigationNotes: body.investigationNotes || null,
      correctiveActions: body.correctiveActions || null,
      photos: body.photos || null,
      status: body.status || "OPEN",
    },
  })

  return NextResponse.json({ incident }, { status: 201 })
}
