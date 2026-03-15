"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  PoundSterling, TrendingUp, TrendingDown, FileText, AlertTriangle,
  Briefcase, Bug, ShieldAlert, Clock, ArrowUpRight, ArrowDownRight,
  CheckCircle, XCircle, FileWarning, UserCheck, Upload, Activity
} from "lucide-react"

interface DashboardData {
  financial: {
    cashPosition: number
    revenueMTD: number
    outstandingTotal: number
    overdueCount: number
    avgMargin: number
  }
  operational: {
    activeJobs: number
    openSnags: number
    certExpiries: number
    pendingTimesheets: number
  }
  charts: {
    jobProfitability: Array<{ id: string; title: string; reference: string; margin: number; contractValue: number; costs: number }>
    cashFlow: Array<{ month: string; income: number; costs: number }>
  }
  actionItems: {
    overdueInvoices: Array<{ number: string; client: string; amount: number; daysOverdue: number }>
    expiringCerts: Array<{ name: string; type: string; expiryDate: string }>
    pendingTimesheets: Array<{ id: string; name: string; weekStart: string }>
  }
  recentActivity: Array<{ id: string; action: string; entity: string; entityId: string | null; details: unknown; userName: string; createdAt: string }>
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value)
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
}

function getActivityIcon(entity: string) {
  switch (entity.toLowerCase()) {
    case "invoice": return <FileText className="w-4 h-4 text-blue-500" />
    case "job": return <Briefcase className="w-4 h-4 text-orange-500" />
    case "incident": return <AlertTriangle className="w-4 h-4 text-red-500" />
    case "timesheet": return <Clock className="w-4 h-4 text-purple-500" />
    case "snagitem": return <Bug className="w-4 h-4 text-amber-500" />
    case "document": return <Upload className="w-4 h-4 text-green-500" />
    case "user": return <UserCheck className="w-4 h-4 text-indigo-500" />
    default: return <Activity className="w-4 h-4 text-gray-500" />
  }
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard")
      if (res.ok) setData(await res.json())
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  if (loading) {
    return (
      <div className="space-y-6">
        <div><h2 className="text-2xl font-bold text-[#1A1A2E]">Dashboard</h2></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i}><CardContent className="p-6"><div className="h-20 bg-gray-100 rounded animate-pulse" /></CardContent></Card>
          ))}
        </div>
      </div>
    )
  }

  if (!data) return <div className="text-center py-12 text-gray-500">Failed to load dashboard data</div>

  const cashPositive = data.financial.cashPosition >= 0

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A2E]">Dashboard</h2>
        <p className="text-gray-500 text-sm">Welcome back. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Row 1 — Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cash Position</p>
                <p className={`text-2xl font-bold mt-1 ${cashPositive ? "text-[#10B981]" : "text-red-500"}`}>
                  {formatCurrency(data.financial.cashPosition)}
                </p>
                <p className="text-xs text-gray-400 mt-1">Receivables − payables (30d)</p>
              </div>
              <div className={`w-12 h-12 rounded-xl ${cashPositive ? "bg-[#10B981]/10" : "bg-red-500/10"} flex items-center justify-center`}>
                {cashPositive ? <TrendingUp className="w-6 h-6 text-[#10B981]" /> : <TrendingDown className="w-6 h-6 text-red-500" />}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Revenue MTD</p>
                <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{formatCurrency(data.financial.revenueMTD)}</p>
                <p className="text-xs text-gray-400 mt-1">Invoices paid this month</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center">
                <PoundSterling className="w-6 h-6 text-[#10B981]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Outstanding Invoices</p>
                <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{formatCurrency(data.financial.outstandingTotal)}</p>
                {data.financial.overdueCount > 0 && (
                  <p className="text-xs text-red-500 mt-1">{data.financial.overdueCount} overdue</p>
                )}
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#F97316]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Job Margin</p>
                <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{data.financial.avgMargin}%</p>
                <p className="text-xs mt-1 flex items-center gap-1">
                  {data.financial.avgMargin >= 15 ? (
                    <><ArrowUpRight className="w-3 h-3 text-[#10B981]" /><span className="text-[#10B981]">Healthy</span></>
                  ) : (
                    <><ArrowDownRight className="w-3 h-3 text-[#F97316]" /><span className="text-[#F97316]">Below target</span></>
                  )}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#3B82F6]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2 — Operational KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Jobs</p>
                <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{data.operational.activeJobs}</p>
                <p className="text-xs text-gray-400 mt-1">LIVE status</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-[#F97316]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Snags</p>
                <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{data.operational.openSnags}</p>
                <p className="text-xs text-gray-400 mt-1">Pending resolution</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Bug className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cert Expiries</p>
                <p className={`text-2xl font-bold mt-1 ${data.operational.certExpiries > 0 ? "text-red-500" : "text-[#10B981]"}`}>
                  {data.operational.certExpiries}
                </p>
                <p className="text-xs text-gray-400 mt-1">Within 30 days</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Timesheets Pending</p>
                <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{data.operational.pendingTimesheets}</p>
                <p className="text-xs text-gray-400 mt-1">Awaiting approval</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3 — Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Job Profitability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#F97316]" />
              Job Profitability
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.charts.jobProfitability.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No live jobs</p>
            ) : (
              <div className="space-y-3">
                {data.charts.jobProfitability.map((job) => {
                  const barColor = job.margin >= 15 ? "#10B981" : job.margin >= 10 ? "#F97316" : "#EF4444"
                  const barWidth = Math.max(5, Math.min(100, job.margin))
                  return (
                    <div key={job.id} className="flex items-center gap-3">
                      <div className="w-32 text-xs text-gray-600 truncate flex-shrink-0" title={job.title}>{job.title}</div>
                      <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${barWidth}%`, backgroundColor: barColor }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-gray-700">
                          {job.margin}%
                        </span>
                      </div>
                    </div>
                  )
                })}
                <div className="flex gap-4 text-xs text-gray-500 mt-2 pt-2 border-t">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#10B981]" /> &gt;15%</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#F97316]" /> 10-15%</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#EF4444]" /> &lt;10%</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cash Flow */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PoundSterling className="w-5 h-5 text-[#3B82F6]" />
              Cash Flow (3 Months)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.charts.cashFlow.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No data</p>
            ) : (
              <div>
                <div className="flex items-end gap-4 justify-center h-48">
                  {(() => {
                    const maxVal = Math.max(...data.charts.cashFlow.flatMap((m) => [m.income, m.costs]), 1)
                    return data.charts.cashFlow.map((m) => (
                      <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                        <div className="flex items-end gap-1 h-40 w-full justify-center">
                          <div className="flex flex-col items-center gap-0.5 w-8">
                            <span className="text-[10px] text-gray-500">{formatCurrency(m.income)}</span>
                            <div
                              className="w-full bg-[#10B981] rounded-t"
                              style={{ height: `${Math.max(4, (m.income / maxVal) * 140)}px` }}
                            />
                          </div>
                          <div className="flex flex-col items-center gap-0.5 w-8">
                            <span className="text-[10px] text-gray-500">{formatCurrency(m.costs)}</span>
                            <div
                              className="w-full bg-[#EF4444] rounded-t"
                              style={{ height: `${Math.max(4, (m.costs / maxVal) * 140)}px` }}
                            />
                          </div>
                        </div>
                        <span className="text-xs text-gray-600 font-medium">{m.month}</span>
                      </div>
                    ))
                  })()}
                </div>
                <div className="flex gap-4 text-xs text-gray-500 mt-3 pt-2 border-t justify-center">
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#10B981]" /> Income</span>
                  <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-[#EF4444]" /> Costs</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 4 — Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overdue Invoices */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileWarning className="w-4 h-4 text-red-500" />
              Overdue Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.actionItems.overdueInvoices.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No overdue invoices 🎉</p>
            ) : (
              <div className="space-y-2">
                {data.actionItems.overdueInvoices.map((inv) => (
                  <Link key={inv.number} href="/dashboard/finance/invoices" className="block">
                    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-medium text-[#1A1A2E]">{inv.number}</p>
                        <p className="text-xs text-gray-500">{inv.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#1A1A2E]">{formatCurrency(inv.amount)}</p>
                        <p className="text-xs text-red-500">{inv.daysOverdue}d overdue</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expiring Certs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              Expiring Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.actionItems.expiringCerts.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">All certs up to date ✓</p>
            ) : (
              <div className="space-y-2">
                {data.actionItems.expiringCerts.map((cert, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A2E]">{cert.name}</p>
                      <p className="text-xs text-gray-500">{cert.type}</p>
                    </div>
                    <Badge variant="warning">{cert.expiryDate ? formatDate(cert.expiryDate) : "N/A"}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Timesheets */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4 text-purple-500" />
              Pending Timesheets
            </CardTitle>
          </CardHeader>
          <CardContent>
            {data.actionItems.pendingTimesheets.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">All timesheets approved ✓</p>
            ) : (
              <div className="space-y-2">
                {data.actionItems.pendingTimesheets.map((ts) => (
                  <div key={ts.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="text-sm font-medium text-[#1A1A2E]">{ts.name}</p>
                      <p className="text-xs text-gray-500">w/c {formatDate(ts.weekStart)}</p>
                    </div>
                    <Link href="/dashboard/team/timesheets">
                      <Badge variant="default" className="cursor-pointer hover:opacity-80">Approve</Badge>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 5 — Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-gray-500" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {data.recentActivity.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-0">
              {data.recentActivity.map((event, idx) => (
                <div key={event.id} className={`flex items-start gap-3 py-3 ${idx < data.recentActivity.length - 1 ? "border-b border-gray-100" : ""}`}>
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getActivityIcon(event.entity)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#1A1A2E]">
                      <span className="font-medium">{event.userName}</span>{" "}
                      {event.action.toLowerCase()} {event.entity.toLowerCase()}
                      {event.entityId && <span className="text-gray-400"> #{event.entityId.slice(0, 6)}</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(event.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                  {event.entity.toLowerCase() === "invoice" && (
                    <Link href="/dashboard/finance/invoices" className="text-xs text-[#F97316] hover:underline flex-shrink-0">View</Link>
                  )}
                  {event.entity.toLowerCase() === "job" && (
                    <Link href="/dashboard/jobs" className="text-xs text-[#F97316] hover:underline flex-shrink-0">View</Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
