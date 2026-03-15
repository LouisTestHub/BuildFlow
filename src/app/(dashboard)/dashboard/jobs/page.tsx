"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, ChevronLeft, ChevronRight, ArrowUpDown, Filter } from "lucide-react"
import { STATUS_COLOURS, formatCurrency, formatDate } from "@/lib/job-status"
import { cn } from "@/lib/utils"
import { JobStatus } from "@prisma/client"

interface Job {
  id: string
  reference: string
  title: string
  clientName: string | null
  siteAddress: string | null
  sitePostcode: string | null
  status: JobStatus
  contractValue: string | null
  startDate: string | null
  projectManager: { id: string; name: string; avatar: string | null } | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "All Statuses" },
  { value: "TENDER", label: "Tender" },
  { value: "WON", label: "Won" },
  { value: "LIVE", label: "Live" },
  { value: "PRACTICAL_COMPLETION", label: "Practical Completion" },
  { value: "FINAL_ACCOUNT", label: "Final Account" },
  { value: "CLOSED", label: "Closed" },
  { value: "LOST", label: "Lost" },
]

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")

  const fetchJobs = useCallback(async (page: number) => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
      sortBy,
      sortDir,
    })
    if (search) params.set("search", search)
    if (status) params.set("status", status)
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)

    const res = await fetch(`/api/jobs?${params}`)
    const data = await res.json()
    setJobs(data.jobs || [])
    setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 })
    setLoading(false)
  }, [search, status, sortBy, sortDir, dateFrom, dateTo])

  useEffect(() => {
    const timer = setTimeout(() => fetchJobs(1), 300)
    return () => clearTimeout(timer)
  }, [fetchJobs])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDir("desc")
    }
  }

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-700"
    >
      {children}
      <ArrowUpDown className={cn("w-3 h-3", sortBy === field ? "text-[#F97316]" : "text-gray-300")} />
    </button>
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Jobs</h2>
          <p className="text-gray-500 text-sm">{pagination.total} job{pagination.total !== 1 ? "s" : ""} total</p>
        </div>
        <Link href="/dashboard/jobs/new">
          <Button>
            <Plus className="w-4 h-4" />
            New Job
          </Button>
        </Link>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search jobs by title, client, reference, postcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              {STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="h-10">
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
          {showFilters && (
            <div className="flex flex-col sm:flex-row gap-3 mt-3 pt-3 border-t">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Start Date From</label>
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Start Date To</label>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
              <div className="flex items-end">
                <Button variant="ghost" size="sm" onClick={() => { setDateFrom(""); setDateTo(""); setStatus(""); setSearch("") }}>
                  Clear All
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left p-3"><SortHeader field="createdAt">Ref</SortHeader></th>
                <th className="text-left p-3 hidden sm:table-cell"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Title</span></th>
                <th className="text-left p-3 hidden md:table-cell"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Client</span></th>
                <th className="text-left p-3 hidden lg:table-cell"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Site</span></th>
                <th className="text-left p-3"><SortHeader field="status">Status</SortHeader></th>
                <th className="text-right p-3 hidden md:table-cell"><SortHeader field="value">Value</SortHeader></th>
                <th className="text-left p-3 hidden xl:table-cell"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">PM</span></th>
                <th className="text-left p-3 hidden lg:table-cell"><SortHeader field="startDate">Start</SortHeader></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={8} className="p-3">
                      <div className="h-5 bg-gray-100 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : jobs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No jobs found. {search || status ? "Try adjusting your filters." : "Create your first job to get started."}
                  </td>
                </tr>
              ) : (
                jobs.map((job) => {
                  const sc = STATUS_COLOURS[job.status]
                  return (
                    <tr key={job.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <Link href={`/dashboard/jobs/${job.id}`} className="block">
                          <span className="font-mono text-xs text-gray-500">{job.reference}</span>
                          <span className="block sm:hidden text-sm font-medium text-[#1A1A2E] mt-0.5">{job.title}</span>
                        </Link>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <Link href={`/dashboard/jobs/${job.id}`} className="text-sm font-medium text-[#1A1A2E] hover:text-[#F97316] transition-colors">
                          {job.title}
                        </Link>
                      </td>
                      <td className="p-3 hidden md:table-cell text-sm text-gray-600">{job.clientName || "—"}</td>
                      <td className="p-3 hidden lg:table-cell text-sm text-gray-600 max-w-[200px] truncate">{job.siteAddress || "—"}</td>
                      <td className="p-3">
                        <Badge className={cn(sc.bg, sc.text, "border-0 text-[10px]")}>{sc.label}</Badge>
                      </td>
                      <td className="p-3 hidden md:table-cell text-right">
                        <span className="font-mono text-sm text-[#1A1A2E]">{formatCurrency(job.contractValue)}</span>
                      </td>
                      <td className="p-3 hidden xl:table-cell">
                        {job.projectManager ? (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#1A1A2E]/10 flex items-center justify-center text-[10px] font-bold text-[#1A1A2E]">
                              {job.projectManager.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <span className="text-sm text-gray-600">{job.projectManager.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Unassigned</span>
                        )}
                      </td>
                      <td className="p-3 hidden lg:table-cell text-sm text-gray-600">{formatDate(job.startDate)}</td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t">
            <p className="text-sm text-gray-500">
              Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline" size="sm"
                disabled={pagination.page <= 1}
                onClick={() => fetchJobs(pagination.page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline" size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchJobs(pagination.page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
