import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const orders = await db.subcontractOrder.findMany({
    where: { subcontractorId: id },
    include: { job: { select: { id: true, reference: true, title: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ orders })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const order = await db.subcontractOrder.create({
    data: {
      subcontractorId: id,
      jobId: body.job_id,
      trade: body.trade || null,
      value: body.value ? parseFloat(body.value) : null,
      scopeDescription: body.scope_description || null,
      orderDate: body.order_date ? new Date(body.order_date) : new Date(),
      status: "DRAFT",
    },
    include: { job: { select: { id: true, reference: true, title: true } } },
  })

  return NextResponse.json({ order }, { status: 201 })
}
