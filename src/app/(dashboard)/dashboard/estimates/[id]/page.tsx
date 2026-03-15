"use client"

import { useState, useEffect, useCallback, use } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Save, Send, Copy, Briefcase, Trash2, Loader2
} from "lucide-react"
import CostBuilder from "@/components/estimate-cost-builder"
import {
  EstimateSectionData, calculateEstimateTotals,
  ESTIMATE_STATUS_COLOURS, formatMoney,
} from "@/lib/estimate-utils"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface EstimateDetail {
  id: string
  reference: string
  title: string
  clientName: string | null
  status: string
  revision: number
  totalCost: string | null
  marginPercent: string | null
  sellPrice: string | null
  createdAt: string
  updatedAt: string
  job: { id: string; title: string; reference: string } | null
  sections: Array<{
    id: string
    name: string
    order: number
    items: Array<{
      id: string
      description: string
      unit: string | null
      quantity: string
      materialCost: string
      labourCost: string
      plantCost: string
      subcontractCost: string
    }>
  }>
}

export default function EstimateDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [estimate, setEstimate] = useState<EstimateDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [actionLoading, setActionLoading] = useState("")

  // Editable fields
  const [title, setTitle] = useState("")
  const [clientName, setClientName] = useState("")
  const [sections, setSections] = useState<EstimateSectionData[]>([])
  const [overheadPercent, setOverheadPercent] = useState(10)
  const [marginPercent, setMarginPercent] = useState(15)

  const totals = calculateEstimateTotals(sections, overheadPercent, marginPercent)

  const fetchEstimate = useCallback(async () => {
    setLoading(true)
    const res = await fetch(`/api/estimates/${id}`)
    const data = await res.json()
    if (data.estimate) {
      const est = data.estimate as EstimateDetail
      setEstimate(est)
      setTitle(est.title)
      setClientName(est.clientName || "")
      setMarginPercent(est.marginPercent ? Number(est.marginPercent) : 15)

      // Convert sections to editable format
      setSections(
        est.sections.map((sec) => ({
          id: sec.id,
          name: sec.name,
          order: sec.order,
          items: sec.items.map((item) => ({
            id: item.id,
            description: item.description,
            unit: item.unit || "nr",
            quantity: Number(item.quantity),
            material_cost: Number(item.materialCost),
            labour_cost: Number(item.labourCost),
            plant_cost: Number(item.plantCost),
            subcontract_cost: Number(item.subcontractCost),
          })),
        }))
      )
    }
    setLoading(false)
  }, [id])

  useEffect(() => {
    fetchEstimate()
  }, [fetchEstimate])

  const handleSave = async () => {
    setSaving(true)
    try {
      await fetch(`/api/estimates/${id}`, {
        method: "PATCH",
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
      await fetchEstimate()
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    setActionLoading("submit")
    try {
      await handleSave()
      const res = await fetch(`/api/estimates/${id}/submit`, { method: "POST" })
      if (res.ok) await fetchEstimate()
    } finally {
      setActionLoading("")
    }
  }

  const handleClone = async () => {
    setActionLoading("clone")
    try {
      const res = await fetch(`/api/estimates/${id}/clone`, { method: "POST" })
      const data = await res.json()
      if (res.ok && data.estimate) {
        router.push(`/dashboard/estimates/${data.estimate.id}`)
      }
    } finally {
      setActionLoading("")
    }
  }

  const handleConvert = async () => {
    setActionLoading("convert")
    try {
      const res = await fetch(`/api/estimates/${id}/convert`, { method: "POST" })
      const data = await res.json()
      if (res.ok && data.job) {
        router.push(`/dashboard/jobs/${data.job.id}`)
      }
    } finally {
      setActionLoading("")
    }
  }

  const handleDelete = async () => {
    if (!confirm("Delete this estimate? This cannot be undone.")) return
    setActionLoading("delete")
    try {
      const res = await fetch(`/api/estimates/${id}`, { method: "DELETE" })
      if (res.ok) router.push("/dashboard/estimates")
    } finally {
      setActionLoading("")
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded animate-pulse" />
        <div className="h-64 bg-gray-100 rounded animate-pulse" />
      </div>
    )
  }

  if (!estimate) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-600">Estimate not found</h2>
        <Link href="/dashboard/estimates">
          <Button variant="outline" className="mt-4">Back to Estimates</Button>
        </Link>
      </div>
    )
  }

  const sc = ESTIMATE_STATUS_COLOURS[estimate.status] || ESTIMATE_STATUS_COLOURS.DRAFT

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Link href="/dashboard/estimates">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-[#1A1A2E]">{estimate.reference}</h2>
            <Badge className={cn(sc.bg, sc.text, "border-0")}>{sc.label}</Badge>
            <span className="text-xs text-gray-400">Rev {estimate.revision}</span>
          </div>
          <p className="text-gray-500 text-sm">{estimate.title}</p>
        </div>
      </div>

      {/* Actions bar */}
      <Card>
        <CardContent className="p-3 flex flex-wrap gap-2">
          <Button onClick={handleSave} disabled={saving} size="sm">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Draft
          </Button>
          {(estimate.status === "DRAFT" || estimate.status === "REVISED") && (
            <Button onClick={handleSubmit} disabled={!!actionLoading} size="sm" variant="secondary">
              {actionLoading === "submit" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              Submit to Client
            </Button>
          )}
          <Button onClick={handleClone} disabled={!!actionLoading} size="sm" variant="outline">
            {actionLoading === "clone" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
            Clone
          </Button>
          {estimate.status !== "DECLINED" && !estimate.job && (
            <Button onClick={handleConvert} disabled={!!actionLoading} size="sm" variant="outline">
              {actionLoading === "convert" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Briefcase className="w-4 h-4" />}
              Convert to Job
            </Button>
          )}
          {estimate.job && (
            <Link href={`/dashboard/jobs/${estimate.job.id}`}>
              <Button size="sm" variant="outline">
                <Briefcase className="w-4 h-4" />
                View Job: {estimate.job.reference}
              </Button>
            </Link>
          )}
          {estimate.status === "DRAFT" && (
            <Button onClick={handleDelete} disabled={!!actionLoading} size="sm" variant="destructive" className="ml-auto">
              {actionLoading === "delete" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Delete
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Basic details (inline edit) */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Client Name</label>
              <Input value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Builder */}
      <CostBuilder
        sections={sections}
        onSectionsChange={setSections}
        overheadPercent={overheadPercent}
        onOverheadChange={setOverheadPercent}
        marginPercent={marginPercent}
        onMarginChange={setMarginPercent}
        totals={totals}
      />

      {/* Bottom save */}
      <div className="flex justify-end gap-2 pb-8">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </Button>
      </div>
    </div>
  )
}
