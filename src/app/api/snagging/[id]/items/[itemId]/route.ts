import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; itemId: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id, itemId } = await params
  const body = await req.json()

  // Verify ownership
  const snagList = await db.snagList.findFirst({
    where: { id, job: { companyId: session.user.companyId } },
  })
  if (!snagList) return NextResponse.json({ error: "Snag list not found" }, { status: 404 })

  const existing = await db.snagItem.findFirst({
    where: { id: itemId, snagListId: id },
  })
  if (!existing) return NextResponse.json({ error: "Item not found" }, { status: 404 })

  const updateData: Record<string, unknown> = {}
  if (body.description !== undefined) updateData.description = body.description
  if (body.location !== undefined) updateData.location = body.location
  if (body.assignedTo !== undefined) updateData.assignedTo = body.assignedTo
  if (body.priority !== undefined) updateData.priority = body.priority
  if (body.dueDate !== undefined) updateData.dueDate = body.dueDate ? new Date(body.dueDate) : null
  if (body.status !== undefined) {
    updateData.status = body.status
    if (body.status === "RESOLVED" || body.status === "VERIFIED") {
      updateData.completedDate = new Date()
    }
  }

  const item = await db.snagItem.update({
    where: { id: itemId },
    data: updateData,
  })

  return NextResponse.json({ item })
}
