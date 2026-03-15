"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, User, ShieldCheck, Clock, Plus, Trash2,
  Loader2, AlertTriangle, XCircle, Mail, Phone, Edit2, Save, X
} from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "profile" | "certifications" | "timesheets"

const ROLE_LABELS: Record<string, string> = {
  DIRECTOR: "Director",
  ESTIMATOR: "Estimator",
  PROJECT_MANAGER: "Project Manager",
  SITE_MANAGER: "Site Manager",
  OFFICE_ADMIN: "Office Admin",
  SUBCONTRACTOR: "Subcontractor",
  CLIENT: "Client",
}

const CERT_TYPES = [
  "CSCS", "First Aid", "PASMA", "IPAF", "Asbestos Awareness",
  "Manual Handling", "Abrasive Wheels", "Confined Spaces",
  "SMSTS", "SSSTS", "Fire Marshal", "Other",
]

interface UserData {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  cscsNumber: string | null
  cscsExpiry: string | null
  avatar: string | null
  createdAt: string
  timesheets: {
    id: string
    weekStart: string
    status: string
    entries: { hoursNormal: string; hoursOvertime: string }[]
  }[]
}

interface Cert {
  id: string
  type: string
  reference: string
  expiryDate: string | null
  createdAt: string
}

function getCertStatus(expiryDate: string | null): { label: string; colour: string } {
  if (!expiryDate) return { label: "No Expiry", colour: "bg-gray-100 text-gray-600" }
  const exp = new Date(expiryDate)
  const now = new Date()
  const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
  if (exp < now) return { label: "Expired", colour: "bg-red-100 text-red-800" }
  if (exp <= thirtyDays) return { label: "Expiring", colour: "bg-amber-100 text-amber-800" }
  return { label: "Valid", colour: "bg-green-100 text-green-800" }
}

function formatDate(d: string | null): string {
  if (!d) return "—"
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "profile", label: "Profile", icon: User },
  { key: "certifications", label: "Certifications", icon: ShieldCheck },
  { key: "timesheets", label: "Timesheets", icon: Clock },
]

export default function TeamMemberDetailPage() {
  const params = useParams()
  const userId = params.id as string
  const [user, setUser] = useState<UserData | null>(null)
  const [certs, setCerts] = useState<Cert[]>([])
  const [tab, setTab] = useState<Tab>("profile")
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", cscsNumber: "", cscsExpiry: "" })
  const [saving, setSaving] = useState(false)

  // Add cert form
  const [showCertForm, setShowCertForm] = useState(false)
  const [certForm, setCertForm] = useState({ type: "CSCS", reference: "", expiryDate: "" })
  const [savingCert, setSavingCert] = useState(false)

  const fetchUser = useCallback(async () => {
    const res = await fetch(`/api/team/${userId}`)
    if (res.ok) {
      const data = await res.json()
      setUser(data.user)
      setCerts(data.certs)
    }
    setLoading(false)
  }, [userId])

  useEffect(() => { fetchUser() }, [fetchUser])

  const startEditing = () => {
    if (!user) return
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      cscsNumber: user.cscsNumber || "",
      cscsExpiry: user.cscsExpiry ? user.cscsExpiry.split("T")[0] : "",
    })
    setEditing(true)
  }

  const saveProfile = async () => {
    setSaving(true)
    const res = await fetch(`/api/team/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone || null,
        cscsNumber: editForm.cscsNumber || null,
        cscsExpiry: editForm.cscsExpiry || null,
      }),
    })
    if (res.ok) {
      setEditing(false)
      fetchUser()
    }
    setSaving(false)
  }

  const addCert = async () => {
    if (!certForm.type) return
    setSavingCert(true)
    const res = await fetch(`/api/team/${userId}/certs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: certForm.type,
        reference: certForm.reference,
        expiryDate: certForm.expiryDate || null,
      }),
    })
    if (res.ok) {
      setCertForm({ type: "CSCS", reference: "", expiryDate: "" })
      setShowCertForm(false)
      fetchUser()
    }
    setSavingCert(false)
  }

  const deleteCert = async (certId: string) => {
    await fetch(`/api/team/${userId}/certs/${certId}`, { method: "DELETE" })
    fetchUser()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#F97316]" /></div>
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-[#1A1A2E]">Team member not found</h2>
        <Link href="/dashboard/team"><Button variant="link" className="mt-4">← Back to Team</Button></Link>
      </div>
    )
  }

  const cscsStatus = getCertStatus(user.cscsExpiry)
  const getInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  // Timesheet calculations
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay() + 1)
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const hoursThisWeek = user.timesheets
    .filter((ts) => new Date(ts.weekStart) >= startOfWeek)
    .reduce((sum, ts) => sum + ts.entries.reduce((s, e) => s + Number(e.hoursNormal) + Number(e.hoursOvertime), 0), 0)

  const hoursThisMonth = user.timesheets
    .filter((ts) => new Date(ts.weekStart) >= startOfMonth)
    .reduce((sum, ts) => sum + ts.entries.reduce((s, e) => s + Number(e.hoursNormal) + Number(e.hoursOvertime), 0), 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Link href="/dashboard/team">
          <Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div className="flex items-center gap-3 flex-1">
          <div className="w-14 h-14 rounded-full bg-[#F97316]/20 flex items-center justify-center text-lg font-bold text-[#F97316]">
            {getInitials(user.name)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#1A1A2E]">{user.name}</h2>
            <Badge className={cn(
              user.role === "DIRECTOR" ? "bg-purple-100 text-purple-800" :
              user.role === "PROJECT_MANAGER" ? "bg-indigo-100 text-indigo-800" :
              user.role === "SITE_MANAGER" ? "bg-amber-100 text-amber-800" :
              user.role === "ESTIMATOR" ? "bg-blue-100 text-blue-800" :
              "bg-gray-100 text-gray-800",
              "border-0 text-xs"
            )}>
              {ROLE_LABELS[user.role] || user.role}
            </Badge>
          </div>
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
                tab === t.key
                  ? "border-[#F97316] text-[#F97316]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.key === "certifications" && <span className="text-xs bg-gray-100 rounded-full px-1.5">{certs.length}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {tab === "profile" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Personal Details</CardTitle>
              {!editing ? (
                <Button variant="ghost" size="sm" onClick={startEditing} className="gap-1 text-xs">
                  <Edit2 className="w-3 h-3" /> Edit
                </Button>
              ) : (
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(false)} className="gap-1 text-xs">
                    <X className="w-3 h-3" /> Cancel
                  </Button>
                  <Button size="sm" onClick={saveProfile} disabled={saving} className="gap-1 text-xs">
                    {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />} Save
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-3">
              {editing ? (
                <>
                  <div><label className="text-xs text-gray-500">Name</label><Input value={editForm.name} onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500">Email</label><Input value={editForm.email} onChange={(e) => setEditForm((f) => ({ ...f, email: e.target.value }))} /></div>
                  <div><label className="text-xs text-gray-500">Phone</label><Input value={editForm.phone} onChange={(e) => setEditForm((f) => ({ ...f, phone: e.target.value }))} /></div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /><span className="text-sm">{user.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /><span className="text-sm">{user.phone || "—"}</span></div>
                  <div className="flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /><span className="text-sm">{ROLE_LABELS[user.role]}</span></div>
                  <div className="text-xs text-gray-400 pt-2">Joined: {formatDate(user.createdAt)}</div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">CSCS Card</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className={cn("flex items-center gap-2 px-3 py-2 rounded-lg", cscsStatus.colour)}>
                {user.cscsExpiry && new Date(user.cscsExpiry) < new Date() ? (
                  <XCircle className="w-4 h-4" />
                ) : user.cscsExpiry && new Date(user.cscsExpiry) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span className="font-medium text-sm">{user.cscsNumber ? cscsStatus.label : "No CSCS"}</span>
              </div>
              {editing ? (
                <>
                  <div><label className="text-xs text-gray-500">CSCS Number</label><Input value={editForm.cscsNumber} onChange={(e) => setEditForm((f) => ({ ...f, cscsNumber: e.target.value }))} placeholder="CSCS number" /></div>
                  <div><label className="text-xs text-gray-500">CSCS Expiry</label><Input type="date" value={editForm.cscsExpiry} onChange={(e) => setEditForm((f) => ({ ...f, cscsExpiry: e.target.value }))} /></div>
                </>
              ) : (
                <>
                  <div className="text-sm"><span className="text-gray-500">Number:</span> <span className="font-mono">{user.cscsNumber || "—"}</span></div>
                  <div className="text-sm"><span className="text-gray-500">Expiry:</span> {formatDate(user.cscsExpiry)}</div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Certifications Tab */}
      {tab === "certifications" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{certs.length} certification{certs.length !== 1 ? "s" : ""}</p>
            <Button size="sm" onClick={() => setShowCertForm(true)} className="gap-1">
              <Plus className="w-4 h-4" /> Add Certification
            </Button>
          </div>

          {showCertForm && (
            <Card>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-sm text-[#1A1A2E]">Add Certification</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <select
                    value={certForm.type}
                    onChange={(e) => setCertForm((f) => ({ ...f, type: e.target.value }))}
                    className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                  >
                    {CERT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <Input placeholder="Reference" value={certForm.reference} onChange={(e) => setCertForm((f) => ({ ...f, reference: e.target.value }))} />
                  <Input type="date" value={certForm.expiryDate} onChange={(e) => setCertForm((f) => ({ ...f, expiryDate: e.target.value }))} />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setShowCertForm(false)}>Cancel</Button>
                  <Button size="sm" onClick={addCert} disabled={savingCert}>
                    {savingCert && <Loader2 className="w-3 h-3 animate-spin" />} Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {certs.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-gray-400">No certifications recorded. Add certifications to track expiry dates.</CardContent></Card>
          ) : (
            <div className="space-y-2">
              {certs.map((cert) => {
                const status = getCertStatus(cert.expiryDate)
                return (
                  <Card key={cert.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                          <ShieldCheck className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[#1A1A2E]">{cert.type}</p>
                          <div className="flex gap-3 text-xs text-gray-400 mt-0.5">
                            {cert.reference && <span className="font-mono">{cert.reference}</span>}
                            <span>Expires: {formatDate(cert.expiryDate)}</span>
                          </div>
                        </div>
                        <Badge className={cn(status.colour, "border-0 text-[10px]")}>{status.label}</Badge>
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
      )}

      {/* Timesheets Tab */}
      {tab === "timesheets" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Hours This Week</p>
                <p className="text-2xl font-bold font-mono text-[#1A1A2E] mt-1">{hoursThisWeek.toFixed(1)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Hours This Month</p>
                <p className="text-2xl font-bold font-mono text-[#1A1A2E] mt-1">{hoursThisMonth.toFixed(1)}</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Link href="/dashboard/team/timesheets">
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <Clock className="w-3 h-3" /> View Full Timesheets
              </Button>
            </Link>
          </div>

          {user.timesheets.length === 0 ? (
            <Card><CardContent className="p-8 text-center text-gray-400">No timesheets recorded yet.</CardContent></Card>
          ) : (
            <div className="space-y-2">
              {user.timesheets.map((ts) => {
                const totalHours = ts.entries.reduce((s, e) => s + Number(e.hoursNormal) + Number(e.hoursOvertime), 0)
                const statusColour = ts.status === "APPROVED" ? "bg-green-100 text-green-800" :
                  ts.status === "SUBMITTED" ? "bg-blue-100 text-blue-800" :
                  ts.status === "REJECTED" ? "bg-red-100 text-red-800" :
                  "bg-gray-100 text-gray-600"
                return (
                  <Card key={ts.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-[#1A1A2E]">Week of {formatDate(ts.weekStart)}</p>
                          <p className="text-xs text-gray-400 font-mono">{totalHours.toFixed(1)} hours</p>
                        </div>
                        <Badge className={cn(statusColour, "border-0 text-[10px]")}>{ts.status}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
