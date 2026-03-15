"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { formatMoney, getCISRate } from "@/lib/finance-utils"
import { ArrowLeft, Plus, Trash2, Loader2 } from "lucide-react"

interface LineItem {
  description: string
  quantity: number
  rate: number
  amount: number
}

interface Job {
  id: string
  reference: string
  title: string
  clientName: string | null
}

interface Subbie {
  id: string
  name: string
  trade: string | null
  cisTaxStatus: string
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [type, setType] = useState<"SALES" | "PURCHASE">("SALES")
  const [jobs, setJobs] = useState<Job[]>([])
  const [subbies, setSubbies] = useState<Subbie[]>([])
  const [jobId, setJobId] = useState("")
  const [clientName, setClientName] = useState("")
  const [subcontractorId, setSubcontractorId] = useState("")
  const [lineItems, setLineItems] = useState<LineItem[]>([{ description: "", quantity: 1, rate: 0, amount: 0 }])
  const [vatType, setVatType] = useState<"standard" | "exempt" | "reverse">("standard")
  const [paymentTerms, setPaymentTerms] = useState(30)
  const [notes, setNotes] = useState("")
  const [materialsAmount, setMaterialsAmount] = useState(0)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/jobs").then(r => r.json()).then(d => setJobs(d.jobs || []))
    fetch("/api/subcontractors").then(r => r.json()).then(d => setSubbies(d.subcontractors || []))
  }, [])

  // Auto-fill client from job
  useEffect(() => {
    if (jobId && type === "SALES") {
      const job = jobs.find(j => j.id === jobId)
      if (job?.clientName) setClientName(job.clientName)
    }
  }, [jobId, jobs, type])

  const subtotal = lineItems.reduce((s, l) => s + l.amount, 0)
  const vatRate = vatType === "standard" ? 0.20 : 0
  const vatAmount = subtotal * vatRate
  const total = subtotal + vatAmount

  // CIS calculations
  const selectedSubbie = subbies.find(s => s.id === subcontractorId)
  const cisRate = selectedSubbie ? getCISRate(selectedSubbie.cisTaxStatus as Parameters<typeof getCISRate>[0]) : 0
  const cisLiable = subtotal - materialsAmount
  const cisDeduction = cisLiable * (cisRate / 100)
  const cisNet = subtotal - cisDeduction

  function updateLineItem(index: number, field: keyof LineItem, value: string) {
    const updated = [...lineItems]
    const item = { ...updated[index] }
    if (field === "description") {
      item.description = value
    } else {
      const num = parseFloat(value) || 0
      if (field === "quantity") item.quantity = num
      if (field === "rate") item.rate = num
      if (field === "amount") item.amount = num
    }
    if (field === "quantity" || field === "rate") {
      item.amount = item.quantity * item.rate
    }
    updated[index] = item
    setLineItems(updated)
  }

  function addLineItem() {
    setLineItems([...lineItems, { description: "", quantity: 1, rate: 0, amount: 0 }])
  }

  function removeLineItem(index: number) {
    if (lineItems.length <= 1) return
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  async function handleSave(status: "DRAFT" | "SENT") {
    setSaving(true)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + paymentTerms)

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        jobId: jobId || null,
        subcontractorId: type === "PURCHASE" ? subcontractorId || null : null,
        amount: subtotal,
        vat: vatAmount,
        vatReverseCharge: vatType === "reverse",
        total,
        status,
        dueDate: dueDate.toISOString(),
        materialsAmount: type === "PURCHASE" && subcontractorId ? materialsAmount : 0,
      }),
    })

    if (res.ok) {
      router.push("/dashboard/finance/invoices")
    }
    setSaving(false)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard/finance/invoices">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-[#1A1A2E]">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">New Invoice</h2>
          <p className="text-gray-500 text-sm">Create a new {type === "SALES" ? "sales" : "purchase"} invoice</p>
        </div>
      </div>

      {/* Type Selector */}
      <div className="flex gap-3">
        <button
          onClick={() => setType("SALES")}
          className={cn(
            "flex-1 p-4 rounded-xl border-2 transition-all text-left",
            type === "SALES" ? "border-[#F97316] bg-[#F97316]/5" : "border-gray-200 hover:border-gray-300"
          )}
        >
          <p className="font-semibold text-[#1A1A2E]">Sales Invoice</p>
          <p className="text-xs text-gray-500 mt-1">Invoice your clients</p>
        </button>
        <button
          onClick={() => setType("PURCHASE")}
          className={cn(
            "flex-1 p-4 rounded-xl border-2 transition-all text-left",
            type === "PURCHASE" ? "border-[#F97316] bg-[#F97316]/5" : "border-gray-200 hover:border-gray-300"
          )}
        >
          <p className="font-semibold text-[#1A1A2E]">Purchase Invoice</p>
          <p className="text-xs text-gray-500 mt-1">Record supplier/subbie invoices</p>
        </button>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{type === "SALES" ? "Sales" : "Purchase"} Invoice Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Client/Supplier */}
          {type === "SALES" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Client Name</label>
                <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Job (optional)</label>
                <select value={jobId} onChange={e => setJobId(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="">No job linked</option>
                  {jobs.map(j => <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>)}
                </select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Subcontractor / Supplier</label>
                <select value={subcontractorId} onChange={e => setSubcontractorId(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="">Select subcontractor...</option>
                  {subbies.map(s => <option key={s.id} value={s.id}>{s.name} ({s.trade})</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Job</label>
                <select value={jobId} onChange={e => setJobId(e.target.value)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="">Select job...</option>
                  {jobs.map(j => <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Line Items */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Line Items</label>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium px-1">
                <span className="col-span-5">Description</span>
                <span className="col-span-2 text-right">Qty</span>
                <span className="col-span-2 text-right">Rate (£)</span>
                <span className="col-span-2 text-right">Amount</span>
                <span className="col-span-1" />
              </div>
              {lineItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <Input className="col-span-5" placeholder="Description" value={item.description} onChange={e => updateLineItem(i, "description", e.target.value)} />
                  <Input className="col-span-2 text-right font-[family-name:var(--font-mono)]" type="number" value={item.quantity || ""} onChange={e => updateLineItem(i, "quantity", e.target.value)} />
                  <Input className="col-span-2 text-right font-[family-name:var(--font-mono)]" type="number" step="0.01" value={item.rate || ""} onChange={e => updateLineItem(i, "rate", e.target.value)} />
                  <div className="col-span-2 text-right font-[family-name:var(--font-mono)] text-sm font-medium text-[#1A1A2E] pr-2">{formatMoney(item.amount)}</div>
                  <button onClick={() => removeLineItem(i)} className="col-span-1 text-gray-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addLineItem} className="gap-1 mt-1">
                <Plus className="w-3 h-3" /> Add Line
              </Button>
            </div>
          </div>

          {/* VAT */}
          {type === "SALES" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">VAT</label>
                <select value={vatType} onChange={e => setVatType(e.target.value as typeof vatType)} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="standard">20% Standard Rate</option>
                  <option value="exempt">0% Exempt</option>
                  <option value="reverse">Reverse Charge</option>
                </select>
                {vatType === "reverse" && (
                  <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded-lg">
                    ⚠️ Customer to account for VAT under reverse charge
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Payment Terms</label>
                <select value={paymentTerms} onChange={e => setPaymentTerms(parseInt(e.target.value))} className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm bg-white">
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Due: {new Date(Date.now() + paymentTerms * 86400000).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                </p>
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              placeholder="Additional notes..."
            />
          </div>

          {/* Totals */}
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-[family-name:var(--font-mono)] font-medium">{formatMoney(subtotal)}</span>
            </div>
            {vatType === "standard" && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">VAT (20%)</span>
                <span className="font-[family-name:var(--font-mono)] font-medium">{formatMoney(vatAmount)}</span>
              </div>
            )}
            {vatType === "reverse" && (
              <div className="flex justify-between text-sm">
                <span className="text-amber-600">VAT Reverse Charge</span>
                <span className="font-[family-name:var(--font-mono)] text-amber-600">RC</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border-t pt-2">
              <span className="text-[#1A1A2E]">Total</span>
              <span className="font-[family-name:var(--font-mono)] text-[#1A1A2E]">{formatMoney(total)}</span>
            </div>
          </div>

          {/* CIS Section (purchase invoices with subbie) */}
          {type === "PURCHASE" && subcontractorId && selectedSubbie && (
            <Card className="border-amber-200 bg-amber-50/30">
              <CardHeader>
                <CardTitle className="text-sm text-amber-800">CIS Deduction Calculation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">Gross Amount</span>
                    <p className="font-[family-name:var(--font-mono)] font-medium">{formatMoney(subtotal)}</p>
                  </div>
                  <div>
                    <label className="text-gray-500 block">Materials (CIS exempt)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={materialsAmount || ""}
                      onChange={e => setMaterialsAmount(parseFloat(e.target.value) || 0)}
                      className="mt-1 font-[family-name:var(--font-mono)]"
                    />
                  </div>
                  <div>
                    <span className="text-gray-500">CIS-Liable Amount</span>
                    <p className="font-[family-name:var(--font-mono)] font-medium">{formatMoney(cisLiable)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Deduction Rate ({selectedSubbie.cisTaxStatus})</span>
                    <p className="font-[family-name:var(--font-mono)] font-bold text-amber-700">{cisRate}%</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Deduction Amount</span>
                    <p className="font-[family-name:var(--font-mono)] font-bold text-red-600">{formatMoney(cisDeduction)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Net Payable</span>
                    <p className="font-[family-name:var(--font-mono)] font-bold text-green-600">{formatMoney(cisNet)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Link href="/dashboard/finance/invoices">
          <Button variant="outline">Cancel</Button>
        </Link>
        <Button
          variant="outline"
          onClick={() => handleSave("DRAFT")}
          disabled={saving || subtotal <= 0}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save Draft
        </Button>
        <Button
          className="bg-[#F97316] hover:bg-[#EA580C] text-white"
          onClick={() => handleSave("SENT")}
          disabled={saving || subtotal <= 0}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Send
        </Button>
      </div>
    </div>
  )
}
