"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, AlertTriangle } from "lucide-react"

interface IncidentData {
  id: string; date: string; severity: string; description: string; status: string
  investigationNotes: string | null; correctiveActions: string | null
  photos: Record<string, string> | null
  job: { id: string; reference: string; title: string }
  user: { id: string; name: string }
}

const severityColour: Record<string, string> = {
  NEAR_MISS: "bg-blue-100 text-blue-800",
  MINOR: "bg-yellow-100 text-yellow-800",
  MAJOR: "bg-orange-100 text-orange-800",
  RIDDOR: "bg-red-100 text-red-800 border border-red-300",
}
const severityLabel: Record<string, string> = { NEAR_MISS: "Near Miss", MINOR: "Minor", MAJOR: "Major", RIDDOR: "RIDDOR" }

export default function IncidentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [incident, setIncident] = useState<IncidentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetch(`/api/incidents/${id}`)
      .then((r) => r.json())
      .then((d) => setIncident(d.incident))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  const updateStatus = async (newStatus: string) => {
    setUpdating(true)
    await fetch(`/api/incidents/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })
    setUpdating(false)
    window.location.reload()
  }

  if (loading) return <div className="p-12 text-center text-gray-400">Loading...</div>
  if (!incident) return <div className="p-12 text-center text-gray-400">Incident not found</div>

  const isRiddor = incident.severity === "RIDDOR"
  const photos = incident.photos || {}

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/safety/incidents">
          <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#1A1A2E]">Incident Report</h2>
            <Badge className={severityColour[incident.severity]}>{severityLabel[incident.severity]}</Badge>
            <Badge variant={incident.status === "CLOSED" ? "success" : incident.status === "INVESTIGATING" ? "warning" : "secondary"}>
              {incident.status === "INVESTIGATING" ? "Investigating" : incident.status === "CLOSED" ? "Closed" : "Open"}
            </Badge>
          </div>
        </div>
      </div>

      {isRiddor && (
        <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">RIDDOR Reportable Incident</p>
            <p className="text-sm text-red-600">This incident is reportable under RIDDOR regulations.</p>
            {photos.riddorRef && <p className="text-sm text-red-700 mt-1">Reference: <strong>{photos.riddorRef}</strong></p>}
            {photos.riddorDate && <p className="text-sm text-red-700">Reported to HSE: {new Date(photos.riddorDate).toLocaleDateString("en-GB")}</p>}
          </div>
        </div>
      )}

      <Card>
        <CardContent className="p-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Date & Time</span>
              <p className="text-sm font-medium mt-1">{new Date(incident.date).toLocaleDateString("en-GB")} {new Date(incident.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Job</span>
              <p className="text-sm font-medium mt-1">{incident.job.reference} — {incident.job.title}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Reported By</span>
              <p className="text-sm font-medium mt-1">{incident.user.name}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Root Cause</span>
              <p className="text-sm font-medium mt-1">{photos.rootCause || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <span className="text-xs text-gray-500 uppercase tracking-wider">Description</span>
            <p className="text-sm mt-1 whitespace-pre-wrap">{incident.description}</p>
          </div>
          {photos.involved && (
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Who was Involved</span>
              <p className="text-sm mt-1">{photos.involved}</p>
            </div>
          )}
          {photos.witnesses && (
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wider">Witnesses</span>
              <p className="text-sm mt-1">{photos.witnesses}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {(incident.investigationNotes || incident.correctiveActions) && (
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="text-lg font-semibold text-[#1A1A2E]">Investigation & Actions</h3>
            {incident.investigationNotes && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Investigation Notes</span>
                <p className="text-sm mt-1 whitespace-pre-wrap">{incident.investigationNotes}</p>
              </div>
            )}
            {incident.correctiveActions && (
              <div>
                <span className="text-xs text-gray-500 uppercase tracking-wider">Corrective Actions</span>
                <p className="text-sm mt-1 whitespace-pre-wrap">{incident.correctiveActions}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {incident.status !== "CLOSED" && (
        <div className="flex gap-3 justify-end">
          {incident.status === "OPEN" && (
            <Button onClick={() => updateStatus("INVESTIGATING")} disabled={updating} className="bg-amber-600 hover:bg-amber-700 text-white">
              Start Investigation
            </Button>
          )}
          <Button onClick={() => updateStatus("CLOSED")} disabled={updating} className="bg-green-600 hover:bg-green-700 text-white">
            Close Incident
          </Button>
        </div>
      )}
    </div>
  )
}
