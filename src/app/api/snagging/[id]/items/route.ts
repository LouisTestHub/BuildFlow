import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const snagList = await db.snagList.findFirst({
    where: { id, job: { companyId: session.user.companyId } },
  })
  if (!snagList) return NextResponse.json({ error: "Snag list not found" }, { status: 404 })

  const item = await db.snagItem.create({
    data: {
      snagListId: id,
      description: body.description,
      location: body.location || null,
      assignedTo: body.assignedTo || null,
      priority: body.priority || "MEDIUM",
      status: "OPEN",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      photos: body.photos || null,
    },
  })

  return NextResponse.json({ item }, { status: 201 })
}
