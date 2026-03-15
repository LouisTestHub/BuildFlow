"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface PortalData {
  subcontractor: { id: string; name: string; trade: string | null; email: string | null; phone: string | null }
  company: { name: string; logo: string | null }
  orders: PortalOrder[]
  certs: PortalCert[]
}

interface PortalOrder {
  id: string
  trade: string | null
  value: string | null
  orderDate: string | null
  status: string
  scopeDescription: string | null
  job: { id: string; reference: string; title: string }
}

interface PortalCert {
  id: string
  type: string
  reference: string | null
  expiryDate: string | null
}

const ORDER_STATUS: Record<string, { color: string; label: string }> = {
  DRAFT: { color: "bg-gray-200 text-gray-700", label: "Draft" },
  ISSUED: { color: "bg-blue-200 text-blue-800", label: "Issued" },
  ACCEPTED: { color: "bg-green-200 text-green-800", label: "Accepted" },
  IN_PROGRESS: { color: "bg-amber-200 text-amber-800", label: "In Progress" },
  COMPLETE: { color: "bg-emerald-200 text-emerald-800", label: "Complete" },
  DISPUTED: { color: "bg-red-200 text-red-800", label: "Disputed" },
}

const CERT_TYPES = [
  "Public Liability", "Employers Liability", "Professional Indemnity", "CSCS",
  "Gas Safe", "NICEIC", "NAPIT", "SSIP", "Asbestos Awareness", "Working at Height", "Other",
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

export default function SubcontractorPortalPage() {
  const params = useParams()
  const token = params.token as string
  const [data, setData] = useState<PortalData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState<"orders" | "certs" | "payments">("orders")
  const [addingCert, setAddingCert] = useState(false)
  const [certForm, setCertForm] = useState({ type: "", reference: "", expiry_date: "" })
  const [savingCert, setSavingCert] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    const res = await fetch(`/api/portal/sub/${token}`)
    if (res.ok) {
      setData(await res.json())
    } else {
      setError(true)
    }
    setLoading(false)
  }, [token])

  useEffect(() => { fetchData() }, [fetchData])

  const handleOrder = async (orderId: string, status: "ACCEPTED" | "DISPUTED") => {
    setActionLoading(orderId)
    await fetch(`/api/portal/sub/${token}/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    setActionLoading(null)
    fetchData()
  }

  const addCert = async () => {
    if (!certForm.type) return
    setSavingCert(true)
    await fetch(`/api/portal/sub/${token}/certs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(certForm),
    })
    setCertForm({ type: "", reference: "", expiry_date: "" })
    setAddingCert(false)
    setSavingCert(false)
    fetchData()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-6xl mb-4">🔗</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Portal Link</h1>
          <p className="text-gray-500">This link is invalid or has expired. Please contact your contractor for a new link.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { key: "orders" as const, label: "📋 My Orders", count: data.orders.length },
    { key: "certs" as const, label: "📄 My Certificates", count: data.certs.length },
    { key: "payments" as const, label: "💷 My Payments", count: 0 },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#1A1A2E] text-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center text-lg font-bold">B</div>
            <div>
              <h1 className="font-bold text-lg">BuildFlow</h1>
              <p className="text-xs text-gray-300">{data.company.name}</p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-300">Welcome back,</p>
            <h2 className="text-xl font-bold">{data.subcontractor.name}</h2>
            {data.subcontractor.trade && <p className="text-sm text-[#F97316]">{data.subcontractor.trade}</p>}
          </div>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 flex gap-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "flex-1 py-3 text-center text-sm font-medium border-b-2 transition-colors",
                tab === t.key ? "border-[#F97316] text-[#F97316]" : "border-transparent text-gray-500"
              )}
            >
              {t.label}
              {t.count > 0 && <span className="ml-1 text-xs bg-gray-100 rounded-full px-1.5 py-0.5">{t.count}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {tab === "orders" && (
          <>
            {data.orders.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <div className="text-4xl mb-3">📋</div>
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              data.orders.map((order) => {
                const os = ORDER_STATUS[order.status] || ORDER_STATUS.DRAFT
                const canAccept = order.status === "ISSUED"
                return (
                  <div key={order.id} className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-mono text-xs text-gray-400">{order.job.reference}</span>
                        <h3 className="font-semibold text-[#1A1A2E]">{order.job.title}</h3>
                      </div>
                      <span className={cn("text-xs font-medium rounded-full px-2.5 py-1", os.color)}>{os.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 mb-3">
                      {order.trade && <span>🔧 {order.trade}</span>}
                      {order.value && <span className="font-mono">💷 {formatCurrency(order.value)}</span>}
                      {order.orderDate && <span>📅 {formatDate(order.orderDate)}</span>}
                    </div>
                    {order.scopeDescription && <p className="text-sm text-gray-600 mb-3">{order.scopeDescription}</p>}
                    {canAccept && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleOrder(order.id, "ACCEPTED")}
                          disabled={actionLoading === order.id}
                          className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold text-sm hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          ✅ Accept Order
                        </button>
                        <button
                          onClick={() => handleOrder(order.id, "DISPUTED")}
                          disabled={actionLoading === order.id}
                          className="flex-1 bg-red-50 text-red-600 border border-red-200 py-3 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          ❌ Decline
                        </button>
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </>
        )}

        {tab === "certs" && (
          <>
            <button
              onClick={() => setAddingCert(true)}
              className="w-full bg-[#F97316] text-white py-3 rounded-xl font-semibold text-sm hover:bg-[#e8660d] transition-colors"
            >
              ➕ Add New Certificate
            </button>

            {addingCert && (
              <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
                <select
                  value={certForm.type}
                  onChange={(e) => setCertForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full h-12 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                >
                  <option value="">Select certificate type...</option>
                  {CERT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <input
                  placeholder="Reference number"
                  value={certForm.reference}
                  onChange={(e) => setCertForm((f) => ({ ...f, reference: e.target.value }))}
                  className="w-full h-12 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                />
                <input
                  type="date"
                  value={certForm.expiry_date}
                  onChange={(e) => setCertForm((f) => ({ ...f, expiry_date: e.target.value }))}
                  className="w-full h-12 rounded-lg border border-gray-300 bg-white px-3 text-sm"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setAddingCert(false)}
                    className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-lg font-semibold text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCert}
                    disabled={savingCert}
                    className="flex-1 bg-[#1A1A2E] text-white py-3 rounded-lg font-semibold text-sm disabled:opacity-50"
                  >
                    {savingCert ? "Saving..." : "Save Certificate"}
                  </button>
                </div>
              </div>
            )}

            {data.certs.length === 0 ? (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <div className="text-4xl mb-3">📄</div>
                <p className="text-gray-500">No certificates on file</p>
              </div>
            ) : (
              data.certs.map((cert) => {
                const now = new Date()
                const expiry = cert.expiryDate ? new Date(cert.expiryDate) : null
                const isExpired = expiry && expiry < now
                const isExpiring = expiry && !isExpired && expiry <= new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
                return (
                  <div key={cert.id} className="bg-white rounded-xl shadow-sm p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-[#1A1A2E]">{cert.type}</h3>
                        <div className="text-sm text-gray-500 mt-0.5">
                          {cert.reference && <span>Ref: {cert.reference} · </span>}
                          <span>Expires: {formatDate(cert.expiryDate)}</span>
                        </div>
                      </div>
                      <span className={cn(
                        "text-xs font-medium rounded-full px-2.5 py-1",
                        isExpired ? "bg-red-100 text-red-700" : isExpiring ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                      )}>
                        {isExpired ? "Expired" : isExpiring ? "Expiring" : "Valid"}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </>
        )}

        {tab === "payments" && (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="text-5xl mb-4">💷</div>
            <h3 className="text-lg font-semibold text-[#1A1A2E] mb-2">Payments</h3>
            <p className="text-gray-500">Payment tracking will be available soon.</p>
            <p className="text-xs text-gray-400 mt-2">Coming in CW5</p>
          </div>
        )}
      </div>
    </div>
  )
}
