import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { getCISRate, getCISTaxMonth } from "@/lib/finance-utils"
import { Prisma } from "@prisma/client"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const url = new URL(req.url)
  const type = url.searchParams.get("type")
  const status = url.searchParams.get("status")
  const jobId = url.searchParams.get("jobId")
  const search = url.searchParams.get("search")
  const page = parseInt(url.searchParams.get("page") || "1")
  const limit = parseInt(url.searchParams.get("limit") || "20")

  const where: Prisma.InvoiceWhereInput = { companyId }
  if (type) where.type = type as Prisma.EnumInvoiceTypeFilter
  if (status) where.status = status as Prisma.EnumInvoiceStatusFilter
  if (jobId) where.jobId = jobId
  if (search) {
    where.OR = [
      { number: { contains: search, mode: "insensitive" } },
      { job: { clientName: { contains: search, mode: "insensitive" } } },
      { subcontractor: { name: { contains: search, mode: "insensitive" } } },
    ]
  }

  const [invoices, total] = await Promise.all([
    db.invoice.findMany({
      where,
      include: { job: { select: { reference: true, clientName: true } }, subcontractor: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    db.invoice.count({ where }),
  ])

  return NextResponse.json({ invoices, total, page, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const body = await req.json()
  const { type, jobId, subcontractorId, amount, vat, vatReverseCharge, total, dueDate, status, materialsAmount } = body

  // Auto-generate invoice number
  const prefix = type === "SALES" ? "INV" : "PI"
  const year = new Date().getFullYear()
  const count = await db.invoice.count({ where: { companyId, type, number: { startsWith: `${prefix}-${year}` } } })
  const number = `${prefix}-${year}-${String(count + 1).padStart(3, "0")}`

  const invoice = await db.invoice.create({
    data: {
      companyId,
      type,
      number,
      jobId: jobId || null,
      subcontractorId: subcontractorId || null,
      amount: new Prisma.Decimal(amount),
      vat: new Prisma.Decimal(vat || 0),
      vatReverseCharge: vatReverseCharge || false,
      total: new Prisma.Decimal(total),
      status: status || "DRAFT",
      dueDate: dueDate ? new Date(dueDate) : null,
    },
    include: { job: true, subcontractor: true },
  })

  // Create CIS deduction if purchase invoice with subcontractor
  if ((type === "PURCHASE" || type === "CIS") && subcontractorId) {
    const subbie = await db.subcontractor.findUnique({ where: { id: subcontractorId } })
    if (subbie) {
      const rate = getCISRate(subbie.cisTaxStatus)
      const materials = parseFloat(materialsAmount || "0")
      const gross = parseFloat(amount)
      const cisLiable = gross - materials
      const deductionAmount = cisLiable * (rate / 100)
      const net = gross - deductionAmount
      const taxMonth = getCISTaxMonth(new Date())

      await db.cISDeduction.create({
        data: {
          invoiceId: invoice.id,
          subcontractorId,
          gross: new Prisma.Decimal(gross),
          deductionRate: new Prisma.Decimal(rate),
          deductionAmount: new Prisma.Decimal(deductionAmount),
          net: new Prisma.Decimal(net),
          taxMonth,
        },
      })
    }
  }

  return NextResponse.json(invoice, { status: 201 })
}
