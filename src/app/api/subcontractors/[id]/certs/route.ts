import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const certs = await db.subcontractorCert.findMany({
    where: { subcontractorId: id },
    orderBy: { expiryDate: "asc" },
  })

  return NextResponse.json({ certs })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const cert = await db.subcontractorCert.create({
    data: {
      subcontractorId: id,
      type: body.type,
      reference: body.reference || null,
      expiryDate: body.expiry_date ? new Date(body.expiry_date) : null,
    },
  })

  return NextResponse.json({ cert }, { status: 201 })
}
