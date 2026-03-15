"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Users, Search, Plus, Phone, Mail, ShieldCheck,
  AlertTriangle, XCircle, Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TeamMember {
  id: string
  name: string
  email: string
  phone: string | null
  role: string
  cscsNumber: string | null
  cscsExpiry: string | null
  cscsStatus: "valid" | "expiring" | "expired" | "none"
  certsExpiring: number
  avatar: string | null
  createdAt: string
}

interface Stats {
  totalStaff: number
  cscsValid: number
  certsExpiringThisMonth: number
}

const ROLE_LABELS: Record<string, string> = {
  DIRECTOR: "Director",
  ESTIMATOR: "Estimator",
  PROJECT_MANAGER: "Project Manager",
  SITE_MANAGER: "Site Manager",
  OFFICE_ADMIN: "Office Admin",
  SUBCONTRACTOR: "Subcontractor",
  CLIENT: "Client",
}

const ROLE_COLOURS: Record<string, string> = {
  DIRECTOR: "bg-purple-100 text-purple-800",
  ESTIMATOR: "bg-blue-100 text-blue-800",
  PROJECT_MANAGER: "bg-indigo-100 text-indigo-800",
  SITE_MANAGER: "bg-amber-100 text-amber-800",
  OFFICE_ADMIN: "bg-pink-100 text-pink-800",
  SUBCONTRACTOR: "bg-gray-100 text-gray-800",
  CLIENT: "bg-teal-100 text-teal-800",
}

const CSCS_BADGE: Record<string, { bg: string; text: string; label: string; icon: React.ElementType }> = {
  valid: { bg: "bg-green-100", text: "text-green-800", label: "CSCS Valid", icon: ShieldCheck },
  expiring: { bg: "bg-amber-100", text: "text-amber-800", label: "CSCS Expiring", icon: AlertTriangle },
  expired: { bg: "bg-red-100", text: "text-red-800", label: "CSCS Expired", icon: XCircle },
  none: { bg: "bg-gray-100", text: "text-gray-500", label: "No CSCS", icon: ShieldCheck },
}

const ROLES = ["", "DIRECTOR", "ESTIMATOR", "PROJECT_MANAGER", "SITE_MANAGER", "OFFICE_ADMIN"]

export default function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [stats, setStats] = useState<Stats>({ totalStaff: 0, cscsValid: 0, certsExpiringThisMonth: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [addForm, setAddForm] = useState({ name: "", email: "", phone: "", role: "SITE_MANAGER" })

  const fetchTeam = async () => {
    const params = new URLSearchParams()
    if (roleFilter) params.set("role", roleFilter)
    if (search) params.set("search", search)
    const res = await fetch(`/api/team?${params}`)
    if (res.ok) {
      const data = await res.json()
      setMembers(data.users)
      setStats(data.stats)
    }
    setLoading(false)
  }

  useEffect(() => { fetchTeam() }, [roleFilter, search])

  const addMember = async () => {
    if (!addForm.name || !addForm.email) return
    setSaving(true)
    const res = await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(addForm),
    })
    if (res.ok) {
      setAddForm({ name: "", email: "", phone: "", role: "SITE_MANAGER" })
      setShowAddForm(false)
      fetchTeam()
    }
    setSaving(false)
  }

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#F97316]" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Team</h2>
          <p className="text-gray-500 text-sm">Manage your team members and certifications</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="gap-1">
          <Plus className="w-4 h-4" /> Add Team Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{stats.totalStaff}</p>
              <p className="text-xs text-gray-500">Total Staff</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{stats.cscsValid}</p>
              <p className="text-xs text-gray-500">CSCS Valid</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1A1A2E]">{stats.certsExpiringThisMonth}</p>
              <p className="text-xs text-gray-500">Certs Expiring This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
        >
          <option value="">All Roles</option>
          {ROLES.filter(Boolean).map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>

      {/* Add Member Form */}
      {showAddForm && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-[#1A1A2E]">New Team Member</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Full name" value={addForm.name} onChange={(e) => setAddForm((f) => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Email" type="email" value={addForm.email} onChange={(e) => setAddForm((f) => ({ ...f, email: e.target.value }))} />
              <Input placeholder="Phone" value={addForm.phone} onChange={(e) => setAddForm((f) => ({ ...f, phone: e.target.value }))} />
              <select
                value={addForm.role}
                onChange={(e) => setAddForm((f) => ({ ...f, role: e.target.value }))}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              >
                {ROLES.filter(Boolean).map((r) => (
                  <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button size="sm" onClick={addMember} disabled={saving}>
                {saving && <Loader2 className="w-3 h-3 animate-spin" />} Add Member
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Team Grid */}
      {members.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No team members found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {members.map((m) => {
            const cscs = CSCS_BADGE[m.cscsStatus]
            const CscsIcon = cscs.icon
            return (
              <Link key={m.id} href={`/dashboard/team/${m.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#F97316]/20 flex items-center justify-center text-sm font-bold text-[#F97316] shrink-0">
                        {getInitials(m.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#1A1A2E] truncate">{m.name}</p>
                        <Badge className={cn(ROLE_COLOURS[m.role], "border-0 text-[10px] mt-1")}>
                          {ROLE_LABELS[m.role] || m.role}
                        </Badge>
                      </div>
                    </div>

                    {/* CSCS Badge */}
                    <div className={cn("flex items-center gap-1.5 mt-3 px-2 py-1.5 rounded-lg", cscs.bg)}>
                      <CscsIcon className={cn("w-3.5 h-3.5", cscs.text)} />
                      <span className={cn("text-xs font-medium", cscs.text)}>{cscs.label}</span>
                    </div>

                    {/* Contact */}
                    <div className="mt-3 space-y-1">
                      {m.phone && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Phone className="w-3 h-3" />
                          <span className="truncate">{m.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Mail className="w-3 h-3" />
                        <span className="truncate">{m.email}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
