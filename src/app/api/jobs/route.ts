import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const url = req.nextUrl.searchParams
  const page = Math.max(1, parseInt(url.get("page") || "1"))
  const limit = Math.min(100, Math.max(1, parseInt(url.get("limit") || "20")))
  const search = url.get("search") || ""
  const status = url.get("status") || ""
  const sortBy = url.get("sortBy") || "createdAt"
  const sortDir = (url.get("sortDir") || "desc") as "asc" | "desc"
  const dateFrom = url.get("dateFrom") || ""
  const dateTo = url.get("dateTo") || ""

  const where: Prisma.JobWhereInput = {
    companyId: session.user.companyId,
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { clientName: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
      { sitePostcode: { contains: search, mode: "insensitive" } },
    ]
  }

  if (status) {
    where.status = status as Prisma.EnumJobStatusFilter
  }

  if (dateFrom || dateTo) {
    where.startDate = {}
    if (dateFrom) (where.startDate as Prisma.DateTimeNullableFilter).gte = new Date(dateFrom)
    if (dateTo) (where.startDate as Prisma.DateTimeNullableFilter).lte = new Date(dateTo)
  }

  const orderBy: Prisma.JobOrderByWithRelationInput = {}
  if (sortBy === "value") orderBy.contractValue = sortDir
  else if (sortBy === "status") orderBy.status = sortDir
  else if (sortBy === "startDate") orderBy.startDate = sortDir
  else orderBy.createdAt = sortDir

  const [jobs, total] = await Promise.all([
    db.job.findMany({
      where,
      orderBy,
      skip: (page - 1) * limit,
      take: limit,
      include: {
        projectManager: { select: { id: true, name: true, avatar: true } },
        _count: { select: { phases: true, dailyLogs: true } },
      },
    }),
    db.job.count({ where }),
  ])

  return NextResponse.json({
    jobs,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const body = await req.json()

  // Auto-generate reference
  const year = new Date().getFullYear()
  const lastJob = await db.job.findFirst({
    where: { companyId: session.user.companyId, reference: { startsWith: `BF-${year}` } },
    orderBy: { reference: "desc" },
  })
  let nextNum = 1
  if (lastJob) {
    const parts = lastJob.reference.split("-")
    nextNum = parseInt(parts[2]) + 1
  }
  const reference = `BF-${year}-${String(nextNum).padStart(3, "0")}`

  const job = await db.job.create({
    data: {
      companyId: session.user.companyId,
      reference,
      title: body.title,
      sector: body.sector || null,
      clientName: body.client_name || null,
      clientEmail: body.client_email || null,
      clientPhone: body.client_phone || null,
      siteAddress: body.site_address || null,
      sitePostcode: body.site_postcode || null,
      contractValue: body.contract_value ? parseFloat(body.contract_value) : null,
      retentionPercent: body.retention_percent ? parseFloat(body.retention_percent) : null,
      defectsPeriodMonths: body.defects_period_months ? parseInt(body.defects_period_months) : null,
      startDate: body.start_date ? new Date(body.start_date) : null,
      endDate: body.end_date ? new Date(body.end_date) : null,
      pmId: body.pm_id || null,
      status: "TENDER",
    },
  })

  return NextResponse.json({ job }, { status: 201 })
}
