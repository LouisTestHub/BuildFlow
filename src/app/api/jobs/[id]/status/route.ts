import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { VALID_TRANSITIONS } from "@/lib/job-status"
import { JobStatus } from "@prisma/client"

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const newStatus = body.status as JobStatus

  if (!newStatus || !Object.values(JobStatus).includes(newStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const job = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
  })

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  const allowed = VALID_TRANSITIONS[job.status] || []
  if (!allowed.includes(newStatus)) {
    return NextResponse.json(
      { error: `Cannot transition from ${job.status} to ${newStatus}. Allowed: ${allowed.join(", ") || "none"}` },
      { status: 400 }
    )
  }

  const updated = await db.job.update({
    where: { id },
    data: { status: newStatus },
  })

  return NextResponse.json({ job: updated })
}
