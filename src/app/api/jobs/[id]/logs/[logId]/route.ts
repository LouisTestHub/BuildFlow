import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; logId: string }> }
) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id, logId } = await params
  const body = await req.json()

  const job = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
    select: { id: true },
  })
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  const existing = await db.dailyLog.findFirst({
    where: { id: logId, jobId: id },
  })
  if (!existing) {
    return NextResponse.json({ error: "Log not found" }, { status: 404 })
  }

  const data: Record<string, unknown> = {}
  if (body.date !== undefined) data.date = new Date(body.date)
  if (body.weather !== undefined) data.weather = body.weather
  if (body.labour_count !== undefined) data.labourCount = body.labour_count ? parseInt(body.labour_count) : null
  if (body.visitors !== undefined) data.visitors = body.visitors
  if (body.notes !== undefined) data.notes = body.notes

  const log = await db.dailyLog.update({ where: { id: logId }, data })
  return NextResponse.json({ log })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; logId: string }> }
) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id, logId } = await params

  const job = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
    select: { id: true },
  })
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  const existing = await db.dailyLog.findFirst({
    where: { id: logId, jobId: id },
  })
  if (!existing) {
    return NextResponse.json({ error: "Log not found" }, { status: 404 })
  }

  await db.dailyLog.delete({ where: { id: logId } })
  return NextResponse.json({ success: true })
}
