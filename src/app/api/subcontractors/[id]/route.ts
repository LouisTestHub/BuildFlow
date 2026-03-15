import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const sub = await db.subcontractor.findFirst({
    where: { id, companyId: session.user.companyId },
    include: {
      certs: { orderBy: { expiryDate: "asc" } },
      orders: {
        include: { job: { select: { id: true, reference: true, title: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  })

  if (!sub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json({ subcontractor: sub })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const existing = await db.subcontractor.findFirst({
    where: { id, companyId: session.user.companyId },
  })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const data: Record<string, unknown> = {}
  if (body.name !== undefined) data.name = body.name
  if (body.trade !== undefined) data.trade = body.trade
  if (body.contact_name !== undefined) data.contactName = body.contact_name
  if (body.email !== undefined) data.email = body.email
  if (body.phone !== undefined) data.phone = body.phone
  if (body.utr !== undefined) data.cisUtr = body.utr
  if (body.tax_status !== undefined) data.cisTaxStatus = body.tax_status
  if (body.cis_verified !== undefined) data.cisVerified = body.cis_verified
  if (body.vat_registered !== undefined) data.vatRegistered = body.vat_registered
  if (body.insurance_expiry !== undefined) data.insuranceExpiry = body.insurance_expiry ? new Date(body.insurance_expiry) : null
  if (body.rating !== undefined) data.rating = body.rating ? parseInt(body.rating) : null
  const sub = await db.subcontractor.update({ where: { id }, data })

  return NextResponse.json({ subcontractor: sub })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.subcontractor.findFirst({
    where: { id, companyId: session.user.companyId },
  })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  // Delete related records first
  await db.subcontractorCert.deleteMany({ where: { subcontractorId: id } })
  await db.subcontractOrder.deleteMany({ where: { subcontractorId: id } })
  await db.subcontractor.delete({ where: { id } })

  return NextResponse.json({ success: true })
}
