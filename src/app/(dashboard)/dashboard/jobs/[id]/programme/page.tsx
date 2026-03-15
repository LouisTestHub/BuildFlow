"use client"

import { useState } from "react"
import { useParams } from "next/link"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft, Calendar, ChevronRight, Plus, AlertTriangle, TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Task {
  id: string
  name: string
  startDate: string
  endDate: string
  progress: number
  status: "not_started" | "in_progress" | "complete" | "delayed"
  dependencies: string[]
  isMilestone: boolean
  critical: boolean
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]

export default function ProgrammePage() {
  const params = useParams()
  const jobId = params?.id as string

  const [tasks] = useState<Task[]>([
    { id: "1", name: "Site Setup & Clearance", startDate: "2024-01-15", endDate: "2024-01-22", progress: 100, status: "complete", dependencies: [], isMilestone: false, critical: true },
    { id: "2", name: "Excavation & Foundations", startDate: "2024-01-23", endDate: "2024-02-10", progress: 100, status: "complete", dependencies: ["1"], isMilestone: false, critical: true },
    { id: "3", name: "Ground Floor Slab", startDate: "2024-02-11", endDate: "2024-02-28", progress: 100, status: "complete", dependencies: ["2"], isMilestone: false, critical: true },
    { id: "4", name: "First Floor Structure", startDate: "2024-03-01", endDate: "2024-03-20", progress: 75, status: "in_progress", dependencies: ["3"], isMilestone: false, critical: true },
    { id: "5", name: "Roof Installation", startDate: "2024-03-21", endDate: "2024-04-15", progress: 0, status: "not_started", dependencies: ["4"], isMilestone: false, critical: true },
    { id: "6", name: "Windows & Doors", startDate: "2024-04-16", endDate: "2024-05-10", progress: 0, status: "not_started", dependencies: ["5"], isMilestone: false, critical: false },
    { id: "7", name: "First Fix Electrics", startDate: "2024-05-01", endDate: "2024-05-25", progress: 0, status: "not_started", dependencies: ["5"], isMilestone: false, critical: false },
    { id: "8", name: "First Fix Plumbing", startDate: "2024-05-01", endDate: "2024-05-25", progress: 0, status: "not_started", dependencies: ["5"], isMilestone: false, critical: false },
    { id: "9", name: "Plastering", startDate: "2024-05-26", endDate: "2024-06-20", progress: 0, status: "not_started", dependencies: ["7", "8"], isMilestone: false, critical: false },
    { id: "10", name: "Practical Completion", startDate: "2024-09-30", endDate: "2024-09-30", progress: 0, status: "not_started", dependencies: ["9"], isMilestone: true, critical: true },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "complete": return "bg-green-500"
      case "in_progress": return "bg-blue-500"
      case "delayed": return "bg-red-500"
      default: return "bg-gray-300"
    }
  }

  const calculatePosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const projectStart = new Date("2024-01-15")
    const projectEnd = new Date("2024-09-30")
    const totalDays = (projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24)
    const startOffset = (start.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24)
    const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/jobs/${jobId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Programme</h2>
          <p className="text-sm text-gray-500">Gantt chart view with critical path & dependencies</p>
        </div>
        <Button variant="outline" size="sm">
          <Calendar className="w-4 h-4 mr-2" /> Adjust Dates
        </Button>
        <Button size="sm">
          <Plus className="w-4 h-4 mr-2" /> Add Task
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Tasks</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{tasks.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {tasks.filter(t => t.status === "in_progress").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Complete</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {tasks.filter(t => t.status === "complete").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Milestones</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">
              {tasks.filter(t => t.isMilestone).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gantt Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gantt View</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {/* Timeline Header */}
          <div className="mb-4">
            <div className="flex border-b border-gray-200">
              <div className="w-64 flex-shrink-0" />
              <div className="flex-1 flex">
                {MONTHS.map((month, idx) => (
                  <div
                    key={idx}
                    className="flex-1 text-center text-xs font-medium text-gray-600 pb-2"
                  >
                    {month}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Rows */}
          <div className="space-y-1">
            {tasks.map((task) => {
              const pos = calculatePosition(task.startDate, task.endDate)
              return (
                <div key={task.id} className="flex items-center gap-4 py-2 hover:bg-gray-50">
                  {/* Task Name */}
                  <div className="w-64 flex-shrink-0 flex items-center gap-2">
                    {task.critical && (
                      <AlertTriangle className="w-3 h-3 text-red-500" title="Critical path" />
                    )}
                    <span className={cn(
                      "text-sm truncate",
                      task.isMilestone ? "font-bold text-[#F97316]" : "text-gray-700"
                    )}>
                      {task.name}
                    </span>
                  </div>

                  {/* Gantt Bar */}
                  <div className="flex-1 relative h-8">
                    <div
                      className={cn(
                        "absolute h-full rounded-lg transition-all",
                        getStatusColor(task.status),
                        task.critical && "ring-2 ring-red-500 ring-opacity-50"
                      )}
                      style={{ left: pos.left, width: pos.width }}
                    >
                      {task.progress > 0 && task.progress < 100 && (
                        <div
                          className="absolute inset-0 bg-white bg-opacity-30 rounded-lg"
                          style={{ width: `${100 - task.progress}%`, right: 0 }}
                        />
                      )}
                      {task.isMilestone && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-[#F97316] transform rotate-45" />
                        </div>
                      )}
                      <div className="absolute inset-0 flex items-center px-2">
                        <span className="text-[10px] text-white font-medium truncate">
                          {task.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs text-gray-600 mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-green-500" />
              <span>Complete</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-blue-500" />
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded bg-gray-300" />
              <span>Not Started</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-[#F97316] transform rotate-45" />
              <span>Milestone</span>
            </div>
            <div className="flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span>Critical Path</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Path Alert */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm text-red-900">Critical Path Warning</p>
            <p className="text-sm text-red-700 mt-1">
              {tasks.filter(t => t.critical && t.status !== "complete").length} critical tasks remain on the critical path.
              Any delay will impact the project completion date.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
