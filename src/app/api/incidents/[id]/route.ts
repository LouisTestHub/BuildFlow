import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const incident = await db.incident.findFirst({
    where: { id, job: { companyId: session.user.companyId } },
    include: {
      job: { select: { id: true, reference: true, title: true } },
      user: { select: { id: true, name: true } },
    },
  })

  if (!incident) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json({ incident })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const existing = await db.incident.findFirst({
    where: { id, job: { companyId: session.user.companyId } },
  })
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const incident = await db.incident.update({
    where: { id },
    data: {
      severity: body.severity ?? existing.severity,
      description: body.description ?? existing.description,
      investigationNotes: body.investigationNotes ?? existing.investigationNotes,
      correctiveActions: body.correctiveActions ?? existing.correctiveActions,
      status: body.status ?? existing.status,
      photos: body.photos ?? existing.photos,
    },
  })

  return NextResponse.json({ incident })
}
