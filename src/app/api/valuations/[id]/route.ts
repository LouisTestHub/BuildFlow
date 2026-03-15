import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const valuation = await db.valuation.findUnique({
    where: { id },
    include: { job: { select: { id: true, reference: true, title: true, clientName: true, retentionPercent: true } } },
  })

  if (!valuation) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(valuation)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  const data: Prisma.ValuationUpdateInput = {}
  if (body.status) data.status = body.status
  if (body.grossValue !== undefined) data.grossValue = new Prisma.Decimal(body.grossValue)
  if (body.retention !== undefined) data.retention = new Prisma.Decimal(body.retention)
  if (body.thisCert !== undefined) data.thisCert = new Prisma.Decimal(body.thisCert)

  const valuation = await db.valuation.update({ where: { id }, data })
  return NextResponse.json(valuation)
}
