import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.estimate.findFirst({
    where: { id, companyId: session.user.companyId },
    include: {
      sections: {
        include: { items: true },
        orderBy: { order: "asc" },
      },
    },
  })

  if (!existing) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 })
  }

  // Generate new reference
  const year = new Date().getFullYear()
  const lastEstimate = await db.estimate.findFirst({
    where: { companyId: session.user.companyId, reference: { startsWith: `EST-${year}` } },
    orderBy: { reference: "desc" },
  })
  let nextNum = 1
  if (lastEstimate) {
    const parts = lastEstimate.reference.split("-")
    nextNum = parseInt(parts[2]) + 1
  }
  const reference = `EST-${year}-${String(nextNum).padStart(3, "0")}`

  const clone = await db.$transaction(async (tx) => {
    const est = await tx.estimate.create({
      data: {
        companyId: session.user!.companyId,
        reference,
        title: existing.title + " (Copy)",
        clientName: existing.clientName,
        status: "DRAFT",
        revision: 1,
        totalCost: existing.totalCost,
        marginPercent: existing.marginPercent,
        sellPrice: existing.sellPrice,
      },
    })

    for (const sec of existing.sections) {
      const section = await tx.estimateSection.create({
        data: {
          estimateId: est.id,
          name: sec.name,
          order: sec.order,
        },
      })

      for (const item of sec.items) {
        await tx.estimateItem.create({
          data: {
            sectionId: section.id,
            description: item.description,
            unit: item.unit,
            quantity: item.quantity,
            materialCost: item.materialCost,
            labourCost: item.labourCost,
            plantCost: item.plantCost,
            subcontractCost: item.subcontractCost,
            markupPercent: item.markupPercent,
          },
        })
      }
    }

    return tx.estimate.findUnique({
      where: { id: est.id },
      include: { sections: { include: { items: true }, orderBy: { order: "asc" } } },
    })
  })

  return NextResponse.json({ estimate: clone }, { status: 201 })
}
