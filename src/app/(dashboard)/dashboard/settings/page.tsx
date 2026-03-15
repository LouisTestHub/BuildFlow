"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Building2, Users, FileText, Bell, CreditCard, Save, Plus,
  Mail, Shield, Trash2, Check, X
} from "lucide-react"

const tabs = [
  { id: "company", label: "Company", icon: Building2 },
  { id: "users", label: "Users", icon: Users },
  { id: "invoices", label: "Invoice Settings", icon: FileText },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "subscription", label: "Subscription", icon: CreditCard },
]

const roles = ["DIRECTOR", "ESTIMATOR", "PROJECT_MANAGER", "SITE_MANAGER", "OFFICE_ADMIN", "SUBCONTRACTOR", "CLIENT"]

const notificationTypes = [
  { key: "invoice_overdue", label: "Invoice overdue" },
  { key: "cert_expiring", label: "Certification expiring" },
  { key: "timesheet_submitted", label: "Timesheet submitted" },
  { key: "incident_reported", label: "Incident reported" },
  { key: "snag_assigned", label: "Snag assigned" },
  { key: "document_uploaded", label: "Document uploaded" },
  { key: "job_status_change", label: "Job status change" },
]

const plans = [
  { name: "Starter", price: "£29", period: "/mo", features: ["5 users", "10 active jobs", "50 documents", "Email support"], current: false },
  { name: "Professional", price: "£79", period: "/mo", features: ["15 users", "25 active jobs", "100 documents", "Priority support", "CIS management", "Reports"], current: true },
  { name: "Business", price: "£149", period: "/mo", features: ["50 users", "Unlimited jobs", "500 documents", "Phone support", "API access", "Custom reports"], current: false },
  { name: "Enterprise", price: "Custom", period: "", features: ["Unlimited users", "Unlimited jobs", "Unlimited docs", "Dedicated CSM", "SLA guarantee", "SSO/SAML"], current: false },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("company")
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Company state
  const [company, setCompany] = useState({ name: "", registrationNumber: "", vatNumber: "", cisUtr: "", address: "" })
  // Users state
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string; createdAt: string }>>([])
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState("PROJECT_MANAGER")
  // Invoice settings (local state — would persist to company metadata)
  const [invoiceSettings, setInvoiceSettings] = useState({
    prefix: "INV", vatRate: "20", paymentTerms: "30",
    bankName: "", sortCode: "", accountNumber: "", terms: ""
  })
  // Notification toggles
  const [notifToggles, setNotifToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationTypes.map((n) => [n.key, true]))
  )

  const fetchCompany = useCallback(async () => {
    try {
      const res = await fetch("/api/settings")
      if (res.ok) {
        const data = await res.json()
        setCompany({ name: data.name || "", registrationNumber: data.registrationNumber || "", vatNumber: data.vatNumber || "", cisUtr: data.cisUtr || "", address: data.address || "" })
      }
    } catch { /* ignore */ }
  }, [])

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/settings/users")
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => {
    fetchCompany()
    fetchUsers()
  }, [fetchCompany, fetchUsers])

  const saveCompany = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(company) })
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 2000) }
    } catch { /* ignore */ } finally { setSaving(false) }
  }

  const inviteUser = async () => {
    if (!inviteEmail) return
    try {
      const res = await fetch("/api/settings/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: inviteEmail, role: inviteRole }) })
      if (res.ok) { setInviteEmail(""); fetchUsers() }
    } catch { /* ignore */ }
  }

  const changeRole = async (id: string, role: string) => {
    try {
      await fetch(`/api/settings/users/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ role }) })
      fetchUsers()
    } catch { /* ignore */ }
  }

  const deactivateUser = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this user?")) return
    try {
      await fetch(`/api/settings/users/${id}`, { method: "DELETE" })
      fetchUsers()
    } catch { /* ignore */ }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1A1A2E]">Settings</h2>
        <p className="text-gray-500 text-sm">Manage your company settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              activeTab === tab.id ? "bg-white text-[#1A1A2E] shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Company Tab */}
      {activeTab === "company" && (
        <Card>
          <CardHeader>
            <CardTitle>Company Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Company Name</label>
                <Input value={company.name} onChange={(e) => setCompany({ ...company, name: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Registration Number</label>
                <Input value={company.registrationNumber} onChange={(e) => setCompany({ ...company, registrationNumber: e.target.value })} placeholder="e.g. 12345678" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">VAT Number</label>
                <Input value={company.vatNumber} onChange={(e) => setCompany({ ...company, vatNumber: e.target.value })} placeholder="e.g. GB123456789" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">CIS UTR</label>
                <Input value={company.cisUtr} onChange={(e) => setCompany({ ...company, cisUtr: e.target.value })} placeholder="Unique Taxpayer Reference" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Address</label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                rows={3}
                value={company.address}
                onChange={(e) => setCompany({ ...company, address: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={saveCompany} disabled={saving} className="bg-[#F97316] hover:bg-[#EA580C]">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              {saved && <span className="text-sm text-[#10B981] flex items-center gap-1"><Check className="w-4 h-4" /> Saved</span>}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Invite User</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Input placeholder="Email address" type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} className="flex-1" />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                >
                  {roles.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                </select>
                <Button onClick={inviteUser} className="bg-[#F97316] hover:bg-[#EA580C]">
                  <Plus className="w-4 h-4 mr-1" /> Invite
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#F97316]/20 flex items-center justify-center">
                        <span className="text-sm font-bold text-[#F97316]">{u.name.split(" ").map((n) => n[0]).join("")}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#1A1A2E]">{u.name}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                      >
                        {roles.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                      </select>
                      <button onClick={() => deactivateUser(u.id)} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Invoice Settings Tab */}
      {activeTab === "invoices" && (
        <Card>
          <CardHeader>
            <CardTitle>Invoice Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Invoice Number Prefix</label>
                <Input value={invoiceSettings.prefix} onChange={(e) => setInvoiceSettings({ ...invoiceSettings, prefix: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Default VAT Rate (%)</label>
                <Input type="number" value={invoiceSettings.vatRate} onChange={(e) => setInvoiceSettings({ ...invoiceSettings, vatRate: e.target.value })} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Default Payment Terms</label>
                <select
                  value={invoiceSettings.paymentTerms}
                  onChange={(e) => setInvoiceSettings({ ...invoiceSettings, paymentTerms: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                >
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                </select>
              </div>
            </div>
            <div className="border-t pt-4">
              <h4 className="text-sm font-semibold text-[#1A1A2E] mb-3">Bank Details (for invoice footer)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Bank Name</label>
                  <Input value={invoiceSettings.bankName} onChange={(e) => setInvoiceSettings({ ...invoiceSettings, bankName: e.target.value })} placeholder="e.g. Barclays" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Sort Code</label>
                  <Input value={invoiceSettings.sortCode} onChange={(e) => setInvoiceSettings({ ...invoiceSettings, sortCode: e.target.value })} placeholder="00-00-00" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Account Number</label>
                  <Input value={invoiceSettings.accountNumber} onChange={(e) => setInvoiceSettings({ ...invoiceSettings, accountNumber: e.target.value })} placeholder="12345678" />
                </div>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Terms & Conditions</label>
              <textarea
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                rows={4}
                value={invoiceSettings.terms}
                onChange={(e) => setInvoiceSettings({ ...invoiceSettings, terms: e.target.value })}
                placeholder="Payment terms and conditions to appear on invoices..."
              />
            </div>
            <Button className="bg-[#F97316] hover:bg-[#EA580C]">
              <Save className="w-4 h-4 mr-2" /> Save Invoice Settings
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === "notifications" && (
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notificationTypes.map((nt) => (
                <div key={nt.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">{nt.label}</p>
                    <p className="text-xs text-gray-500">Receive in-app notifications</p>
                  </div>
                  <button
                    onClick={() => setNotifToggles({ ...notifToggles, [nt.key]: !notifToggles[nt.key] })}
                    className={`relative w-11 h-6 rounded-full transition-colors ${notifToggles[nt.key] ? "bg-[#F97316]" : "bg-gray-300"}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow ${notifToggles[nt.key] ? "translate-x-5" : ""}`} />
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Tab */}
      {activeTab === "subscription" && (
        <>
          {/* Usage */}
          <Card>
            <CardHeader>
              <CardTitle>Current Usage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Users", used: 8, max: 15 },
                { label: "Active Jobs", used: 5, max: 25 },
                { label: "Documents", used: 20, max: 100 },
              ].map((u) => (
                <div key={u.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{u.label}</span>
                    <span className="font-medium">{u.used} / {u.max}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#F97316] rounded-full h-2 transition-all"
                      style={{ width: `${(u.used / u.max) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Plans */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <Card key={plan.name} className={plan.current ? "ring-2 ring-[#F97316]" : ""}>
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    {plan.current && <Badge className="bg-[#F97316] mb-2">Current Plan</Badge>}
                    <h3 className="text-lg font-bold text-[#1A1A2E]">{plan.name}</h3>
                    <p className="text-2xl font-bold text-[#F97316] mt-1">
                      {plan.price}<span className="text-sm text-gray-400 font-normal">{plan.period}</span>
                    </p>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                        <span className="text-gray-600">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    {plan.current ? (
                      <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    ) : (
                      <Button className="w-full bg-[#1A1A2E] hover:bg-[#1A1A2E]/90">
                        {plan.price === "Custom" ? "Contact Sales" : "Upgrade"}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
