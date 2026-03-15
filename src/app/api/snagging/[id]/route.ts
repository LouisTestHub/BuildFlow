import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const snagList = await db.snagList.findFirst({
    where: { id, job: { companyId: session.user.companyId } },
    include: {
      job: { select: { id: true, reference: true, title: true } },
      items: { orderBy: { createdAt: "desc" } },
    },
  })

  if (!snagList) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ snagList })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const existing = await db.snagList.findFirst({
    where: { id, job: { companyId: session.user.companyId } },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const snagList = await db.snagList.update({
    where: { id },
    data: {
      area: body.area ?? existing.area,
      status: body.status ?? existing.status,
    },
  })

  return NextResponse.json({ snagList })
}
