import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ token: string; orderId: string }> }) {
  const { token, orderId } = await params
  const body = await req.json()

  const sub = await db.subcontractor.findFirst({
    where: { portalToken: token },
  })
  if (!sub) {
    return NextResponse.json({ error: "Invalid portal link" }, { status: 404 })
  }

  // Only allow accept/decline
  if (!["ACCEPTED", "DISPUTED"].includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 })
  }

  const order = await db.subcontractOrder.findFirst({
    where: { id: orderId, subcontractorId: sub.id },
  })
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 })
  }

  const updated = await db.subcontractOrder.update({
    where: { id: orderId },
    data: { status: body.status },
    include: { job: { select: { id: true, reference: true, title: true } } },
  })

  return NextResponse.json({ order: updated })
}
