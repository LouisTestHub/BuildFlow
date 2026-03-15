"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatMoney, VALUATION_STATUS_STYLES } from "@/lib/finance-utils"
import { formatDate } from "@/lib/job-status"
import { ArrowLeft, Plus, Loader2, X } from "lucide-react"

interface Valuation {
  id: string
  number: number
  periodStart: string
  periodEnd: string
  grossValue: string
  retention: string
  previousCerts: string
  thisCert: string
  status: string
  job: { id: string; reference: string; title: string; retentionPercent: string | null }
}

interface Job {
  id: string
  reference: string
  title: string
  retentionPercent: string | null
}

export default function ValuationsPage() {
  const [valuations, setValuations] = useState<Valuation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [saving, setSaving] = useState(false)

  // Form state
  const [formJobId, setFormJobId] = useState("")
  const [formPeriodStart, setFormPeriodStart] = useState("")
  const [formPeriodEnd, setFormPeriodEnd] = useState("")
  const [formGrossValue, setFormGrossValue] = useState("")
  const [formMaterials, setFormMaterials] = useState("")
  const [formRetention, setFormRetention] = useState("5")

  useEffect(() => {
    Promise.all([
      fetch("/api/valuations").then(r => r.json()),
      fetch("/api/jobs").then(r => r.json()),
    ]).then(([vData, jData]) => {
      setValuations(vData.valuations || [])
      setJobs(jData.jobs || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  // Update retention when job changes
  useEffect(() => {
    const job = jobs.find(j => j.id === formJobId)
    if (job?.retentionPercent) setFormRetention(job.retentionPercent)
  }, [formJobId, jobs])

  const grossTotal = parseFloat(formGrossValue || "0") + parseFloat(formMaterials || "0")
  const retentionAmount = grossTotal * (parseFloat(formRetention) / 100)

  // Calculate previous certs for selected job
  const prevCerts = valuations
    .filter(v => v.job.id === formJobId && (v.status === "CERTIFIED" || v.status === "PAID"))
    .reduce((s, v) => s + parseFloat(v.thisCert), 0)

  const thisCert = grossTotal - retentionAmount - prevCerts

  async function handleCreate() {
    setSaving(true)
    const res = await fetch("/api/valuations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobId: formJobId,
        periodStart: formPeriodStart,
        periodEnd: formPeriodEnd,
        grossValue: formGrossValue,
        materialsOnSite: formMaterials,
        retentionPercent: formRetention,
      }),
    })
    if (res.ok) {
      const val = await res.json()
      setValuations(prev => [...prev, val])
      setShowForm(false)
      resetForm()
    }
    setSaving(false)
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/valuations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setValuations(prev => prev.map(v => v.id === id ? { ...v, status: updated.status } : v))
    }
  }

  function resetForm() {
    setFormJobId("")
    setFormPeriodStart("")
    setFormPeriodEnd("")
    setFormGrossValue("")
    setFormMaterials("")
    setFormRetention("5")
  }

  // Group by job
  const grouped: Record<string, { job: Valuation["job"]; items: Valuation[] }> = {}
  for (const v of valuations) {
    if (!grouped[v.job.id]) grouped[v.job.id] = { job: v.job, items: [] }
    grouped[v.job.id].items.push(v)
  }

  const statusFlow: Record<string, string> = {
    DRAFT: "SUBMITTED",
    SUBMITTED: "CERTIFIED",
    CERTIFIED: "PAID",
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/finance">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1A1A2E]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A2E]">Valuations</h2>
            <p className="text-gray-500 text-sm">Track interim valuations and certificates</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#F97316] hover:bg-[#EA580C] text-white gap-2">
          <Plus className="w-4 h-4" /> New Valuation
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="border-[#F97316]/30">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">New Valuation</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => { setShowForm(false); resetForm() }}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Job</label>
                <select value={formJobId} onChange={e => setFormJobId(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="">Select job...</option>
                  {jobs.filter(j => ["LIVE", "PRACTICAL_COMPLETION"].includes(j.reference ? "" : "")).concat(jobs).map(j => (
                    <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Period Start</label>
                <Input type="date" value={formPeriodStart} onChange={e => setFormPeriodStart(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Period End</label>
                <Input type="date" value={formPeriodEnd} onChange={e => setFormPeriodEnd(e.target.value)} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Value of Work Done (£)</label>
                <Input type="number" step="0.01" value={formGrossValue} onChange={e => setFormGrossValue(e.target.value)} className="font-[family-name:var(--font-mono)]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Materials on Site (£)</label>
                <Input type="number" step="0.01" value={formMaterials} onChange={e => setFormMaterials(e.target.value)} className="font-[family-name:var(--font-mono)]" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Retention %</label>
                <Input type="number" step="0.5" value={formRetention} onChange={e => setFormRetention(e.target.value)} className="font-[family-name:var(--font-mono)]" />
              </div>
            </div>

            {/* Auto-calculated summary */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Gross Value (work + materials)</span>
                <span className="font-[family-name:var(--font-mono)] font-medium">{formatMoney(grossTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Less Retention ({formRetention}%)</span>
                <span className="font-[family-name:var(--font-mono)] text-red-500">-{formatMoney(retentionAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Less Previous Certificates</span>
                <span className="font-[family-name:var(--font-mono)] text-red-500">-{formatMoney(prevCerts)}</span>
              </div>
              <div className="flex justify-between font-bold border-t pt-2">
                <span className="text-[#1A1A2E]">Amount Due This Certificate</span>
                <span className={cn("font-[family-name:var(--font-mono)]", thisCert >= 0 ? "text-green-600" : "text-red-600")}>
                  {formatMoney(thisCert)}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => { setShowForm(false); resetForm() }}>Cancel</Button>
              <Button
                className="bg-[#F97316] hover:bg-[#EA580C] text-white"
                disabled={saving || !formJobId || !formPeriodStart || !formPeriodEnd || grossTotal <= 0}
                onClick={handleCreate}
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Valuation
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Valuations list grouped by job */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-[#F97316]" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📊</div>
            <p>No valuations yet.</p>
          </CardContent>
        </Card>
      ) : (
        Object.values(grouped).map(({ job, items }) => (
          <Card key={job.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <span className="font-[family-name:var(--font-mono)] text-[#F97316]">{job.reference}</span>
                <span className="text-gray-400">—</span>
                <span className="text-[#1A1A2E]">{job.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-500">
                      <th className="text-left py-2 px-2 font-medium">Val #</th>
                      <th className="text-left py-2 px-2 font-medium">Period</th>
                      <th className="text-right py-2 px-2 font-medium">Gross Value</th>
                      <th className="text-right py-2 px-2 font-medium">Retention</th>
                      <th className="text-right py-2 px-2 font-medium">Prev Certs</th>
                      <th className="text-right py-2 px-2 font-medium">This Cert</th>
                      <th className="text-center py-2 px-2 font-medium">Status</th>
                      <th className="text-center py-2 px-2 font-medium">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.sort((a, b) => a.number - b.number).map(v => {
                      const style = VALUATION_STATUS_STYLES[v.status as keyof typeof VALUATION_STATUS_STYLES] || VALUATION_STATUS_STYLES.DRAFT
                      const nextStatus = statusFlow[v.status]
                      return (
                        <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                          <td className="py-2 px-2 font-medium text-[#1A1A2E]">Val {v.number}</td>
                          <td className="py-2 px-2 text-gray-500 text-xs">{formatDate(v.periodStart)} — {formatDate(v.periodEnd)}</td>
                          <td className="py-2 px-2 text-right font-[family-name:var(--font-mono)]">{formatMoney(v.grossValue)}</td>
                          <td className="py-2 px-2 text-right font-[family-name:var(--font-mono)] text-gray-500">{formatMoney(v.retention)}</td>
                          <td className="py-2 px-2 text-right font-[family-name:var(--font-mono)] text-gray-500">{formatMoney(v.previousCerts)}</td>
                          <td className="py-2 px-2 text-right font-[family-name:var(--font-mono)] font-medium text-[#1A1A2E]">{formatMoney(v.thisCert)}</td>
                          <td className="py-2 px-2 text-center">
                            <Badge className={cn(style.bg, style.text, "border-0 text-[10px]")}>{style.label}</Badge>
                          </td>
                          <td className="py-2 px-2 text-center">
                            {nextStatus && (
                              <Button variant="ghost" size="sm" className="text-xs text-[#F97316]" onClick={() => updateStatus(v.id, nextStatus)}>
                                → {VALUATION_STATUS_STYLES[nextStatus as keyof typeof VALUATION_STATUS_STYLES]?.label}
                              </Button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
