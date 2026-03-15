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
  if (existing.status !== "DRAFT") {
    return NextResponse.json({ error: "Only DRAFT RAMS can be approved" }, { status: 400 })
  }

  const rams = await db.rAMS.update({
    where: { id },
    data: {
      status: "APPROVED",
      approvedBy: session.user.name || session.user.email || "Unknown",
      approvedDate: new Date(),
    },
  })

  return NextResponse.json({ rams })
}
