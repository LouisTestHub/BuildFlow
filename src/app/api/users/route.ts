import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const users = await db.user.findMany({
    where: { companyId: session.user.companyId },
    select: { id: true, name: true, email: true, role: true, avatar: true },
    orderBy: { name: "asc" },
  })

  return NextResponse.json({ users })
}
