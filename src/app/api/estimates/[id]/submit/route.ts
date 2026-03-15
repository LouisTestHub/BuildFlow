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

  if (existing.status !== "DRAFT" && existing.status !== "REVISED") {
    return NextResponse.json({ error: "Only DRAFT or REVISED estimates can be submitted" }, { status: 400 })
  }

  const estimate = await db.estimate.update({
    where: { id },
    data: { status: "SUBMITTED" },
    include: { sections: { include: { items: true }, orderBy: { order: "asc" } } },
  })

  return NextResponse.json({ estimate })
}
