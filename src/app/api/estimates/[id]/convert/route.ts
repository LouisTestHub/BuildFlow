import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.estimate.findFirst({
    where: { id, companyId: session.user.companyId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 })
  }

  if (existing.status === "DECLINED") {
    return NextResponse.json({ error: "Cannot convert a declined estimate" }, { status: 400 })
  }

  // Auto-generate job reference
  const year = new Date().getFullYear()
  const lastJob = await db.job.findFirst({
    where: { companyId: session.user.companyId, reference: { startsWith: `BF-${year}` } },
    orderBy: { reference: "desc" },
  })
  let nextNum = 1
  if (lastJob) {
    const parts = lastJob.reference.split("-")
    nextNum = parseInt(parts[2]) + 1
  }
  const jobReference = `BF-${year}-${String(nextNum).padStart(3, "0")}`

  const result = await db.$transaction(async (tx) => {
    // Create job from estimate
    const job = await tx.job.create({
      data: {
        companyId: session.user!.companyId,
        reference: jobReference,
        title: existing.title,
        clientName: existing.clientName,
        contractValue: existing.sellPrice,
        status: "WON",
      },
    })

    // Update estimate: link to job and set ACCEPTED
    const estimate = await tx.estimate.update({
      where: { id },
      data: {
        status: "ACCEPTED",
        jobId: job.id,
      },
    })

    return { job, estimate }
  })

  return NextResponse.json(result, { status: 201 })
}
