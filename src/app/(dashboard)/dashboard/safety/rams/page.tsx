"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface RAMS {
  id: string; title: string; version: number; status: string; approvedBy: string | null
  updatedAt: string; job: { id: string; reference: string; title: string }
}

const statusBadge: Record<string, { class: string; label: string }> = {
  DRAFT: { class: "bg-gray-100 text-gray-700", label: "Draft" },
  APPROVED: { class: "bg-green-100 text-green-800", label: "Approved" },
  SUPERSEDED: { class: "bg-amber-100 text-amber-800", label: "Superseded" },
}

const subNav = [
  { href: "/dashboard/safety", label: "Overview" },
  { href: "/dashboard/safety/rams", label: "RAMS" },
  { href: "/dashboard/safety/incidents", label: "Incidents" },
  { href: "/dashboard/safety/inductions", label: "Inductions" },
]

export default function RamsPage() {
  const [rams, setRams] = useState<RAMS[]>([])
  const [loading, setLoading] = useState(true)
  const [filterJob, setFilterJob] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [jobs, setJobs] = useState<Array<{ id: string; reference: string; title: string }>>([])

  useEffect(() => {
    const params = new URLSearchParams()
    if (filterJob) params.set("jobId", filterJob)
    if (filterStatus) params.set("status", filterStatus)
    fetch(`/api/rams?${params}`)
      .then((r) => r.json())
      .then((d) => setRams(d.rams || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [filterJob, filterStatus])

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
          <p className="text-gray-500 text-sm">Risk Assessments & Method Statements</p>
        </div>
        <Link href="/dashboard/safety/rams/new">
          <Button className="bg-[#F97316] hover:bg-[#EA580C] text-white">
            <Plus className="w-4 h-4 mr-2" />New RAMS
          </Button>
        </Link>
      </div>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {subNav.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              item.href === "/dashboard/safety/rams"
                ? "border-[#F97316] text-[#F97316]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
              {item.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <select
          value={filterJob}
          onChange={(e) => setFilterJob(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
        >
          <option value="">All Jobs</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
        >
          <option value="">All Statuses</option>
          <option value="DRAFT">Draft</option>
          <option value="APPROVED">Approved</option>
          <option value="SUPERSEDED">Superseded</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-12 text-center text-gray-400">Loading...</div>
          ) : rams.length === 0 ? (
            <div className="p-12 text-center text-gray-400">No RAMS found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500 bg-gray-50">
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Job</th>
                    <th className="px-4 py-3 font-medium">Version</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium hidden md:table-cell">Approved By</th>
                    <th className="px-4 py-3 font-medium">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {rams.map((r) => {
                    const badge = statusBadge[r.status] || statusBadge.DRAFT
                    return (
                      <tr key={r.id} className="border-b hover:bg-gray-50 cursor-pointer" onClick={() => window.location.href = `/dashboard/safety/rams/${r.id}`}>
                        <td className="px-4 py-3 font-medium text-[#1A1A2E]">{r.title}</td>
                        <td className="px-4 py-3 text-gray-600">{r.job.reference}</td>
                        <td className="px-4 py-3">v{r.version}</td>
                        <td className="px-4 py-3"><Badge className={badge.class}>{badge.label}</Badge></td>
                        <td className="px-4 py-3 hidden md:table-cell text-gray-600">{r.approvedBy || "—"}</td>
                        <td className="px-4 py-3 text-gray-500">{new Date(r.updatedAt).toLocaleDateString("en-GB")}</td>
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
