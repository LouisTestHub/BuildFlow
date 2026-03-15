import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const { id } = await params

  const invoice = await db.invoice.findUnique({ where: { id } })
  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 })
  if (invoice.status === "PAID") return NextResponse.json({ error: "Already paid" }, { status: 400 })
  if (invoice.status === "VOID") return NextResponse.json({ error: "Cannot pay void invoice" }, { status: 400 })

  const updated = await db.invoice.update({ where: { id }, data: { status: "PAID" } })
  return NextResponse.json(updated)
}
