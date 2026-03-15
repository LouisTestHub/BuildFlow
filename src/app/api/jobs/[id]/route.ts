import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const job = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
    include: {
      projectManager: { select: { id: true, name: true, avatar: true, email: true } },
      phases: { orderBy: { order: "asc" } },
      dailyLogs: { orderBy: { date: "desc" }, take: 10, include: { user: { select: { name: true } } } },
      _count: { select: { phases: true, dailyLogs: true, invoices: true, documents: true } },
    },
  })

  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  // Include subcontract orders if requested
  let subcontractOrders = null
  const url = _req.nextUrl.searchParams
  if (url.get("includeSubOrders")) {
    subcontractOrders = await db.subcontractOrder.findMany({
      where: { jobId: id },
      include: {
        subcontractor: { select: { id: true, name: true, trade: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  return NextResponse.json({ job, ...(subcontractOrders ? { subcontractOrders } : {}) })
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const existing = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
  })
  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  const data: Record<string, unknown> = {}
  if (body.title !== undefined) data.title = body.title
  if (body.sector !== undefined) data.sector = body.sector
  if (body.client_name !== undefined) data.clientName = body.client_name
  if (body.client_email !== undefined) data.clientEmail = body.client_email
  if (body.client_phone !== undefined) data.clientPhone = body.client_phone
  if (body.site_address !== undefined) data.siteAddress = body.site_address
  if (body.site_postcode !== undefined) data.sitePostcode = body.site_postcode
  if (body.contract_value !== undefined) data.contractValue = body.contract_value ? parseFloat(body.contract_value) : null
  if (body.retention_percent !== undefined) data.retentionPercent = body.retention_percent ? parseFloat(body.retention_percent) : null
  if (body.defects_period_months !== undefined) data.defectsPeriodMonths = body.defects_period_months ? parseInt(body.defects_period_months) : null
  if (body.start_date !== undefined) data.startDate = body.start_date ? new Date(body.start_date) : null
  if (body.end_date !== undefined) data.endDate = body.end_date ? new Date(body.end_date) : null
  if (body.pm_id !== undefined) data.pmId = body.pm_id || null

  const job = await db.job.update({ where: { id }, data })
  return NextResponse.json({ job })
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.job.findFirst({
    where: { id, companyId: session.user.companyId },
  })
  if (!existing) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 })
  }

  // Soft delete by setting status to CLOSED
  await db.job.update({ where: { id }, data: { status: "CLOSED" } })
  return NextResponse.json({ success: true })
}
