import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const body = await req.json()

  const sub = await db.subcontractor.findFirst({
    where: { portalToken: token },
  })
  if (!sub) {
    return NextResponse.json({ error: "Invalid portal link" }, { status: 404 })
  }

  const cert = await db.subcontractorCert.create({
    data: {
      subcontractorId: sub.id,
      type: body.type,
      reference: body.reference || null,
      expiryDate: body.expiry_date ? new Date(body.expiry_date) : null,
    },
  })

  return NextResponse.json({ cert }, { status: 201 })
}
