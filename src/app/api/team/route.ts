import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import bcryptjs from "bcryptjs"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const role = searchParams.get("role")
  const search = searchParams.get("search")
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const where: Record<string, unknown> = { companyId }
  if (role) where.role = role
  if (search) {
    where.name = { contains: search, mode: "insensitive" }
  }

  const users = await db.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      cscsNumber: true,
      cscsExpiry: true,
      avatar: true,
      createdAt: true,
    },
    orderBy: { name: "asc" },
  })

  // Get cert counts (documents used as certs: jobId = null, category NOT starting with standard doc categories)
  const certDocs = await db.document.findMany({
    where: {
      companyId,
      jobId: null,
      uploadedBy: { not: null },
    },
    select: { uploadedBy: true, fileUrl: true },
  })

  const now = new Date()
  const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const usersWithCscs = users.map((u) => {
    let cscsStatus: "valid" | "expiring" | "expired" | "none" = "none"
    if (u.cscsExpiry) {
      if (u.cscsExpiry < now) cscsStatus = "expired"
      else if (u.cscsExpiry <= thirtyDaysFromNow) cscsStatus = "expiring"
      else cscsStatus = "valid"
    }

    // Count certs expiring this month for this user
    const userCerts = certDocs.filter((c) => c.uploadedBy === u.id)
    const certsExpiring = userCerts.filter((c) => {
      if (!c.fileUrl) return false
      try {
        const exp = new Date(c.fileUrl)
        return exp > now && exp <= thirtyDaysFromNow
      } catch { return false }
    }).length

    return { ...u, cscsStatus, certsExpiring }
  })

  // Stats
  const totalStaff = users.length
  const cscsValid = usersWithCscs.filter((u) => u.cscsStatus === "valid").length
  const certsExpiringThisMonth = usersWithCscs.reduce((sum, u) => sum + u.certsExpiring, 0)
  // Also count CSCS expiring
  const cscsExpiring = usersWithCscs.filter((u) => u.cscsStatus === "expiring").length

  return NextResponse.json({
    users: usersWithCscs,
    stats: { totalStaff, cscsValid, certsExpiringThisMonth: certsExpiringThisMonth + cscsExpiring },
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const companyId = (session.user as Record<string, unknown>).companyId as string
  const body = await req.json()

  const passwordHash = await bcryptjs.hash(body.password || "BuildFlow2026!", 12)

  const user = await db.user.create({
    data: {
      companyId,
      name: body.name,
      email: body.email,
      passwordHash,
      role: body.role || "SITE_MANAGER",
      phone: body.phone || null,
      cscsNumber: body.cscsNumber || null,
      cscsExpiry: body.cscsExpiry ? new Date(body.cscsExpiry) : null,
    },
  })

  return NextResponse.json({ user }, { status: 201 })
}
