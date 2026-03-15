"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft, ChevronRight, Clock, Users, Check,
  X, Loader2, ChevronDown, ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"

interface TimesheetEntry {
  id: string
  date: string
  hoursNormal: string
  hoursOvertime: string
  job: { id: string; reference: string; title: string }
}

interface Timesheet {
  id: string
  weekStart: string
  status: string
  user: { id: string; name: string; role: string }
  entries: TimesheetEntry[]
}

interface TeamTimesheetRow {
  user: { id: string; name: string; role: string }
  timesheet: Timesheet | null
  totalHours: number
  status: string
}

const STATUS_COLOURS: Record<string, { bg: string; text: string }> = {
  DRAFT: { bg: "bg-gray-100", text: "text-gray-600" },
  SUBMITTED: { bg: "bg-blue-100", text: "text-blue-800" },
  APPROVED: { bg: "bg-green-100", text: "text-green-800" },
  REJECTED: { bg: "bg-red-100", text: "text-red-800" },
  NOT_STARTED: { bg: "bg-gray-50", text: "text-gray-400" },
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function formatDateShort(d: Date): string {
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" })
}

function formatWeek(monday: Date): string {
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  return `${formatDateShort(monday)} — ${formatDateShort(sunday)}`
}

export default function TimesheetsPage() {
  const [weekStart, setWeekStart] = useState(getMonday(new Date()))
  const [teamData, setTeamData] = useState<TeamTimesheetRow[]>([])
  const [myTimesheet, setMyTimesheet] = useState<Timesheet | null>(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)
  const [view, setView] = useState<"my" | "team">("my")
  const [approving, setApproving] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const weekStr = weekStart.toISOString().split("T")[0]

    // Fetch my timesheet
    const myRes = await fetch(`/api/timesheets?weekStart=${weekStr}`)
    if (myRes.ok) {
      const data = await myRes.json()
      setMyTimesheet(data.timesheets?.[0] || null)
    }

    // Fetch team timesheets
    const teamRes = await fetch(`/api/timesheets/team?weekStart=${weekStr}`)
    if (teamRes.ok) {
      const data = await teamRes.json()
      setTeamData(data.teamTimesheets || [])
    }

    setLoading(false)
  }, [weekStart])

  useEffect(() => { fetchData() }, [fetchData])

  const prevWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() - 7)
    setWeekStart(d)
  }

  const nextWeek = () => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + 7)
    setWeekStart(d)
  }

  const submitTimesheet = async (id: string) => {
    await fetch(`/api/timesheets/${id}/submit`, { method: "POST" })
    fetchData()
  }

  const approveTimesheet = async (id: string) => {
    setApproving(id)
    await fetch(`/api/timesheets/${id}/approve`, { method: "POST" })
    setApproving(null)
    fetchData()
  }

  const rejectTimesheet = async (id: string) => {
    setApproving(id)
    await fetch(`/api/timesheets/${id}/reject`, { method: "POST" })
    setApproving(null)
    fetchData()
  }

  // Build grid data for my timesheet
  const buildGrid = (ts: Timesheet | null) => {
    if (!ts) return { jobs: [], dailyTotals: Array(7).fill(0), weeklyTotal: 0 }

    const jobMap = new Map<string, { job: { id: string; reference: string; title: string }; hours: number[] }>()

    for (const entry of ts.entries) {
      const entryDate = new Date(entry.date)
      const dayIndex = (entryDate.getDay() + 6) % 7 // Mon=0, Sun=6
      const key = entry.job.id

      if (!jobMap.has(key)) {
        jobMap.set(key, { job: entry.job, hours: Array(7).fill(0) })
      }
      const row = jobMap.get(key)!
      row.hours[dayIndex] = Number(entry.hoursNormal) + Number(entry.hoursOvertime)
    }

    const jobs = Array.from(jobMap.values())
    const dailyTotals = Array(7).fill(0)
    for (const j of jobs) {
      for (let i = 0; i < 7; i++) {
        dailyTotals[i] += j.hours[i]
      }
    }
    const weeklyTotal = dailyTotals.reduce((s, h) => s + h, 0)

    return { jobs, dailyTotals, weeklyTotal }
  }

  const getDayDates = () => {
    return DAYS.map((_, i) => {
      const d = new Date(weekStart)
      d.setDate(weekStart.getDate() + i)
      return d
    })
  }

  const dayDates = getDayDates()

  if (loading) {
    return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#F97316]" /></div>
  }

  const myGrid = buildGrid(myTimesheet)
  const totalTeamHours = teamData.reduce((s, t) => s + t.totalHours, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/team">
          <Button variant="ghost" size="icon" className="shrink-0"><ArrowLeft className="w-4 h-4" /></Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Timesheets</h2>
          <p className="text-gray-500 text-sm">Track hours across jobs</p>
        </div>
      </div>

      {/* Week Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevWeek}><ChevronLeft className="w-4 h-4" /></Button>
          <div className="text-sm font-medium text-[#1A1A2E] min-w-[200px] text-center">
            {formatWeek(weekStart)}
          </div>
          <Button variant="outline" size="icon" onClick={nextWeek}><ChevronRight className="w-4 h-4" /></Button>
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setView("my")}
            className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors", view === "my" ? "bg-white text-[#1A1A2E] shadow-sm" : "text-gray-500")}
          >
            <Clock className="w-3 h-3 inline mr-1" /> My Timesheet
          </button>
          <button
            onClick={() => setView("team")}
            className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition-colors", view === "team" ? "bg-white text-[#1A1A2E] shadow-sm" : "text-gray-500")}
          >
            <Users className="w-3 h-3 inline mr-1" /> Team View
          </button>
        </div>
      </div>

      {/* My Timesheet View */}
      {view === "my" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">My Timesheet</CardTitle>
            <div className="flex items-center gap-2">
              {myTimesheet && (
                <Badge className={cn(STATUS_COLOURS[myTimesheet.status]?.bg, STATUS_COLOURS[myTimesheet.status]?.text, "border-0 text-xs")}>
                  {myTimesheet.status}
                </Badge>
              )}
              {myTimesheet?.status === "DRAFT" && (
                <Button size="sm" onClick={() => submitTimesheet(myTimesheet.id)} className="text-xs gap-1">
                  <Check className="w-3 h-3" /> Submit
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {myGrid.jobs.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">No timesheet entries for this week.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-500 text-xs">
                      <th className="text-left py-2 pr-4 min-w-[200px]">Job</th>
                      {DAYS.map((d, i) => (
                        <th key={d} className="text-center py-2 px-2 min-w-[60px]">
                          <div>{d}</div>
                          <div className="text-[10px] text-gray-400 font-normal">{formatDateShort(dayDates[i])}</div>
                        </th>
                      ))}
                      <th className="text-center py-2 px-2 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myGrid.jobs.map((row) => {
                      const rowTotal = row.hours.reduce((s, h) => s + h, 0)
                      return (
                        <tr key={row.job.id} className="border-b border-gray-50">
                          <td className="py-2 pr-4">
                            <span className="font-mono text-xs text-gray-400">{row.job.reference}</span>
                            <p className="text-sm text-[#1A1A2E] truncate max-w-[180px]">{row.job.title}</p>
                          </td>
                          {row.hours.map((h, i) => (
                            <td key={i} className="text-center py-2 px-2">
                              <div className={cn(
                                "w-12 h-8 mx-auto rounded flex items-center justify-center font-mono text-sm",
                                h > 8 ? "bg-amber-100 text-amber-800 font-semibold" :
                                h > 0 ? "bg-gray-50 text-[#1A1A2E]" :
                                "text-gray-300"
                              )}>
                                {h > 0 ? h.toFixed(1) : "—"}
                              </div>
                            </td>
                          ))}
                          <td className="text-center py-2 px-2 font-mono font-semibold text-[#1A1A2E]">
                            {rowTotal.toFixed(1)}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2">
                      <td className="py-2 pr-4 font-semibold text-[#1A1A2E]">Daily Total</td>
                      {myGrid.dailyTotals.map((t, i) => (
                        <td key={i} className="text-center py-2 px-2">
                          <span className={cn(
                            "font-mono font-semibold",
                            t > 8 ? "text-amber-600" : "text-[#1A1A2E]"
                          )}>
                            {t > 0 ? t.toFixed(1) : "—"}
                          </span>
                        </td>
                      ))}
                      <td className="text-center py-2 px-2 font-mono font-bold text-[#F97316] text-base">
                        {myGrid.weeklyTotal.toFixed(1)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Team View */}
      {view === "team" && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Team Members</p>
                <p className="text-2xl font-bold text-[#1A1A2E]">{teamData.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Total Hours</p>
                <p className="text-2xl font-bold font-mono text-[#1A1A2E]">{totalTeamHours.toFixed(1)}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Pending Approval</p>
                <p className="text-2xl font-bold text-amber-600">{teamData.filter((t) => t.status === "SUBMITTED").length}</p>
              </CardContent>
            </Card>
          </div>

          {/* Bulk approve */}
          {teamData.some((t) => t.status === "SUBMITTED") && (
            <div className="flex justify-end">
              <Button
                size="sm"
                className="gap-1 text-xs"
                onClick={async () => {
                  const submitted = teamData.filter((t) => t.status === "SUBMITTED" && t.timesheet)
                  for (const t of submitted) {
                    await fetch(`/api/timesheets/${t.timesheet!.id}/approve`, { method: "POST" })
                  }
                  fetchData()
                }}
              >
                <Check className="w-3 h-3" /> Approve All Submitted
              </Button>
            </div>
          )}

          {/* Team list */}
          <div className="space-y-2">
            {teamData.map((row) => {
              const sc = STATUS_COLOURS[row.status] || STATUS_COLOURS.NOT_STARTED
              const isExpanded = expanded === row.user.id
              const grid = row.timesheet ? buildGrid(row.timesheet) : null

              return (
                <Card key={row.user.id}>
                  <CardContent className="p-4">
                    <button className="w-full text-left" onClick={() => setExpanded(isExpanded ? null : row.user.id)}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#F97316]/20 flex items-center justify-center text-xs font-bold text-[#F97316]">
                          {row.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-[#1A1A2E]">{row.user.name}</p>
                          <p className="text-xs text-gray-400">{row.user.role?.replace(/_/g, " ")}</p>
                        </div>
                        <Badge className={cn(sc.bg, sc.text, "border-0 text-[10px]")}>{row.status.replace(/_/g, " ")}</Badge>
                        <span className="font-mono text-sm text-[#1A1A2E] w-16 text-right">{row.totalHours.toFixed(1)}h</span>
                        {row.status === "SUBMITTED" && row.timesheet && (
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-green-600 hover:text-green-800 hover:bg-green-50"
                              onClick={() => approveTimesheet(row.timesheet!.id)}
                              disabled={approving === row.timesheet.id}
                            >
                              {approving === row.timesheet.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-600 hover:text-red-800 hover:bg-red-50"
                              onClick={() => rejectTimesheet(row.timesheet!.id)}
                              disabled={approving === row.timesheet.id}
                            >
                              <X className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                        <ChevronDown className={cn("w-4 h-4 text-gray-300 transition-transform", isExpanded && "rotate-180")} />
                      </div>
                    </button>

                    {isExpanded && grid && grid.jobs.length > 0 && (
                      <div className="mt-3 pt-3 border-t overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-500 text-xs">
                              <th className="text-left py-1 pr-4 min-w-[180px]">Job</th>
                              {DAYS.map((d) => (
                                <th key={d} className="text-center py-1 px-2 min-w-[50px]">{d}</th>
                              ))}
                              <th className="text-center py-1 px-2">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {grid.jobs.map((j) => {
                              const rowTotal = j.hours.reduce((s, h) => s + h, 0)
                              return (
                                <tr key={j.job.id} className="border-b border-gray-50">
                                  <td className="py-1 pr-4 text-xs text-[#1A1A2E] truncate max-w-[180px]">{j.job.reference} — {j.job.title}</td>
                                  {j.hours.map((h, i) => (
                                    <td key={i} className="text-center py-1 px-2 font-mono text-xs">
                                      <span className={cn(h > 8 ? "text-amber-600 font-semibold" : h > 0 ? "text-[#1A1A2E]" : "text-gray-300")}>
                                        {h > 0 ? h.toFixed(1) : "—"}
                                      </span>
                                    </td>
                                  ))}
                                  <td className="text-center py-1 px-2 font-mono text-xs font-semibold">{rowTotal.toFixed(1)}</td>
                                </tr>
                              )
                            })}
                          </tbody>
                          <tfoot>
                            <tr className="border-t">
                              <td className="py-1 pr-4 text-xs font-semibold text-[#1A1A2E]">Total</td>
                              {grid.dailyTotals.map((t, i) => (
                                <td key={i} className="text-center py-1 px-2 font-mono text-xs font-semibold">
                                  {t > 0 ? t.toFixed(1) : "—"}
                                </td>
                              ))}
                              <td className="text-center py-1 px-2 font-mono text-xs font-bold text-[#F97316]">
                                {grid.weeklyTotal.toFixed(1)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    )}

                    {isExpanded && (!grid || grid.jobs.length === 0) && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-xs text-gray-400 text-center py-2">No entries for this week</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
