import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const url = new URL(req.url)
  const jobId = url.searchParams.get("jobId")

  const where: Prisma.ValuationWhereInput = { job: { companyId } }
  if (jobId) where.jobId = jobId

  const valuations = await db.valuation.findMany({
    where,
    include: { job: { select: { id: true, reference: true, title: true, retentionPercent: true } } },
    orderBy: [{ jobId: "asc" }, { number: "asc" }],
  })

  return NextResponse.json({ valuations })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json()
  const { jobId, periodStart, periodEnd, grossValue, materialsOnSite, retentionPercent } = body

  // Auto-increment number per job
  const last = await db.valuation.findFirst({ where: { jobId }, orderBy: { number: "desc" } })
  const number = (last?.number || 0) + 1

  // Calculate previous certs
  const previous = await db.valuation.findMany({
    where: { jobId, status: { in: ["CERTIFIED", "PAID"] } },
  })
  const previousCerts = previous.reduce((s, v) => s + Number(v.thisCert), 0)

  // Calculate this certificate
  const gross = parseFloat(grossValue) + parseFloat(materialsOnSite || "0")
  const retention = gross * (parseFloat(retentionPercent || "5") / 100)
  const thisCert = gross - retention - previousCerts

  const valuation = await db.valuation.create({
    data: {
      jobId,
      number,
      periodStart: new Date(periodStart),
      periodEnd: new Date(periodEnd),
      grossValue: new Prisma.Decimal(gross),
      retention: new Prisma.Decimal(retention),
      previousCerts: new Prisma.Decimal(previousCerts),
      thisCert: new Prisma.Decimal(thisCert),
      status: "DRAFT",
    },
    include: { job: { select: { reference: true, title: true } } },
  })

  return NextResponse.json(valuation, { status: 201 })
}
