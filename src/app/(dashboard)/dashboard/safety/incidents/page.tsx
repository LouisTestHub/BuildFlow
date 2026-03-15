"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface Incident {
  id: string; date: string; severity: string; description: string; status: string
  job: { id: string; reference: string; title: string }
  user: { id: string; name: string }
}

const severityColour: Record<string, string> = {
  NEAR_MISS: "bg-blue-100 text-blue-800",
  MINOR: "bg-yellow-100 text-yellow-800",
  MAJOR: "bg-orange-100 text-orange-800",
  RIDDOR: "bg-red-100 text-red-800 border border-red-300",
}
const severityLabel: Record<string, string> = { NEAR_MISS: "Near Miss", MINOR: "Minor", MAJOR: "Major", RIDDOR: "RIDDOR" }

const subNav = [
  { href: "/dashboard/safety", label: "Overview" },
  { href: "/dashboard/safety/rams", label: "RAMS" },
  { href: "/dashboard/safety/incidents", label: "Incidents" },
  { href: "/dashboard/safety/inductions", label: "Inductions" },
]

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState("")
  const [filterJob, setFilterJob] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [jobs, setJobs] = useState<Array<{ id: string; reference: string; title: string }>>([])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filterSeverity) params.set("severity", filterSeverity)
    if (filterJob) params.set("jobId", filterJob)
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)
    fetch(`/api/incidents?${params}`)
      .then((r) => r.json())
      .then((d) => setIncidents(d.incidents || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filterSeverity, filterJob, dateFrom, dateTo])

  useEffect(() => {
    fetch("/api/jobs?limit=100")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs?.map((j: Record<string, string>) => ({ id: j.id, reference: j.reference, title: j.title })) || []))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Health & Safety</h2>
          <p className="text-gray-500 text-sm">Incident reports</p>
        </div>
        <Link href="/dashboard/safety/incidents/new">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            <AlertTriangle className="w-4 h-4 mr-2" />Report Incident
          </Button>
        </Link>
      </div>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {subNav.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              item.href === "/dashboard/safety/incidents"
                ? "border-[#F97316] text-[#F97316]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>{item.label}</div>
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        <select value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm">
          <option value="">All Severities</option>
          <option value="NEAR_MISS">Near Miss</option>
          <option value="MINOR">Minor</option>
          <option value="MAJOR">Major</option>
          <option value="RIDDOR">RIDDOR</option>
        </select>
        <select value={filterJob} onChange={(e) => setFilterJob(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm">
          <option value="">All Jobs</option>
          {jobs.map((j) => <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>)}
        </select>
        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm" placeholder="From" />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm" placeholder="To" />
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : incidents.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No incidents found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Job</th>
                    <th className="px-4 py-3 font-medium">Severity</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Description</th>
                    <th className="px-4 py-3 font-medium hidden sm:table-cell">Reported By</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map((inc) => (
                    <tr key={inc.id}
                      className={`border-b hover:bg-gray-50 cursor-pointer ${inc.severity === "RIDDOR" ? "border-l-4 border-l-red-500 bg-red-50/30" : ""}`}
                      onClick={() => window.location.href = `/dashboard/safety/incidents/${inc.id}`}>
                      <td className="px-4 py-3">{new Date(inc.date).toLocaleDateString("en-GB")}</td>
                      <td className="px-4 py-3">{inc.job.reference}</td>
                      <td className="px-4 py-3"><Badge className={severityColour[inc.severity]}>{severityLabel[inc.severity]}</Badge></td>
                      <td className="px-4 py-3 hidden md:table-cell max-w-xs truncate">{inc.description}</td>
                      <td className="px-4 py-3 hidden sm:table-cell">{inc.user.name}</td>
                      <td className="px-4 py-3">
                        <Badge variant={inc.status === "CLOSED" ? "success" : inc.status === "INVESTIGATING" ? "warning" : "secondary"}>
                          {inc.status === "INVESTIGATING" ? "Investigating" : inc.status === "CLOSED" ? "Closed" : "Open"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
