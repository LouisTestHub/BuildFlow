import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as { companyId: string }
  const now = new Date()
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  const [teamMembers, subCerts] = await Promise.all([
    db.user.findMany({
      where: { companyId: user.companyId },
      select: { id: true, name: true, role: true, cscsNumber: true, cscsExpiry: true },
    }),
    db.subcontractorCert.findMany({
      where: { subcontractor: { companyId: user.companyId } },
      include: { subcontractor: { select: { name: true } } },
    }),
  ])

  const teamCerts = teamMembers.filter((u) => u.cscsNumber).map((u) => {
    const expiry = u.cscsExpiry ? new Date(u.cscsExpiry) : null
    let status: "valid" | "expiring" | "expired" | "unknown" = "unknown"
    if (expiry) {
      if (expiry < now) status = "expired"
      else if (expiry < thirtyDays) status = "expiring"
      else status = "valid"
    }
    return {
      type: "team" as const,
      personName: u.name,
      role: u.role,
      certType: "CSCS Card",
      reference: u.cscsNumber,
      expiryDate: u.cscsExpiry,
      status,
    }
  })

  const subbieCerts = subCerts.map((c) => {
    const expiry = c.expiryDate ? new Date(c.expiryDate) : null
    let status: "valid" | "expiring" | "expired" | "unknown" = "unknown"
    if (expiry) {
      if (expiry < now) status = "expired"
      else if (expiry < thirtyDays) status = "expiring"
      else status = "valid"
    }
    return {
      type: "subcontractor" as const,
      personName: c.subcontractor.name,
      role: "Subcontractor",
      certType: c.type,
      reference: c.reference,
      expiryDate: c.expiryDate,
      status,
    }
  })

  const allCerts = [...teamCerts, ...subbieCerts]
  const summary = {
    total: allCerts.length,
    valid: allCerts.filter((c) => c.status === "valid").length,
    expiring: allCerts.filter((c) => c.status === "expiring").length,
    expired: allCerts.filter((c) => c.status === "expired").length,
    unknown: allCerts.filter((c) => c.status === "unknown").length,
  }

  return NextResponse.json({ certs: allCerts, summary })
}
