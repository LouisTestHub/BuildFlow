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
  const status = url.get("status") || ""

  const where: Record<string, unknown> = { job: { companyId: session.user.companyId } }
  if (jobId) where.jobId = jobId
  if (status) where.status = status

  const rams = await db.rAMS.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: { job: { select: { id: true, reference: true, title: true } } },
  })

  return NextResponse.json({ rams })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const body = await req.json()

  // Verify job belongs to company
  const job = await db.job.findFirst({
    where: { id: body.jobId, companyId: session.user.companyId },
  })
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const rams = await db.rAMS.create({
    data: {
      jobId: body.jobId,
      title: body.title,
      content: body.content || {},
      status: "DRAFT",
    },
  })

  return NextResponse.json({ rams }, { status: 201 })
}
