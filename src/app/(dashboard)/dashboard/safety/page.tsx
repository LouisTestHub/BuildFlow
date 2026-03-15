"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShieldCheck, AlertTriangle, ClipboardList, Users, FileWarning } from "lucide-react"

interface DashboardData {
  kpis: {
    activeRams: number
    daysSinceLastIncident: number
    incidentsThisYear: number
    riddorCount: number
    inductionsThisWeek: number
  }
  breakdown: { NEAR_MISS: number; MINOR: number; MAJOR: number; RIDDOR: number }
  recentIncidents: Array<{
    id: string; date: string; severity: string; description: string; status: string
    job: { reference: string; title: string }
    user: { name: string }
  }>
  expiringRams: Array<{
    id: string; title: string; updatedAt: string
    job: { reference: string; title: string }
  }>
}

const severityColour: Record<string, string> = {
  NEAR_MISS: "bg-blue-100 text-blue-800",
  MINOR: "bg-yellow-100 text-yellow-800",
  MAJOR: "bg-orange-100 text-orange-800",
  RIDDOR: "bg-red-100 text-red-800 border border-red-300",
}

const severityLabel: Record<string, string> = {
  NEAR_MISS: "Near Miss",
  MINOR: "Minor",
  MAJOR: "Major",
  RIDDOR: "RIDDOR",
}

const chartColours: Record<string, string> = {
  NEAR_MISS: "#3B82F6",
  MINOR: "#EAB308",
  MAJOR: "#F97316",
  RIDDOR: "#EF4444",
}

const subNav = [
  { href: "/dashboard/safety", label: "Overview" },
  { href: "/dashboard/safety/rams", label: "RAMS" },
  { href: "/dashboard/safety/incidents", label: "Incidents" },
  { href: "/dashboard/safety/inductions", label: "Inductions" },
]

export default function SafetyPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/safety/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const kpis = data?.kpis
  const breakdown = data?.breakdown || { NEAR_MISS: 0, MINOR: 0, MAJOR: 0, RIDDOR: 0 }
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Health & Safety</h2>
          <p className="text-gray-500 text-sm">Safety management dashboard</p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/safety/incidents/new">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <AlertTriangle className="w-4 h-4 mr-2" />Report Incident
            </Button>
          </Link>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
        {subNav.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              item.href === "/dashboard/safety"
                ? "border-[#F97316] text-[#F97316]"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
              {item.label}
            </div>
          </Link>
        ))}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A2E]">{kpis?.activeRams ?? 0}</p>
                <p className="text-xs text-gray-500">Active RAMS</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A2E]">{kpis?.daysSinceLastIncident ?? 0}</p>
                <p className="text-xs text-gray-500">Days Since Incident</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A2E]">{kpis?.incidentsThisYear ?? 0}</p>
                <p className="text-xs text-gray-500">Incidents This Year</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <FileWarning className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A2E]">{kpis?.riddorCount ?? 0}</p>
                <p className="text-xs text-gray-500">RIDDOR Reports</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#1A1A2E]">{kpis?.inductionsThisWeek ?? 0}</p>
                <p className="text-xs text-gray-500">Inductions This Week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Incident Breakdown Chart */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-4">Incident Breakdown</h3>
            {total === 0 ? (
              <p className="text-gray-400 text-center py-8">No incidents recorded this year</p>
            ) : (
              <div className="space-y-4">
                {/* Bar chart */}
                <div className="space-y-3">
                  {(Object.keys(breakdown) as Array<keyof typeof breakdown>).map((key) => {
                    const count = breakdown[key]
                    const pct = total > 0 ? (count / total) * 100 : 0
                    return (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">{severityLabel[key]}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(pct, 2)}%`, backgroundColor: chartColours[key] }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="flex flex-wrap gap-3 pt-2">
                  {(Object.keys(breakdown) as Array<keyof typeof breakdown>).map((key) => (
                    <div key={key} className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: chartColours[key] }} />
                      {severityLabel[key]}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiring RAMS */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#1A1A2E]">RAMS Needing Review</h3>
              <Link href="/dashboard/safety/rams">
                <Button variant="ghost" size="sm" className="text-[#F97316]">View All</Button>
              </Link>
            </div>
            {!data?.expiringRams?.length ? (
              <p className="text-gray-400 text-center py-8">All RAMS are up to date</p>
            ) : (
              <div className="space-y-3">
                {data.expiringRams.map((r) => (
                  <Link key={r.id} href={`/dashboard/safety/rams/${r.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 transition-colors">
                      <div>
                        <p className="font-medium text-sm text-[#1A1A2E]">{r.title}</p>
                        <p className="text-xs text-gray-500">{r.job.reference} — {r.job.title}</p>
                      </div>
                      <div className="text-xs text-amber-600">
                        Updated {new Date(r.updatedAt).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Incidents */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Recent Incidents</h3>
            <Link href="/dashboard/safety/incidents">
              <Button variant="ghost" size="sm" className="text-[#F97316]">View All</Button>
            </Link>
          </div>
          {!data?.recentIncidents?.length ? (
            <p className="text-gray-400 text-center py-8">No incidents recorded</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-gray-500">
                    <th className="pb-2 font-medium">Date</th>
                    <th className="pb-2 font-medium">Job</th>
                    <th className="pb-2 font-medium">Severity</th>
                    <th className="pb-2 font-medium hidden md:table-cell">Description</th>
                    <th className="pb-2 font-medium hidden sm:table-cell">Reported By</th>
                    <th className="pb-2 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentIncidents.map((inc) => (
                    <tr key={inc.id} className={`border-b hover:bg-gray-50 ${inc.severity === "RIDDOR" ? "border-l-4 border-l-red-500" : ""}`}>
                      <td className="py-3">{new Date(inc.date).toLocaleDateString("en-GB")}</td>
                      <td className="py-3">{inc.job.reference}</td>
                      <td className="py-3">
                        <Badge className={severityColour[inc.severity]}>{severityLabel[inc.severity]}</Badge>
                      </td>
                      <td className="py-3 hidden md:table-cell max-w-xs truncate">{inc.description}</td>
                      <td className="py-3 hidden sm:table-cell">{inc.user.name}</td>
                      <td className="py-3">
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
