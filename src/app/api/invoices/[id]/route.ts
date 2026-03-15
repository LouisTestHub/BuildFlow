import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      job: { select: { id: true, reference: true, title: true, clientName: true } },
      subcontractor: { select: { id: true, name: true, cisTaxStatus: true, cisUtr: true } },
      cisDeductions: true,
    },
  })

  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 })
  return NextResponse.json(invoice)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params
  const body = await req.json()

  const data: Prisma.InvoiceUpdateInput = {}
  if (body.status) data.status = body.status
  if (body.amount !== undefined) data.amount = new Prisma.Decimal(body.amount)
  if (body.vat !== undefined) data.vat = new Prisma.Decimal(body.vat)
  if (body.total !== undefined) data.total = new Prisma.Decimal(body.total)
  if (body.dueDate !== undefined) data.dueDate = body.dueDate ? new Date(body.dueDate) : null
  if (body.vatReverseCharge !== undefined) data.vatReverseCharge = body.vatReverseCharge

  const invoice = await db.invoice.update({ where: { id }, data })
  return NextResponse.json(invoice)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const invoice = await db.invoice.findUnique({ where: { id } })
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (invoice.status !== "DRAFT") return NextResponse.json({ error: "Only draft invoices can be deleted" }, { status: 400 })

  await db.cISDeduction.deleteMany({ where: { invoiceId: id } })
  await db.invoice.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
