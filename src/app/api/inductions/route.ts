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
  const dateFrom = url.get("dateFrom") || ""
  const dateTo = url.get("dateTo") || ""

  const where: Record<string, unknown> = { job: { companyId: session.user.companyId } }
  if (jobId) where.jobId = jobId
  if (dateFrom || dateTo) {
    const dateFilter: Record<string, Date> = {}
    if (dateFrom) dateFilter.gte = new Date(dateFrom)
    if (dateTo) dateFilter.lte = new Date(dateTo)
    where.date = dateFilter
  }

  const inductions = await db.induction.findMany({
    where,
    orderBy: { date: "desc" },
    include: {
      job: { select: { id: true, reference: true, title: true } },
    },
  })

  return NextResponse.json({ inductions })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const body = await req.json()

  const job = await db.job.findFirst({
    where: { id: body.jobId, companyId: session.user.companyId },
  })
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const induction = await db.induction.create({
    data: {
      jobId: body.jobId,
      personName: body.personName,
      companyName: body.companyName || null,
      date: new Date(body.date),
      inductedBy: body.inductedBy || null,
      signed: body.signed || false,
      topics: body.topics || [],
    },
  })

  return NextResponse.json({ induction }, { status: 201 })
}
