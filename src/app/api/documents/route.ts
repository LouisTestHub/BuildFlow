import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const jobId = searchParams.get("jobId")
  const category = searchParams.get("category")
  const search = searchParams.get("search")
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const where: Record<string, unknown> = {
    companyId,
    jobId: jobId ? jobId : { not: null }, // Exclude cert docs (jobId=null) unless filtering by job
  }

  if (category) where.category = category
  if (search) where.title = { contains: search, mode: "insensitive" }

  // If jobId is explicitly "all", get all docs with jobId != null
  if (jobId === "all") {
    where.jobId = { not: null }
  }

  const documents = await db.document.findMany({
    where,
    include: {
      job: { select: { id: true, reference: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
  })

  // Get user names for uploadedBy
  const uploaderIds = [...new Set(documents.map((d) => d.uploadedBy).filter(Boolean))] as string[]
  const uploaders = await db.user.findMany({
    where: { id: { in: uploaderIds } },
    select: { id: true, name: true },
  })
  const uploaderMap = Object.fromEntries(uploaders.map((u) => [u.id, u.name]))

  const docsWithUploaders = documents.map((d) => ({
    ...d,
    uploaderName: d.uploadedBy ? uploaderMap[d.uploadedBy] || "Unknown" : "Unknown",
  }))

  return NextResponse.json({ documents: docsWithUploaders })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const companyId = (session.user as Record<string, unknown>).companyId as string
  const body = await req.json()

  const document = await db.document.create({
    data: {
      companyId,
      jobId: body.jobId || null,
      category: body.category || "Other",
      title: body.title,
      fileUrl: body.fileUrl || null,
      uploadedBy: session.user.id,
      version: body.version || 1,
    },
  })

  return NextResponse.json({ document }, { status: 201 })
}
