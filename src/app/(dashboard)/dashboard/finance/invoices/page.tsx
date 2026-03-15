"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatMoney, INVOICE_STATUS_STYLES, INVOICE_TYPE_STYLES } from "@/lib/finance-utils"
import { formatDate } from "@/lib/job-status"
import {
  Plus, Search, ChevronLeft, ChevronRight, ArrowLeft, Loader2
} from "lucide-react"

type TabKey = "ALL" | "SALES" | "PURCHASE" | "OVERDUE"

interface Invoice {
  id: string
  number: string
  type: string
  amount: string
  vat: string
  total: string
  status: string
  dueDate: string | null
  createdAt: string
  job: { reference: string; clientName: string | null } | null
  subcontractor: { name: string } | null
}

export default function InvoicesPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-48"><Loader2 className="w-6 h-6 animate-spin text-[#F97316]" /></div>}>
      <InvoicesPageInner />
    </Suspense>
  )
}

function InvoicesPageInner() {
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get("status") || ""
  const initialType = searchParams.get("type") || ""

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState<TabKey>(
    initialType === "SALES" ? "SALES" :
    initialType === "PURCHASE" ? "PURCHASE" :
    initialStatus === "OVERDUE" ? "OVERDUE" : "ALL"
  )
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState(initialStatus)
  const [filterJob, setFilterJob] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set("page", String(page))
    if (tab === "SALES") params.set("type", "SALES")
    if (tab === "PURCHASE") params.set("type", "PURCHASE")
    if (tab === "OVERDUE") params.set("status", "OVERDUE")
    if (filterStatus && tab !== "OVERDUE") params.set("status", filterStatus)
    if (filterJob) params.set("jobId", filterJob)
    if (search) params.set("search", search)

    const res = await fetch(`/api/invoices?${params}`)
    if (res.ok) {
      const data = await res.json()
      setInvoices(data.invoices)
      setTotalPages(data.pages)
    }
    setLoading(false)
  }, [page, tab, filterStatus, filterJob, search])

  useEffect(() => { fetchInvoices() }, [fetchInvoices])

  const tabs: { key: TabKey; label: string }[] = [
    { key: "ALL", label: "All" },
    { key: "SALES", label: "Sales" },
    { key: "PURCHASE", label: "Purchase" },
    { key: "OVERDUE", label: "Overdue" },
  ]

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
            <h2 className="text-2xl font-bold text-[#1A1A2E]">Invoices</h2>
            <p className="text-gray-500 text-sm">Sales & purchase invoices</p>
          </div>
        </div>
        <Link href="/dashboard/finance/invoices/new">
          <Button className="bg-[#F97316] hover:bg-[#EA580C] text-white gap-2">
            <Plus className="w-4 h-4" /> New Invoice
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setPage(1); setFilterStatus("") }}
            className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              tab === t.key ? "bg-white text-[#1A1A2E] shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by number, client..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="pl-10"
          />
        </div>
        {tab === "ALL" && (
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setPage(1) }}
            className="h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SENT">Sent</option>
            <option value="PAID">Paid</option>
            <option value="OVERDUE">Overdue</option>
            <option value="VOID">Void</option>
          </select>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-[#F97316]" />
        </div>
      ) : invoices.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            <div className="text-4xl mb-3">📄</div>
            <p>No invoices found.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Number</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Client/Subbie</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">Job</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Amount</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">VAT</th>
                  <th className="text-right py-3 px-2 font-medium text-gray-500">Total</th>
                  <th className="text-center py-3 px-2 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Due Date</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => {
                  const isOverdue = inv.status === "OVERDUE"
                  const statusStyle = INVOICE_STATUS_STYLES[inv.status as keyof typeof INVOICE_STATUS_STYLES] || INVOICE_STATUS_STYLES.DRAFT
                  const typeStyle = INVOICE_TYPE_STYLES[inv.type as keyof typeof INVOICE_TYPE_STYLES] || INVOICE_TYPE_STYLES.SALES

                  return (
                    <tr
                      key={inv.id}
                      className={cn(
                        "border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer",
                        isOverdue && "bg-red-50 border-l-4 border-l-red-500 hover:bg-red-100/50"
                      )}
                      onClick={() => window.location.href = `/dashboard/finance/invoices/${inv.id}`}
                    >
                      <td className="py-3 px-4 font-medium font-[family-name:var(--font-mono)] text-[#1A1A2E]">{inv.number}</td>
                      <td className="py-3 px-2">
                        <Badge className={cn(typeStyle.bg, typeStyle.text, "border-0 text-[10px]")}>{typeStyle.label}</Badge>
                      </td>
                      <td className="py-3 px-2 text-gray-600 max-w-[160px] truncate">
                        {inv.type === "SALES" ? (inv.job?.clientName || "—") : (inv.subcontractor?.name || "—")}
                      </td>
                      <td className="py-3 px-2 text-gray-500 font-[family-name:var(--font-mono)] text-xs">{inv.job?.reference || "—"}</td>
                      <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)] text-[#1A1A2E]">{formatMoney(inv.amount)}</td>
                      <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)] text-gray-500">{formatMoney(inv.vat)}</td>
                      <td className="py-3 px-2 text-right font-[family-name:var(--font-mono)] font-medium text-[#1A1A2E]">{formatMoney(inv.total)}</td>
                      <td className="py-3 px-2 text-center">
                        <Badge className={cn(statusStyle.bg, statusStyle.text, "border-0 text-[10px]")}>{statusStyle.label}</Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{inv.dueDate ? formatDate(inv.dueDate) : "—"}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage(p => p - 1)}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage(p => p + 1)}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
