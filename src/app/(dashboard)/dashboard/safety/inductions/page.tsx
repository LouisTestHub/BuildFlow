"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X, Users } from "lucide-react"

interface Induction {
  id: string; date: string; personName: string; companyName: string | null
  inductedBy: string | null; topics: string[] | null
  job: { id: string; reference: string; title: string }
}

const TOPICS = [
  "Site Rules", "PPE Requirements", "Welfare Facilities", "First Aid",
  "Fire Procedures", "Hazard Awareness", "Permits to Work", "Working Hours", "Reporting Procedures",
]

const subNav = [
  { href: "/dashboard/safety", label: "Overview" },
  { href: "/dashboard/safety/rams", label: "RAMS" },
  { href: "/dashboard/safety/incidents", label: "Incidents" },
  { href: "/dashboard/safety/inductions", label: "Inductions" },
]

export default function InductionsPage() {
  const [inductions, setInductions] = useState<Induction[]>([])
  const [loading, setLoading] = useState(true)
  const [filterJob, setFilterJob] = useState("")
  const [jobs, setJobs] = useState<Array<{ id: string; reference: string; title: string }>>([])
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Form state
  const [formJob, setFormJob] = useState("")
  const [formName, setFormName] = useState("")
  const [formCompany, setFormCompany] = useState("")
  const [formTrade, setFormTrade] = useState("")
  const [formInductedBy, setFormInductedBy] = useState("")
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0])
  const [formTopics, setFormTopics] = useState<string[]>([])

  const fetchInductions = () => {
    const params = new URLSearchParams()
    if (filterJob) params.set("jobId", filterJob)
    fetch(`/api/inductions?${params}`)
      .then((r) => r.json())
      .then((d) => setInductions(d.inductions || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchInductions() }, [filterJob])

  useEffect(() => {
    fetch("/api/jobs?limit=100")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs?.map((j: Record<string, string>) => ({ id: j.id, reference: j.reference, title: j.title })) || []))
      .catch(() => {})
  }, [])

  const toggleTopic = (t: string) => {
    setFormTopics((p) => p.includes(t) ? p.filter((x) => x !== t) : [...p, t])
  }

  const handleSubmit = async () => {
    if (!formJob || !formName) return alert("Job and person name are required")
    setSaving(true)
    try {
      await fetch("/api/inductions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: formJob, personName: formName, companyName: formCompany || undefined,
          date: formDate, inductedBy: formInductedBy || undefined,
          topics: [...formTopics, ...(formTrade ? [`Trade: ${formTrade}`] : [])],
        }),
      })
      setShowForm(false)
      setFormName(""); setFormCompany(""); setFormTrade(""); setFormTopics([])
      fetchInductions()
    } catch {
      alert("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Health & Safety</h2>
          <p className="text-gray-500 text-sm">Site induction records</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
          <Plus className="w-4 h-4 mr-2" />Record Induction
        </Button>
      </div>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {subNav.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              item.href === "/dashboard/safety/inductions"
                ? "border-[#F97316] text-[#F97316]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{item.label}</div>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm">
          <option value="">All Jobs</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>)}
        </select>
      </div>

      {/* Induction Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#1A1A2E]">Record Induction</h3>
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
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Person Name *</label>
                  <Input value={formName} onChange={(e) => setFormName(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Company</label>
                  <Input value={formCompany} onChange={(e) => setFormCompany(e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Trade</label>
                  <Input value={formTrade} onChange={(e) => setFormTrade(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Inducted By</label>
                  <Input value={formInductedBy} onChange={(e) => setFormInductedBy(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Date</label>
                <Input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Topics Covered</label>
                <div className="grid grid-cols-2 gap-2">
                  {TOPICS.map((t) => (
                    <label key={t} className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer text-sm ${
                      formTopics.includes(t) ? "bg-[#F97316]/10 border-[#F97316]" : "border-gray-200 hover:bg-gray-50"
                    }`}>
                      <input type="checkbox" checked={formTopics.includes(t)} onChange={() => toggleTopic(t)} className="accent-[#F97316]" />
                      {t}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 justify-end pt-2">
                <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button onClick={handleSubmit} disabled={saving} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
                  {saving ? "Saving..." : "Save Induction"}
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
          ) : inductions.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-400">No induction records found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Job</th>
                    <th className="px-4 py-3 font-medium">Person Name</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Company</th>
                    <th className="px-4 py-3 font-medium hidden lg:table-cell">Trade</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Inducted By</th>
                  </tr>
                </thead>
                <tbody>
                  {inductions.map((ind) => {
                    const trade = (ind.topics || []).find((t: string) => t.startsWith("Trade: "))?.replace("Trade: ", "") || "—"
                    return (
                      <tr key={ind.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{new Date(ind.date).toLocaleDateString("en-GB")}</td>
                        <td className="px-4 py-3">{ind.job.reference}</td>
                        <td className="px-4 py-3 font-medium">{ind.personName}</td>
                        <td className="px-4 py-3 hidden md:table-cell">{ind.companyName || "—"}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">{trade}</td>
                        <td className="px-4 py-3 hidden sm:table-cell">{ind.inductedBy || "—"}</td>
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
