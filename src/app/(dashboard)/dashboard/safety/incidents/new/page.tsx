"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, AlertTriangle } from "lucide-react"

const SEVERITIES = [
  { value: "NEAR_MISS", label: "Near Miss", colour: "border-blue-400 bg-blue-50 text-blue-800", ring: "ring-blue-400" },
  { value: "MINOR", label: "Minor", colour: "border-yellow-400 bg-yellow-50 text-yellow-800", ring: "ring-yellow-400" },
  { value: "MAJOR", label: "Major", colour: "border-orange-400 bg-orange-50 text-orange-800", ring: "ring-orange-400" },
  { value: "RIDDOR", label: "RIDDOR", colour: "border-red-500 bg-red-50 text-red-800", ring: "ring-red-500" },
]

const ROOT_CAUSES = ["Human Error", "Equipment Failure", "Environmental", "Procedure Gap", "Training Gap", "Other"]

export default function NewIncidentPage() {
  const router = useRouter()
  const [jobs, setJobs] = useState<Array<{ id: string; reference: string; title: string }>>([])
  const [saving, setSaving] = useState(false)

  const [jobId, setJobId] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState(new Date().toTimeString().slice(0, 5))
  const [severity, setSeverity] = useState("NEAR_MISS")
  const [description, setDescription] = useState("")
  const [involved, setInvolved] = useState("")
  const [witnesses, setWitnesses] = useState("")
  const [immediateActions, setImmediateActions] = useState("")
  const [rootCause, setRootCause] = useState("")
  const [correctiveActions, setCorrectiveActions] = useState("")
  const [status, setStatus] = useState("OPEN")
  const [riddorRef, setRiddorRef] = useState("")
  const [riddorDate, setRiddorDate] = useState("")

  useEffect(() => {
    fetch("/api/jobs?limit=100")
      .then((r) => r.json())
      .then((d) => setJobs(d.jobs?.map((j: Record<string, string>) => ({ id: j.id, reference: j.reference, title: j.title })) || []))
      .catch(() => {})
  }, [])

  const handleSubmit = async () => {
    if (!jobId || !description) return alert("Job and description are required")
    setSaving(true)
    try {
      const photos = {
        involved, witnesses, immediateActions, rootCause,
        ...(severity === "RIDDOR" ? { riddorRef, riddorDate } : {}),
      }
      await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId, date: `${date}T${time}:00.000Z`, severity, description,
          investigationNotes: `Involved: ${involved}\nWitnesses: ${witnesses}\nRoot Cause: ${rootCause}`,
          correctiveActions: `Immediate: ${immediateActions}\nCorrective: ${correctiveActions}`,
          status, photos,
        }),
      })
      router.push("/dashboard/safety/incidents")
    } catch {
      alert("Failed to save")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/safety/incidents">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Report Incident</h2>
          <p className="text-gray-500 text-sm">Record a health & safety incident</p>
        </div>
      </div>

      {/* Date/Job */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Date *</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Time</label>
              <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Job *</label>
              <select value={jobId} onChange={(e) => setJobId(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm">
                <option value="">Select job...</option>
                {jobs.map((j) => <option key={j.id} value={j.id}>{j.reference} — {j.title}</option>)}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Severity */}
      <Card>
        <CardContent className="p-6">
          <label className="text-sm font-medium text-gray-700 mb-3 block">Severity *</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SEVERITIES.map((s) => (
              <button key={s.value} onClick={() => setSeverity(s.value)}
                className={`p-4 rounded-xl border-2 text-center font-semibold transition-all ${s.colour} ${
                  severity === s.value ? `${s.ring} ring-2 scale-105` : "opacity-60 hover:opacity-100"
                }`}>
                {s.value === "RIDDOR" && <AlertTriangle className="w-5 h-5 mx-auto mb-1" />}
                {s.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm min-h-[100px]" placeholder="Describe what happened..." />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Who was Involved</label>
              <Input value={involved} onChange={(e) => setInvolved(e.target.value)} placeholder="Names of people involved" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Witnesses</label>
              <Input value={witnesses} onChange={(e) => setWitnesses(e.target.value)} placeholder="Names of witnesses" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Immediate Actions Taken</label>
            <textarea value={immediateActions} onChange={(e) => setImmediateActions(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm min-h-[80px]" placeholder="What was done immediately..." />
          </div>
        </CardContent>
      </Card>

      {/* Investigation */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h3 className="text-lg font-semibold text-[#1A1A2E]">Investigation</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Root Cause</label>
              <select value={rootCause} onChange={(e) => setRootCause(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm">
                <option value="">Select...</option>
                {ROOT_CAUSES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Investigation Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm">
                <option value="OPEN">Open</option>
                <option value="INVESTIGATING">Under Investigation</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Corrective Actions</label>
            <textarea value={correctiveActions} onChange={(e) => setCorrectiveActions(e.target.value)}
              className="w-full rounded-lg border border-gray-200 p-3 text-sm min-h-[80px]" placeholder="Corrective actions to prevent reoccurrence..." />
          </div>
        </CardContent>
      </Card>

      {/* RIDDOR section */}
      {severity === "RIDDOR" && (
        <Card className="border-red-300 bg-red-50/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="text-lg font-semibold">RIDDOR Reporting</h3>
            </div>
            <p className="text-sm text-red-600">This incident must be reported to the HSE under RIDDOR regulations.</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-red-700 mb-1 block">RIDDOR Reference Number</label>
                <Input value={riddorRef} onChange={(e) => setRiddorRef(e.target.value)} placeholder="HSE reference number" />
              </div>
              <div>
                <label className="text-sm font-medium text-red-700 mb-1 block">Date Reported to HSE</label>
                <Input type="date" value={riddorDate} onChange={(e) => setRiddorDate(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 justify-end">
        <Link href="/dashboard/safety/incidents"><Button variant="ghost">Cancel</Button></Link>
        <Button onClick={handleSubmit} disabled={saving} className="bg-red-600 hover:bg-red-700 text-white">
          {saving ? "Submitting..." : "Submit Report"}
        </Button>
      </div>
    </div>
  )
}
