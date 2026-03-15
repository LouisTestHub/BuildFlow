import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  const sub = await db.subcontractor.findFirst({
    where: { portalToken: token },
    include: {
      company: { select: { name: true, logo: true } },
      certs: { orderBy: { expiryDate: "asc" } },
      orders: {
        include: { job: { select: { id: true, reference: true, title: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!sub) {
    return NextResponse.json({ error: "Invalid portal link" }, { status: 404 })
  }

  return NextResponse.json({
    subcontractor: {
      id: sub.id,
      name: sub.name,
      trade: sub.trade,
      email: sub.email,
      phone: sub.phone,
    },
    company: sub.company,
    orders: sub.orders,
    certs: sub.certs,
  })
}
