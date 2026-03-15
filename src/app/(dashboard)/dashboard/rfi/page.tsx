"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus, MessageSquare, Clock, CheckCircle, AlertCircle, FileText
} from "lucide-react"
import { cn } from "@/lib/utils"

interface RFI {
  id: string
  reference: string
  title: string
  description: string
  raisedBy: string
  assignedTo: string
  jobRef: string | null
  drawingRef: string | null
  status: "open" | "pending_response" | "responded" | "closed"
  priority: "low" | "medium" | "high"
  createdAt: string
  responseDeadline: string | null
  respondedAt: string | null
  response: string | null
}

const STATUS_COLORS = {
  open: "bg-blue-100 text-blue-700",
  pending_response: "bg-amber-100 text-amber-700",
  responded: "bg-green-100 text-green-700",
  closed: "bg-gray-200 text-gray-500",
}

const PRIORITY_COLORS = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-orange-100 text-orange-700",
  high: "bg-red-100 text-red-700",
}

export default function RFIPage() {
  const [rfis] = useState<RFI[]>([
    {
      id: "1",
      reference: "RFI-001",
      title: "Clarification on stair balustrade height",
      description: "Drawing A-202 shows balustrade at 900mm but Building Regs require 1100mm for this stair. Please confirm correct height.",
      raisedBy: "John Smith",
      assignedTo: "ABC Architects",
      jobRef: "JOB-2024-003",
      drawingRef: "A-202 Rev B",
      status: "pending_response",
      priority: "high",
      createdAt: "2024-03-12",
      responseDeadline: "2024-03-19",
      respondedAt: null,
      response: null,
    },
    {
      id: "2",
      reference: "RFI-002",
      title: "Soil stack vent terminal position",
      description: "Plumbing layout shows vent terminal within 3m of velux window. Can we relocate to rear elevation?",
      raisedBy: "Mike Taylor",
      assignedTo: "Plumbing Consultant",
      jobRef: "JOB-2024-003",
      drawingRef: "P-101 Rev A",
      status: "responded",
      priority: "medium",
      createdAt: "2024-03-08",
      responseDeadline: "2024-03-15",
      respondedAt: "2024-03-14",
      response: "Approved to relocate to rear elevation. Updated drawing P-101 Rev B issued.",
    },
    {
      id: "3",
      reference: "RFI-003",
      title: "Brick specification confirmation",
      description: "Specification lists 'red facing brick' but no manufacturer specified. Please confirm approved brick type.",
      raisedBy: "Sarah Jones",
      assignedTo: "ABC Architects",
      jobRef: "JOB-2024-005",
      drawingRef: null,
      status: "closed",
      priority: "low",
      createdAt: "2024-03-01",
      responseDeadline: "2024-03-08",
      respondedAt: "2024-03-05",
      response: "Use Ibstock Leicester Red Multi. Sample approved by client 05/03/24.",
    },
  ])

  const stats = {
    total: rfis.length,
    open: rfis.filter(r => r.status === "open").length,
    pendingResponse: rfis.filter(r => r.status === "pending_response").length,
    overdue: rfis.filter(r => r.responseDeadline && new Date(r.responseDeadline) < new Date() && r.status !== "closed" && r.status !== "responded").length,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">RFI (Request for Information)</h2>
          <p className="text-sm text-gray-500">Formal RFI system for design clarifications</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Raise RFI
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total RFIs</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Open</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.open}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Pending Response</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pendingResponse}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Overdue</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.overdue}</p>
          </CardContent>
        </Card>
      </div>

      {/* RFI List */}
      <div className="space-y-3">
        {rfis.map(rfi => (
          <Card key={rfi.id} className={cn(
            rfi.responseDeadline && new Date(rfi.responseDeadline) < new Date() && rfi.status !== "closed" && rfi.status !== "responded" && "border-red-300"
          )}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-mono text-sm font-semibold text-[#1A1A2E]">{rfi.reference}</span>
                    <Badge className={cn(STATUS_COLORS[rfi.status], "border-0 text-xs")}>
                      {rfi.status.replace("_", " ")}
                    </Badge>
                    <Badge className={cn(PRIORITY_COLORS[rfi.priority], "border-0 text-xs")}>
                      {rfi.priority}
                    </Badge>
                    {rfi.jobRef && (
                      <span className="text-xs text-gray-500">→ {rfi.jobRef}</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-[#1A1A2E] mb-2">{rfi.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{rfi.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                    <span>Raised by {rfi.raisedBy} on {new Date(rfi.createdAt).toLocaleDateString("en-GB")}</span>
                    <span>Assigned to: {rfi.assignedTo}</span>
                    {rfi.drawingRef && <span>Ref: {rfi.drawingRef}</span>}
                  </div>

                  {rfi.responseDeadline && (
                    <div className={cn(
                      "flex items-center gap-2 text-xs mt-2",
                      new Date(rfi.responseDeadline) < new Date() && rfi.status !== "closed" && rfi.status !== "responded" ? "text-red-600" : "text-gray-500"
                    )}>
                      <Clock className="w-3 h-3" />
                      <span>Response deadline: {new Date(rfi.responseDeadline).toLocaleDateString("en-GB")}</span>
                      {new Date(rfi.responseDeadline) < new Date() && rfi.status !== "closed" && rfi.status !== "responded" && (
                        <Badge className="bg-red-100 text-red-700 border-0 text-[10px] ml-1">OVERDUE</Badge>
                      )}
                    </div>
                  )}

                  {rfi.response && (
                    <div className="mt-3 pt-3 border-t border-gray-100 bg-green-50 rounded-lg p-3">
                      <div className="flex items-start gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                        <p className="text-sm font-medium text-green-900">Response:</p>
                      </div>
                      <p className="text-sm text-green-800 ml-6">{rfi.response}</p>
                      {rfi.respondedAt && (
                        <p className="text-xs text-green-600 ml-6 mt-1">
                          Responded on {new Date(rfi.respondedAt).toLocaleDateString("en-GB")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {rfi.status !== "closed" && (
                <div className="flex gap-2 mt-3">
                  {rfi.status === "open" && (
                    <Button size="sm" variant="outline">Assign</Button>
                  )}
                  {rfi.status === "pending_response" && (
                    <Button size="sm">Record Response</Button>
                  )}
                  {rfi.status === "responded" && (
                    <Button size="sm">Close RFI</Button>
                  )}
                  <Button size="sm" variant="ghost">View History</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
