"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Home, Image, FileText, MessageSquare, Download, TrendingUp, Calendar,
  CheckCircle, Clock, AlertCircle, Camera
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function ClientPortalPage() {
  const project = {
    title: "New Build – 42 Oak Lane",
    reference: "JOB-2024-003",
    status: "In Progress",
    progress: 65,
    contractValue: 485000,
    startDate: "2024-01-15",
    estimatedCompletion: "2024-09-30",
  }

  const milestones = [
    { name: "Foundations", status: "complete", date: "2024-02-10" },
    { name: "Ground Floor Slab", status: "complete", date: "2024-02-28" },
    { name: "First Floor Structure", status: "in_progress", date: "2024-03-20" },
    { name: "Roof Installation", status: "pending", date: "2024-04-15" },
    { name: "Windows & Doors", status: "pending", date: "2024-05-10" },
    { name: "Electrics & Plumbing", status: "pending", date: "2024-06-05" },
  ]

  const recentPhotos = [
    { id: "1", caption: "First floor walls complete", date: "2024-03-14" },
    { id: "2", caption: "Brickwork progress - south elevation", date: "2024-03-12" },
    { id: "3", caption: "Internal walls framed", date: "2024-03-10" },
  ]

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 }).format(val)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center">
              <Home className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#1A1A2E]">BuildFlow Client Portal</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600 hidden sm:block">Welcome, David & Sarah</span>
            <div className="w-8 h-8 rounded-full bg-[#F97316]/20 flex items-center justify-center">
              <span className="text-xs font-bold text-[#F97316]">DS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Project Header */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-xs text-gray-400">{project.reference}</span>
                  <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">{project.status}</Badge>
                </div>
                <h1 className="text-2xl font-bold text-[#1A1A2E]">{project.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                  <span>Start: {new Date(project.startDate).toLocaleDateString("en-GB")}</span>
                  <span>Est. Completion: {new Date(project.estimatedCompletion).toLocaleDateString("en-GB")}</span>
                  <span className="font-medium">Contract: {formatCurrency(project.contractValue)}</span>
                </div>
              </div>
              <div className="text-center">
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="42"
                      stroke="#F97316"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 42}`}
                      strokeDashoffset={`${2 * Math.PI * 42 * (1 - project.progress / 100)}`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#1A1A2E]">{project.progress}%</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Complete</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Link href="/portal/gallery">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <Camera className="w-8 h-8 mx-auto text-[#F97316] mb-2" />
                <p className="font-medium text-sm text-[#1A1A2E]">Photo Gallery</p>
                <p className="text-xs text-gray-500 mt-1">{recentPhotos.length} new</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/portal/documents">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 mx-auto text-[#F97316] mb-2" />
                <p className="font-medium text-sm text-[#1A1A2E]">Documents</p>
                <p className="text-xs text-gray-500 mt-1">Drawings & specs</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/portal/valuations">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-8 h-8 mx-auto text-[#F97316] mb-2" />
                <p className="font-medium text-sm text-[#1A1A2E]">Valuations</p>
                <p className="text-xs text-gray-500 mt-1">1 pending approval</p>
              </CardContent>
            </Card>
          </Link>
          <Link href="/portal/queries">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 mx-auto text-[#F97316] mb-2" />
                <p className="font-medium text-sm text-[#1A1A2E]">Queries</p>
                <p className="text-xs text-gray-500 mt-1">Raise a question</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Milestones */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Project Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {milestones.map((milestone, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                    milestone.status === "complete" && "bg-green-100",
                    milestone.status === "in_progress" && "bg-amber-100",
                    milestone.status === "pending" && "bg-gray-100"
                  )}>
                    {milestone.status === "complete" && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {milestone.status === "in_progress" && <Clock className="w-5 h-5 text-amber-600" />}
                    {milestone.status === "pending" && <AlertCircle className="w-5 h-5 text-gray-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      "font-medium text-sm",
                      milestone.status === "complete" ? "text-gray-700" : "text-[#1A1A2E]"
                    )}>
                      {milestone.name}
                    </p>
                    <p className="text-xs text-gray-500">{new Date(milestone.date).toLocaleDateString("en-GB", { day: "numeric", month: "long" })}</p>
                  </div>
                  {milestone.status === "complete" && (
                    <Badge className="bg-green-100 text-green-700 border-0 text-xs">Complete</Badge>
                  )}
                  {milestone.status === "in_progress" && (
                    <Badge className="bg-amber-100 text-amber-700 border-0 text-xs">In Progress</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Photos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Camera className="w-4 h-4" />
              Recent Progress Photos
            </CardTitle>
            <Link href="/portal/gallery">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recentPhotos.map(photo => (
                <div key={photo.id} className="space-y-2">
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#1A1A2E]">{photo.caption}</p>
                    <p className="text-xs text-gray-500">{new Date(photo.date).toLocaleDateString("en-GB")}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-4 text-center text-xs text-gray-500">
          <p>Questions about your project? Contact your project manager: <a href="mailto:james@buildflow.com" className="text-[#F97316] hover:underline">james@buildflow.com</a></p>
        </div>
      </footer>
    </div>
  )
}
