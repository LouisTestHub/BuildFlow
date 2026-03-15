import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; orderId: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { orderId } = await params
  const body = await req.json()

  const order = await db.subcontractOrder.update({
    where: { id: orderId },
    data: { status: body.status },
    include: { job: { select: { id: true, reference: true, title: true } } },
  })

  return NextResponse.json({ order })
}
