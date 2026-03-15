"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ArrowLeft, Loader2, Star } from "lucide-react"

const TRADES = [
  "Electrician", "Plumber", "Bricklayer", "Plasterer", "Roofer", "Groundworker",
  "Carpenter", "Decorator", "Scaffolder", "Steelwork", "M&E", "Demolition",
  "Landscaping", "Flooring", "Glazing", "Other",
]

const TAX_STATUSES = [
  { value: "GROSS", label: "Gross" },
  { value: "NET", label: "Net" },
  { value: "HIGHER_RATE", label: "Higher Rate" },
  { value: "NOT_VERIFIED", label: "Not Verified" },
]

export default function NewSubcontractorPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({
    name: "",
    trade: "",
    contact_name: "",
    email: "",
    phone: "",
    address: "",
    utr: "",
    tax_status: "NOT_VERIFIED",
    cis_verified: false,
    vat_registered: false,
    vat_number: "",
    insurance_expiry: "",
    rating: 0,
    notes: "",
  })

  const updateForm = (key: string, value: string | boolean | number) => {
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = async () => {
    if (!form.name.trim()) {
      setError("Name is required")
      return
    }
    setSaving(true)
    setError("")

    const res = await fetch("/api/subcontractors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    if (res.ok) {
      const data = await res.json()
      router.push(`/dashboard/subcontractors/${data.subcontractor.id}`)
    } else {
      setError("Failed to create subcontractor")
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/subcontractors">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Add Subcontractor</h2>
          <p className="text-gray-500 text-sm">Register a new subcontractor</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">{error}</div>
      )}

      {/* Company Details */}
      <Card>
        <CardHeader><CardTitle className="text-base">Company Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Company Name *</label>
            <Input value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="e.g. ABC Electrical Ltd" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Trade</label>
            <select
              value={form.trade}
              onChange={(e) => updateForm("trade", e.target.value)}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              <option value="">Select trade...</option>
              {TRADES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">Contact Name</label>
              <Input value={form.contact_name} onChange={(e) => updateForm("contact_name", e.target.value)} placeholder="e.g. John Smith" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Phone</label>
              <Input value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="e.g. 07700 900000" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <Input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="e.g. info@company.co.uk" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Address</label>
            <Input value={form.address} onChange={(e) => updateForm("address", e.target.value)} placeholder="Full address" />
          </div>
        </CardContent>
      </Card>

      {/* CIS */}
      <Card>
        <CardHeader><CardTitle className="text-base">CIS Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1">UTR Number</label>
              <Input value={form.utr} onChange={(e) => updateForm("utr", e.target.value)} placeholder="10-digit UTR" className="font-mono" />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Tax Status</label>
              <select
                value={form.tax_status}
                onChange={(e) => updateForm("tax_status", e.target.value)}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              >
                {TAX_STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.cis_verified}
              onChange={(e) => updateForm("cis_verified", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]"
            />
            CIS Verified with HMRC
          </label>
        </CardContent>
      </Card>

      {/* VAT & Insurance */}
      <Card>
        <CardHeader><CardTitle className="text-base">VAT & Insurance</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form.vat_registered}
              onChange={(e) => updateForm("vat_registered", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-[#F97316] focus:ring-[#F97316]"
            />
            VAT Registered
          </label>
          {form.vat_registered && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">VAT Number</label>
              <Input value={form.vat_number} onChange={(e) => updateForm("vat_number", e.target.value)} placeholder="GB123456789" className="font-mono" />
            </div>
          )}
          <div>
            <label className="block text-xs text-gray-500 mb-1">Insurance Expiry Date</label>
            <Input type="date" value={form.insurance_expiry} onChange={(e) => updateForm("insurance_expiry", e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader><CardTitle className="text-base">Rating & Notes</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button key={i} onClick={() => updateForm("rating", form.rating === i ? 0 : i)} className="p-0.5">
                  <Star className={cn("w-6 h-6 transition-colors", i <= form.rating ? "text-amber-400 fill-amber-400" : "text-gray-200 hover:text-amber-200")} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => updateForm("notes", e.target.value)}
              rows={3}
              placeholder="Any additional notes..."
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        <Link href="/dashboard/subcontractors">
          <Button variant="ghost">Cancel</Button>
        </Link>
        <Button onClick={submit} disabled={saving}>
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          Create Subcontractor
        </Button>
      </div>
    </div>
  )
}
