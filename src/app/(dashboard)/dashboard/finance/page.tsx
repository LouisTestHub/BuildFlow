"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatMoney, formatMoneyShort } from "@/lib/finance-utils"
import {
  PoundSterling, FileText, AlertTriangle, Receipt, TrendingUp,
  Plus, CreditCard, FileDown, Loader2
} from "lucide-react"

type SubTab = "overview" | "invoices" | "cis" | "valuations"

interface DashboardData {
  kpis: {
    cashPosition: number
    outstandingTotal: number
    overdueCount: number
    cisThisMonth: number
    revenueMTD: number
  }
  cashFlow: { month: string; income: number; costs: number }[]
  ageing: { current: number; thirty: number; sixty: number; ninety: number }
}

export default function FinancePage() {
  const [tab, setTab] = useState<SubTab>("overview")
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/finance/dashboard")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const subTabs: { key: SubTab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "invoices", label: "Invoices" },
    { key: "cis", label: "CIS" },
    { key: "valuations", label: "Valuations" },
  ]

  if (tab === "invoices") {
    return <MetaRedirect to="/dashboard/finance/invoices" />
  }
  if (tab === "cis") {
    return <MetaRedirect to="/dashboard/finance/cis" />
  }
  if (tab === "valuations") {
    return <MetaRedirect to="/dashboard/finance/valuations" />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Finance</h2>
          <p className="text-gray-500 text-sm">Financial overview, invoicing, CIS and valuations</p>
        </div>
      </div>

      {/* Sub navigation */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {subTabs.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              tab === t.key ? "bg-white text-[#1A1A2E] shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
        </div>
      ) : data ? (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <KPICard
              icon={<PoundSterling className="w-5 h-5" />}
              label="Cash Position"
              value={formatMoney(data.kpis.cashPosition)}
              color={data.kpis.cashPosition >= 0 ? "text-green-600" : "text-red-600"}
              iconBg="bg-green-100"
              iconColor="text-green-600"
            />
            <KPICard
              icon={<FileText className="w-5 h-5" />}
              label="Outstanding Invoices"
              value={formatMoney(data.kpis.outstandingTotal)}
              color="text-blue-600"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
            />
            <KPICard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Overdue"
              value={String(data.kpis.overdueCount)}
              color="text-red-600"
              iconBg="bg-red-100"
              iconColor="text-red-600"
              alert={data.kpis.overdueCount > 0}
            />
            <KPICard
              icon={<Receipt className="w-5 h-5" />}
              label="CIS Deductions (Month)"
              value={formatMoney(data.kpis.cisThisMonth)}
              color="text-amber-600"
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
            />
            <KPICard
              icon={<TrendingUp className="w-5 h-5" />}
              label="Revenue MTD"
              value={formatMoney(data.kpis.revenueMTD)}
              color="text-emerald-600"
              iconBg="bg-emerald-100"
              iconColor="text-emerald-600"
            />
          </div>

          {/* Cash Flow Chart + Ageing Report */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Cash Flow Chart */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Cash Flow — Last 6 Months</CardTitle>
              </CardHeader>
              <CardContent>
                <CashFlowChart data={data.cashFlow} />
              </CardContent>
            </Card>

            {/* Ageing Report */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Receivables Ageing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AgeingRow label="Current" amount={data.ageing.current} color="bg-green-500" total={data.kpis.outstandingTotal} />
                <AgeingRow label="30 days" amount={data.ageing.thirty} color="bg-yellow-500" total={data.kpis.outstandingTotal} />
                <AgeingRow label="60 days" amount={data.ageing.sixty} color="bg-orange-500" total={data.kpis.outstandingTotal} />
                <AgeingRow label="90+ days" amount={data.ageing.ninety} color="bg-red-500" total={data.kpis.outstandingTotal} />
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Link href="/dashboard/finance/invoices/new">
                <Button className="bg-[#F97316] hover:bg-[#EA580C] text-white gap-2">
                  <Plus className="w-4 h-4" /> New Invoice
                </Button>
              </Link>
              <Link href="/dashboard/finance/invoices?status=SENT">
                <Button variant="outline" className="gap-2">
                  <CreditCard className="w-4 h-4" /> Record Payment
                </Button>
              </Link>
              <Link href="/dashboard/finance/cis">
                <Button variant="outline" className="gap-2">
                  <FileDown className="w-4 h-4" /> CIS Return
                </Button>
              </Link>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">Failed to load financial data.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function MetaRedirect({ to }: { to: string }) {
  useEffect(() => { window.location.href = to }, [to])
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
    </div>
  )
}

function KPICard({ icon, label, value, color, iconBg, iconColor, alert }: {
  icon: React.ReactNode; label: string; value: string; color: string; iconBg: string; iconColor: string; alert?: boolean
}) {
  return (
    <Card className={cn(alert && "border-red-300 bg-red-50/50")}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", iconBg, iconColor)}>
            {icon}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-gray-500 truncate">{label}</p>
            <p className={cn("text-lg font-bold font-[family-name:var(--font-mono)]", color)}>{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CashFlowChart({ data }: { data: { month: string; income: number; costs: number }[] }) {
  const maxVal = Math.max(...data.flatMap(d => [d.income, d.costs]), 1)

  return (
    <div className="space-y-2">
      {/* Legend */}
      <div className="flex gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" /> Income</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-400 inline-block" /> Costs</span>
      </div>

      {/* Chart */}
      <div className="flex items-end gap-2 h-48">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex gap-0.5 items-end h-40">
              <div className="flex-1 flex flex-col justify-end">
                <div
                  className="w-full bg-emerald-500 rounded-t-sm transition-all"
                  style={{ height: `${(d.income / maxVal) * 100}%`, minHeight: d.income > 0 ? "4px" : "0" }}
                  title={formatMoney(d.income)}
                />
              </div>
              <div className="flex-1 flex flex-col justify-end">
                <div
                  className="w-full bg-red-400 rounded-t-sm transition-all"
                  style={{ height: `${(d.costs / maxVal) * 100}%`, minHeight: d.costs > 0 ? "4px" : "0" }}
                  title={formatMoney(d.costs)}
                />
              </div>
            </div>
            <span className="text-[10px] text-gray-400">{d.month}</span>
          </div>
        ))}
      </div>

      {/* Values below */}
      <div className="grid grid-cols-6 gap-2 text-center mt-2">
        {data.map((d, i) => (
          <div key={i} className="text-[10px]">
            <p className="text-emerald-600 font-[family-name:var(--font-mono)]">{formatMoneyShort(d.income)}</p>
            <p className="text-red-400 font-[family-name:var(--font-mono)]">{formatMoneyShort(d.costs)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function AgeingRow({ label, amount, color, total }: { label: string; amount: number; color: string; total: number }) {
  const pct = total > 0 ? (amount / total) * 100 : 0
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-[family-name:var(--font-mono)] font-medium text-[#1A1A2E]">{formatMoney(amount)}</span>
      </div>
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
