"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus, CheckCircle, XCircle, Clock, FileText, Search, AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface QualityChecklist {
  id: string
  reference: string
  trade: string
  description: string
  jobRef: string
  inspector: string
  status: "pending" | "in_progress" | "passed" | "failed" | "remedial_required"
  checkDate: string | null
  items: { name: string; compliant: boolean | null }[]
}

interface NonConformance {
  id: string
  reference: string
  title: string
  description: string
  jobRef: string
  trade: string
  severity: "minor" | "major" | "critical"
  raisedBy: string
  raisedDate: string
  status: "open" | "remedial_in_progress" | "closed"
}

const CHECKLIST_STATUS_COLORS = {
  pending: "bg-gray-100 text-gray-700",
  in_progress: "bg-blue-100 text-blue-700",
  passed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  remedial_required: "bg-amber-100 text-amber-700",
}

const SEVERITY_COLORS = {
  minor: "bg-amber-100 text-amber-700",
  major: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
}

export default function QualityManagementPage() {
  const [activeTab, setActiveTab] = useState<"checklists" | "non-conformances" | "itps">("checklists")

  const [checklists] = useState<QualityChecklist[]>([
    {
      id: "1",
      reference: "QC-001",
      trade: "Brickwork",
      description: "First lift brickwork inspection - elevation A",
      jobRef: "JOB-2024-003",
      inspector: "John Smith",
      status: "passed",
      checkDate: "2024-03-12",
      items: [
        { name: "Mortar joint width 10mm ± 3mm", compliant: true },
        { name: "Perpends plumb and aligned", compliant: true },
        { name: "DPC level and continuous", compliant: true },
        { name: "Cavity width 100mm ± 5mm", compliant: true },
        { name: "Wall ties installed @ 900mm c/c", compliant: true },
      ],
    },
    {
      id: "2",
      reference: "QC-002",
      trade: "Plastering",
      description: "Skim coat finish - ground floor rooms",
      jobRef: "JOB-2024-003",
      inspector: "Sarah Jones",
      status: "remedial_required",
      checkDate: "2024-03-14",
      items: [
        { name: "Surface smooth and free from blemishes", compliant: false },
        { name: "Corners sharp and true", compliant: true },
        { name: "Reveals plumb and square", compliant: true },
        { name: "Ceiling level within ±3mm/2m", compliant: true },
      ],
    },
    {
      id: "3",
      reference: "QC-003",
      trade: "Electrical",
      description: "First fix wiring inspection",
      jobRef: "JOB-2024-005",
      inspector: "Mike Taylor",
      status: "in_progress",
      checkDate: null,
      items: [
        { name: "Cable routes protected", compliant: null },
        { name: "Circuits labeled correctly", compliant: null },
        { name: "Earth bonding in place", compliant: null },
        { name: "Cable clips @ correct spacing", compliant: null },
      ],
    },
  ])

  const [nonConformances] = useState<NonConformance[]>([
    {
      id: "1",
      reference: "NCR-001",
      title: "Uneven plaster finish - living room",
      description: "Multiple ripples and trowel marks visible on south wall. Requires re-skim.",
      jobRef: "JOB-2024-003",
      trade: "Plastering",
      severity: "minor",
      raisedBy: "Sarah Jones",
      raisedDate: "2024-03-14",
      status: "remedial_in_progress",
    },
    {
      id: "2",
      reference: "NCR-002",
      title: "Incorrect brick bond pattern",
      description: "Flemish bond used instead of English bond per specification. Sections 2-4 of elevation B.",
      jobRef: "JOB-2024-005",
      trade: "Brickwork",
      severity: "major",
      raisedBy: "John Smith",
      raisedDate: "2024-03-10",
      status: "open",
    },
  ])

  const statsChecklists = {
    total: checklists.length,
    passed: checklists.filter(c => c.status === "passed").length,
    failed: checklists.filter(c => c.status === "failed").length,
    remedialRequired: checklists.filter(c => c.status === "remedial_required").length,
  }

  const statsNCR = {
    total: nonConformances.length,
    open: nonConformances.filter(n => n.status === "open").length,
    inProgress: nonConformances.filter(n => n.status === "remedial_in_progress").length,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Quality Management</h2>
          <p className="text-sm text-gray-500">Checklists, inspections & non-conformance tracking</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> New Inspection
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-6">
          {[
            { key: "checklists" as const, label: "Quality Checklists" },
            { key: "non-conformances" as const, label: "Non-Conformances" },
            { key: "itps" as const, label: "ITPs" },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "pb-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.key
                  ? "border-[#F97316] text-[#F97316]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Checklists Tab */}
      {activeTab === "checklists" && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Total Inspections</p>
                <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{statsChecklists.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Passed</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{statsChecklists.passed}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Remedial Required</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{statsChecklists.remedialRequired}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Failed</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{statsChecklists.failed}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {checklists.map(checklist => (
              <Card key={checklist.id}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm font-semibold text-[#1A1A2E]">{checklist.reference}</span>
                        <Badge className={cn(CHECKLIST_STATUS_COLORS[checklist.status], "border-0 text-xs")}>
                          {checklist.status.replace("_", " ")}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{checklist.trade}</Badge>
                        <span className="text-xs text-gray-500">→ {checklist.jobRef}</span>
                      </div>
                      <p className="font-medium text-[#1A1A2E] mb-1">{checklist.description}</p>
                      <p className="text-xs text-gray-500">
                        Inspector: {checklist.inspector}
                        {checklist.checkDate && ` · ${new Date(checklist.checkDate).toLocaleDateString("en-GB")}`}
                      </p>
                    </div>
                  </div>

                  {/* Checklist Items */}
                  <div className="space-y-2 mt-4">
                    {checklist.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        {item.compliant === true && (
                          <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        )}
                        {item.compliant === false && (
                          <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        )}
                        {item.compliant === null && (
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        )}
                        <span className={cn(
                          item.compliant === false ? "text-red-600" : "text-gray-700"
                        )}>
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 mt-4">
                    {checklist.status === "in_progress" && (
                      <Button size="sm">Complete Inspection</Button>
                    )}
                    {checklist.status === "remedial_required" && (
                      <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Schedule Remedial Work</Button>
                    )}
                    <Button size="sm" variant="ghost">View Full Report</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Non-Conformances Tab */}
      {activeTab === "non-conformances" && (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Total NCRs</p>
                <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{statsNCR.total}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">Open</p>
                <p className="text-2xl font-bold text-red-600 mt-1">{statsNCR.open}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-xs text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-amber-600 mt-1">{statsNCR.inProgress}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            {nonConformances.map(ncr => (
              <Card key={ncr.id} className="border-red-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-sm font-semibold text-[#1A1A2E]">{ncr.reference}</span>
                        <Badge className={cn(SEVERITY_COLORS[ncr.severity], "border-0 text-xs")}>
                          {ncr.severity}
                        </Badge>
                        <Badge variant="outline" className="text-xs">{ncr.trade}</Badge>
                        <span className="text-xs text-gray-500">→ {ncr.jobRef}</span>
                      </div>
                      <h3 className="font-semibold text-[#1A1A2E] mb-2">{ncr.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{ncr.description}</p>
                      <p className="text-xs text-gray-500">
                        Raised by {ncr.raisedBy} on {new Date(ncr.raisedDate).toLocaleDateString("en-GB")}
                      </p>
                      <div className="flex gap-2 mt-4">
                        {ncr.status === "open" && (
                          <Button size="sm" className="bg-amber-600 hover:bg-amber-700">Start Remedial Work</Button>
                        )}
                        {ncr.status === "remedial_in_progress" && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">Mark as Resolved</Button>
                        )}
                        <Button size="sm" variant="ghost">View Details</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* ITPs Tab Placeholder */}
      {activeTab === "itps" && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">Inspection & Test Plans coming soon</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
