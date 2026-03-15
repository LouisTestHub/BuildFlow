import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const rams = await db.rAMS.findFirst({
    where: { id, job: { companyId: session.user.companyId } },
    include: { job: { select: { id: true, reference: true, title: true } } },
  })

  if (!rams) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ rams })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const existing = await db.rAMS.findFirst({
    where: { id, job: { companyId: session.user.companyId } },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const rams = await db.rAMS.update({
    where: { id },
    data: {
      title: body.title ?? existing.title,
      content: body.content ?? existing.content,
    },
  })

  return NextResponse.json({ rams })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.rAMS.findFirst({
    where: { id, job: { companyId: session.user.companyId } },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.rAMS.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
