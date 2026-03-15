import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; phaseId: string }> }
) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id, phaseId } = await params
  const body = await req.json()

  const job = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
    select: { id: true },
  })
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  const existing = await db.jobPhase.findFirst({
    where: { id: phaseId, jobId: id },
  })
  if (!existing) {
    return NextResponse.json({ error: "Phase not found" }, { status: 404 })
  }

  const data: Record<string, unknown> = {}
  if (body.name !== undefined) data.name = body.name
  if (body.order !== undefined) data.order = body.order
  if (body.budget !== undefined) data.budget = body.budget ? parseFloat(body.budget) : null
  if (body.start_date !== undefined) data.startDate = body.start_date ? new Date(body.start_date) : null
  if (body.end_date !== undefined) data.endDate = body.end_date ? new Date(body.end_date) : null
  if (body.status !== undefined) data.status = body.status

  const phase = await db.jobPhase.update({ where: { id: phaseId }, data })
  return NextResponse.json({ phase })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; phaseId: string }> }
) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id, phaseId } = await params

  const job = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
    select: { id: true },
  })
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  const existing = await db.jobPhase.findFirst({
    where: { id: phaseId, jobId: id },
  })
  if (!existing) {
    return NextResponse.json({ error: "Phase not found" }, { status: 404 })
  }

  await db.jobPhase.delete({ where: { id: phaseId } })
  return NextResponse.json({ success: true })
}
