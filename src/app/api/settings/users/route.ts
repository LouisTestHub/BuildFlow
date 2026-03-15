import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import crypto from "crypto"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as { companyId: string }

  const users = await db.user.findMany({
    where: { companyId: user.companyId },
    select: { id: true, name: true, email: true, role: true, createdAt: true, avatar: true },
    orderBy: { createdAt: "asc" },
  })

  const invitations = await db.invitation.findMany({
    where: { companyId: user.companyId, expiresAt: { gt: new Date() } },
    select: { id: true, email: true, role: true, createdAt: true },
  })

  return NextResponse.json({ users, invitations })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as { companyId: string; role: string }

  if (user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Only directors can invite users" }, { status: 403 })
  }

  const { email, role } = await req.json()
  if (!email || !role) {
    return NextResponse.json({ error: "Email and role are required" }, { status: 400 })
  }

  const existing = await db.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 })
  }

  const invitation = await db.invitation.create({
    data: {
      companyId: user.companyId,
      email,
      role,
      token: crypto.randomBytes(32).toString("hex"),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  })

  return NextResponse.json(invitation, { status: 201 })
}
