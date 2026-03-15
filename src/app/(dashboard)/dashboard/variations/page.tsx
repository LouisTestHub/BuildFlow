"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus, TrendingUp, TrendingDown, Clock, CheckCircle, AlertCircle, Search
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Variation {
  id: string
  reference: string
  title: string
  description: string
  jobRef: string
  costImpact: number
  timeImpact: number | null
  status: "draft" | "submitted" | "client_review" | "approved" | "rejected" | "implemented"
  submittedDate: string | null
  approvedDate: string | null
  linkedEstimate: string | null
}

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-700",
  submitted: "bg-blue-100 text-blue-700",
  client_review: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  implemented: "bg-emerald-100 text-emerald-700",
}

export default function VariationsPage() {
  const [variations] = useState<Variation[]>([
    {
      id: "1",
      reference: "VAR-001",
      title: "Additional power sockets in kitchen",
      description: "Client request for 4x additional double sockets in kitchen area. Requires additional first-fix wiring.",
      jobRef: "JOB-2024-003",
      costImpact: 850,
      timeImpact: 1,
      status: "approved",
      submittedDate: "2024-03-05",
      approvedDate: "2024-03-08",
      linkedEstimate: "EST-VAR-001",
    },
    {
      id: "2",
      reference: "VAR-002",
      title: "Upgrade bathroom tiles",
      description: "Change from standard ceramic to large-format porcelain tiles. Upgrade covers 15m² bathroom.",
      jobRef: "JOB-2024-003",
      costImpact: 1250,
      timeImpact: 2,
      status: "client_review",
      submittedDate: "2024-03-10",
      approvedDate: null,
      linkedEstimate: "EST-VAR-002",
    },
    {
      id: "3",
      reference: "VAR-003",
      title: "Add bifold doors to rear",
      description: "Replace single patio door with 3m bifold door system. Structural opening modification required.",
      jobRef: "JOB-2024-005",
      costImpact: 4800,
      timeImpact: 5,
      status: "approved",
      submittedDate: "2024-02-28",
      approvedDate: "2024-03-02",
      linkedEstimate: "EST-VAR-003",
    },
    {
      id: "4",
      reference: "VAR-004",
      title: "Underfloor heating - ground floor",
      description: "Client request to add UFH to entire ground floor (48m²). Requires wet system and manifold.",
      jobRef: "JOB-2024-003",
      costImpact: 3200,
      timeImpact: 3,
      status: "rejected",
      submittedDate: "2024-03-01",
      approvedDate: null,
      linkedEstimate: null,
    },
  ])

  const stats = {
    total: variations.length,
    pending: variations.filter(v => v.status === "submitted" || v.status === "client_review").length,
    approved: variations.filter(v => v.status === "approved").length,
    totalCostImpact: variations.filter(v => v.status === "approved" || v.status === "implemented").reduce((sum, v) => sum + v.costImpact, 0),
    totalTimeImpact: variations.filter(v => v.status === "approved" || v.status === "implemented").reduce((sum, v) => sum + (v.timeImpact || 0), 0),
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Variation Orders</h2>
          <p className="text-sm text-gray-500">Track contract variations & change requests</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Variation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Variations</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Approved</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Cost Impact</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1 font-mono">{formatCurrency(stats.totalCostImpact)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Time Impact</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{stats.totalTimeImpact} days</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input placeholder="Search variations..." className="pl-10" />
            </div>
            <select className="flex h-10 w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="">All Statuses</option>
              <option>Draft</option>
              <option>Submitted</option>
              <option>Client Review</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Variations List */}
      <div className="space-y-3">
        {variations.map(variation => (
          <Card key={variation.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-[#1A1A2E]">{variation.reference}</span>
                    <Badge className={cn(STATUS_COLORS[variation.status], "border-0 text-xs")}>
                      {variation.status.replace("_", " ")}
                    </Badge>
                    <span className="text-xs text-gray-500">→ {variation.jobRef}</span>
                  </div>
                  <h3 className="font-semibold text-[#1A1A2E] mb-2">{variation.title}</h3>
                  <p className="text-sm text-gray-600">{variation.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cost Impact</p>
                  <div className="flex items-center gap-1">
                    {variation.costImpact > 0 ? (
                      <TrendingUp className="w-4 h-4 text-red-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-green-500" />
                    )}
                    <span className={cn(
                      "font-bold font-mono",
                      variation.costImpact > 0 ? "text-red-600" : "text-green-600"
                    )}>
                      {variation.costImpact > 0 ? "+" : ""}{formatCurrency(variation.costImpact)}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Time Impact</p>
                  <div className="flex items-center gap-1">
                    {variation.timeImpact && variation.timeImpact > 0 ? (
                      <>
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-amber-600">+{variation.timeImpact} days</span>
                      </>
                    ) : (
                      <span className="font-medium text-gray-600">None</span>
                    )}
                  </div>
                </div>

                {variation.submittedDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Submitted</p>
                    <p className="font-medium text-[#1A1A2E] text-sm">
                      {new Date(variation.submittedDate).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                )}

                {variation.approvedDate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Approved</p>
                    <p className="font-medium text-green-600 text-sm flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      {new Date(variation.approvedDate).toLocaleDateString("en-GB")}
                    </p>
                  </div>
                )}

                {variation.linkedEstimate && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Linked Estimate</p>
                    <p className="font-medium text-blue-600 text-sm">{variation.linkedEstimate}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-2 mt-4">
                {variation.status === "draft" && (
                  <Button size="sm">Submit for Approval</Button>
                )}
                {variation.status === "client_review" && (
                  <>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">Approve</Button>
                    <Button size="sm" variant="outline" className="text-red-600 border-red-600">Reject</Button>
                  </>
                )}
                {variation.status === "approved" && (
                  <Button size="sm">Mark as Implemented</Button>
                )}
                <Button size="sm" variant="ghost">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
