"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatMoney } from "@/lib/finance-utils"
import { ArrowLeft, ChevronLeft, ChevronRight, Download, FileText, Loader2 } from "lucide-react"

interface CISSummary {
  subcontractor: { id: string; name: string; cisUtr: string | null; cisTaxStatus: string }
  gross: number
  materials: number
  cisLiable: number
  rate: number
  deduction: number
  net: number
}

interface CISData {
  taxMonth: string
  summary: CISSummary[]
  totals: { gross: number; materials: number; cisLiable: number; deduction: number; net: number }
}

export default function CISPage() {
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [data, setData] = useState<CISData | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewingStatement, setViewingStatement] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/cis/monthly?year=${year}&month=${month}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [year, month])

  function prevMonth() {
    if (month === 1) { setMonth(12); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }

  function nextMonth() {
    if (month === 12) { setMonth(1); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  const monthName = new Date(year, month - 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" })
  // UK tax month: 6th current month to 5th next month
  const taxPeriodStart = `6 ${new Date(year, month - 1).toLocaleDateString("en-GB", { month: "long" })}`
  const nextMonthDate = new Date(year, month)
  const taxPeriodEnd = `5 ${nextMonthDate.toLocaleDateString("en-GB", { month: "long" })}`

  const exportUrl = `/api/cis/export?year=${year}&month=${month}`

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/finance">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1A1A2E]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A2E]">CIS Returns</h2>
            <p className="text-gray-500 text-sm">Construction Industry Scheme deductions</p>
          </div>
        </div>
        <a href={exportUrl} download>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </a>
      </div>

      {/* Month selector */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="text-center">
          <p className="font-semibold text-[#1A1A2E]">{monthName}</p>
          <p className="text-xs text-gray-400">Tax period: {taxPeriodStart} — {taxPeriodEnd}</p>
        </div>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-[#F97316]" />
        </div>
      ) : !data || data.summary.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📋</div>
            <p>No CIS deductions for this period.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Summary Table */}
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">Subcontractor</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-500">UTR</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Gross</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Materials</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">CIS-Liable</th>
                    <th className="text-center py-3 px-2 font-medium text-gray-500">Rate</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Deduction</th>
                    <th className="text-right py-3 px-2 font-medium text-gray-500">Net</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-500">Statement</th>
                  </tr>
                </thead>
                <tbody>
                  {data.summary.map(row => (
                    <tr key={row.subcontractor.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-3 px-4 font-medium text-[#1A1A2E]">{row.subcontractor.name}</td>
                      <td className="py-3 px-2 font-[family-name:var(--font-mono)] text-gray-500 text-xs">{row.subcontractor.cisUtr || "—"}</td>
                      <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)]">{formatMoney(row.gross)}</td>
                      <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)] text-gray-500">{formatMoney(row.materials)}</td>
                      <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)]">{formatMoney(row.cisLiable)}</td>
                      <td className="py-3 px-2 text-center font-[family-name:var(--font-mono)] font-medium">{row.rate}%</td>
                      <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)] text-red-600 font-medium">{formatMoney(row.deduction)}</td>
                      <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)] font-medium text-[#1A1A2E]">{formatMoney(row.net)}</td>
                      <td className="py-3 px-4 text-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewingStatement(viewingStatement === row.subcontractor.id ? null : row.subcontractor.id)}
                          className="text-[#F97316]"
                        >
                          <FileText className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-gray-50 font-bold">
                    <td className="py-3 px-4 text-[#1A1A2E]">Totals</td>
                    <td className="py-3 px-2" />
                    <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)]">{formatMoney(data.totals.gross)}</td>
                    <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)] text-gray-500">{formatMoney(data.totals.materials)}</td>
                    <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)]">{formatMoney(data.totals.cisLiable)}</td>
                    <td className="py-3 px-2" />
                    <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)] text-red-600">{formatMoney(data.totals.deduction)}</td>
                    <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)] text-[#1A1A2E]">{formatMoney(data.totals.net)}</td>
                    <td className="py-3 px-4" />
                  </tr>
                </tfoot>
              </table>
            </div>
          </Card>

          {/* Statement view */}
          {viewingStatement && (() => {
            const row = data.summary.find(r => r.subcontractor.id === viewingStatement)
            if (!row) return null
            return (
              <Card className="border-[#F97316]/30">
                <CardHeader>
                  <CardTitle className="text-base">CIS Statement — {row.subcontractor.name}</CardTitle>
                  <p className="text-xs text-gray-500">Tax period: {taxPeriodStart} — {taxPeriodEnd} | UTR: {row.subcontractor.cisUtr || "N/A"}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="grid grid-cols-2 gap-2 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-gray-500">Gross Payments</p>
                        <p className="font-[family-name:var(--font-mono)] font-bold text-lg">{formatMoney(row.gross)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Materials (CIS exempt)</p>
                        <p className="font-[family-name:var(--font-mono)] font-bold text-lg">{formatMoney(row.materials)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">CIS Deduction ({row.rate}%)</p>
                        <p className="font-[family-name:var(--font-mono)] font-bold text-lg text-red-600">{formatMoney(row.deduction)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Net Payment</p>
                        <p className="font-[family-name:var(--font-mono)] font-bold text-lg text-green-600">{formatMoney(row.net)}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })()}
        </>
      )}
    </div>
  )
}
