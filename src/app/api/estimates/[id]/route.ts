import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const estimate = await db.estimate.findFirst({
    where: { id, companyId: session.user.companyId },
    include: {
      sections: {
        include: { items: true },
        orderBy: { order: "asc" },
      },
      job: { select: { id: true, title: true, reference: true } },
    },
  })

  if (!estimate) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 })
  }

  return NextResponse.json({ estimate })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()

  const existing = await db.estimate.findFirst({
    where: { id, companyId: session.user.companyId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 })
  }

  // Calculate totals from sections if provided
  const sections: Array<{ id?: string; name: string; order: number; items: Array<{
    id?: string; description: string; unit: string; quantity: number;
    material_cost: number; labour_cost: number; plant_cost: number; subcontract_cost: number
  }> }> | undefined = body.sections

  let totalCost = existing.totalCost ? Number(existing.totalCost) : 0
  let marginPercent = body.margin_percent !== undefined ? Number(body.margin_percent) : Number(existing.marginPercent || 15)
  let sellPrice = existing.sellPrice ? Number(existing.sellPrice) : 0

  if (sections) {
    totalCost = 0
    for (const sec of sections) {
      for (const item of sec.items) {
        totalCost += (Number(item.material_cost) + Number(item.labour_cost) + Number(item.plant_cost) + Number(item.subcontract_cost)) * Number(item.quantity)
      }
    }
    const overheadPercent = Number(body.overhead_percent || 10)
    const overheadAmount = totalCost * (overheadPercent / 100)
    const netCost = totalCost + overheadAmount
    sellPrice = marginPercent >= 100 ? netCost : netCost / (1 - marginPercent / 100)
  }

  const estimate = await db.$transaction(async (tx) => {
    // Update estimate
    await tx.estimate.update({
      where: { id },
      data: {
        title: body.title ?? existing.title,
        clientName: body.client_name !== undefined ? body.client_name : existing.clientName,
        totalCost,
        marginPercent,
        sellPrice,
      },
    })

    // If sections provided, delete old and recreate
    if (sections) {
      // Get old sections to delete items
      const oldSections = await tx.estimateSection.findMany({
        where: { estimateId: id },
        select: { id: true },
      })
      
      for (const os of oldSections) {
        await tx.estimateItem.deleteMany({ where: { sectionId: os.id } })
      }
      await tx.estimateSection.deleteMany({ where: { estimateId: id } })

      // Create new sections and items
      for (const sec of sections) {
        const section = await tx.estimateSection.create({
          data: {
            estimateId: id,
            name: sec.name,
            order: sec.order,
          },
        })

        for (const item of sec.items) {
          await tx.estimateItem.create({
            data: {
              sectionId: section.id,
              description: item.description,
              unit: item.unit || null,
              quantity: Number(item.quantity) || 1,
              materialCost: Number(item.material_cost) || 0,
              labourCost: Number(item.labour_cost) || 0,
              plantCost: Number(item.plant_cost) || 0,
              subcontractCost: Number(item.subcontract_cost) || 0,
            },
          })
        }
      }
    }

    return tx.estimate.findUnique({
      where: { id },
      include: { sections: { include: { items: true }, orderBy: { order: "asc" } } },
    })
  })

  return NextResponse.json({ estimate })
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user?.companyId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 })
  }

  const { id } = await params

  const existing = await db.estimate.findFirst({
    where: { id, companyId: session.user.companyId },
  })

  if (!existing) {
    return NextResponse.json({ error: "Estimate not found" }, { status: 404 })
  }

  if (existing.status !== "DRAFT") {
    return NextResponse.json({ error: "Only DRAFT estimates can be deleted" }, { status: 400 })
  }

  await db.$transaction(async (tx) => {
    const sections = await tx.estimateSection.findMany({
      where: { estimateId: id },
      select: { id: true },
    })
    for (const s of sections) {
      await tx.estimateItem.deleteMany({ where: { sectionId: s.id } })
    }
    await tx.estimateSection.deleteMany({ where: { estimateId: id } })
    await tx.estimate.delete({ where: { id } })
  })

  return NextResponse.json({ success: true })
}
