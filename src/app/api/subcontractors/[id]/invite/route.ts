import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { randomBytes } from "crypto"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.subcontractor.findFirst({
    where: { id, companyId: session.user.companyId },
  })
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  const token = randomBytes(32).toString("hex")

  await db.subcontractor.update({
    where: { id },
    data: { portalToken: token },
  })

  const portalUrl = `${req.nextUrl.origin}/sub/${token}`

  return NextResponse.json({ token, portalUrl })
}
