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
  const dateFrom = url.get("dateFrom") || ""
  const dateTo = url.get("dateTo") || ""

  const where: Prisma.EstimateWhereInput = {
    companyId: session.user.companyId,
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { clientName: { contains: search, mode: "insensitive" } },
      { reference: { contains: search, mode: "insensitive" } },
    ]
  }

  if (status) {
    where.status = status as Prisma.EnumEstimateStatusFilter
  }

  if (dateFrom || dateTo) {
    where.createdAt = {}
    if (dateFrom) (where.createdAt as Prisma.DateTimeFilter).gte = new Date(dateFrom)
    if (dateTo) (where.createdAt as Prisma.DateTimeFilter).lte = new Date(dateTo + "T23:59:59Z")
  }

  const [estimates, total, allEstimates] = await Promise.all([
    db.estimate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        sections: {
          include: { items: true },
          orderBy: { order: "asc" },
        },
      },
    }),
    db.estimate.count({ where }),
    // Stats: get all estimates for this company (unfiltered for stats)
    db.estimate.findMany({
      where: { companyId: session.user.companyId },
      select: {
        status: true,
        sellPrice: true,
        marginPercent: true,
      },
    }),
  ])

  // Calculate stats
  const totalEstimates = allEstimates.length
  const accepted = allEstimates.filter((e) => e.status === "ACCEPTED").length
  const declined = allEstimates.filter((e) => e.status === "DECLINED").length
  const decided = accepted + declined
  const winRate = decided > 0 ? Math.round((accepted / decided) * 100) : 0
  const margins = allEstimates.filter((e) => e.marginPercent).map((e) => Number(e.marginPercent))
  const avgMargin = margins.length > 0 ? Math.round((margins.reduce((a, b) => a + b, 0) / margins.length) * 10) / 10 : 0
  const pipelineValue = allEstimates
    .filter((e) => e.status === "SUBMITTED")
    .reduce((sum, e) => sum + Number(e.sellPrice || 0), 0)

  return NextResponse.json({
    estimates,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    stats: { totalEstimates, winRate, avgMargin, pipelineValue },
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
  const lastEstimate = await db.estimate.findFirst({
    where: { companyId: session.user.companyId, reference: { startsWith: `EST-${year}` } },
    orderBy: { reference: "desc" },
  })
  let nextNum = 1
  if (lastEstimate) {
    const parts = lastEstimate.reference.split("-")
    nextNum = parseInt(parts[2]) + 1
  }
  const reference = body.reference || `EST-${year}-${String(nextNum).padStart(3, "0")}`

  // Calculate totals from sections
  const sections: Array<{ name: string; order: number; items: Array<{
    description: string; unit: string; quantity: number;
    material_cost: number; labour_cost: number; plant_cost: number; subcontract_cost: number
  }> }> = body.sections || []

  let totalCost = 0
  for (const sec of sections) {
    for (const item of sec.items) {
      totalCost += (Number(item.material_cost) + Number(item.labour_cost) + Number(item.plant_cost) + Number(item.subcontract_cost)) * Number(item.quantity)
    }
  }

  const overheadPercent = Number(body.overhead_percent || 10)
  const marginPercent = Number(body.margin_percent || 15)
  const overheadAmount = totalCost * (overheadPercent / 100)
  const netCost = totalCost + overheadAmount
  const sellPrice = marginPercent >= 100 ? netCost : netCost / (1 - marginPercent / 100)

  const estimate = await db.$transaction(async (tx) => {
    const est = await tx.estimate.create({
      data: {
        companyId: session.user!.companyId,
        reference,
        title: body.title || "Untitled Estimate",
        clientName: body.client_name || null,
        status: "DRAFT",
        revision: 1,
        totalCost,
        marginPercent,
        sellPrice,
      },
    })

    for (const sec of sections) {
      const section = await tx.estimateSection.create({
        data: {
          estimateId: est.id,
          name: sec.name,
          order: sec.order,
        },
      })

      for (const item of sec.items) {
        await tx.estimateItem.create({
          data: {
            sectionId: section.id,
            description: item.description,
            unit: item.unit || null,
            quantity: Number(item.quantity) || 1,
            materialCost: Number(item.material_cost) || 0,
            labourCost: Number(item.labour_cost) || 0,
            plantCost: Number(item.plant_cost) || 0,
            subcontractCost: Number(item.subcontract_cost) || 0,
          },
        })
      }
    }

    return tx.estimate.findUnique({
      where: { id: est.id },
      include: { sections: { include: { items: true }, orderBy: { order: "asc" } } },
    })
  })

  return NextResponse.json({ estimate }, { status: 201 })
}
