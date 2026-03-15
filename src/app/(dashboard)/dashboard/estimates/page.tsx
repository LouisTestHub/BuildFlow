"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search, Plus, ChevronLeft, ChevronRight, Filter,
  Calculator, TrendingUp, Target, PoundSterling
} from "lucide-react"
import { ESTIMATE_STATUS_COLOURS, formatMoneyCompact } from "@/lib/estimate-utils"
import { formatDate } from "@/lib/job-status"
import { cn } from "@/lib/utils"
import { EstimateStatus } from "@prisma/client"

interface EstimateRow {
  id: string
  reference: string
  title: string
  clientName: string | null
  status: EstimateStatus
  totalCost: string | null
  marginPercent: string | null
  sellPrice: string | null
  createdAt: string
  updatedAt: string
  sections: Array<{ items: Array<Record<string, unknown>> }>
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface Stats {
  totalEstimates: number
  winRate: number
  avgMargin: number
  pipelineValue: number
}

const STATUS_OPTIONS = [
  { value: "", label: "All Statuses" },
  { value: "DRAFT", label: "Draft" },
  { value: "SUBMITTED", label: "Submitted" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "DECLINED", label: "Declined" },
  { value: "REVISED", label: "Revised" },
]

export default function EstimatesPage() {
  const [estimates, setEstimates] = useState<EstimateRow[]>([])
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, totalPages: 0 })
  const [stats, setStats] = useState<Stats>({ totalEstimates: 0, winRate: 0, avgMargin: 0, pipelineValue: 0 })
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchEstimates = useCallback(async (page: number) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(page), limit: "20" })
    if (search) params.set("search", search)
    if (status) params.set("status", status)
    if (dateFrom) params.set("dateFrom", dateFrom)
    if (dateTo) params.set("dateTo", dateTo)

    const res = await fetch(`/api/estimates?${params}`)
    const data = await res.json()
    setEstimates(data.estimates || [])
    setPagination(data.pagination || { page: 1, limit: 20, total: 0, totalPages: 0 })
    setStats(data.stats || { totalEstimates: 0, winRate: 0, avgMargin: 0, pipelineValue: 0 })
    setLoading(false)
  }, [search, status, dateFrom, dateTo])

  useEffect(() => {
    const timer = setTimeout(() => fetchEstimates(1), 300)
    return () => clearTimeout(timer)
  }, [fetchEstimates])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Estimates</h2>
          <p className="text-gray-500 text-sm">{pagination.total} estimate{pagination.total !== 1 ? "s" : ""} total</p>
        </div>
        <Link href="/dashboard/estimates/new">
          <Button>
            <Plus className="w-4 h-4" />
            New Estimate
          </Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E] font-mono">{stats.totalEstimates}</p>
              <p className="text-xs text-gray-500">Total Estimates</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E] font-mono">{stats.winRate}%</p>
              <p className="text-xs text-gray-500">Win Rate</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E] font-mono">{stats.avgMargin}%</p>
              <p className="text-xs text-gray-500">Avg Margin</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <PoundSterling className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E] font-mono">{formatMoneyCompact(stats.pipelineValue)}</p>
              <p className="text-xs text-gray-500">Pipeline Value</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search by title, client, or reference..."
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
                <label className="text-xs text-gray-500 mb-1 block">Created From</label>
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Created To</label>
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
                <th className="text-left p-3"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Ref</span></th>
                <th className="text-left p-3 hidden sm:table-cell"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Title</span></th>
                <th className="text-left p-3 hidden md:table-cell"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Client</span></th>
                <th className="text-left p-3"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</span></th>
                <th className="text-right p-3 hidden md:table-cell"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Sell Price</span></th>
                <th className="text-right p-3 hidden lg:table-cell"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Margin</span></th>
                <th className="text-left p-3 hidden lg:table-cell"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Created</span></th>
                <th className="text-left p-3 hidden xl:table-cell"><span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</span></th>
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
              ) : estimates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    No estimates found. {search || status ? "Try adjusting your filters." : "Create your first estimate to get started."}
                  </td>
                </tr>
              ) : (
                estimates.map((est) => {
                  const sc = ESTIMATE_STATUS_COLOURS[est.status] || ESTIMATE_STATUS_COLOURS.DRAFT
                  const margin = est.marginPercent ? Number(est.marginPercent) : 0
                  const marginClass = margin > 15 ? "text-green-600" : margin >= 10 ? "text-amber-600" : "text-red-600"
                  return (
                    <tr key={est.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <Link href={`/dashboard/estimates/${est.id}`} className="block">
                          <span className="font-mono text-xs text-gray-500">{est.reference}</span>
                          <span className="block sm:hidden text-sm font-medium text-[#1A1A2E] mt-0.5">{est.title}</span>
                        </Link>
                      </td>
                      <td className="p-3 hidden sm:table-cell">
                        <Link href={`/dashboard/estimates/${est.id}`} className="text-sm font-medium text-[#1A1A2E] hover:text-[#F97316] transition-colors">
                          {est.title}
                        </Link>
                      </td>
                      <td className="p-3 hidden md:table-cell text-sm text-gray-600">{est.clientName || "—"}</td>
                      <td className="p-3">
                        <Badge className={cn(sc.bg, sc.text, "border-0 text-[10px]")}>{sc.label}</Badge>
                      </td>
                      <td className="p-3 hidden md:table-cell text-right">
                        <span className="font-mono text-sm text-[#1A1A2E]">
                          {est.sellPrice ? formatMoneyCompact(Number(est.sellPrice)) : "—"}
                        </span>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-right">
                        <span className={cn("font-mono text-sm font-semibold", marginClass)}>
                          {margin > 0 ? `${margin}%` : "—"}
                        </span>
                      </td>
                      <td className="p-3 hidden lg:table-cell text-sm text-gray-600">{formatDate(est.createdAt)}</td>
                      <td className="p-3 hidden xl:table-cell text-sm text-gray-600">{formatDate(est.updatedAt)}</td>
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
                onClick={() => fetchEstimates(pagination.page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline" size="sm"
                disabled={pagination.page >= pagination.totalPages}
                onClick={() => fetchEstimates(pagination.page + 1)}
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
