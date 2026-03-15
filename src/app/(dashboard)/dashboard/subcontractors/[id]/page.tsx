"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  ArrowLeft, Loader2, Star, ShieldCheck, Award, ClipboardList, Clock,
  Plus, Trash2, Send, Copy, Check, User, Phone, Mail, MapPin
} from "lucide-react"

type Tab = "profile" | "certs" | "orders" | "history"

interface SubData {
  id: string
  name: string
  trade: string | null
  contactName: string | null
  email: string | null
  phone: string | null
  cisUtr: string | null
  cisVerified: boolean
  cisTaxStatus: string
  vatRegistered: boolean
  insuranceExpiry: string | null
  rating: number | null
  portalToken: string | null
  certs: Cert[]
  orders: Order[]
}

interface Cert {
  id: string
  type: string
  reference: string | null
  expiryDate: string | null
}

interface Order {
  id: string
  trade: string | null
  value: string | null
  orderDate: string | null
  status: string
  scopeDescription: string | null
  job: { id: string; reference: string; title: string }
}

const CIS_BADGES: Record<string, { bg: string; text: string; label: string }> = {
  GROSS: { bg: "bg-green-100", text: "text-green-800", label: "Gross" },
  NET: { bg: "bg-amber-100", text: "text-amber-800", label: "Net" },
  HIGHER_RATE: { bg: "bg-red-100", text: "text-red-800", label: "Higher Rate" },
  NOT_VERIFIED: { bg: "bg-gray-100", text: "text-gray-600", label: "Not Verified" },
  UNMATCHED: { bg: "bg-gray-100", text: "text-gray-600", label: "Unmatched" },
}

const ORDER_STATUS: Record<string, { bg: string; text: string; label: string }> = {
  DRAFT: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
  ISSUED: { bg: "bg-blue-100", text: "text-blue-800", label: "Issued" },
  ACCEPTED: { bg: "bg-green-100", text: "text-green-800", label: "Accepted" },
  IN_PROGRESS: { bg: "bg-amber-100", text: "text-amber-800", label: "In Progress" },
  COMPLETE: { bg: "bg-emerald-100", text: "text-emerald-800", label: "Complete" },
  DISPUTED: { bg: "bg-red-100", text: "text-red-800", label: "Disputed" },
}

const CERT_TYPES = [
  "Public Liability", "Employers Liability", "Professional Indemnity", "CSCS",
  "Gas Safe", "NICEIC", "NAPIT", "SSIP", "Asbestos Awareness", "Working at Height", "Other",
]

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "certs", label: "Certifications", icon: Award },
  { key: "orders", label: "Orders", icon: ClipboardList },
  { key: "history", label: "History", icon: Clock },
]

function formatDate(d: string | null) {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function formatCurrency(v: string | number | null) {
  if (!v) return "—"
  const n = typeof v === "string" ? parseFloat(v) : v
  return `£${n.toLocaleString("en-GB", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function certExpiryStatus(d: string | null): "valid" | "expiring" | "expired" {
  if (!d) return "expired"
  const now = new Date()
  const expiry = new Date(d)
  if (expiry < now) return "expired"
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  if (expiry <= thirtyDays) return "expiring"
  return "valid"
}

const CERT_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  valid: { bg: "bg-green-100", text: "text-green-800", label: "Valid" },
  expiring: { bg: "bg-amber-100", text: "text-amber-800", label: "Expiring" },
  expired: { bg: "bg-red-100", text: "text-red-800", label: "Expired" },
}

export default function SubcontractorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const subId = params.id as string
  const [sub, setSub] = useState<SubData | null>(null)
  const [tab, setTab] = useState<Tab>("profile")
  const [loading, setLoading] = useState(true)

  const fetchSub = useCallback(async () => {
    const res = await fetch(`/api/subcontractors/${subId}`)
    if (res.ok) {
      const data = await res.json()
      setSub(data.subcontractor)
    }
    setLoading(false)
  }, [subId])

  useEffect(() => { fetchSub() }, [fetchSub])

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#F97316]" /></div>
  }

  if (!sub) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-[#1A1A2E]">Subcontractor not found</h2>
        <Link href="/dashboard/subcontractors"><Button variant="link" className="mt-4">← Back</Button></Link>
      </div>
    )
  }

  const cis = CIS_BADGES[sub.cisTaxStatus] || CIS_BADGES.NOT_VERIFIED

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4">
        <Link href="/dashboard/subcontractors">
          <Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={cn(cis.bg, cis.text, "border-0")}>{cis.label}</Badge>
            {sub.cisVerified && <Badge variant="success" className="text-[10px]">✓ CIS Verified</Badge>}
          </div>
          <h2 className="text-2xl font-bold text-[#1A1A2E] mt-1">{sub.name}</h2>
          {sub.trade && <p className="text-gray-500 text-sm">{sub.trade}</p>}
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className={cn("w-5 h-5", i <= (sub.rating || 0) ? "text-amber-400 fill-amber-400" : "text-gray-200")} />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                tab === t.key ? "border-[#F97316] text-[#F97316]" : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.key === "certs" && <span className="text-xs bg-gray-100 rounded-full px-1.5">{sub.certs.length}</span>}
              {t.key === "orders" && <span className="text-xs bg-gray-100 rounded-full px-1.5">{sub.orders.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {tab === "profile" && <ProfileTab sub={sub} onRefresh={fetchSub} />}
      {tab === "certs" && <CertsTab subId={subId} certs={sub.certs} onRefresh={fetchSub} />}
      {tab === "orders" && <OrdersTab subId={subId} orders={sub.orders} onRefresh={fetchSub} />}
      {tab === "history" && <HistoryTab sub={sub} />}
    </div>
  )
}

/* ── Profile Tab ───────────────────────────────────────────────── */
function ProfileTab({ sub, onRefresh }: { sub: SubData; onRefresh: () => void }) {
  const [verifying, setVerifying] = useState(false)
  const [inviting, setInviting] = useState(false)
  const [portalUrl, setPortalUrl] = useState("")
  const [copied, setCopied] = useState(false)
  const [editRating, setEditRating] = useState(sub.rating || 0)
  const [savingRating, setSavingRating] = useState(false)

  const verifyCIS = async () => {
    setVerifying(true)
    await fetch(`/api/subcontractors/${sub.id}/verify`, { method: "POST" })
    setVerifying(false)
    onRefresh()
  }

  const generatePortal = async () => {
    setInviting(true)
    const res = await fetch(`/api/subcontractors/${sub.id}/invite`, { method: "POST" })
    if (res.ok) {
      const data = await res.json()
      setPortalUrl(data.portalUrl)
    }
    setInviting(false)
  }

  const copyPortalUrl = () => {
    navigator.clipboard.writeText(portalUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveRating = async (r: number) => {
    setEditRating(r)
    setSavingRating(true)
    await fetch(`/api/subcontractors/${sub.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: r }),
    })
    setSavingRating(false)
    onRefresh()
  }

  const cis = CIS_BADGES[sub.cisTaxStatus] || CIS_BADGES.NOT_VERIFIED

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Contact Info */}
      <Card>
        <CardHeader><CardTitle className="text-base">Contact Information</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          {sub.contactName && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{sub.contactName}</span>
            </div>
          )}
          {sub.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-400" />
              <a href={`mailto:${sub.email}`} className="text-sm text-blue-600 hover:underline">{sub.email}</a>
            </div>
          )}
          {sub.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <a href={`tel:${sub.phone}`} className="text-sm">{sub.phone}</a>
            </div>
          )}
          {sub.trade && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{sub.trade}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CIS Details */}
      <Card>
        <CardHeader><CardTitle className="text-base">CIS Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={cn(cis.bg, cis.text, "border-0 text-sm px-4 py-1.5")}>{cis.label}</Badge>
            {sub.cisVerified ? (
              <span className="text-sm text-green-600 flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Verified</span>
            ) : (
              <Button size="sm" variant="outline" onClick={verifyCIS} disabled={verifying}>
                {verifying ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />}
                Verify CIS
              </Button>
            )}
          </div>
          {sub.cisUtr && (
            <div>
              <p className="text-xs text-gray-500">UTR Number</p>
              <p className="font-mono text-sm">{sub.cisUtr}</p>
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500">VAT Status</p>
            <p className="text-sm">{sub.vatRegistered ? "VAT Registered" : "Not VAT Registered"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Insurance Expiry</p>
            <p className="text-sm font-mono">{formatDate(sub.insuranceExpiry)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Rating */}
      <Card>
        <CardHeader><CardTitle className="text-base">Rating</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <button key={i} onClick={() => saveRating(editRating === i ? 0 : i)} disabled={savingRating} className="p-0.5">
                <Star className={cn("w-8 h-8 transition-colors", i <= editRating ? "text-amber-400 fill-amber-400" : "text-gray-200 hover:text-amber-200")} />
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Click stars to update rating</p>
        </CardContent>
      </Card>

      {/* Portal */}
      <Card>
        <CardHeader><CardTitle className="text-base">Subcontractor Portal</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-500">Generate a portal link for this subcontractor to view orders and upload certificates.</p>
          {portalUrl ? (
            <div className="flex items-center gap-2">
              <Input value={portalUrl} readOnly className="font-mono text-xs" />
              <Button size="sm" variant="outline" onClick={copyPortalUrl}>
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          ) : (
            <Button size="sm" onClick={generatePortal} disabled={inviting}>
              {inviting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Generate Portal Link
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

/* ── Certifications Tab ──────────────────────────────────────────── */
function CertsTab({ subId, certs, onRefresh }: { subId: string; certs: Cert[]; onRefresh: () => void }) {
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ type: "", reference: "", expiry_date: "" })

  const addCert = async () => {
    if (!form.type) return
    setSaving(true)
    await fetch(`/api/subcontractors/${subId}/certs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setForm({ type: "", reference: "", expiry_date: "" })
    setAdding(false)
    setSaving(false)
    onRefresh()
  }

  const deleteCert = async (certId: string) => {
    await fetch(`/api/subcontractors/${subId}/certs/${certId}`, { method: "DELETE" })
    onRefresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{certs.length} certification{certs.length !== 1 ? "s" : ""}</p>
        <Button size="sm" onClick={() => setAdding(true)}><Plus className="w-4 h-4" /> Add Cert</Button>
      </div>

      {adding && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              <option value="">Select cert type...</option>
              {CERT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Reference number" value={form.reference} onChange={(e) => setForm((f) => ({ ...f, reference: e.target.value }))} />
              <Input type="date" value={form.expiry_date} onChange={(e) => setForm((f) => ({ ...f, expiry_date: e.target.value }))} />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
              <Button size="sm" onClick={addCert} disabled={saving}>
                {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save Cert
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {certs.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-gray-400">No certifications on file.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {certs.map((cert) => {
            const status = certExpiryStatus(cert.expiryDate)
            const style = CERT_STATUS_STYLES[status]
            return (
              <Card key={cert.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Award className={cn("w-5 h-5 shrink-0", status === "valid" ? "text-green-500" : status === "expiring" ? "text-amber-500" : "text-red-500")} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#1A1A2E]">{cert.type}</p>
                      <div className="flex flex-wrap gap-x-4 text-xs text-gray-400 mt-0.5">
                        {cert.reference && <span>Ref: {cert.reference}</span>}
                        <span>Expires: {formatDate(cert.expiryDate)}</span>
                      </div>
                    </div>
                    <Badge className={cn(style.bg, style.text, "border-0 text-[10px]")}>{style.label}</Badge>
                    <button onClick={() => deleteCert(cert.id)} className="text-gray-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── Orders Tab ──────────────────────────────────────────────────── */
function OrdersTab({ subId, orders, onRefresh }: { subId: string; orders: Order[]; onRefresh: () => void }) {
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)
  const [jobs, setJobs] = useState<{ id: string; reference: string; title: string }[]>([])
  const [form, setForm] = useState({ job_id: "", trade: "", value: "", scope_description: "" })

  const loadJobs = async () => {
    const res = await fetch("/api/jobs?limit=100")
    if (res.ok) {
      const data = await res.json()
      setJobs(data.jobs.map((j: { id: string; reference: string; title: string }) => ({ id: j.id, reference: j.reference, title: j.title })))
    }
  }

  const startAdding = () => {
    loadJobs()
    setAdding(true)
  }

  const addOrder = async () => {
    if (!form.job_id) return
    setSaving(true)
    await fetch(`/api/subcontractors/${subId}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setForm({ job_id: "", trade: "", value: "", scope_description: "" })
    setAdding(false)
    setSaving(false)
    onRefresh()
  }

  const updateStatus = async (orderId: string, status: string) => {
    await fetch(`/api/subcontractors/${subId}/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    onRefresh()
  }

  const STATUS_FLOW: Record<string, string[]> = {
    DRAFT: ["ISSUED"],
    ISSUED: ["ACCEPTED", "DISPUTED"],
    ACCEPTED: ["IN_PROGRESS"],
    IN_PROGRESS: ["COMPLETE"],
    COMPLETE: [],
    DISPUTED: ["ISSUED"],
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{orders.length} order{orders.length !== 1 ? "s" : ""}</p>
        <Button size="sm" onClick={startAdding}><Plus className="w-4 h-4" /> New Order</Button>
      </div>

      {adding && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <select
              value={form.job_id}
              onChange={(e) => setForm((f) => ({ ...f, job_id: e.target.value }))}
              className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              <option value="">Select job...</option>
              {jobs.map((j) => <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>)}
            </select>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Trade / scope" value={form.trade} onChange={(e) => setForm((f) => ({ ...f, trade: e.target.value }))} />
              <Input type="number" placeholder="Value (£)" value={form.value} onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))} className="font-mono" />
            </div>
            <textarea
              value={form.scope_description}
              onChange={(e) => setForm((f) => ({ ...f, scope_description: e.target.value }))}
              rows={2}
              placeholder="Scope description..."
              className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>Cancel</Button>
              <Button size="sm" onClick={addOrder} disabled={saving}>
                {saving && <Loader2 className="w-3 h-3 animate-spin" />} Create Order
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {orders.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-gray-400">No orders yet.</CardContent></Card>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => {
            const os = ORDER_STATUS[order.status] || ORDER_STATUS.DRAFT
            const nextStatuses = STATUS_FLOW[order.status] || []
            return (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs text-gray-400">{order.job.reference}</span>
                        <Badge className={cn(os.bg, os.text, "border-0 text-[10px]")}>{os.label}</Badge>
                      </div>
                      <p className="text-sm font-medium text-[#1A1A2E] mt-0.5">{order.job.title}</p>
                      <div className="flex flex-wrap gap-x-4 text-xs text-gray-400 mt-1">
                        {order.trade && <span>{order.trade}</span>}
                        {order.value && <span className="font-mono">{formatCurrency(order.value)}</span>}
                        {order.orderDate && <span>{formatDate(order.orderDate)}</span>}
                      </div>
                      {order.scopeDescription && <p className="text-xs text-gray-500 mt-1">{order.scopeDescription}</p>}
                    </div>
                    {nextStatuses.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap">
                        {nextStatuses.map((ns) => {
                          const nStyle = ORDER_STATUS[ns] || ORDER_STATUS.DRAFT
                          return (
                            <Button key={ns} size="sm" variant="outline" className={cn("text-xs", nStyle.text)} onClick={() => updateStatus(order.id, ns)}>
                              → {nStyle.label}
                            </Button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

/* ── History Tab ─────────────────────────────────────────────────── */
function HistoryTab({ sub }: { sub: SubData }) {
  const totalValue = sub.orders.reduce((sum, o) => sum + (o.value ? parseFloat(o.value) : 0), 0)
  const jobMap = new Map<string, { reference: string; title: string; orders: Order[] }>()

  for (const order of sub.orders) {
    const existing = jobMap.get(order.job.id)
    if (existing) {
      existing.orders.push(order)
    } else {
      jobMap.set(order.job.id, { reference: order.job.reference, title: order.job.title, orders: [order] })
    }
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Jobs Worked On</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{jobMap.size}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{sub.orders.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Value</p>
            <p className="text-2xl font-bold font-mono text-[#1A1A2E] mt-1">{formatCurrency(totalValue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Jobs */}
      {jobMap.size === 0 ? (
        <Card><CardContent className="p-8 text-center text-gray-400">No job history yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {Array.from(jobMap.entries()).map(([jobId, data]) => {
            const jobTotal = data.orders.reduce((sum, o) => sum + (o.value ? parseFloat(o.value) : 0), 0)
            return (
              <Card key={jobId}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-mono text-xs text-gray-400">{data.reference}</span>
                      <p className="font-medium text-sm text-[#1A1A2E]">{data.title}</p>
                    </div>
                    <span className="font-mono text-sm font-medium text-[#1A1A2E]">{formatCurrency(jobTotal)}</span>
                  </div>
                  <div className="space-y-1">
                    {data.orders.map((order) => {
                      const os = ORDER_STATUS[order.status] || ORDER_STATUS.DRAFT
                      return (
                        <div key={order.id} className="flex items-center gap-2 text-xs text-gray-500">
                          <Badge className={cn(os.bg, os.text, "border-0 text-[10px]")}>{os.label}</Badge>
                          {order.trade && <span>{order.trade}</span>}
                          {order.value && <span className="font-mono">{formatCurrency(order.value)}</span>}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
