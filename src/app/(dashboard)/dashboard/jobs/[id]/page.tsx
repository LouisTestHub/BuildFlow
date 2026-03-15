"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Calendar, PoundSterling, Users, MapPin, Clock,
  Plus, Trash2, ChevronUp, ChevronDown, Loader2, FileText, Wrench
} from "lucide-react"
import { STATUS_COLOURS, VALID_TRANSITIONS, WEATHER_OPTIONS, WEATHER_ICONS, formatCurrency, formatDate } from "@/lib/job-status"
import { cn } from "@/lib/utils"
import { JobStatus, PhaseStatus } from "@prisma/client"

type Tab = "overview" | "phases" | "logs" | "costs" | "documents" | "subcontractors"

interface JobData {
  id: string
  reference: string
  title: string
  status: JobStatus
  clientName: string | null
  clientEmail: string | null
  clientPhone: string | null
  siteAddress: string | null
  sitePostcode: string | null
  sector: string | null
  contractValue: string | null
  startDate: string | null
  endDate: string | null
  retentionPercent: string | null
  defectsPeriodMonths: number | null
  pmId: string | null
  createdAt: string
  updatedAt: string
  projectManager: { id: string; name: string; avatar: string | null; email: string } | null
  phases: Phase[]
  dailyLogs: DailyLogEntry[]
  _count: { phases: number; dailyLogs: number; invoices: number; documents: number }
}

interface Phase {
  id: string
  name: string
  order: number
  budget: string | null
  startDate: string | null
  endDate: string | null
  status: PhaseStatus
}

interface DailyLogEntry {
  id: string
  date: string
  weather: string | null
  labourCount: number | null
  visitors: string | null
  notes: string | null
  user: { name: string }
}

const PHASE_STATUS_COLOURS: Record<PhaseStatus, { bg: string; text: string; label: string }> = {
  NOT_STARTED: { bg: "bg-gray-100", text: "text-gray-600", label: "Not Started" },
  IN_PROGRESS: { bg: "bg-blue-100", text: "text-blue-800", label: "In Progress" },
  COMPLETE: { bg: "bg-green-100", text: "text-green-800", label: "Complete" },
}

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "overview", label: "Overview", icon: FileText },
  { key: "phases", label: "Phases", icon: Clock },
  { key: "logs", label: "Daily Logs", icon: Calendar },
  { key: "costs", label: "Costs", icon: PoundSterling },
  { key: "documents", label: "Documents", icon: FileText },
  { key: "subcontractors", label: "Subcontractors", icon: Users },
]

export default function JobDetailPage() {
  const params = useParams()
  const jobId = params.id as string
  const [job, setJob] = useState<JobData | null>(null)
  const [tab, setTab] = useState<Tab>("overview")
  const [loading, setLoading] = useState(true)
  const [statusChanging, setStatusChanging] = useState(false)

  const fetchJob = useCallback(async () => {
    const res = await fetch(`/api/jobs/${jobId}`)
    if (res.ok) {
      const data = await res.json()
      setJob(data.job)
    }
    setLoading(false)
  }, [jobId])

  useEffect(() => { fetchJob() }, [fetchJob])

  const changeStatus = async (newStatus: JobStatus) => {
    setStatusChanging(true)
    const res = await fetch(`/api/jobs/${jobId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) await fetchJob()
    setStatusChanging(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    )
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-[#1A1A2E]">Job not found</h2>
        <Link href="/dashboard/jobs"><Button variant="link" className="mt-4">← Back to Jobs</Button></Link>
      </div>
    )
  }

  const sc = STATUS_COLOURS[job.status]
  const transitions = VALID_TRANSITIONS[job.status] || []
  const totalBudget = job.phases.reduce((sum, p) => sum + (p.budget ? parseFloat(p.budget) : 0), 0)
  const contractVal = job.contractValue ? parseFloat(job.contractValue) : 0
  const estimatedCost = totalBudget || contractVal * 0.8
  const costsToDate = estimatedCost * 0.45
  const forecastFinal = estimatedCost * 1.02
  const margin = contractVal > 0 ? ((contractVal - forecastFinal) / contractVal * 100) : 0

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" size="icon" className="shrink-0">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-sm text-gray-400">{job.reference}</span>
            <Badge className={cn(sc.bg, sc.text, "border-0")}>{sc.label}</Badge>
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A2E] mt-1 truncate">{job.title}</h2>
          {job.clientName && <p className="text-gray-500 text-sm">{job.clientName}</p>}
        </div>
        {transitions.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {transitions.map(t => {
              const tc = STATUS_COLOURS[t]
              return (
                <Button
                  key={t}
                  size="sm"
                  variant="outline"
                  disabled={statusChanging}
                  onClick={() => changeStatus(t)}
                  className={cn("text-xs", tc.text)}
                >
                  Move to {tc.label}
                </Button>
              )
            })}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                tab === t.key
                  ? "border-[#F97316] text-[#F97316]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.key === "logs" && <span className="text-xs bg-gray-100 rounded-full px-1.5">{job._count.dailyLogs}</span>}
              {t.key === "phases" && <span className="text-xs bg-gray-100 rounded-full px-1.5">{job._count.phases}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {tab === "overview" && <OverviewTab job={job} totalBudget={totalBudget} estimatedCost={estimatedCost} costsToDate={costsToDate} forecastFinal={forecastFinal} margin={margin} />}
      {tab === "phases" && <PhasesTab jobId={jobId} phases={job.phases} onRefresh={fetchJob} />}
      {tab === "logs" && <DailyLogsTab jobId={jobId} logs={job.dailyLogs} onRefresh={fetchJob} />}
      {tab === "costs" && <CostsTab job={job} totalBudget={totalBudget} costsToDate={costsToDate} />}
      {tab === "documents" && <JobDocumentsTab jobId={jobId} />}
      {tab === "subcontractors" && <SubcontractorsTab jobId={jobId} />}
    </div>
  )
}

/* ── Overview Tab ────────────────────────────────────────────────── */
function OverviewTab({ job, totalBudget, estimatedCost, costsToDate, forecastFinal, margin }: {
  job: JobData; totalBudget: number; estimatedCost: number; costsToDate: number; forecastFinal: number; margin: number
}) {
  const contractVal = job.contractValue ? parseFloat(job.contractValue) : 0
  return (
    <div className="space-y-4">
      {/* Financial Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: "Contract Value", value: formatCurrency(contractVal), accent: false },
          { label: "Estimated Cost", value: formatCurrency(estimatedCost), accent: false },
          { label: "Costs to Date", value: formatCurrency(costsToDate), accent: false },
          { label: "Forecast Final", value: formatCurrency(forecastFinal), accent: false },
          { label: "Margin", value: `${margin.toFixed(1)}%`, accent: margin > 15 },
        ].map(card => (
          <Card key={card.label}>
            <CardContent className="p-4">
              <p className="text-xs text-gray-500">{card.label}</p>
              <p className={cn("text-xl font-bold font-mono mt-1", card.accent ? "text-green-600" : "text-[#1A1A2E]")}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Key Info */}
        <Card>
          <CardHeader><CardTitle className="text-base">Key Details</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {job.siteAddress && (
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-[#1A1A2E]">{job.siteAddress}</p>
                  {job.sitePostcode && <p className="text-xs text-gray-400">{job.sitePostcode}</p>}
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <p className="text-sm text-[#1A1A2E]">
                {formatDate(job.startDate)} → {formatDate(job.endDate)}
              </p>
            </div>
            {job.sector && (
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-gray-400 shrink-0" />
                <p className="text-sm text-[#1A1A2E]">{job.sector}</p>
              </div>
            )}
            {job.projectManager && (
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400 shrink-0" />
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#F97316]/20 flex items-center justify-center text-[10px] font-bold text-[#F97316]">
                    {job.projectManager.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">{job.projectManager.name}</p>
                    <p className="text-xs text-gray-400">{job.projectManager.email}</p>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <PoundSterling className="w-4 h-4 text-gray-400 shrink-0" />
              <p className="text-sm text-[#1A1A2E]">
                Retention: {job.retentionPercent || 0}% · Defects: {job.defectsPeriodMonths || 0} months
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            {job.dailyLogs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-3">
                {job.dailyLogs.slice(0, 5).map(log => (
                  <div key={log.id} className="flex gap-3 text-sm">
                    <div className="text-gray-400 font-mono text-xs w-16 shrink-0 pt-0.5">{formatDate(log.date)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[#1A1A2E] truncate">{log.notes?.split("\n")[0]?.replace(/^\[(WORK|ISSUES|H&S)\]\s*/, "") || "Daily log entry"}</p>
                      <p className="text-xs text-gray-400">{log.user.name} · {log.labourCount || 0} on site</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

/* ── Phases Tab ──────────────────────────────────────────────────── */
function PhasesTab({ jobId, phases, onRefresh }: { jobId: string; phases: Phase[]; onRefresh: () => void }) {
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ name: "", budget: "", start_date: "", end_date: "" })

  const addPhase = async () => {
    if (!form.name.trim()) return
    setSaving(true)
    await fetch(`/api/jobs/${jobId}/phases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setForm({ name: "", budget: "", start_date: "", end_date: "" })
    setAdding(false)
    setSaving(false)
    onRefresh()
  }

  const deletePhase = async (phaseId: string) => {
    await fetch(`/api/jobs/${jobId}/phases/${phaseId}`, { method: "DELETE" })
    onRefresh()
  }

  const movePhase = async (phaseId: string, newOrder: number) => {
    await fetch(`/api/jobs/${jobId}/phases/${phaseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: newOrder }),
    })
    onRefresh()
  }

  const totalBudget = phases.reduce((sum, p) => sum + (p.budget ? parseFloat(p.budget) : 0), 0)
  const completedBudget = phases.filter(p => p.status === "COMPLETE").reduce((sum, p) => sum + (p.budget ? parseFloat(p.budget) : 0), 0)
  const progressPercent = totalBudget > 0 ? (completedBudget / totalBudget * 100) : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">{phases.length} phases · Total budget: <span className="font-mono font-medium text-[#1A1A2E]">{formatCurrency(totalBudget)}</span></p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs text-gray-500">{progressPercent.toFixed(0)}% complete</span>
          </div>
        </div>
        <Button size="sm" onClick={() => setAdding(true)}>
          <Plus className="w-4 h-4" /> Add Phase
        </Button>
      </div>

      {adding && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <Input placeholder="Phase name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Input type="number" placeholder="Budget (£)" value={form.budget} onChange={e => setForm(f => ({ ...f, budget: e.target.value }))} className="font-mono" />
              <Input type="date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              <Input type="date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
              <Button size="sm" onClick={addPhase} disabled={saving}>
                {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save Phase
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {phases.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-gray-400">No phases yet. Add your first phase to track progress.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {phases.map((phase, i) => {
            const ps = PHASE_STATUS_COLOURS[phase.status]
            return (
              <Card key={phase.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        disabled={i === 0}
                        onClick={() => movePhase(phase.id, phase.order - 1)}
                        className="text-gray-300 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        disabled={i === phases.length - 1}
                        onClick={() => movePhase(phase.id, phase.order + 1)}
                        className="text-gray-300 hover:text-gray-600 disabled:opacity-30"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-[#1A1A2E] flex items-center justify-center text-xs font-bold text-white shrink-0">
                      {phase.order}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-[#1A1A2E] text-sm">{phase.name}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400 mt-0.5">
                        {phase.budget && <span className="font-mono">{formatCurrency(phase.budget)}</span>}
                        {phase.startDate && <span>{formatDate(phase.startDate)} → {formatDate(phase.endDate)}</span>}
                      </div>
                    </div>
                    <Badge className={cn(ps.bg, ps.text, "border-0 text-[10px]")}>{ps.label}</Badge>
                    <button onClick={() => deletePhase(phase.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Daily Logs Tab ──────────────────────────────────────────────── */
function DailyLogsTab({ jobId, logs: initialLogs, onRefresh }: { jobId: string; logs: DailyLogEntry[]; onRefresh: () => void }) {
  const [logs, setLogs] = useState(initialLogs)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weather: "",
    labour_count: "",
    visitors: "",
    work_completed: "",
    issues_delays: "",
    hs_notes: "",
  })

  const submitLog = async () => {
    if (!form.work_completed.trim()) return
    setSaving(true)
    const res = await fetch(`/api/jobs/${jobId}/logs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ date: new Date().toISOString().split("T")[0], weather: "", labour_count: "", visitors: "", work_completed: "", issues_delays: "", hs_notes: "" })
      setShowForm(false)
      // Refresh logs
      const logsRes = await fetch(`/api/jobs/${jobId}/logs`)
      if (logsRes.ok) {
        const data = await logsRes.json()
        setLogs(data.logs)
      }
      onRefresh()
    }
    setSaving(false)
  }

  const deleteLog = async (logId: string) => {
    await fetch(`/api/jobs/${jobId}/logs/${logId}`, { method: "DELETE" })
    setLogs(l => l.filter(x => x.id !== logId))
    onRefresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{logs.length} daily log{logs.length !== 1 ? "s" : ""}</p>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4" /> New Daily Log
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader><CardTitle className="text-base">New Daily Log</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date</label>
                <Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Weather</label>
                <select
                  value={form.weather}
                  onChange={e => setForm(f => ({ ...f, weather: e.target.value }))}
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                >
                  <option value="">Select...</option>
                  {WEATHER_OPTIONS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Labour on Site</label>
                <Input type="number" value={form.labour_count} onChange={e => setForm(f => ({ ...f, labour_count: e.target.value }))} placeholder="0" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Visitors</label>
              <Input value={form.visitors} onChange={e => setForm(f => ({ ...f, visitors: e.target.value }))} placeholder="e.g. Building control inspector" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Work Completed *</label>
              <textarea
                value={form.work_completed}
                onChange={e => setForm(f => ({ ...f, work_completed: e.target.value }))}
                rows={3}
                placeholder="Describe work completed today..."
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Issues / Delays</label>
              <textarea
                value={form.issues_delays}
                onChange={e => setForm(f => ({ ...f, issues_delays: e.target.value }))}
                rows={2}
                placeholder="Any issues or delays..."
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">H&S Notes</label>
              <textarea
                value={form.hs_notes}
                onChange={e => setForm(f => ({ ...f, hs_notes: e.target.value }))}
                rows={2}
                placeholder="Health & safety observations..."
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button size="sm" onClick={submitLog} disabled={saving}>
                {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save Log
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {logs.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-gray-400">No daily logs yet.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {logs.map(log => {
            const isExpanded = expanded === log.id
            const weatherIcon = log.weather ? (WEATHER_ICONS[log.weather] || log.weather) : ""
            const notesPreview = log.notes?.split("\n")[0]?.replace(/^\[(WORK|ISSUES|H&S)\]\s*/, "") || ""
            return (
              <Card key={log.id}>
                <CardContent className="p-4">
                  <button className="w-full text-left" onClick={() => setExpanded(isExpanded ? null : log.id)}>
                    <div className="flex items-center gap-3">
                      <div className="text-2xl w-8 text-center">{weatherIcon || "📋"}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-[#1A1A2E]">{formatDate(log.date)}</span>
                          <span className="text-xs text-gray-400">by {log.user.name}</span>
                        </div>
                        {!isExpanded && <p className="text-sm text-gray-500 truncate mt-0.5">{notesPreview}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <span className="text-sm font-mono text-[#1A1A2E]">{log.labourCount || 0}</span>
                          <span className="text-xs text-gray-400 ml-1">on site</span>
                        </div>
                        <ChevronDown className={cn("w-4 h-4 text-gray-300 transition-transform", isExpanded && "rotate-180")} />
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t space-y-2">
                      {log.visitors && <p className="text-sm"><span className="font-medium text-gray-600">Visitors:</span> {log.visitors}</p>}
                      {log.notes && (
                        <div className="text-sm space-y-1">
                          {log.notes.split("\n").map((line, i) => {
                            const workMatch = line.match(/^\[WORK\]\s*(.*)/)
                            const issueMatch = line.match(/^\[ISSUES\]\s*(.*)/)
                            const hsMatch = line.match(/^\[H&S\]\s*(.*)/)
                            if (workMatch) return <p key={i}><span className="font-medium text-green-700">Work:</span> {workMatch[1]}</p>
                            if (issueMatch) return <p key={i}><span className="font-medium text-orange-700">Issues:</span> {issueMatch[1]}</p>
                            if (hsMatch) return <p key={i}><span className="font-medium text-blue-700">H&S:</span> {hsMatch[1]}</p>
                            return <p key={i} className="text-gray-600">{line}</p>
                          })}
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button onClick={() => deleteLog(log.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">
                          Delete log
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Costs Tab ───────────────────────────────────────────────────── */
interface JobInvoice {
  id: string
  number: string
  type: string
  amount: string
  vat: string
  total: string
  status: string
  dueDate: string | null
  createdAt: string
}

const INV_STATUS: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
  SENT: { bg: "bg-blue-100", text: "text-blue-800", label: "Sent" },
  PAID: { bg: "bg-green-100", text: "text-green-800", label: "Paid" },
  OVERDUE: { bg: "bg-red-100", text: "text-red-800", label: "Overdue" },
  VOID: { bg: "bg-gray-200", text: "text-gray-500", label: "Void" },
}

function CostsTab({ job, totalBudget, costsToDate }: { job: JobData; totalBudget: number; costsToDate: number }) {
  const [invoices, setInvoices] = useState<JobInvoice[]>([])
  const [loadingInv, setLoadingInv] = useState(true)

  useEffect(() => {
    fetch(`/api/invoices?jobId=${job.id}&limit=50`)
      .then(r => r.json())
      .then(d => { setInvoices(d.invoices || []); setLoadingInv(false) })
      .catch(() => setLoadingInv(false))
  }, [job.id])

  const contractVal = job.contractValue ? parseFloat(job.contractValue) : 0
  const budget = totalBudget || contractVal * 0.8
  const salesInvoices = invoices.filter(i => i.type === "SALES")
  const purchaseInvoices = invoices.filter(i => i.type === "PURCHASE" || i.type === "CIS")
  const totalIncome = salesInvoices.filter(i => i.status === "PAID").reduce((s, i) => s + parseFloat(i.total), 0)
  const totalCosts = purchaseInvoices.filter(i => i.status === "PAID").reduce((s, i) => s + parseFloat(i.total), 0)
  const actualCosts = totalCosts || costsToDate
  const remaining = budget - actualCosts

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Budget</p>
            <p className="text-2xl font-bold font-[family-name:var(--font-mono)] text-[#1A1A2E] mt-1">{formatCurrency(budget)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Income (Paid)</p>
            <p className="text-2xl font-bold font-[family-name:var(--font-mono)] text-green-600 mt-1">{formatCurrency(totalIncome)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Costs (Paid)</p>
            <p className="text-2xl font-bold font-[family-name:var(--font-mono)] text-[#1A1A2E] mt-1">{formatCurrency(actualCosts)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Budget Remaining</p>
            <p className={cn("text-2xl font-bold font-[family-name:var(--font-mono)] mt-1", remaining > 0 ? "text-green-600" : "text-red-600")}>
              {formatCurrency(remaining)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Invoices linked to this job */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Invoices on This Job</CardTitle>
          <Link href={`/dashboard/finance/invoices/new`}>
            <Button variant="outline" size="sm" className="gap-1 text-xs">
              <Plus className="w-3 h-3" /> New Invoice
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {loadingInv ? (
            <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-[#F97316]" /></div>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No invoices linked to this job yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500 text-xs">
                    <th className="text-left py-2">Number</th>
                    <th className="text-left py-2">Type</th>
                    <th className="text-right py-2">Total</th>
                    <th className="text-center py-2">Status</th>
                    <th className="text-left py-2">Due</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => {
                    const s = INV_STATUS[inv.status] || INV_STATUS.DRAFT
                    return (
                      <tr key={inv.id} className={cn("border-b border-gray-50", inv.status === "OVERDUE" && "bg-red-50")}>
                        <td className="py-2 font-[family-name:var(--font-mono)] text-[#1A1A2E]">
                          <Link href={`/dashboard/finance/invoices/${inv.id}`} className="hover:text-[#F97316]">{inv.number}</Link>
                        </td>
                        <td className="py-2 text-gray-500 text-xs">{inv.type}</td>
                        <td className="py-2 text-right font-[family-name:var(--font-mono)] font-medium">{formatCurrency(parseFloat(inv.total))}</td>
                        <td className="py-2 text-center"><Badge className={cn(s.bg, s.text, "border-0 text-[10px]")}>{s.label}</Badge></td>
                        <td className="py-2 text-gray-500 text-xs">{inv.dueDate ? formatDate(inv.dueDate) : "—"}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ── Documents Tab ───────────────────────────────────────────────── */
interface JobDocument {
  id: string
  title: string
  category: string | null
  uploaderName: string
  createdAt: string
}

const DOC_CAT_COLOURS: Record<string, string> = {
  Drawings: "bg-blue-100 text-blue-800",
  Specifications: "bg-purple-100 text-purple-800",
  Contracts: "bg-indigo-100 text-indigo-800",
  Correspondence: "bg-teal-100 text-teal-800",
  Certificates: "bg-green-100 text-green-800",
  "Health & Safety": "bg-red-100 text-red-800",
  Photos: "bg-amber-100 text-amber-800",
  Financial: "bg-emerald-100 text-emerald-800",
  Other: "bg-gray-100 text-gray-600",
}

function JobDocumentsTab({ jobId }: { jobId: string }) {
  const [docs, setDocs] = useState<JobDocument[]>([])
  const [loadingDocs, setLoadingDocs] = useState(true)

  useEffect(() => {
    fetch(`/api/documents?jobId=${jobId}`)
      .then((r) => r.json())
      .then((d) => { setDocs(d.documents || []); setLoadingDocs(false) })
      .catch(() => setLoadingDocs(false))
  }, [jobId])

  if (loadingDocs) {
    return <div className="flex justify-center py-8"><Loader2 className="w-5 h-5 animate-spin text-[#F97316]" /></div>
  }

  if (docs.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-400">
          <div className="text-4xl mb-3">📄</div>
          <p>No documents uploaded for this job yet.</p>
          <Link href="/dashboard/documents">
            <Button variant="link" size="sm" className="mt-2 text-[#F97316]">Go to Documents</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{docs.length} document{docs.length !== 1 ? "s" : ""}</p>
        <Link href="/dashboard/documents">
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <FileText className="w-3 h-3" /> All Documents
          </Button>
        </Link>
      </div>
      <div className="space-y-2">
        {docs.map((doc) => {
          const catColour = DOC_CAT_COLOURS[doc.category || "Other"] || DOC_CAT_COLOURS.Other
          return (
            <Card key={doc.id}>
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-gray-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1A1A2E] truncate">{doc.title}</p>
                    <Badge className={cn(catColour, "border-0 text-[10px] mt-0.5")}>{doc.category || "Other"}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">{doc.uploaderName}</p>
                    <p className="text-[10px] text-gray-400">{formatDate(doc.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

/* ── Placeholder Tab ─────────────────────────────────────────────── */
function PlaceholderTab({ icon, title, message, note }: { icon: string; title: string; message: string; note: string }) {
  return (
    <Card>
      <CardContent className="p-12 text-center">
        <div className="text-5xl mb-4">{icon}</div>
        <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">{title}</h3>
        <p className="text-gray-500">{message}</p>
        <p className="text-xs text-gray-400 mt-2">{note}</p>
      </CardContent>
    </Card>
  )
}

/* ── Subcontractors Tab ──────────────────────────────────────────── */
interface SubOrder {
  id: string
  trade: string | null
  value: string | null
  status: string
  scopeDescription: string | null
  orderDate: string | null
  subcontractor: { id: string; name: string; trade: string | null }
}

const SUB_ORDER_STATUS: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
  ISSUED: { bg: "bg-blue-100", text: "text-blue-800", label: "Issued" },
  ACCEPTED: { bg: "bg-green-100", text: "text-green-800", label: "Accepted" },
  IN_PROGRESS: { bg: "bg-amber-100", text: "text-amber-800", label: "In Progress" },
  COMPLETE: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Complete" },
  DISPUTED: { bg: "bg-red-100", text: "text-red-800", label: "Disputed" },
}

function SubcontractorsTab({ jobId }: { jobId: string }) {
  const [orders, setOrders] = useState<SubOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/jobs/${jobId}?includeSubOrders=1`)
      if (res.ok) {
        const data = await res.json()
        setOrders(data.subcontractOrders || [])
      }
      setLoading(false)
    }
    load()
  }, [jobId])

  if (loading) {
    return <div className="flex items-center justify-center h-32"><Loader2 className="w-6 h-6 animate-spin text-[#F97316]" /></div>
  }

  if (orders.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-gray-400">
          <div className="text-4xl mb-3">👷</div>
          <p>No subcontractors assigned to this job yet.</p>
          <p className="text-xs mt-1">Create subcontract orders from the Subcontractors section.</p>
        </CardContent>
      </Card>
    )
  }

  const totalValue = orders.reduce((sum, o) => sum + (o.value ? parseFloat(o.value) : 0), 0)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {orders.length} subcontract order{orders.length !== 1 ? "s" : ""} · Total: <span className="font-mono font-medium text-[#1A1A2E]">{formatCurrency(totalValue)}</span>
        </p>
      </div>
      <div className="space-y-2">
        {orders.map((order) => {
          const os = SUB_ORDER_STATUS[order.status] || SUB_ORDER_STATUS.DRAFT
          return (
            <Card key={order.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#F97316]/20 flex items-center justify-center text-xs font-bold text-[#F97316]">
                    {order.subcontractor.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link href={`/dashboard/subcontractors/${order.subcontractor.id}`} className="font-medium text-sm text-[#1A1A2E] hover:text-[#F97316] transition-colors">
                      {order.subcontractor.name}
                    </Link>
                    <div className="flex flex-wrap gap-x-4 text-xs text-gray-400 mt-0.5">
                      {order.trade && <span>{order.trade}</span>}
                      {order.value && <span className="font-mono">{formatCurrency(parseFloat(order.value))}</span>}
                      {order.orderDate && <span>{formatDate(order.orderDate)}</span>}
                    </div>
                    {order.scopeDescription && <p className="text-xs text-gray-500 mt-0.5 truncate">{order.scopeDescription}</p>}
                  </div>
                  <Badge className={cn(os.bg, os.text, "border-0 text-[10px]")}>{os.label}</Badge>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
