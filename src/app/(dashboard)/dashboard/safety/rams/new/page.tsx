"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Hazard {
  id: string; description: string; whoAtRisk: string
  riskBefore: string; controls: string; riskAfter: string; responsible: string
}

const RISK_LEVELS = ["Low", "Medium", "High", "Very High"]
const RISK_COLOURS: Record<string, string> = {
  Low: "bg-green-100 text-green-800 border-green-300",
  Medium: "bg-amber-100 text-amber-800 border-amber-300",
  High: "bg-orange-100 text-orange-800 border-orange-300",
  "Very High": "bg-red-100 text-red-800 border-red-300",
}

const PPE_ITEMS = ["Hard Hat", "Hi-Vis", "Steel Toes", "Gloves", "Eye Protection", "Ear Protection", "Mask/RPE", "Harness"]

function newHazard(): Hazard {
  return { id: crypto.randomUUID(), description: "", whoAtRisk: "", riskBefore: "Medium", controls: "", riskAfter: "Low", responsible: "" }
}

export default function NewRamsPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [jobId, setJobId] = useState("")
  const [hazards, setHazards] = useState<Hazard[]>([newHazard()])
  const [ppe, setPpe] = useState<string[]>([])
  const [emergency, setEmergency] = useState({ hospital: "", firstAider: "", assemblyPoint: "" })
  const [jobs, setJobs] = useState<Array<{ id: string; reference: string; title: string }>>([])
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/jobs?limit=100")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs?.map((j: Record<string, string>) => ({ id: j.id, reference: j.reference, title: j.title })) || []))
      .catch(() => {})
  }, [])

  const updateHazard = (id: string, field: keyof Hazard, value: string) => {
    setHazards((h) => h.map((hz) => hz.id === id ? { ...hz, [field]: value } : hz))
  }

  const togglePpe = (item: string) => {
    setPpe((p) => p.includes(item) ? p.filter((x) => x !== item) : [...p, item])
  }

  const save = async (approve: boolean) => {
    if (!title || !jobId) return alert("Title and Job are required")
    setSaving(true)
    try {
      const content = { hazards: hazards.map(({ id, ...h }) => h), ppe, emergency }
      const res = await fetch("/api/rams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, jobId, content }),
      })
      const data = await res.json()
      if (approve && data.rams?.id) {
        await fetch(`/api/rams/${data.rams.id}/approve`, { method: "POST" })
      }
      router.push("/dashboard/safety/rams")
    } catch {
      alert("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/safety/rams">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">New RAMS</h2>
          <p className="text-gray-500 text-sm">Risk Assessment & Method Statement</p>
        </div>
      </div>

      {/* Header */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Working at Height — Block A" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Job *</label>
              <select value={jobId} onChange={(e) => setJobId(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]">
                <option value="">Select job...</option>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hazards */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Hazard Assessment</h3>
            <Button variant="ghost" size="sm" onClick={() => setHazards([...hazards, newHazard()])} className="text-[#F97316]">
              <Plus className="w-4 h-4 mr-1" />Add Hazard
            </Button>
          </div>
          <div className="space-y-6">
            {hazards.map((hz, idx) => (
              <div key={hz.id} className="border rounded-lg p-4 space-y-3 relative">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-600">Hazard {idx + 1}</span>
                  {hazards.length > 1 && (
                    <button onClick={() => setHazards(hazards.filter((h) => h.id !== hz.id))} className="text-red-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div>
                  <label className="text-xs text-gray-500">Hazard Description</label>
                  <textarea value={hz.description} onChange={(e) => updateHazard(hz.id, "description", e.target.value)}
                    className="w-full mt-1 rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] min-h-[60px]" />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Who is at Risk</label>
                    <Input value={hz.whoAtRisk} onChange={(e) => updateHazard(hz.id, "whoAtRisk", e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Responsible Person</label>
                    <Input value={hz.responsible} onChange={(e) => updateHazard(hz.id, "responsible", e.target.value)} className="mt-1" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500">Risk BEFORE Controls</label>
                    <select value={hz.riskBefore} onChange={(e) => updateHazard(hz.id, "riskBefore", e.target.value)}
                      className={`w-full h-10 mt-1 rounded-lg border px-3 text-sm font-medium ${RISK_COLOURS[hz.riskBefore] || ""}`}>
                      {RISK_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Risk AFTER Controls</label>
                    <select value={hz.riskAfter} onChange={(e) => updateHazard(hz.id, "riskAfter", e.target.value)}
                      className={`w-full h-10 mt-1 rounded-lg border px-3 text-sm font-medium ${RISK_COLOURS[hz.riskAfter] || ""}`}>
                      {RISK_LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Control Measures</label>
                  <textarea value={hz.controls} onChange={(e) => updateHazard(hz.id, "controls", e.target.value)}
                    className="w-full mt-1 rounded-lg border border-gray-200 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] min-h-[80px]" />
                </div>
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
            {PPE_ITEMS.map((item) => (
              <label key={item} className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
                ppe.includes(item) ? "bg-[#F97316]/10 border-[#F97316]" : "bg-white border-gray-200 hover:bg-gray-50"
              }`}>
                <input type="checkbox" checked={ppe.includes(item)} onChange={() => togglePpe(item)} className="accent-[#F97316]" />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Info */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#1A1A2E]">Emergency Information</h3>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Nearest Hospital</label>
              <Input value={emergency.hospital} onChange={(e) => setEmergency({ ...emergency, hospital: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">First Aider</label>
              <Input value={emergency.firstAider} onChange={(e) => setEmergency({ ...emergency, firstAider: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Assembly Point</label>
              <Input value={emergency.assemblyPoint} onChange={(e) => setEmergency({ ...emergency, assemblyPoint: e.target.value })} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 justify-end">
        <Link href="/dashboard/safety/rams"><Button variant="ghost">Cancel</Button></Link>
        <Button onClick={() => save(false)} disabled={saving} className="bg-gray-600 hover:bg-gray-700 text-white">
          {saving ? "Saving..." : "Save Draft"}
        </Button>
        <Button onClick={() => save(true)} disabled={saving} className="bg-green-600 hover:bg-green-700 text-white">
          {saving ? "Saving..." : "Save & Approve"}
        </Button>
      </div>
    </div>
  )
}
