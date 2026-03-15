import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.rAMS.findFirst({
    where: { id, job: { companyId: session.user.companyId } },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (existing.status !== "APPROVED") {
    return NextResponse.json({ error: "Only APPROVED RAMS can be superseded" }, { status: 400 })
  }

  // Mark old as superseded and create new version
  const [, newRams] = await db.$transaction([
    db.rAMS.update({
      where: { id },
      data: { status: "SUPERSEDED" },
    }),
    db.rAMS.create({
      data: {
        jobId: existing.jobId,
        title: existing.title,
        version: existing.version + 1,
        content: existing.content || {},
        status: "DRAFT",
      },
    }),
  ])

  return NextResponse.json({ rams: newRams }, { status: 201 })
}
