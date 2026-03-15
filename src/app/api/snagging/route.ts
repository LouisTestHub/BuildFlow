import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const url = req.nextUrl.searchParams
  const jobId = url.get("jobId") || ""

  const where: Record<string, unknown> = { job: { companyId: session.user.companyId } }
  if (jobId) where.jobId = jobId

  const snagLists = await db.snagList.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      job: { select: { id: true, reference: true, title: true } },
      items: {
        select: { id: true, status: true, priority: true, dueDate: true, completedDate: true, createdAt: true },
      },
    },
  })

  const listsWithStats = snagLists.map((sl) => {
    const total = sl.items.length
    const open = sl.items.filter((i) => i.status === "OPEN").length
    const inProgress = sl.items.filter((i) => i.status === "IN_PROGRESS").length
    const resolved = sl.items.filter((i) => i.status === "RESOLVED" || i.status === "VERIFIED").length
    const overdue = sl.items.filter((i) => i.dueDate && new Date(i.dueDate) < new Date() && i.status !== "RESOLVED" && i.status !== "VERIFIED").length
    return { ...sl, stats: { total, open, inProgress, resolved, overdue } }
  })

  // Global stats
  const totalOpen = listsWithStats.reduce((a, l) => a + l.stats.open + l.stats.inProgress, 0)
  const totalOverdue = listsWithStats.reduce((a, l) => a + l.stats.overdue, 0)

  return NextResponse.json({ snagLists: listsWithStats, stats: { totalOpen, totalOverdue } })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const body = await req.json()

  const job = await db.job.findFirst({
    where: { id: body.jobId, companyId: session.user.companyId },
  })
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const snagList = await db.snagList.create({
    data: {
      jobId: body.jobId,
      area: body.area,
      status: "OPEN",
    },
  })

  return NextResponse.json({ snagList }, { status: 201 })
}
