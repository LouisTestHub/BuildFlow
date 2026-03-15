import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const companyId = session.user.companyId

  const [
    activeRams,
    allIncidents,
    recentIncidents,
    expiringRams,
    inductionsThisWeek,
  ] = await Promise.all([
    db.rAMS.count({
      where: { job: { companyId }, status: "APPROVED" },
    }),
    db.incident.findMany({
      where: {
        job: { companyId },
        date: { gte: new Date(new Date().getFullYear(), 0, 1) },
      },
      select: { severity: true, date: true },
    }),
    db.incident.findMany({
      where: { job: { companyId } },
      orderBy: { date: "desc" },
      take: 5,
      include: {
        job: { select: { reference: true, title: true } },
        user: { select: { name: true } },
      },
    }),
    db.rAMS.findMany({
      where: {
        job: { companyId },
        status: "APPROVED",
        updatedAt: { lte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
      },
      include: { job: { select: { reference: true, title: true } } },
      take: 5,
      orderBy: { updatedAt: "asc" },
    }),
    db.induction.count({
      where: {
        job: { companyId },
        date: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ])

  // Last incident date
  const lastIncident = await db.incident.findFirst({
    where: { job: { companyId } },
    orderBy: { date: "desc" },
    select: { date: true },
  })

  const daysSinceLastIncident = lastIncident
    ? Math.floor((Date.now() - lastIncident.date.getTime()) / (1000 * 60 * 60 * 24))
    : 999

  const incidentsThisYear = allIncidents.length
  const riddorCount = allIncidents.filter((i) => i.severity === "RIDDOR").length

  const breakdown = {
    NEAR_MISS: allIncidents.filter((i) => i.severity === "NEAR_MISS").length,
    MINOR: allIncidents.filter((i) => i.severity === "MINOR").length,
    MAJOR: allIncidents.filter((i) => i.severity === "MAJOR").length,
    RIDDOR: riddorCount,
  }

  return NextResponse.json({
    kpis: {
      activeRams,
      daysSinceLastIncident,
      incidentsThisYear,
      riddorCount,
      inductionsThisWeek,
    },
    breakdown,
    recentIncidents,
    expiringRams,
  })
}
