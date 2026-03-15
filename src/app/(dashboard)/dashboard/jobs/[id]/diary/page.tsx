"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Calendar, Cloud, CloudRain, CloudSnow, Sun, Wind,
  Users, Truck, UserCheck, AlertTriangle, Camera, Plus, Trash2, Upload
} from "lucide-react"

interface DiaryEntry {
  id: string
  date: string
  weather: string
  temperature: number | null
  workforceCount: number
  deliveries: string | null
  visitors: string | null
  workCompleted: string
  delays: string | null
  hsNotes: string | null
  photos: { id: string; url: string; caption: string | null }[]
  createdBy: { name: string }
  createdAt: string
}

const WEATHER_OPTIONS = [
  { value: "sunny", label: "☀️ Sunny", icon: Sun },
  { value: "cloudy", label: "☁️ Cloudy", icon: Cloud },
  { value: "rainy", label: "🌧️ Rainy", icon: CloudRain },
  { value: "snowy", label: "❄️ Snowy", icon: CloudSnow },
  { value: "windy", label: "💨 Windy", icon: Wind },
]

export default function SiteDiaryPage() {
  const params = useParams()
  const jobId = params.id as string
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    weather: "sunny",
    temperature: "",
    workforce_count: "",
    deliveries: "",
    visitors: "",
    work_completed: "",
    delays: "",
    hs_notes: "",
  })

  useEffect(() => {
    // Demo data
    setEntries([
      {
        id: "1",
        date: "2024-03-15",
        weather: "sunny",
        temperature: 12,
        workforceCount: 8,
        deliveries: "Concrete delivery - 6m³ ready-mix",
        visitors: "Building Control Inspector (09:30-10:15)",
        workCompleted: "Foundation pour completed. Ground floor slab preparation started. Rebar installation for north wall.",
        delays: null,
        hsNotes: "All PPE checks completed. New operative inducted.",
        photos: [
          { id: "1", url: "/placeholder-foundation.jpg", caption: "Foundation pour - east elevation" },
          { id: "2", url: "/placeholder-rebar.jpg", caption: "Rebar installation progress" },
        ],
        createdBy: { name: "John Smith" },
        createdAt: "2024-03-15T16:30:00Z",
      },
      {
        id: "2",
        date: "2024-03-14",
        weather: "rainy",
        temperature: 9,
        workforceCount: 5,
        deliveries: null,
        visitors: null,
        workCompleted: "Excavation backfilled. Drainage inspection pit installed.",
        delays: "Rain stopped work at 14:00. Site cleared early.",
        hsNotes: "Slip hazard from rain - extra signage deployed.",
        photos: [],
        createdBy: { name: "John Smith" },
        createdAt: "2024-03-14T15:45:00Z",
      },
    ])
    setLoading(false)
  }, [jobId])

  const submitEntry = async () => {
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      date: form.date,
      weather: form.weather,
      temperature: form.temperature ? Number(form.temperature) : null,
      workforceCount: Number(form.workforce_count),
      deliveries: form.deliveries || null,
      visitors: form.visitors || null,
      workCompleted: form.work_completed,
      delays: form.delays || null,
      hsNotes: form.hs_notes || null,
      photos: [],
      createdBy: { name: "Current User" },
      createdAt: new Date().toISOString(),
    }
    setEntries([newEntry, ...entries])
    setShowForm(false)
    setForm({
      date: new Date().toISOString().split("T")[0],
      weather: "sunny",
      temperature: "",
      workforce_count: "",
      deliveries: "",
      visitors: "",
      work_completed: "",
      delays: "",
      hs_notes: "",
    })
  }

  const getWeatherIcon = (weather: string) => {
    const opt = WEATHER_OPTIONS.find(w => w.value === weather)
    return opt ? opt.label.split(" ")[0] : "☀️"
  }

  if (loading) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/jobs/${jobId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Site Diary</h2>
          <p className="text-sm text-gray-500">Day-by-day record with photos and conditions</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" /> New Entry
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">New Diary Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Date</label>
                <Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Weather</label>
                <select
                  value={form.weather}
                  onChange={e => setForm({ ...form, weather: e.target.value })}
                  className="flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {WEATHER_OPTIONS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Temperature (°C)</label>
                <Input type="number" value={form.temperature} onChange={e => setForm({ ...form, temperature: e.target.value })} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Workforce on Site</label>
                <Input type="number" value={form.workforce_count} onChange={e => setForm({ ...form, workforce_count: e.target.value })} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Deliveries</label>
                <Input value={form.deliveries} onChange={e => setForm({ ...form, deliveries: e.target.value })} placeholder="e.g. 10 tonnes aggregate" />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Visitors</label>
              <Input value={form.visitors} onChange={e => setForm({ ...form, visitors: e.target.value })} placeholder="e.g. Architect site visit 11:00" />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Work Completed *</label>
              <textarea
                value={form.work_completed}
                onChange={e => setForm({ ...form, work_completed: e.target.value })}
                rows={3}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Describe work completed..."
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Delays / Issues</label>
              <textarea
                value={form.delays}
                onChange={e => setForm({ ...form, delays: e.target.value })}
                rows={2}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="Any delays or issues..."
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Health & Safety Notes</label>
              <textarea
                value={form.hs_notes}
                onChange={e => setForm({ ...form, hs_notes: e.target.value })}
                rows={2}
                className="flex w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
                placeholder="H&S observations..."
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={submitEntry} disabled={!form.work_completed.trim()}>Save Entry</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {entries.map(entry => (
          <Card key={entry.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className="text-center flex-shrink-0">
                  <div className="text-3xl">{getWeatherIcon(entry.weather)}</div>
                  {entry.temperature && <div className="text-xs text-gray-500 mt-1">{entry.temperature}°C</div>}
                </div>
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1A1A2E]">{new Date(entry.date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</h3>
                      <p className="text-xs text-gray-500">Logged by {entry.createdBy.name}</p>
                    </div>
                    <button className="text-gray-300 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{entry.workforceCount} on site</span>
                    </div>
                    {entry.deliveries && (
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{entry.deliveries}</span>
                      </div>
                    )}
                    {entry.visitors && (
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{entry.visitors}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Work Completed:</p>
                    <p className="text-sm text-gray-600">{entry.workCompleted}</p>
                  </div>

                  {entry.delays && (
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-amber-900">Delays / Issues:</p>
                          <p className="text-sm text-amber-700">{entry.delays}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {entry.hsNotes && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-blue-900 mb-1">H&S Notes:</p>
                      <p className="text-sm text-blue-700">{entry.hsNotes}</p>
                    </div>
                  )}

                  {entry.photos.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        Progress Photos ({entry.photos.length})
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {entry.photos.map(photo => (
                          <div key={photo.id} className="relative group">
                            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                              <Camera className="w-8 h-8 text-gray-400" />
                            </div>
                            {photo.caption && (
                              <p className="text-xs text-gray-500 mt-1">{photo.caption}</p>
                            )}
                          </div>
                        ))}
                        <button className="aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center hover:border-[#F97316] hover:text-[#F97316] transition-colors">
                          <Upload className="w-6 h-6" />
                          <span className="text-xs mt-1">Add Photo</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
