import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const document = await db.document.findFirst({
    where: { id, companyId },
    include: {
      job: { select: { id: true, reference: true, title: true } },
    },
  })

  if (!document) return NextResponse.json({ error: "Not found" }, { status: 404 })

  return NextResponse.json({ document })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const companyId = (session.user as Record<string, unknown>).companyId as string
  const body = await req.json()

  const existing = await db.document.findFirst({ where: { id, companyId } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const data: Record<string, unknown> = {}
  if (body.title !== undefined) data.title = body.title
  if (body.category !== undefined) data.category = body.category
  if (body.jobId !== undefined) data.jobId = body.jobId
  if (body.fileUrl !== undefined) data.fileUrl = body.fileUrl

  const document = await db.document.update({ where: { id }, data })

  return NextResponse.json({ document })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const existing = await db.document.findFirst({ where: { id, companyId } })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.document.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
