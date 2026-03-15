import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const user = await db.user.findFirst({
    where: { id, companyId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      cscsNumber: true,
      cscsExpiry: true,
      avatar: true,
      createdAt: true,
      timesheets: {
        orderBy: { weekStart: "desc" },
        take: 5,
        select: {
          id: true,
          weekStart: true,
          status: true,
          entries: {
            select: { hoursNormal: true, hoursOvertime: true },
          },
        },
      },
    },
  })

  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Get certs (documents with jobId=null for this user)
  const certs = await db.document.findMany({
    where: { companyId, jobId: null, uploadedBy: user.id },
    select: {
      id: true,
      category: true,
      title: true,
      fileUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const formattedCerts = certs.map((c) => ({
    id: c.id,
    type: c.category || "Other",
    reference: c.title,
    expiryDate: c.fileUrl || null,
    createdAt: c.createdAt,
  }))

  return NextResponse.json({ user, certs: formattedCerts })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const companyId = (session.user as Record<string, unknown>).companyId as string
  const body = await req.json()

  const existing = await db.user.findFirst({ where: { id, companyId } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const data: Record<string, unknown> = {}
  if (body.name !== undefined) data.name = body.name
  if (body.email !== undefined) data.email = body.email
  if (body.phone !== undefined) data.phone = body.phone
  if (body.role !== undefined) data.role = body.role
  if (body.cscsNumber !== undefined) data.cscsNumber = body.cscsNumber
  if (body.cscsExpiry !== undefined) data.cscsExpiry = body.cscsExpiry ? new Date(body.cscsExpiry) : null

  const user = await db.user.update({ where: { id }, data })

  return NextResponse.json({ user })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const companyId = (session.user as Record<string, unknown>).companyId as string
  const role = (session.user as Record<string, unknown>).role as string

  if (role !== "DIRECTOR") return NextResponse.json({ error: "Directors only" }, { status: 403 })

  const existing = await db.user.findFirst({ where: { id, companyId } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  // Soft delete — just mark as disabled via role change or similar
  // For now, actually delete (demo purposes)
  await db.user.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
