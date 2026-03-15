import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; certId: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { certId } = await params

  await db.subcontractorCert.delete({ where: { id: certId } })

  return NextResponse.json({ success: true })
}
