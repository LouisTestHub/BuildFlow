import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { auth } from "@/lib/auth"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; certId: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { id, certId } = await params
  const companyId = (session.user as Record<string, unknown>).companyId as string

  const cert = await db.document.findFirst({
    where: { id: certId, companyId, uploadedBy: id, jobId: null },
  })

  if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 })

  await db.document.delete({ where: { id: certId } })

  return NextResponse.json({ success: true })
}
