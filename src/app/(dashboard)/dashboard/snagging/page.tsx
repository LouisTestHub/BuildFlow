"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, CheckSquare, AlertCircle, Clock } from "lucide-react"

interface SnagListItem {
  id: string; area: string; status: string; createdAt: string
  job: { id: string; reference: string; title: string }
  stats: { total: number; open: number; inProgress: number; resolved: number; overdue: number }
}

const statusBadge: Record<string, { class: string; label: string }> = {
  OPEN: { class: "bg-red-100 text-red-800", label: "Open" },
  IN_PROGRESS: { class: "bg-amber-100 text-amber-800", label: "In Progress" },
  COMPLETE: { class: "bg-green-100 text-green-800", label: "Complete" },
}

export default function SnaggingPage() {
  const [snagLists, setSnagLists] = useState<SnagListItem[]>([])
  const [stats, setStats] = useState({ totalOpen: 0, totalOverdue: 0 })
  const [loading, setLoading] = useState(true)
  const [filterJob, setFilterJob] = useState("")
  const [jobs, setJobs] = useState<Array<{ id: string; reference: string; title: string }>>([])
  const [showForm, setShowForm] = useState(false)
  const [formJob, setFormJob] = useState("")
  const [formArea, setFormArea] = useState("")
  const [saving, setSaving] = useState(false)

  const fetchData = () => {
    const params = new URLSearchParams()
    if (filterJob) params.set("jobId", filterJob)
    fetch(`/api/snagging?${params}`)
      .then((r) => r.json())
      .then((d) => { setSnagLists(d.snagLists || []); setStats(d.stats || { totalOpen: 0, totalOverdue: 0 }) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [filterJob])

  useEffect(() => {
    fetch("/api/jobs?limit=100")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs?.map((j: Record<string, string>) => ({ id: j.id, reference: j.reference, title: j.title })) || []))
      .catch(() => {})
  }, [])

  const handleCreate = async () => {
    if (!formJob || !formArea) return alert("Job and area are required")
    setSaving(true)
    try {
      await fetch("/api/snagging", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: formJob, area: formArea }),
      })
      setShowForm(false); setFormArea("")
      fetchData()
    } catch { alert("Failed to create") }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Snagging</h2>
          <p className="text-gray-500 text-sm">Track and resolve snag items</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
          <Plus className="w-4 h-4 mr-2" />New Snag List
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <CheckSquare className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{stats.totalOpen}</p>
              <p className="text-xs text-gray-500">Open Snags</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{stats.totalOverdue}</p>
              <p className="text-xs text-gray-500">Overdue Snags</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{snagLists.length}</p>
              <p className="text-xs text-gray-500">Snag Lists</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm">
          <option value="">All Jobs</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>)}
        </select>
      </div>

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <Card className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#1A1A2E]">New Snag List</h3>
                <button onClick={() => setShowForm(false)}><X className="w-5 h-5 text-gray-400" /></button>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Job *</label>
                <select value={formJob} onChange={(e) => setFormJob(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm">
                  <option value="">Select job...</option>
                  {jobs.map((j) => <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Area / Zone *</label>
                <Input value={formArea} onChange={(e) => setFormArea(e.target.value)} placeholder="e.g. Block A — Ground Floor" />
              </div>
              <div className="flex gap-3 justify-end">
                <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={handleCreate} disabled={saving} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
                  {saving ? "Creating..." : "Create"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : snagLists.length === 0 ? (
            <div className="p-12 text-center">
              <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">No snag lists yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Job</th>
                    <th className="px-4 py-3 font-medium">Area / Zone</th>
                    <th className="px-4 py-3 font-medium">Total</th>
                    <th className="px-4 py-3 font-medium">Open</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Resolved</th>
                    <th className="px-4 py-3 font-medium">Progress</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {snagLists.map((sl) => {
                    const badge = statusBadge[sl.status] || statusBadge.OPEN
                    const pct = sl.stats.total > 0 ? Math.round((sl.stats.resolved / sl.stats.total) * 100) : 0
                    return (
                      <tr key={sl.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/dashboard/snagging/${sl.id}`}>
                        <td className="px-4 py-3">{sl.job.reference}</td>
                        <td className="px-4 py-3 font-medium">{sl.area}</td>
                        <td className="px-4 py-3">{sl.stats.total}</td>
                        <td className="px-4 py-3">
                          <span className={sl.stats.open > 0 ? "text-red-600 font-semibold" : ""}>{sl.stats.open}</span>
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">{sl.stats.resolved}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden min-w-[60px]">
                              <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="text-xs text-gray-500 w-8">{pct}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><Badge className={badge.class}>{badge.label}</Badge></td>
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
