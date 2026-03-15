"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, Trash2, CheckCircle, RefreshCw } from "lucide-react"

interface Hazard {
  id?: string; description: string; whoAtRisk: string
  riskBefore: string; controls: string; riskAfter: string; responsible: string
}

interface RAMSData {
  id: string; title: string; version: number; status: string
  approvedBy: string | null; approvedDate: string | null
  content: { hazards?: Hazard[]; ppe?: string[]; emergency?: { hospital?: string; firstAider?: string; assemblyPoint?: string } } | null
  job: { id: string; reference: string; title: string }
}

const RISK_LEVELS = ["Low", "Medium", "High", "Very High"]
const RISK_COLOURS: Record<string, string> = {
  Low: "bg-green-100 text-green-800 border-green-300",
  Medium: "bg-amber-100 text-amber-800 border-amber-300",
  High: "bg-orange-100 text-orange-800 border-orange-300",
  "Very High": "bg-red-100 text-red-800 border-red-300",
}
const PPE_ITEMS = ["Hard Hat", "Hi-Vis", "Steel Toes", "Gloves", "Eye Protection", "Ear Protection", "Mask/RPE", "Harness"]

const statusBadge: Record<string, { class: string; label: string }> = {
  DRAFT: { class: "bg-gray-100 text-gray-700", label: "Draft" },
  APPROVED: { class: "bg-green-100 text-green-800", label: "Approved" },
  SUPERSEDED: { class: "bg-amber-100 text-amber-800", label: "Superseded" },
}

export default function RamsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [rams, setRams] = useState<RAMSData | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState("")
  const [hazards, setHazards] = useState<(Hazard & { _id: string })[]>([])
  const [ppe, setPpe] = useState<string[]>([])
  const [emergency, setEmergency] = useState({ hospital: "", firstAider: "", assemblyPoint: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch(`/api/rams/${id}`)
      .then((r) => r.json())
      .then((d) => {
        setRams(d.rams)
        if (d.rams) {
          setTitle(d.rams.title)
          const c = d.rams.content || {}
          setHazards((c.hazards || []).map((h: Hazard) => ({ ...h, _id: crypto.randomUUID() })))
          setPpe(c.ppe || [])
          setEmergency(c.emergency || { hospital: "", firstAider: "", assemblyPoint: "" })
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const updateHazard = (_id: string, field: keyof Hazard, value: string) => {
    setHazards((h) => h.map((hz) => hz._id === _id ? { ...hz, [field]: value } : hz))
  }

  const handleSave = async () => {
    setSaving(true)
    const content = { hazards: hazards.map(({ _id, ...h }) => h), ppe, emergency }
    await fetch(`/api/rams/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    })
    setSaving(false)
    setEditing(false)
    router.refresh()
  }

  const handleApprove = async () => {
    await fetch(`/api/rams/${id}/approve`, { method: "POST" })
    window.location.reload()
  }

  const handleSupersede = async () => {
    const res = await fetch(`/api/rams/${id}/supersede`, { method: "POST" })
    const data = await res.json()
    if (data.rams?.id) router.push(`/dashboard/safety/rams/${data.rams.id}`)
  }

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>
  if (!rams) return <div className="p-12 text-center text-gray-400">RAMS not found</div>

  const badge = statusBadge[rams.status] || statusBadge.DRAFT
  const content = rams.content || {}
  const isEditable = rams.status === "DRAFT"

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/safety/rams">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#1A1A2E]">{rams.title}</h2>
            <Badge className={badge.class}>{badge.label}</Badge>
            <span className="text-sm text-gray-500">v{rams.version}</span>
          </div>
          <p className="text-gray-500 text-sm">{rams.job.reference} — {rams.job.title}</p>
        </div>
        <div className="flex gap-2">
          {isEditable && !editing && (
            <Button onClick={() => setEditing(true)} className="bg-[#F97316] hover:bg-[#EA580C] text-white">Edit</Button>
          )}
          {isEditable && (
            <Button onClick={handleApprove} className="bg-green-600 hover:bg-green-700 text-white">
              <CheckCircle className="w-4 h-4 mr-1" />Approve
            </Button>
          )}
          {rams.status === "APPROVED" && (
            <Button onClick={handleSupersede} className="bg-amber-600 hover:bg-amber-700 text-white">
              <RefreshCw className="w-4 h-4 mr-1" />Supersede
            </Button>
          )}
        </div>
      </div>

      {rams.approvedBy && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-800">
          Approved by <strong>{rams.approvedBy}</strong> on {rams.approvedDate ? new Date(rams.approvedDate).toLocaleDateString("en-GB") : "—"}
        </div>
      )}

      {/* Hazards */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Hazard Assessment</h3>
            {editing && (
              <Button variant="ghost" size="sm" onClick={() => setHazards([...hazards, { _id: crypto.randomUUID(), description: "", whoAtRisk: "", riskBefore: "Medium", controls: "", riskAfter: "Low", responsible: "" }])} className="text-[#F97316]">
                <Plus className="w-4 h-4 mr-1" />Add Hazard
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {(editing ? hazards : (content.hazards || [])).map((hz: Hazard & { _id?: string }, idx: number) => (
              <div key={hz._id || idx} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Hazard {idx + 1}</span>
                  {editing && hazards.length > 1 && (
                    <button onClick={() => setHazards(hazards.filter((h) => h._id !== hz._id))} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {editing ? (
                  <>
                    <textarea value={hz.description} onChange={(e) => updateHazard(hz._id!, "description", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2 text-sm min-h-[60px]" placeholder="Hazard description" />
                    <div className="grid sm:grid-cols-2 gap-3">
                      <Input value={hz.whoAtRisk} onChange={(e) => updateHazard(hz._id!, "whoAtRisk", e.target.value)} placeholder="Who is at risk" />
                      <Input value={hz.responsible} onChange={(e) => updateHazard(hz._id!, "responsible", e.target.value)} placeholder="Responsible person" />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-3">
                      <select value={hz.riskBefore} onChange={(e) => updateHazard(hz._id!, "riskBefore", e.target.value)}
                        className={`h-10 rounded-lg border px-3 text-sm font-medium ${RISK_COLOURS[hz.riskBefore] || ""}`}>
                        {RISK_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                      <select value={hz.riskAfter} onChange={(e) => updateHazard(hz._id!, "riskAfter", e.target.value)}
                        className={`h-10 rounded-lg border px-3 text-sm font-medium ${RISK_COLOURS[hz.riskAfter] || ""}`}>
                        {RISK_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                      </select>
                    </div>
                    <textarea value={hz.controls} onChange={(e) => updateHazard(hz._id!, "controls", e.target.value)}
                      className="w-full rounded-lg border border-gray-200 p-2 text-sm min-h-[80px]" placeholder="Control measures" />
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-800">{hz.description}</p>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                      <div><span className="text-gray-500">At Risk:</span> {hz.whoAtRisk}</div>
                      <div><span className="text-gray-500">Responsible:</span> {hz.responsible}</div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      <span>Before: <Badge className={RISK_COLOURS[hz.riskBefore]}>{hz.riskBefore}</Badge></span>
                      <span>→</span>
                      <span>After: <Badge className={RISK_COLOURS[hz.riskAfter]}>{hz.riskAfter}</Badge></span>
                    </div>
                    <div><span className="text-xs text-gray-500">Controls:</span><p className="text-sm">{hz.controls}</p></div>
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PPE */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">PPE Requirements</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {PPE_ITEMS.map((item) => {
              const checked = editing ? ppe.includes(item) : (content.ppe || []).includes(item)
              return (
                <label key={item} className={`flex items-center gap-2 p-3 rounded-lg border ${
                  checked ? "bg-[#F97316]/10 border-[#F97316]" : "bg-white border-gray-200"
                } ${editing ? "cursor-pointer" : "cursor-default"}`}>
                  <input type="checkbox" checked={checked} disabled={!editing}
                    onChange={() => editing && setPpe(ppe.includes(item) ? ppe.filter((x) => x !== item) : [...ppe, item])}
                    className="accent-[#F97316]" />
                  <span className="text-sm">{item}</span>
                </label>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Emergency */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Emergency Information</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            {editing ? (
              <>
                <div><label className="text-sm text-gray-500 block mb-1">Nearest Hospital</label><Input value={emergency.hospital} onChange={(e) => setEmergency({ ...emergency, hospital: e.target.value })} /></div>
                <div><label className="text-sm text-gray-500 block mb-1">First Aider</label><Input value={emergency.firstAider} onChange={(e) => setEmergency({ ...emergency, firstAider: e.target.value })} /></div>
                <div><label className="text-sm text-gray-500 block mb-1">Assembly Point</label><Input value={emergency.assemblyPoint} onChange={(e) => setEmergency({ ...emergency, assemblyPoint: e.target.value })} /></div>
              </>
            ) : (
              <>
                <div><span className="text-xs text-gray-500">Nearest Hospital</span><p className="text-sm font-medium">{content.emergency?.hospital || "—"}</p></div>
                <div><span className="text-xs text-gray-500">First Aider</span><p className="text-sm font-medium">{content.emergency?.firstAider || "—"}</p></div>
                <div><span className="text-xs text-gray-500">Assembly Point</span><p className="text-sm font-medium">{content.emergency?.assemblyPoint || "—"}</p></div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {editing && (
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
