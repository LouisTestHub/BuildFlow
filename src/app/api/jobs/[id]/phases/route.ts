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

  const job = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
    select: { id: true },
  })
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  const phases = await db.jobPhase.findMany({
    where: { jobId: id },
    orderBy: { order: "asc" },
  })

  return NextResponse.json({ phases })
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

  // Get next order
  const lastPhase = await db.jobPhase.findFirst({
    where: { jobId: id },
    orderBy: { order: "desc" },
  })
  const nextOrder = (lastPhase?.order || 0) + 1

  const phase = await db.jobPhase.create({
    data: {
      jobId: id,
      name: body.name,
      order: body.order ?? nextOrder,
      budget: body.budget ? parseFloat(body.budget) : null,
      startDate: body.start_date ? new Date(body.start_date) : null,
      endDate: body.end_date ? new Date(body.end_date) : null,
      status: body.status || "NOT_STARTED",
    },
  })

  return NextResponse.json({ phase }, { status: 201 })
}
