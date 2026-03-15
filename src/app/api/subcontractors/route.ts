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
  const search = url.get("search") || ""
  const trade = url.get("trade") || ""
  const cisStatus = url.get("cisStatus") || ""
  const compliance = url.get("compliance") || ""

  const where: Prisma.SubcontractorWhereInput = {
    companyId: session.user.companyId,
  }

  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { trade: { contains: search, mode: "insensitive" } },
      { contactName: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
      { phone: { contains: search, mode: "insensitive" } },
    ]
  }

  if (trade) {
    where.trade = trade
  }

  if (cisStatus) {
    where.cisTaxStatus = cisStatus as Prisma.EnumCISTaxStatusFilter
  }

  const subs = await db.subcontractor.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      certs: true,
      orders: {
        include: { job: { select: { id: true, reference: true, title: true } } },
      },
      _count: { select: { orders: true } },
    },
  })

  const now = new Date()
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  // Compute compliance for each sub
  const subsWithCompliance = subs.map((sub) => {
    let complianceStatus: "compliant" | "expiring" | "expired" = "compliant"

    // Check insurance expiry
    if (!sub.insuranceExpiry) {
      complianceStatus = "expired"
    } else if (sub.insuranceExpiry < now) {
      complianceStatus = "expired"
    } else if (sub.insuranceExpiry <= thirtyDays) {
      complianceStatus = "expiring"
    }

    // Check certs
    for (const cert of sub.certs) {
      if (!cert.expiryDate) continue
      if (cert.expiryDate < now) {
        complianceStatus = "expired"
        break
      }
      if (cert.expiryDate <= thirtyDays && complianceStatus !== "expired") {
        complianceStatus = "expiring"
      }
    }

    return { ...sub, complianceStatus }
  })

  // Filter by compliance if requested
  const filtered = compliance
    ? subsWithCompliance.filter((s) => s.complianceStatus === compliance)
    : subsWithCompliance

  // Stats
  const total = subsWithCompliance.length
  const compliant = subsWithCompliance.filter((s) => s.complianceStatus === "compliant").length
  const expiring = subsWithCompliance.filter((s) => s.complianceStatus === "expiring").length
  const unverified = subsWithCompliance.filter((s) => s.cisTaxStatus === "NOT_VERIFIED").length

  return NextResponse.json({
    subcontractors: filtered,
    stats: {
      total,
      compliantPercent: total > 0 ? Math.round((compliant / total) * 100) : 0,
      expiring,
      unverified,
    },
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const body = await req.json()

  const sub = await db.subcontractor.create({
    data: {
      companyId: session.user.companyId,
      name: body.name,
      trade: body.trade || null,
      contactName: body.contact_name || null,
      email: body.email || null,
      phone: body.phone || null,
      cisUtr: body.utr || null,
      cisTaxStatus: body.tax_status || "NOT_VERIFIED",
      cisVerified: body.cis_verified || false,
      vatRegistered: body.vat_registered || false,
      insuranceExpiry: body.insurance_expiry ? new Date(body.insurance_expiry) : null,
      rating: body.rating ? parseInt(body.rating) : null,
    },
  })

  return NextResponse.json({ subcontractor: sub }, { status: 201 })
}
