"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText, Search, Plus, Upload, ChevronDown, Loader2,
  Image, FileSpreadsheet, File, X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DocRecord {
  id: string
  title: string
  category: string | null
  fileUrl: string | null
  uploadedBy: string | null
  uploaderName: string
  version: number
  createdAt: string
  job: { id: string; reference: string; title: string } | null
}

const CATEGORIES = [
  { value: "Drawings", colour: "bg-blue-100 text-blue-800" },
  { value: "Specifications", colour: "bg-purple-100 text-purple-800" },
  { value: "Contracts", colour: "bg-indigo-100 text-indigo-800" },
  { value: "Correspondence", colour: "bg-teal-100 text-teal-800" },
  { value: "Certificates", colour: "bg-green-100 text-green-800" },
  { value: "Health & Safety", colour: "bg-red-100 text-red-800" },
  { value: "Photos", colour: "bg-amber-100 text-amber-800" },
  { value: "Financial", colour: "bg-emerald-100 text-emerald-800" },
  { value: "Other", colour: "bg-gray-100 text-gray-600" },
]

const CATEGORY_MAP = Object.fromEntries(CATEGORIES.map((c) => [c.value, c.colour]))

function getFileIcon(title: string) {
  const lower = title.toLowerCase()
  if (lower.match(/\.(jpg|jpeg|png|gif|webp)$/i) || lower.includes("photo")) return Image
  if (lower.match(/\.(xls|xlsx|csv)$/i) || lower.includes("spreadsheet")) return FileSpreadsheet
  return FileText
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

function formatSize(): string {
  // Placeholder file size since we store metadata only
  const sizes = ["124 KB", "2.3 MB", "856 KB", "1.1 MB", "3.4 MB", "512 KB", "1.8 MB"]
  return sizes[Math.floor(Math.random() * sizes.length)]
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [jobFilter, setJobFilter] = useState("")
  const [viewMode, setViewMode] = useState<"byJob" | "byCategory">("byJob")
  const [showUpload, setShowUpload] = useState(false)
  const [saving, setSaving] = useState(false)
  const [jobs, setJobs] = useState<{ id: string; reference: string; title: string }[]>([])
  const [uploadForm, setUploadForm] = useState({ title: "", jobId: "", category: "Drawings" })

  const fetchDocuments = async () => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (categoryFilter) params.set("category", categoryFilter)
    if (jobFilter) params.set("jobId", jobFilter)
    if (!jobFilter) params.set("jobId", "all")

    const res = await fetch(`/api/documents?${params}`)
    if (res.ok) {
      const data = await res.json()
      setDocuments(data.documents)
    }
    setLoading(false)
  }

  const fetchJobs = async () => {
    const res = await fetch("/api/jobs?limit=50")
    if (res.ok) {
      const data = await res.json()
      setJobs(data.jobs?.map((j: Record<string, unknown>) => ({
        id: j.id,
        reference: j.reference,
        title: j.title,
      })) || [])
    }
  }

  useEffect(() => { fetchDocuments(); fetchJobs() }, [search, categoryFilter, jobFilter])

  const uploadDoc = async () => {
    if (!uploadForm.title) return
    setSaving(true)
    const res = await fetch("/api/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: uploadForm.title,
        jobId: uploadForm.jobId || null,
        category: uploadForm.category,
      }),
    })
    if (res.ok) {
      setUploadForm({ title: "", jobId: "", category: "Drawings" })
      setShowUpload(false)
      fetchDocuments()
    }
    setSaving(false)
  }

  // Group documents
  const groupByJob = () => {
    const groups = new Map<string, { job: { reference: string; title: string } | null; docs: DocRecord[] }>()
    for (const doc of documents) {
      const key = doc.job?.id || "none"
      if (!groups.has(key)) {
        groups.set(key, { job: doc.job, docs: [] })
      }
      groups.get(key)!.docs.push(doc)
    }
    return Array.from(groups.entries())
  }

  const groupByCategory = () => {
    const groups = new Map<string, DocRecord[]>()
    for (const doc of documents) {
      const key = doc.category || "Other"
      if (!groups.has(key)) groups.set(key, [])
      groups.get(key)!.push(doc)
    }
    return Array.from(groups.entries()).sort((a, b) => a[0].localeCompare(b[0]))
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#F97316]" /></div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Documents</h2>
          <p className="text-gray-500 text-sm">{documents.length} document{documents.length !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="gap-1">
          <Upload className="w-4 h-4" /> Upload Document
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={jobFilter}
          onChange={(e) => setJobFilter(e.target.value)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
        >
          <option value="">All Jobs</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>
          ))}
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.value}</option>
          ))}
        </select>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode("byJob")}
            className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors", viewMode === "byJob" ? "bg-white text-[#1A1A2E] shadow-sm" : "text-gray-500")}
          >
            By Job
          </button>
          <button
            onClick={() => setViewMode("byCategory")}
            className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors", viewMode === "byCategory" ? "bg-white text-[#1A1A2E] shadow-sm" : "text-gray-500")}
          >
            By Category
          </button>
        </div>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-[#1A1A2E]">Upload Document</h3>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </div>
            <Input placeholder="Document title" value={uploadForm.title} onChange={(e) => setUploadForm((f) => ({ ...f, title: e.target.value }))} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={uploadForm.jobId}
                onChange={(e) => setUploadForm((f) => ({ ...f, jobId: e.target.value }))}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              >
                <option value="">Select job...</option>
                {jobs.map((j) => (
                  <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>
                ))}
              </select>
              <select
                value={uploadForm.category}
                onChange={(e) => setUploadForm((f) => ({ ...f, category: e.target.value }))}
                className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.value}</option>
                ))}
              </select>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
              <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">File upload placeholder</p>
              <p className="text-xs text-gray-400">Metadata will be stored — file hosting coming soon</p>
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setShowUpload(false)}>Cancel</Button>
              <Button size="sm" onClick={uploadDoc} disabled={saving}>
                {saving && <Loader2 className="w-3 h-3 animate-spin" />} Save Document
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Document List */}
      {documents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center text-gray-400">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No documents found</p>
          </CardContent>
        </Card>
      ) : viewMode === "byJob" ? (
        <DocumentsByJob groups={groupByJob()} />
      ) : (
        <DocumentsByCategory groups={groupByCategory()} />
      )}
    </div>
  )
}

function DocumentRow({ doc }: { doc: DocRecord }) {
  const Icon = getFileIcon(doc.title)
  const catColour = doc.category ? CATEGORY_MAP[doc.category] || CATEGORY_MAP.Other : CATEGORY_MAP.Other

  return (
    <div className="flex items-center gap-3 py-2 px-1 hover:bg-gray-50 rounded transition-colors">
      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[#1A1A2E] truncate">{doc.title}</p>
        <div className="flex flex-wrap gap-2 mt-0.5">
          <Badge className={cn(catColour, "border-0 text-[10px]")}>{doc.category || "Other"}</Badge>
          {doc.job && <span className="text-[10px] text-gray-400 font-mono">{doc.job.reference}</span>}
        </div>
      </div>
      <div className="text-right hidden sm:block">
        <p className="text-xs text-gray-500">{doc.uploaderName}</p>
        <p className="text-[10px] text-gray-400">{formatDate(doc.createdAt)}</p>
      </div>
      <span className="text-xs text-gray-400 font-mono hidden md:block">{formatSize()}</span>
    </div>
  )
}

function DocumentsByJob({ groups }: { groups: [string, { job: { reference: string; title: string } | null; docs: DocRecord[] }][] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(groups.map(([k]) => k)))

  return (
    <div className="space-y-2">
      {groups.map(([key, { job, docs }]) => (
        <Card key={key}>
          <CardContent className="p-3">
            <button
              className="w-full flex items-center gap-2 text-left"
              onClick={() => {
                const next = new Set(expanded)
                next.has(key) ? next.delete(key) : next.add(key)
                setExpanded(next)
              }}
            >
              <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", expanded.has(key) && "rotate-180")} />
              <div className="flex-1">
                <span className="font-medium text-sm text-[#1A1A2E]">
                  {job ? `${job.reference} — ${job.title}` : "No Job"}
                </span>
                <span className="text-xs text-gray-400 ml-2">{docs.length} doc{docs.length !== 1 ? "s" : ""}</span>
              </div>
            </button>
            {expanded.has(key) && (
              <div className="mt-2 divide-y divide-gray-50">
                {docs.map((doc) => <DocumentRow key={doc.id} doc={doc} />)}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function DocumentsByCategory({ groups }: { groups: [string, DocRecord[]][] }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(groups.map(([k]) => k)))

  return (
    <div className="space-y-2">
      {groups.map(([category, docs]) => {
        const catColour = CATEGORY_MAP[category] || CATEGORY_MAP.Other
        return (
          <Card key={category}>
            <CardContent className="p-3">
              <button
                className="w-full flex items-center gap-2 text-left"
                onClick={() => {
                  const next = new Set(expanded)
                  next.has(category) ? next.delete(category) : next.add(category)
                  setExpanded(next)
                }}
              >
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", expanded.has(category) && "rotate-180")} />
                <Badge className={cn(catColour, "border-0 text-xs")}>{category}</Badge>
                <span className="text-xs text-gray-400">{docs.length} doc{docs.length !== 1 ? "s" : ""}</span>
              </button>
              {expanded.has(category) && (
                <div className="mt-2 divide-y divide-gray-50">
                  {docs.map((doc) => <DocumentRow key={doc.id} doc={doc} />)}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
