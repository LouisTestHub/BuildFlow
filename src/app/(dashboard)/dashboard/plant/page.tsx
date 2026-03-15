"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus, Truck, Calendar, PoundSterling, AlertTriangle, CheckCircle, Search
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PlantItem {
  id: string
  name: string
  type: "owned" | "hired"
  category: string
  supplier: string | null
  hireStart: string | null
  hireEnd: string | null
  costPerWeek: number | null
  jobAssigned: string | null
  lastInspection: string | null
  nextInspection: string | null
  status: "available" | "on_hire" | "maintenance" | "inspection_due"
  operatorCert: string | null
}

const STATUS_COLORS = {
  available: "bg-green-100 text-green-700",
  on_hire: "bg-blue-100 text-blue-700",
  maintenance: "bg-amber-100 text-amber-700",
  inspection_due: "bg-red-100 text-red-700",
}

export default function PlantRegisterPage() {
  const [plant] = useState<PlantItem[]>([
    {
      id: "1",
      name: "Mini Excavator 1.5T",
      type: "hired",
      category: "Excavation",
      supplier: "Plant Hire Co",
      hireStart: "2024-03-01",
      hireEnd: "2024-04-15",
      costPerWeek: 280,
      jobAssigned: "JOB-2024-003",
      lastInspection: "2024-03-01",
      nextInspection: "2024-04-01",
      status: "on_hire",
      operatorCert: "Valid until 2025-08-15",
    },
    {
      id: "2",
      name: "Tower Scaffolding System",
      type: "hired",
      category: "Access",
      supplier: "Scaffold Solutions",
      hireStart: "2024-02-15",
      hireEnd: "2024-06-30",
      costPerWeek: 185,
      jobAssigned: "JOB-2024-005",
      lastInspection: "2024-03-10",
      nextInspection: "2024-03-24",
      status: "inspection_due",
      operatorCert: null,
    },
    {
      id: "3",
      name: "Concrete Mixer",
      type: "owned",
      category: "Mixing",
      supplier: null,
      hireStart: null,
      hireEnd: null,
      costPerWeek: null,
      jobAssigned: null,
      lastInspection: "2024-02-01",
      nextInspection: "2024-05-01",
      status: "available",
      operatorCert: null,
    },
    {
      id: "4",
      name: "Dumper Truck 1T",
      type: "owned",
      category: "Transport",
      supplier: null,
      hireStart: null,
      hireEnd: null,
      costPerWeek: null,
      jobAssigned: "JOB-2024-003",
      lastInspection: "2024-01-15",
      nextInspection: "2024-04-15",
      status: "on_hire",
      operatorCert: "Valid until 2025-12-10",
    },
  ])

  const stats = {
    total: plant.length,
    owned: plant.filter(p => p.type === "owned").length,
    hired: plant.filter(p => p.type === "hired").length,
    inspectionDue: plant.filter(p => p.status === "inspection_due").length,
    totalWeeklyCost: plant.filter(p => p.costPerWeek).reduce((sum, p) => sum + (p.costPerWeek || 0), 0),
  }

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(val)

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Plant & Equipment Register</h2>
          <p className="text-sm text-gray-500">Track hired/owned plant, inspections & certifications</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" /> Add Plant
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Plant</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Owned</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.owned}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Hired</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.hired}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Inspection Due</p>
            <p className="text-2xl font-bold text-red-600 mt-1">{stats.inspectionDue}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Weekly Hire Cost</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1 font-mono">{formatCurrency(stats.totalWeeklyCost)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input placeholder="Search plant..." className="pl-10" />
            </div>
            <select className="flex h-10 w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="">All Types</option>
              <option>Owned</option>
              <option>Hired</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Plant List */}
      <div className="space-y-3">
        {plant.map(item => (
          <Card key={item.id} className={cn(
            item.status === "inspection_due" && "border-red-300"
          )}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Truck className="w-4 h-4 text-gray-400" />
                    <h3 className="font-semibold text-[#1A1A2E]">{item.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {item.type}
                    </Badge>
                    <Badge className={cn(STATUS_COLORS[item.status], "border-0 text-xs")}>
                      {item.status.replace("_", " ")}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm mt-3">
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="font-medium text-[#1A1A2E]">{item.category}</p>
                    </div>
                    {item.supplier && (
                      <div>
                        <p className="text-xs text-gray-500">Supplier</p>
                        <p className="font-medium text-[#1A1A2E]">{item.supplier}</p>
                      </div>
                    )}
                    {item.jobAssigned && (
                      <div>
                        <p className="text-xs text-gray-500">Assigned to</p>
                        <p className="font-medium text-[#1A1A2E]">{item.jobAssigned}</p>
                      </div>
                    )}
                    {item.hireStart && item.hireEnd && (
                      <div>
                        <p className="text-xs text-gray-500">Hire Period</p>
                        <p className="font-medium text-[#1A1A2E] text-xs">
                          {new Date(item.hireStart).toLocaleDateString("en-GB")} → {new Date(item.hireEnd).toLocaleDateString("en-GB")}
                        </p>
                      </div>
                    )}
                    {item.costPerWeek && (
                      <div>
                        <p className="text-xs text-gray-500">Cost per Week</p>
                        <p className="font-medium text-[#1A1A2E] font-mono">{formatCurrency(item.costPerWeek)}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs text-gray-500">Next Inspection</p>
                      <p className={cn(
                        "font-medium text-xs flex items-center gap-1",
                        item.status === "inspection_due" ? "text-red-600" : "text-[#1A1A2E]"
                      )}>
                        {item.status === "inspection_due" && <AlertTriangle className="w-3 h-3" />}
                        {item.nextInspection ? new Date(item.nextInspection).toLocaleDateString("en-GB") : "—"}
                      </p>
                    </div>
                    {item.operatorCert && (
                      <div>
                        <p className="text-xs text-gray-500">Operator Cert</p>
                        <p className="font-medium text-[#1A1A2E] text-xs flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-green-600" />
                          {item.operatorCert}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="outline">View Details</Button>
                {item.status === "inspection_due" && (
                  <Button size="sm" className="bg-red-600 hover:bg-red-700">Record Inspection</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
