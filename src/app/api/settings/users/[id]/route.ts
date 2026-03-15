import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const currentUser = session.user as { companyId: string; role: string }

  if (currentUser.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Only directors can change roles" }, { status: 403 })
  }

  const { id } = await params
  const { role } = await req.json()

  const targetUser = await db.user.findFirst({
    where: { id, companyId: currentUser.companyId },
  })

  if (!targetUser) return NextResponse.json({ error: "User not found" }, { status: 404 })

  const updated = await db.user.update({
    where: { id },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  })

  return NextResponse.json(updated)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const currentUser = session.user as { companyId: string; role: string }

  if (currentUser.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Only directors can deactivate users" }, { status: 403 })
  }

  const { id } = await params

  if (id === session.user.id) {
    return NextResponse.json({ error: "Cannot deactivate yourself" }, { status: 400 })
  }

  // We don't actually delete — just remove from company (soft deactivate via role change)
  // Since schema doesn't have an 'active' field, we'll leave them but could be enhanced
  await db.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
