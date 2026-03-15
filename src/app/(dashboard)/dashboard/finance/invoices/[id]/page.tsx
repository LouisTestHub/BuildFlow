"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { formatMoney, INVOICE_STATUS_STYLES, INVOICE_TYPE_STYLES } from "@/lib/finance-utils"
import { formatDate } from "@/lib/job-status"
import { ArrowLeft, Loader2, CheckCircle, XCircle, Send } from "lucide-react"

interface InvoiceDetail {
  id: string
  number: string
  type: string
  amount: string
  vat: string
  vatReverseCharge: boolean
  total: string
  status: string
  dueDate: string | null
  createdAt: string
  job: { id: string; reference: string; title: string; clientName: string | null } | null
  subcontractor: { id: string; name: string; cisTaxStatus: string; cisUtr: string | null } | null
  cisDeductions: { id: string; gross: string; deductionRate: string; deductionAmount: string; net: string; taxMonth: string }[]
}

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [acting, setActing] = useState(false)

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then(r => r.json())
      .then(d => { setInvoice(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  async function updateStatus(status: string) {
    setActing(true)
    const res = await fetch(`/api/invoices/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated = await res.json()
      setInvoice(prev => prev ? { ...prev, status: updated.status } : null)
    }
    setActing(false)
  }

  async function recordPayment() {
    setActing(true)
    const res = await fetch(`/api/invoices/${id}/payment`, { method: "POST" })
    if (res.ok) {
      setInvoice(prev => prev ? { ...prev, status: "PAID" } : null)
    }
    setActing(false)
  }

  async function deleteInvoice() {
    if (!confirm("Delete this draft invoice?")) return
    setActing(true)
    const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" })
    if (res.ok) router.push("/dashboard/finance/invoices")
    setActing(false)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#F97316]" /></div>
  }

  if (!invoice) {
    return <div className="text-center py-12 text-gray-500">Invoice not found.</div>
  }

  const statusStyle = INVOICE_STATUS_STYLES[invoice.status as keyof typeof INVOICE_STATUS_STYLES] || INVOICE_STATUS_STYLES.DRAFT
  const typeStyle = INVOICE_TYPE_STYLES[invoice.type as keyof typeof INVOICE_TYPE_STYLES] || INVOICE_TYPE_STYLES.SALES
  const isOverdue = invoice.status === "OVERDUE"

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/finance/invoices">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1A1A2E]">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-[#1A1A2E] font-[family-name:var(--font-mono)]">{invoice.number}</h2>
              <Badge className={cn(typeStyle.bg, typeStyle.text, "border-0")}>{typeStyle.label}</Badge>
              <Badge className={cn(statusStyle.bg, statusStyle.text, "border-0", isOverdue && "animate-pulse")}>{statusStyle.label}</Badge>
            </div>
            <p className="text-gray-500 text-sm">Created {formatDate(invoice.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Overdue alert */}
      {isOverdue && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-red-800">This invoice is overdue</p>
            <p className="text-sm text-red-600">Due date: {formatDate(invoice.dueDate)}</p>
          </div>
        </div>
      )}

      {/* Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {invoice.job && (
              <>
                <div>
                  <p className="text-gray-500">Job Reference</p>
                  <Link href={`/dashboard/jobs/${invoice.job.id}`} className="font-medium text-[#F97316] hover:underline">
                    {invoice.job.reference}
                  </Link>
                </div>
                <div>
                  <p className="text-gray-500">Client</p>
                  <p className="font-medium text-[#1A1A2E]">{invoice.job.clientName || "—"}</p>
                </div>
              </>
            )}
            {invoice.subcontractor && (
              <>
                <div>
                  <p className="text-gray-500">Subcontractor</p>
                  <Link href={`/dashboard/subcontractors/${invoice.subcontractor.id}`} className="font-medium text-[#F97316] hover:underline">
                    {invoice.subcontractor.name}
                  </Link>
                </div>
                <div>
                  <p className="text-gray-500">CIS Status</p>
                  <p className="font-medium">{invoice.subcontractor.cisTaxStatus}</p>
                </div>
              </>
            )}
            <div>
              <p className="text-gray-500">Due Date</p>
              <p className="font-medium">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>

          {/* Financial summary */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount</span>
              <span className="font-[family-name:var(--font-mono)] font-medium">{formatMoney(invoice.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">VAT{invoice.vatReverseCharge ? " (Reverse Charge)" : ""}</span>
              <span className="font-[family-name:var(--font-mono)] font-medium">
                {invoice.vatReverseCharge ? "RC" : formatMoney(invoice.vat)}
              </span>
            </div>
            {invoice.vatReverseCharge && (
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">
                ⚠️ Customer to account for VAT under reverse charge
              </p>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span>Total</span>
              <span className="font-[family-name:var(--font-mono)]">{formatMoney(invoice.total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CIS Deductions */}
      {invoice.cisDeductions.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-base text-amber-800">CIS Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-2">Tax Month</th>
                  <th className="text-right py-2">Gross</th>
                  <th className="text-right py-2">Rate</th>
                  <th className="text-right py-2">Deduction</th>
                  <th className="text-right py-2">Net</th>
                </tr>
              </thead>
              <tbody>
                {invoice.cisDeductions.map(d => (
                  <tr key={d.id} className="border-b border-gray-50">
                    <td className="py-2 font-[family-name:var(--font-mono)]">{d.taxMonth}</td>
                    <td className="py-2 text-right font-[family-name:var(--font-mono)]">{formatMoney(d.gross)}</td>
                    <td className="py-2 text-right font-[family-name:var(--font-mono)]">{Number(d.deductionRate).toFixed(0)}%</td>
                    <td className="py-2 text-right font-[family-name:var(--font-mono)] text-red-600">{formatMoney(d.deductionAmount)}</td>
                    <td className="py-2 text-right font-[family-name:var(--font-mono)] font-medium">{formatMoney(d.net)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="p-4 flex flex-wrap gap-3">
          {invoice.status === "DRAFT" && (
            <>
              <Button onClick={() => updateStatus("SENT")} disabled={acting} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <Send className="w-4 h-4" /> Mark as Sent
              </Button>
              <Button variant="outline" onClick={deleteInvoice} disabled={acting} className="text-red-600 hover:bg-red-50">
                Delete Draft
              </Button>
            </>
          )}
          {(invoice.status === "SENT" || invoice.status === "OVERDUE") && (
            <Button onClick={recordPayment} disabled={acting} className="bg-green-600 hover:bg-green-700 text-white gap-2">
              <CheckCircle className="w-4 h-4" /> Mark as Paid
            </Button>
          )}
          {invoice.status !== "VOID" && invoice.status !== "PAID" && (
            <Button variant="outline" onClick={() => updateStatus("VOID")} disabled={acting} className="text-gray-500">
              Void Invoice
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
