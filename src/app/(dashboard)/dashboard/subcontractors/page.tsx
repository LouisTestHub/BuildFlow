"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Search, Plus, Users, ShieldCheck, AlertTriangle, ShieldX, Loader2, Star } from "lucide-react"

interface SubcontractorRow {
  id: string
  name: string
  trade: string | null
  contactName: string | null
  email: string | null
  phone: string | null
  cisTaxStatus: string
  cisVerified: boolean
  insuranceExpiry: string | null
  rating: number | null
  complianceStatus: "compliant" | "expiring" | "expired"
  _count: { orders: number }
}

const CIS_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  GROSS: { bg: "bg-green-100", text: "text-green-800", label: "Gross" },
  NET: { bg: "bg-amber-100", text: "text-amber-800", label: "Net" },
  HIGHER_RATE: { bg: "bg-red-100", text: "text-red-800", label: "Higher Rate" },
  NOT_VERIFIED: { bg: "bg-gray-100", text: "text-gray-600", label: "Not Verified" },
  UNMATCHED: { bg: "bg-gray-100", text: "text-gray-600", label: "Unmatched" },
}

const COMPLIANCE_ICONS: Record<string, string> = {
  compliant: "🟢",
  expiring: "🟡",
  expired: "🔴",
}

const TRADES = [
  "Electrician", "Plumber", "Bricklayer", "Plasterer", "Roofer", "Groundworker",
  "Carpenter", "Decorator", "Scaffolder", "Steelwork", "M&E", "Demolition",
  "Landscaping", "Flooring", "Glazing", "Other",
]

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-300 text-xs">—</span>
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn("w-3.5 h-3.5", i <= rating ? "text-amber-400 fill-amber-400" : "text-gray-200")}
        />
      ))}
    </div>
  )
}

export default function SubcontractorsPage() {
  const [subs, setSubs] = useState<SubcontractorRow[]>([])
  const [stats, setStats] = useState({ total: 0, compliantPercent: 0, expiring: 0, unverified: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [tradeFilter, setTradeFilter] = useState("")
  const [cisFilter, setCisFilter] = useState("")
  const [complianceFilter, setComplianceFilter] = useState("")

  const fetchSubs = useCallback(async () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (tradeFilter) params.set("trade", tradeFilter)
    if (cisFilter) params.set("cisStatus", cisFilter)
    if (complianceFilter) params.set("compliance", complianceFilter)

    const res = await fetch(`/api/subcontractors?${params}`)
    if (res.ok) {
      const data = await res.json()
      setSubs(data.subcontractors)
      setStats(data.stats)
    }
    setLoading(false)
  }, [search, tradeFilter, cisFilter, complianceFilter])

  useEffect(() => {
    const timer = setTimeout(() => fetchSubs(), 300)
    return () => clearTimeout(timer)
  }, [fetchSubs])

  const formatDate = (d: string | null) => {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Subcontractors</h2>
          <p className="text-gray-500 text-sm">Manage your subcontractors and compliance</p>
        </div>
        <Link href="/dashboard/subcontractors/new">
          <Button><Plus className="w-4 h-4" /> Add Subcontractor</Button>
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{stats.total}</p>
              <p className="text-xs text-gray-500">Total Subbies</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{stats.compliantPercent}%</p>
              <p className="text-xs text-gray-500">Fully Compliant</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.expiring}</p>
              <p className="text-xs text-gray-500">Expiring This Month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <ShieldX className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{stats.unverified}</p>
              <p className="text-xs text-gray-500">Unverified CIS</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name, trade, contact..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={tradeFilter}
              onChange={(e) => setTradeFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              <option value="">All Trades</option>
              {TRADES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={cisFilter}
              onChange={(e) => setCisFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              <option value="">All CIS Status</option>
              <option value="GROSS">Gross</option>
              <option value="NET">Net</option>
              <option value="HIGHER_RATE">Higher Rate</option>
              <option value="NOT_VERIFIED">Not Verified</option>
            </select>
            <select
              value={complianceFilter}
              onChange={(e) => setComplianceFilter(e.target.value)}
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              <option value="">All Compliance</option>
              <option value="compliant">🟢 Compliant</option>
              <option value="expiring">🟡 Expiring</option>
              <option value="expired">🔴 Expired/Missing</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      {subs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-5xl mb-4">👷</div>
            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">No subcontractors found</h3>
            <p className="text-gray-500 mb-4">
              {search || tradeFilter || cisFilter || complianceFilter
                ? "Try adjusting your filters"
                : "Add your first subcontractor to get started"}
            </p>
            {!search && !tradeFilter && !cisFilter && !complianceFilter && (
              <Link href="/dashboard/subcontractors/new">
                <Button><Plus className="w-4 h-4" /> Add Subcontractor</Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50/50">
                  <th className="text-left p-3 font-medium text-gray-600">Status</th>
                  <th className="text-left p-3 font-medium text-gray-600">Name</th>
                  <th className="text-left p-3 font-medium text-gray-600">Trade</th>
                  <th className="text-left p-3 font-medium text-gray-600 hidden md:table-cell">Contact</th>
                  <th className="text-left p-3 font-medium text-gray-600">CIS</th>
                  <th className="text-left p-3 font-medium text-gray-600 hidden lg:table-cell">Insurance Expiry</th>
                  <th className="text-left p-3 font-medium text-gray-600 hidden lg:table-cell">Rating</th>
                  <th className="text-left p-3 font-medium text-gray-600 hidden md:table-cell">Jobs</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((sub) => {
                  const cis = CIS_BADGES[sub.cisTaxStatus] || CIS_BADGES.NOT_VERIFIED
                  return (
                    <tr key={sub.id} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="p-3">
                        <span className="text-lg" title={sub.complianceStatus}>
                          {COMPLIANCE_ICONS[sub.complianceStatus]}
                        </span>
                      </td>
                      <td className="p-3">
                        <Link href={`/dashboard/subcontractors/${sub.id}`} className="font-medium text-[#1A1A2E] hover:text-[#F97316] transition-colors">
                          {sub.name}
                        </Link>
                      </td>
                      <td className="p-3 text-gray-600">{sub.trade || "—"}</td>
                      <td className="p-3 hidden md:table-cell">
                        <div className="text-gray-600">{sub.contactName || "—"}</div>
                        {sub.phone && <div className="text-xs text-gray-400">{sub.phone}</div>}
                      </td>
                      <td className="p-3">
                        <Badge className={cn(cis.bg, cis.text, "border-0 text-[10px]")}>{cis.label}</Badge>
                      </td>
                      <td className="p-3 hidden lg:table-cell font-mono text-xs">
                        {formatDate(sub.insuranceExpiry)}
                      </td>
                      <td className="p-3 hidden lg:table-cell">
                        <StarRating rating={sub.rating} />
                      </td>
                      <td className="p-3 hidden md:table-cell">
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5">{sub._count.orders}</span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
