"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus, Camera, MapPin, AlertCircle, CheckCircle, Clock, Upload, Download
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Defect {
  id: string
  reference: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  severity: "cosmetic" | "minor" | "major" | "structural"
  status: "open" | "assigned" | "in_progress" | "resolved" | "closed"
  location: { x: number; y: number }
  assignedTo: string | null
  trade: string | null
  photos: string[]
  createdAt: string
  resolvedAt: string | null
}

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
}

const STATUS_COLORS = {
  open: "bg-gray-100 text-gray-700",
  assigned: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-500",
}

export default function SnagTrackerPage() {
  const [defects, setDefects] = useState<Defect[]>([
    {
      id: "1",
      reference: "SNG-001",
      title: "Kitchen plasterwork uneven",
      description: "Wall behind kitchen units has uneven plaster finish. Visible ripples.",
      priority: "medium",
      severity: "minor",
      status: "assigned",
      location: { x: 35, y: 42 },
      assignedTo: "ABC Plastering Ltd",
      trade: "Plastering",
      photos: [],
      createdAt: "2024-03-12",
      resolvedAt: null,
    },
    {
      id: "2",
      reference: "SNG-002",
      title: "Bathroom door not closing flush",
      description: "En-suite door sticks at top corner. Requires adjustment.",
      priority: "low",
      severity: "cosmetic",
      status: "in_progress",
      location: { x: 68, y: 28 },
      assignedTo: "Precision Joinery",
      trade: "Carpentry",
      photos: [],
      createdAt: "2024-03-13",
      resolvedAt: null,
    },
    {
      id: "3",
      reference: "SNG-003",
      title: "Cracked tile in hallway",
      description: "Single floor tile cracked near entrance. Needs replacement.",
      priority: "medium",
      severity: "minor",
      status: "open",
      location: { x: 50, y: 65 },
      assignedTo: null,
      trade: "Tiling",
      photos: [],
      createdAt: "2024-03-14",
      resolvedAt: null,
    },
  ])

  const [showForm, setShowForm] = useState(false)
  const [selectedDefect, setSelectedDefect] = useState<Defect | null>(null)

  const stats = {
    total: defects.length,
    open: defects.filter(d => d.status === "open").length,
    inProgress: defects.filter(d => d.status === "in_progress").length,
    resolved: defects.filter(d => d.status === "resolved").length,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Defect & Snag Tracker</h2>
          <p className="text-sm text-gray-500">Visual defect tracking with floor plan mapping</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" /> Upload Floor Plan
          </Button>
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> New Defect
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Defects</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Open</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">{stats.open}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">In Progress</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.inProgress}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Resolved</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.resolved}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Floor Plan */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Floor Plan View
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative bg-gray-100 rounded-lg aspect-[16/10] border-2 border-dashed border-gray-300">
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-gray-400">
                <Upload className="w-12 h-12" />
                <p className="text-sm">Upload floor plan to pin defects</p>
                <Button variant="outline" size="sm">Choose File</Button>
              </div>
              {/* Demo pins */}
              {defects.map(defect => (
                <button
                  key={defect.id}
                  onClick={() => setSelectedDefect(defect)}
                  className={cn(
                    "absolute w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-xs transition-transform hover:scale-110",
                    defect.priority === "critical" && "bg-red-500",
                    defect.priority === "high" && "bg-orange-500",
                    defect.priority === "medium" && "bg-blue-500",
                    defect.priority === "low" && "bg-gray-500"
                  )}
                  style={{ left: `${defect.location.x}%`, top: `${defect.location.y}%` }}
                  title={defect.title}
                >
                  {defect.id}
                </button>
              ))}
            </div>
            <div className="flex gap-3 text-xs text-gray-500 mt-3">
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-red-500" /> Critical</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-orange-500" /> High</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-500" /> Medium</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-gray-500" /> Low</span>
            </div>
          </CardContent>
        </Card>

        {/* Selected Defect Detail */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {selectedDefect ? `Defect Details` : "Select a Defect"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDefect ? (
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm text-gray-500">{selectedDefect.reference}</span>
                    <Badge className={cn(STATUS_COLORS[selectedDefect.status], "border-0 text-xs")}>
                      {selectedDefect.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-[#1A1A2E]">{selectedDefect.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedDefect.description}</p>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Priority:</span>
                    <Badge className={cn(PRIORITY_COLORS[selectedDefect.priority], "border-0 text-xs")}>
                      {selectedDefect.priority}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Severity:</span>
                    <span className="font-medium">{selectedDefect.severity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Trade:</span>
                    <span className="font-medium">{selectedDefect.trade || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Assigned to:</span>
                    <span className="font-medium text-xs">{selectedDefect.assignedTo || "Unassigned"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Raised:</span>
                    <span className="font-medium">{new Date(selectedDefect.createdAt).toLocaleDateString("en-GB")}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-2">Photo Evidence:</p>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <Camera className="w-8 h-8 text-gray-300" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1">Edit</Button>
                  <Button size="sm" className="flex-1">Update Status</Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Click a pin on the floor plan to view defect details</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Defect List */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">All Defects</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500 text-xs">
                  <th className="text-left py-2">Ref</th>
                  <th className="text-left py-2">Title</th>
                  <th className="text-center py-2">Priority</th>
                  <th className="text-center py-2">Status</th>
                  <th className="text-left py-2">Assigned</th>
                  <th className="text-left py-2">Raised</th>
                </tr>
              </thead>
              <tbody>
                {defects.map(defect => (
                  <tr
                    key={defect.id}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedDefect(defect)}
                  >
                    <td className="py-3 font-mono text-xs">{defect.reference}</td>
                    <td className="py-3 font-medium text-[#1A1A2E]">{defect.title}</td>
                    <td className="py-3 text-center">
                      <Badge className={cn(PRIORITY_COLORS[defect.priority], "border-0 text-xs")}>
                        {defect.priority}
                      </Badge>
                    </td>
                    <td className="py-3 text-center">
                      <Badge className={cn(STATUS_COLORS[defect.status], "border-0 text-xs")}>
                        {defect.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 text-gray-600 text-xs">{defect.assignedTo || "—"}</td>
                    <td className="py-3 text-gray-500 text-xs">{new Date(defect.createdAt).toLocaleDateString("en-GB")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
