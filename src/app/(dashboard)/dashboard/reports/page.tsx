"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  BarChart3, TrendingUp, Users, FileText, Clock, AlertTriangle,
  ShieldCheck, CheckSquare, ClipboardList, PieChart, X, Download,
  ArrowLeft, ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"

type ReportType = "profitability" | "subcontractor-spend" | "outstanding" | "compliance" | null

interface ReportCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  color: string
  bg: string
  implemented: boolean
}

const reportCards: ReportCard[] = [
  { id: "profitability", title: "Job Profitability Summary", description: "All jobs with margin %, sortable by profitability", icon: TrendingUp, color: "text-[#10B981]", bg: "bg-[#10B981]/10", implemented: true },
  { id: "subcontractor-spend", title: "Subcontractor Spend", description: "Total spend per subcontractor across all jobs", icon: Users, color: "text-[#3B82F6]", bg: "bg-[#3B82F6]/10", implemented: true },
  { id: "outstanding", title: "Outstanding Debts", description: "All unpaid invoices with ageing analysis", icon: FileText, color: "text-red-500", bg: "bg-red-500/10", implemented: true },
  { id: "compliance", title: "Compliance Overview", description: "All team & subbie certifications with status", icon: ShieldCheck, color: "text-[#F97316]", bg: "bg-[#F97316]/10", implemented: true },
  { id: "job-cost", title: "Job Cost Report", description: "Budget vs actual costs by phase for each job", icon: BarChart3, color: "text-purple-500", bg: "bg-purple-500/10", implemented: false },
  { id: "cis", title: "CIS Return", description: "Monthly CIS deduction data for HMRC submissions", icon: PieChart, color: "text-indigo-500", bg: "bg-indigo-500/10", implemented: false },
  { id: "time", title: "Time Analysis", description: "Hours by job and by person for any date range", icon: Clock, color: "text-cyan-500", bg: "bg-cyan-500/10", implemented: false },
  { id: "safety", title: "H&S Summary", description: "Incident counts, RAMS status, safety overview", icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", implemented: false },
  { id: "snagging", title: "Snagging Summary", description: "Open/resolved snag items by job", icon: CheckSquare, color: "text-teal-500", bg: "bg-teal-500/10", implemented: false },
  { id: "monthly", title: "Monthly Management Report", description: "Combined KPIs summary for board reporting", icon: ClipboardList, color: "text-gray-600", bg: "bg-gray-600/10", implemented: false },
]

function formatCurrency(v: number) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 }).format(v)
}

function exportCSV(headers: string[], rows: string[][], filename: string) {
  const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join("\n")
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function ReportsPage() {
  const [activeReport, setActiveReport] = useState<ReportType>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [sortField, setSortField] = useState<string>("")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc")

  const fetchReport = useCallback(async (type: ReportType) => {
    if (!type) return
    setLoading(true)
    try {
      const res = await fetch(`/api/reports/${type}`)
      if (res.ok) setReportData(await res.json())
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeReport) fetchReport(activeReport)
  }, [activeReport, fetchReport])

  const openReport = (id: string) => {
    const card = reportCards.find((c) => c.id === id)
    if (card?.implemented) {
      setActiveReport(id as ReportType)
      setSortField("")
    }
  }

  // Sort helper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sortData = (data: any[], field: string) => {
    return [...data].sort((a, b) => {
      const va = a[field]
      const vb = b[field]
      if (typeof va === "number" && typeof vb === "number") return sortDir === "asc" ? va - vb : vb - va
      return sortDir === "asc" ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va))
    })
  }

  const toggleSort = (field: string) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("desc") }
  }

  const SortHeader = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <th
      className="text-left py-3 px-4 font-medium text-gray-500 cursor-pointer hover:text-gray-700 select-none"
      onClick={() => toggleSort(field)}
    >
      {children} {sortField === field && (sortDir === "asc" ? "↑" : "↓")}
    </th>
  )

  if (activeReport && !loading && reportData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => { setActiveReport(null); setReportData(null) }}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A2E]">{reportCards.find((c) => c.id === activeReport)?.title}</h2>
            <p className="text-gray-500 text-sm">{reportCards.find((c) => c.id === activeReport)?.description}</p>
          </div>
        </div>

        {/* Profitability Report */}
        {activeReport === "profitability" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Job Profitability</CardTitle>
              <Button variant="outline" size="sm" onClick={() => {
                const rows = (reportData as Array<{ reference: string; title: string; status: string; contractValue: number; totalCosts: number; profit: number; margin: number }>).map((j) => [j.reference, j.title, j.status, String(j.contractValue), String(j.totalCosts), String(j.profit), String(j.margin)])
                exportCSV(["Reference", "Title", "Status", "Contract Value", "Total Costs", "Profit", "Margin %"], rows, "profitability-report.csv")
              }}>
                <Download className="w-4 h-4 mr-1" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <SortHeader field="reference">Ref</SortHeader>
                      <SortHeader field="title">Job</SortHeader>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      <SortHeader field="contractValue">Contract</SortHeader>
                      <SortHeader field="totalCosts">Costs</SortHeader>
                      <SortHeader field="profit">Profit</SortHeader>
                      <SortHeader field="margin">Margin %</SortHeader>
                    </tr>
                  </thead>
                  <tbody>
                    {sortData(reportData, sortField || "margin").map((job: { id: string; reference: string; title: string; status: string; contractValue: number; totalCosts: number; profit: number; margin: number }) => (
                      <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-mono text-xs">{job.reference}</td>
                        <td className="py-3 px-4 font-medium">{job.title}</td>
                        <td className="py-3 px-4"><Badge variant={job.status === "LIVE" ? "success" : "secondary"}>{job.status}</Badge></td>
                        <td className="py-3 px-4">{formatCurrency(job.contractValue)}</td>
                        <td className="py-3 px-4">{formatCurrency(job.totalCosts)}</td>
                        <td className="py-3 px-4">
                          <span className={job.profit >= 0 ? "text-[#10B981]" : "text-red-500"}>{formatCurrency(job.profit)}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-semibold ${job.margin >= 15 ? "text-[#10B981]" : job.margin >= 10 ? "text-[#F97316]" : "text-red-500"}`}>
                            {job.margin}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Subcontractor Spend */}
        {activeReport === "subcontractor-spend" && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Subcontractor Spend</CardTitle>
              <Button variant="outline" size="sm" onClick={() => {
                const rows = (reportData as Array<{ name: string; trade: string; totalSpend: number; orderCount: number }>).map((s) => [s.name, s.trade || "", String(s.totalSpend), String(s.orderCount)])
                exportCSV(["Name", "Trade", "Total Spend", "Orders"], rows, "subcontractor-spend.csv")
              }}>
                <Download className="w-4 h-4 mr-1" /> Export CSV
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <SortHeader field="name">Subcontractor</SortHeader>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Trade</th>
                      <SortHeader field="totalSpend">Total Spend</SortHeader>
                      <SortHeader field="orderCount">Orders</SortHeader>
                      <th className="text-left py-3 px-4 font-medium text-gray-500">Job Breakdown</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortData(reportData, sortField || "totalSpend").map((sub: { id: string; name: string; trade: string; totalSpend: number; orderCount: number; jobBreakdown: Array<{ jobRef: string; jobTitle: string; total: number }> }) => (
                      <tr key={sub.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{sub.name}</td>
                        <td className="py-3 px-4 text-gray-500">{sub.trade || "—"}</td>
                        <td className="py-3 px-4 font-semibold">{formatCurrency(sub.totalSpend)}</td>
                        <td className="py-3 px-4">{sub.orderCount}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {sub.jobBreakdown.slice(0, 3).map((jb) => (
                              <Badge key={jb.jobRef} variant="secondary" className="text-xs">{jb.jobRef}: {formatCurrency(jb.total)}</Badge>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Outstanding Debts */}
        {activeReport === "outstanding" && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "Current", value: reportData.summary.current },
                { label: "1-30 days", value: reportData.summary["1-30"] },
                { label: "31-60 days", value: reportData.summary["31-60"] },
                { label: "61-90 days", value: reportData.summary["61-90"] },
                { label: "90+ days", value: reportData.summary["90+"] },
                { label: "Total", value: reportData.summary.total },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className={`text-lg font-bold mt-1 ${s.label === "90+ days" && s.value > 0 ? "text-red-500" : "text-[#1A1A2E]"}`}>
                      {formatCurrency(s.value)}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Invoice Detail</CardTitle>
                <Button variant="outline" size="sm" onClick={() => {
                  const rows = reportData.invoices.map((i: { number: string; client: string; total: number; daysOutstanding: number; ageingBand: string; status: string }) => [i.number, i.client, String(i.total), String(i.daysOutstanding), i.ageingBand, i.status])
                  exportCSV(["Invoice", "Client", "Total", "Days Outstanding", "Ageing Band", "Status"], rows, "outstanding-debts.csv")
                }}>
                  <Download className="w-4 h-4 mr-1" /> Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Client</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Job</th>
                        <SortHeader field="total">Total</SortHeader>
                        <SortHeader field="daysOutstanding">Days</SortHeader>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Ageing</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortData(reportData.invoices, sortField || "daysOutstanding").map((inv: { id: string; number: string; client: string; jobTitle: string; total: number; daysOutstanding: number; ageingBand: string; status: string }) => (
                        <tr key={inv.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-xs">{inv.number}</td>
                          <td className="py-3 px-4">{inv.client}</td>
                          <td className="py-3 px-4 text-gray-500">{inv.jobTitle}</td>
                          <td className="py-3 px-4 font-semibold">{formatCurrency(inv.total)}</td>
                          <td className="py-3 px-4">
                            <span className={inv.daysOutstanding > 30 ? "text-red-500 font-semibold" : ""}>{inv.daysOutstanding}</span>
                          </td>
                          <td className="py-3 px-4"><Badge variant={inv.ageingBand.includes("90") ? "destructive" : inv.ageingBand.includes("60") ? "warning" : "secondary"}>{inv.ageingBand}</Badge></td>
                          <td className="py-3 px-4"><Badge variant={inv.status === "OVERDUE" ? "destructive" : "warning"}>{inv.status}</Badge></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* Compliance Overview */}
        {activeReport === "compliance" && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Total", value: reportData.summary.total, color: "text-[#1A1A2E]" },
                { label: "Valid", value: reportData.summary.valid, color: "text-[#10B981]" },
                { label: "Expiring", value: reportData.summary.expiring, color: "text-[#F97316]" },
                { label: "Expired", value: reportData.summary.expired, color: "text-red-500" },
                { label: "Unknown", value: reportData.summary.unknown, color: "text-gray-400" },
              ].map((s) => (
                <Card key={s.label}>
                  <CardContent className="p-4 text-center">
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Certifications</CardTitle>
                <Button variant="outline" size="sm" onClick={() => {
                  const rows = reportData.certs.map((c: { personName: string; certType: string; reference: string; expiryDate: string; status: string; type: string }) => [c.personName, c.type, c.certType, c.reference || "", c.expiryDate || "", c.status])
                  exportCSV(["Name", "Type", "Cert", "Reference", "Expiry", "Status"], rows, "compliance-overview.csv")
                }}>
                  <Download className="w-4 h-4 mr-1" /> Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Type</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Certification</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Reference</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Expiry</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.certs.map((cert: { personName: string; type: string; certType: string; reference: string; expiryDate: string; status: string; role: string }, i: number) => (
                        <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium">{cert.personName}</td>
                          <td className="py-3 px-4">
                            <Badge variant={cert.type === "team" ? "default" : "secondary"}>
                              {cert.type === "team" ? "Team" : "Subbie"}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">{cert.certType}</td>
                          <td className="py-3 px-4 font-mono text-xs">{cert.reference || "—"}</td>
                          <td className="py-3 px-4">{cert.expiryDate ? new Date(cert.expiryDate).toLocaleDateString("en-GB") : "—"}</td>
                          <td className="py-3 px-4">
                            <Badge variant={cert.status === "valid" ? "success" : cert.status === "expiring" ? "warning" : cert.status === "expired" ? "destructive" : "secondary"}>
                              {cert.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A2E]">Reports</h2>
        <p className="text-gray-500 text-sm">Generate and export business reports</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportCards.map((report) => (
            <Card key={report.id} className={`${report.implemented ? "cursor-pointer hover:shadow-md transition-shadow" : "opacity-60"}`} onClick={() => report.implemented && report.id && openReport(report.id as string)}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${report.bg} flex items-center justify-center flex-shrink-0`}>
                    <report.icon className={`w-6 h-6 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[#1A1A2E]">{report.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                    <div className="mt-3">
                      {report.implemented ? (
                        <span className="text-sm text-[#F97316] font-medium flex items-center gap-1">
                          View Report <ChevronRight className="w-4 h-4" />
                        </span>
                      ) : (
                        <Badge variant="secondary">Coming Soon</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
