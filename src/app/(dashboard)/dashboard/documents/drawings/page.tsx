"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus, Upload, Download, FileText, Search, Filter, AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Drawing {
  id: string
  number: string
  title: string
  revision: string
  status: "for_construction" | "preliminary" | "as_built" | "superseded"
  discipline: string
  area: string
  uploadedBy: string
  uploadedAt: string
  supersededBy: string | null
}

const STATUS_COLORS = {
  for_construction: "bg-green-100 text-green-700",
  preliminary: "bg-amber-100 text-amber-700",
  as_built: "bg-blue-100 text-blue-700",
  superseded: "bg-gray-200 text-gray-500",
}

const DISCIPLINE_COLORS: Record<string, string> = {
  Architectural: "bg-purple-100 text-purple-700",
  Structural: "bg-blue-100 text-blue-700",
  Mechanical: "bg-green-100 text-green-700",
  Electrical: "bg-yellow-100 text-yellow-700",
  Plumbing: "bg-teal-100 text-teal-700",
}

export default function DrawingsRegisterPage() {
  const [drawings] = useState<Drawing[]>([
    {
      id: "1",
      number: "A-100",
      title: "Ground Floor Plan",
      revision: "C",
      status: "for_construction",
      discipline: "Architectural",
      area: "Ground Floor",
      uploadedBy: "John Smith",
      uploadedAt: "2024-03-10",
      supersededBy: null,
    },
    {
      id: "2",
      number: "A-101",
      title: "First Floor Plan",
      revision: "B",
      status: "for_construction",
      discipline: "Architectural",
      area: "First Floor",
      uploadedBy: "John Smith",
      uploadedAt: "2024-03-10",
      supersededBy: null,
    },
    {
      id: "3",
      number: "A-100",
      title: "Ground Floor Plan",
      revision: "B",
      status: "superseded",
      discipline: "Architectural",
      area: "Ground Floor",
      uploadedBy: "John Smith",
      uploadedAt: "2024-02-20",
      supersededBy: "A-100 Rev C",
    },
    {
      id: "4",
      number: "S-200",
      title: "Foundation Details",
      revision: "A",
      status: "for_construction",
      discipline: "Structural",
      area: "Foundations",
      uploadedBy: "Sarah Jones",
      uploadedAt: "2024-01-25",
      supersededBy: null,
    },
    {
      id: "5",
      number: "E-300",
      title: "Lighting Layout - Ground Floor",
      revision: "A",
      status: "preliminary",
      discipline: "Electrical",
      area: "Ground Floor",
      uploadedBy: "Mike Taylor",
      uploadedAt: "2024-03-12",
      supersededBy: null,
    },
  ])

  const stats = {
    total: drawings.length,
    forConstruction: drawings.filter(d => d.status === "for_construction").length,
    preliminary: drawings.filter(d => d.status === "preliminary").length,
    superseded: drawings.filter(d => d.status === "superseded").length,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#1A1A2E]">Drawing Register</h2>
          <p className="text-sm text-gray-500">Construction drawings with revision tracking</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" /> Export List
          </Button>
          <Button size="sm">
            <Upload className="w-4 h-4 mr-2" /> Upload Drawing
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Total Drawings</p>
            <p className="text-2xl font-bold text-[#1A1A2E] mt-1">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">For Construction</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.forConstruction}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Preliminary</p>
            <p className="text-2xl font-bold text-amber-600 mt-1">{stats.preliminary}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500">Superseded</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">{stats.superseded}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input placeholder="Search drawings..." className="pl-10" />
            </div>
            <select className="flex h-10 w-full sm:w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="">All Disciplines</option>
              <option>Architectural</option>
              <option>Structural</option>
              <option>Mechanical</option>
              <option>Electrical</option>
              <option>Plumbing</option>
            </select>
            <select className="flex h-10 w-full sm:w-48 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
              <option value="">All Statuses</option>
              <option>For Construction</option>
              <option>Preliminary</option>
              <option>As-Built</option>
              <option>Superseded</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Drawings List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Drawings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500 text-xs">
                  <th className="text-left py-3 px-2">Number</th>
                  <th className="text-left py-3 px-2">Title</th>
                  <th className="text-center py-3 px-2">Rev</th>
                  <th className="text-center py-3 px-2">Discipline</th>
                  <th className="text-center py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Area</th>
                  <th className="text-left py-3 px-2">Uploaded</th>
                  <th className="text-right py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {drawings.map((drawing) => (
                  <tr
                    key={drawing.id}
                    className={cn(
                      "border-b border-gray-50 hover:bg-gray-50",
                      drawing.status === "superseded" && "opacity-50"
                    )}
                  >
                    <td className="py-3 px-2 font-mono font-medium text-[#1A1A2E]">
                      {drawing.number}
                    </td>
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium text-[#1A1A2E]">{drawing.title}</p>
                        {drawing.supersededBy && (
                          <p className="text-xs text-red-500 mt-0.5 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Superseded by {drawing.supersededBy}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant="outline" className="font-mono text-xs">
                        {drawing.revision}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge className={cn(DISCIPLINE_COLORS[drawing.discipline] || "bg-gray-100 text-gray-700", "border-0 text-xs")}>
                        {drawing.discipline}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge className={cn(STATUS_COLORS[drawing.status], "border-0 text-xs")}>
                        {drawing.status.replace("_", " ")}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-gray-600">{drawing.area}</td>
                    <td className="py-3 px-2 text-gray-500 text-xs">
                      <div>
                        <p>{drawing.uploadedBy}</p>
                        <p className="text-[10px] text-gray-400">{new Date(drawing.uploadedAt).toLocaleDateString("en-GB")}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </td>
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
