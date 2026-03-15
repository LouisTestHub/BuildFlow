"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Loader2 } from "lucide-react"
import { SECTORS } from "@/lib/job-status"

interface User {
  id: string
  name: string
  role: string
}

export default function NewJobPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [form, setForm] = useState({
    title: "",
    sector: "",
    client_name: "",
    client_email: "",
    client_phone: "",
    site_address: "",
    site_postcode: "",
    contract_value: "",
    retention_percent: "5",
    defects_period_months: "12",
    start_date: "",
    end_date: "",
    pm_id: "",
  })

  useEffect(() => {
    fetch("/api/users").then(r => r.json()).then(d => setUsers(d.users || []))
  }, [])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    setErrors(errs => { const next = { ...errs }; delete next[field]; return next })
  }

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = "Job title is required"
    if (form.client_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email)) {
      errs.client_email = "Invalid email address"
    }
    if (form.contract_value && isNaN(parseFloat(form.contract_value))) {
      errs.contract_value = "Must be a valid number"
    }
    if (form.start_date && form.end_date && new Date(form.end_date) < new Date(form.start_date)) {
      errs.end_date = "End date must be after start date"
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to create job")
      const data = await res.json()
      router.push(`/dashboard/jobs/${data.job.id}`)
    } catch {
      setErrors({ _form: "Failed to create job. Please try again." })
      setSubmitting(false)
    }
  }

  const Field = ({ label, field, type = "text", required = false, placeholder = "", mono = false }: {
    label: string; field: string; type?: string; required?: boolean; placeholder?: string; mono?: boolean
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <Input
        type={type}
        value={form[field as keyof typeof form]}
        onChange={set(field)}
        placeholder={placeholder}
        className={mono ? "font-mono" : ""}
      />
      {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/dashboard/jobs">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">New Job</h2>
          <p className="text-gray-500 text-sm">Reference will be auto-generated</p>
        </div>
      </div>

      {errors._form && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{errors._form}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Job Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Job Title" field="title" required placeholder="e.g. Victoria Road Rear Extension" />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
              <select
                value={form.sector}
                onChange={set("sector")}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              >
                <option value="">Select sector...</option>
                {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Client</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Client Name" field="client_name" placeholder="e.g. Mr & Mrs Patterson" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Client Email" field="client_email" type="email" placeholder="client@email.com" />
              <Field label="Client Phone" field="client_phone" type="tel" placeholder="01234 567890" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Site</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <Field label="Site Address" field="site_address" placeholder="42 Victoria Road, Chelmsford" />
            <Field label="Site Postcode" field="site_postcode" placeholder="CM1 3PA" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Commercial</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Field label="Contract Value (£)" field="contract_value" type="number" placeholder="185000" mono />
              <Field label="Retention (%)" field="retention_percent" type="number" placeholder="5" mono />
              <Field label="Defects Period (months)" field="defects_period_months" type="number" placeholder="12" mono />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Schedule & Team</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Start Date" field="start_date" type="date" />
              <Field label="End Date" field="end_date" type="date" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Manager</label>
              <select
                value={form.pm_id}
                onChange={set("pm_id")}
                className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              >
                <option value="">Select PM...</option>
                {users.filter(u => ["DIRECTOR", "PROJECT_MANAGER", "SITE_MANAGER"].includes(u.role)).map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role.replace("_", " ")})</option>
                ))}
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Link href="/dashboard/jobs">
            <Button variant="outline" type="button">Cancel</Button>
          </Link>
          <Button type="submit" disabled={submitting}>
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Job
          </Button>
        </div>
      </form>
    </div>
  )
}
