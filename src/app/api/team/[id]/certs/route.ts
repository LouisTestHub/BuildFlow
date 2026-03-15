import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const certs = await db.document.findMany({
    where: { companyId, jobId: null, uploadedBy: id },
    select: {
      id: true,
      category: true,
      title: true,
      fileUrl: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })

  const formattedCerts = certs.map((c) => ({
    id: c.id,
    type: c.category || "Other",
    reference: c.title,
    expiryDate: c.fileUrl || null,
    createdAt: c.createdAt,
  }))

  return NextResponse.json({ certs: formattedCerts })
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id } = await params
  const companyId = (session.user as Record<string, unknown>).companyId as string
  const body = await req.json()

  const cert = await db.document.create({
    data: {
      companyId,
      jobId: null,
      category: body.type,
      title: body.reference || "",
      fileUrl: body.expiryDate || null,
      uploadedBy: id,
    },
  })

  return NextResponse.json({
    cert: {
      id: cert.id,
      type: cert.category,
      reference: cert.title,
      expiryDate: cert.fileUrl,
      createdAt: cert.createdAt,
    },
  }, { status: 201 })
}
