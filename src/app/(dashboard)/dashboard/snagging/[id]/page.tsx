"use client"

import { useEffect, useState, use } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Plus, ChevronDown, ChevronUp } from "lucide-react"

interface SnagItem {
  id: string; description: string; location: string | null; assignedTo: string | null
  priority: string; status: string; dueDate: string | null; completedDate: string | null
  photos: Record<string, string> | null; createdAt: string
}

interface SnagListData {
  id: string; area: string; status: string
  job: { id: string; reference: string; title: string }
  items: SnagItem[]
}

const priorityBadge: Record<string, string> = {
  HIGH: "bg-red-100 text-red-800",
  MEDIUM: "bg-amber-100 text-amber-800",
  LOW: "bg-green-100 text-green-800",
}

const statusBadge: Record<string, { class: string; label: string }> = {
  OPEN: { class: "bg-red-100 text-red-800", label: "Open" },
  IN_PROGRESS: { class: "bg-amber-100 text-amber-800", label: "In Progress" },
  RESOLVED: { class: "bg-blue-100 text-blue-800", label: "Resolved" },
  VERIFIED: { class: "bg-green-100 text-green-800", label: "Verified" },
}

const CATEGORIES = ["Incomplete Work", "Defective Work", "Damage", "Cleaning", "Other"]
const STATUS_FLOW: Record<string, string[]> = {
  OPEN: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: ["VERIFIED", "IN_PROGRESS"],
  VERIFIED: [],
}

export default function SnagListDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [snagList, setSnagList] = useState<SnagListData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [saving, setSaving] = useState(false)

  // Add form
  const [newDesc, setNewDesc] = useState("")
  const [newLocation, setNewLocation] = useState("")
  const [newPriority, setNewPriority] = useState("MEDIUM")
  const [newAssigned, setNewAssigned] = useState("")
  const [newDue, setNewDue] = useState("")
  const [newCategory, setNewCategory] = useState("Incomplete Work")

  const fetchData = () => {
    fetch(`/api/snagging/${id}`)
      .then((r) => r.json())
      .then((d) => setSnagList(d.snagList))
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [id])

  const handleAddItem = async () => {
    if (!newDesc) return alert("Description is required")
    setSaving(true)
    try {
      await fetch(`/api/snagging/${id}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: newDesc, location: newLocation || undefined,
          priority: newPriority, assignedTo: newAssigned || undefined,
          dueDate: newDue || undefined,
          photos: newCategory ? { category: newCategory } : undefined,
        }),
      })
      setNewDesc(""); setNewLocation(""); setNewAssigned(""); setNewDue("")
      setShowAddForm(false)
      fetchData()
    } catch { alert("Failed to add item") }
    finally { setSaving(false) }
  }

  const changeItemStatus = async (itemId: string, newStatus: string) => {
    await fetch(`/api/snagging/${id}/items/${itemId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    fetchData()
  }

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>
  if (!snagList) return <div className="p-12 text-center text-gray-400">Snag list not found</div>

  const items = snagList.items || []
  const resolved = items.filter((i) => i.status === "RESOLVED" || i.status === "VERIFIED").length
  const pct = items.length > 0 ? Math.round((resolved / items.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/snagging">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">{snagList.area}</h2>
          <p className="text-gray-500 text-sm">{snagList.job.reference} — {snagList.job.title}</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
          <Plus className="w-4 h-4 mr-2" />Add Snag
        </Button>
      </div>

      {/* Progress Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-bold text-[#1A1A2E]">{resolved} / {items.length} resolved ({pct}%)</span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-4 mt-3 text-xs text-gray-500">
            <span>🔴 Open: {items.filter((i) => i.status === "OPEN").length}</span>
            <span>🟡 In Progress: {items.filter((i) => i.status === "IN_PROGRESS").length}</span>
            <span>🔵 Resolved: {items.filter((i) => i.status === "RESOLVED").length}</span>
            <span>🟢 Verified: {items.filter((i) => i.status === "VERIFIED").length}</span>
          </div>
        </CardContent>
      </Card>

      {/* Add Snag Form */}
      {showAddForm && (
        <Card className="border-[#F97316]">
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Add Snag Item</h3>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
              <textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)}
                className="w-full rounded-lg border border-gray-200 p-3 text-sm min-h-[80px]" placeholder="Describe the snag..." />
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                <Input value={newLocation} onChange={(e) => setNewLocation(e.target.value)} placeholder="e.g. Room 101" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Priority</label>
                <select value={newPriority} onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm">
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Category</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Assigned To</label>
                <Input value={newAssigned} onChange={(e) => setNewAssigned(e.target.value)} placeholder="Name" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Due Date</label>
                <Input type="date" value={newDue} onChange={(e) => setNewDue(e.target.value)} />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button onClick={handleAddItem} disabled={saving} className="bg-[#F97316] hover:bg-[#EA580C] text-white">
                {saving ? "Adding..." : "Add Item"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Snag Items */}
      <div className="space-y-3">
        {items.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-gray-400">
              No snag items yet. Click "Add Snag" to get started.
            </CardContent>
          </Card>
        ) : (
          items.map((item) => {
            const expanded = expandedItem === item.id
            const sBadge = statusBadge[item.status] || statusBadge.OPEN
            const nextStatuses = STATUS_FLOW[item.status] || []
            const isOverdue = item.dueDate && new Date(item.dueDate) < new Date() && item.status !== "RESOLVED" && item.status !== "VERIFIED"
            const category = (item.photos as Record<string, string> | null)?.category

            return (
              <Card key={item.id} className={isOverdue ? "border-red-300" : ""}>
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedItem(expanded ? null : item.id)}
                    className="w-full p-4 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm text-[#1A1A2E] truncate">{item.description}</span>
                        <Badge className={priorityBadge[item.priority]}>{item.priority}</Badge>
                        <Badge className={sBadge.class}>{sBadge.label}</Badge>
                        {isOverdue && <Badge className="bg-red-500 text-white">Overdue</Badge>}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                        {item.location && <span>📍 {item.location}</span>}
                        {item.assignedTo && <span>👤 {item.assignedTo}</span>}
                        {item.dueDate && <span>📅 {new Date(item.dueDate).toLocaleDateString("en-GB")}</span>}
                      </div>
                    </div>
                    {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                  </button>
                  {expanded && (
                    <div className="px-4 pb-4 pt-0 border-t space-y-3">
                      <div className="grid sm:grid-cols-2 gap-3 text-sm pt-3">
                        <div><span className="text-gray-500">Category:</span> {category || "—"}</div>
                        <div><span className="text-gray-500">Created:</span> {new Date(item.createdAt).toLocaleDateString("en-GB")}</div>
                        {item.completedDate && <div><span className="text-gray-500">Completed:</span> {new Date(item.completedDate).toLocaleDateString("en-GB")}</div>}
                      </div>
                      {nextStatuses.length > 0 && (
                        <div className="flex gap-2 pt-2">
                          {nextStatuses.map((ns) => {
                            const nsBadge = statusBadge[ns]
                            return (
                              <Button key={ns} size="sm" onClick={() => changeItemStatus(item.id, ns)}
                                className={`${ns === "VERIFIED" ? "bg-green-600 hover:bg-green-700" : ns === "RESOLVED" ? "bg-blue-600 hover:bg-blue-700" : "bg-amber-600 hover:bg-amber-700"} text-white`}>
                                Mark as {nsBadge.label}
                              </Button>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
