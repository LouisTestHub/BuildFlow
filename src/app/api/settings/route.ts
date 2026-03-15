import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as { companyId: string }

  const company = await db.company.findUnique({
    where: { id: user.companyId },
  })

  return NextResponse.json(company)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const user = session.user as { companyId: string; role: string }

  if (user.role !== "DIRECTOR") {
    return NextResponse.json({ error: "Only directors can update settings" }, { status: 403 })
  }

  const body = await req.json()
  const { name, registrationNumber, vatNumber, cisUtr, address } = body

  const updated = await db.company.update({
    where: { id: user.companyId },
    data: {
      ...(name && { name }),
      ...(registrationNumber !== undefined && { registrationNumber }),
      ...(vatNumber !== undefined && { vatNumber }),
      ...(cisUtr !== undefined && { cisUtr }),
      ...(address !== undefined && { address }),
    },
  })

  return NextResponse.json(updated)
}
