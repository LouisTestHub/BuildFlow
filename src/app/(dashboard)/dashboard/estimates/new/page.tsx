"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react"
import CostBuilder from "@/components/estimate-cost-builder"
import {
  EstimateSectionData, calculateEstimateTotals,
} from "@/lib/estimate-utils"
import Link from "next/link"

export default function NewEstimatePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)

  // Step 1 fields
  const [title, setTitle] = useState("")
  const [clientName, setClientName] = useState("")
  const [clientEmail, setClientEmail] = useState("")
  const [siteAddress, setSiteAddress] = useState("")
  const [notes, setNotes] = useState("")

  // Step 2 fields
  const [sections, setSections] = useState<EstimateSectionData[]>([
    { name: "", order: 1, items: [{ description: "", unit: "nr", quantity: 1, material_cost: 0, labour_cost: 0, plant_cost: 0, subcontract_cost: 0 }] },
  ])
  const [overheadPercent, setOverheadPercent] = useState(10)
  const [marginPercent, setMarginPercent] = useState(15)

  const totals = calculateEstimateTotals(sections, overheadPercent, marginPercent)

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/estimates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          client_name: clientName,
          overhead_percent: overheadPercent,
          margin_percent: marginPercent,
          sections: sections.map((sec, i) => ({
            name: sec.name || `Section ${i + 1}`,
            order: i + 1,
            items: sec.items.map((item) => ({
              description: item.description,
              unit: item.unit,
              quantity: item.quantity,
              material_cost: item.material_cost,
              labour_cost: item.labour_cost,
              plant_cost: item.plant_cost,
              subcontract_cost: item.subcontract_cost,
            })),
          })),
        }),
      })
      const data = await res.json()
      if (res.ok && data.estimate) {
        router.push(`/dashboard/estimates/${data.estimate.id}`)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/estimates">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">New Estimate</h2>
          <p className="text-gray-500 text-sm">Step {step} of 2 — {step === 1 ? "Basic Details" : "Cost Builder"}</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex gap-2">
        <div className={`flex-1 h-1.5 rounded-full ${step >= 1 ? "bg-[#F97316]" : "bg-gray-200"}`} />
        <div className={`flex-1 h-1.5 rounded-full ${step >= 2 ? "bg-[#F97316]" : "bg-gray-200"}`} />
      </div>

      {step === 1 && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Basic Details</h3>
            <p className="text-sm text-gray-500">Reference will be auto-generated (EST-2026-XXX)</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Estimate Title *</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Loft Conversion — 8 Birch Close"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Client Name</label>
                <Input
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Mr & Mrs Smith"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Client Email</label>
                <Input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@email.com"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Site Address</label>
                <Input
                  value={siteAddress}
                  onChange={(e) => setSiteAddress(e.target.value)}
                  placeholder="Full site address"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)} disabled={!title}>
                Next: Cost Builder <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <>
          <CostBuilder
            sections={sections}
            onSectionsChange={setSections}
            overheadPercent={overheadPercent}
            onOverheadChange={setOverheadPercent}
            marginPercent={marginPercent}
            onMarginChange={setMarginPercent}
            totals={totals}
          />

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              <ArrowLeft className="w-4 h-4" /> Back to Details
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Estimate
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
