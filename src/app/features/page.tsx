"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, ArrowRight, Check, FileText, Calculator, Users, Shield, Clipboard, TrendingUp, Calendar, Camera, FileSpreadsheet } from "lucide-react"

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1A1A2E]">BuildFlow</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-[#F97316] font-medium">Features</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Pricing</Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-[#1A1A2E]">About</Link>
            <Link href="/case-studies" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Case Studies</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Contact</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function FeaturesPage() {
  const features = [
    {
      icon: FileText,
      title: "Job Management",
      description: "Complete project lifecycle management from tender to handover",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800",
      details: [
        "Track unlimited jobs with custom phases and milestones",
        "Client information, site details, and contracts in one place",
        "Real-time progress tracking with completion percentages",
        "Automated alerts for approaching deadlines",
        "Document storage linked directly to each job",
        "Full audit trail of all changes and updates"
      ]
    },
    {
      icon: Calendar,
      title: "Daily Logs & Site Diaries",
      description: "Capture what happens on site, every single day",
      image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800",
      details: [
        "Mobile-first logging from site (works offline)",
        "Photo attachments with GPS and timestamp metadata",
        "Weather conditions, labour hours, and plant usage",
        "Notes on delays, variations, and site conditions",
        "Automatic notifications to office staff",
        "Export daily logs as PDF for client sharing"
      ]
    },
    {
      icon: Calculator,
      title: "Estimating & Quotes",
      description: "Build accurate estimates faster with intelligent templates",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800",
      details: [
        "Material, labour, plant, and subcontractor cost breakdown",
        "Set margins by category or overall",
        "Revision tracking with change history",
        "Convert won estimates straight into live jobs",
        "Import from Excel or build from scratch",
        "Professional PDF exports branded with your logo"
      ]
    },
    {
      icon: Users,
      title: "Subcontractor Portal",
      description: "Manage your supply chain with visibility and control",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800",
      details: [
        "Digital subcontractor database with all certifications",
        "Track insurance, CIS status, and accreditation expiry",
        "Secure portal for subbies to view orders and submit invoices",
        "Performance ratings and historical spend analysis",
        "Automated reminders for expiring documents",
        "No visibility of your margins or other jobs"
      ]
    },
    {
      icon: TrendingUp,
      title: "Finance & CIS",
      description: "HMRC-compliant CIS management and financial tracking",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
      details: [
        "Automated CIS deductions (20% standard, 30% unverified)",
        "Generate monthly CIS returns in minutes",
        "Verification statements for subcontractors",
        "Real-time P&L by job with cost vs budget tracking",
        "Valuation management with retention tracking",
        "Cash flow forecasting based on payment terms"
      ]
    },
    {
      icon: Shield,
      title: "Health & Safety",
      description: "Digital RAMS, inductions, and incident management",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800",
      details: [
        "Create and store RAMS templates for common tasks",
        "Site induction records with sign-off tracking",
        "Incident reporting with RIDDOR severity classification",
        "Photo evidence and witness statements",
        "Corrective action tracking until closure",
        "HSE-ready audit trail and compliance reporting"
      ]
    },
    {
      icon: Clipboard,
      title: "Snagging & Defects",
      description: "Track punch lists from identification to sign-off",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
      details: [
        "Log defects with photos, location, and priority",
        "Assign responsibility to team members or subbies",
        "Status workflow from Open → In Progress → Resolved",
        "Client-facing snagging reports with photos",
        "Retention release tracking tied to snagging completion",
        "Export defects list as PDF or Excel"
      ]
    },
    {
      icon: Calendar,
      title: "Timesheets & Labour",
      description: "Track who worked where, when, and for how long",
      image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800",
      details: [
        "Digital timesheets linked to jobs and phases",
        "Clock in/out from mobile with GPS verification",
        "Overtime calculation and approval workflow",
        "Export to payroll or accounting software",
        "Labour cost allocation against estimates",
        "Real-time labour utilisation dashboards"
      ]
    },
    {
      icon: FileSpreadsheet,
      title: "Document Management",
      description: "All project documents in one searchable archive",
      image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800",
      details: [
        "Upload contracts, drawings, specs, and certificates",
        "Version control with automatic revision numbering",
        "Tag documents by job, phase, or document type",
        "Full-text search across all uploaded files",
        "Controlled access based on user roles",
        "Never lose a drawing or invoice again"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="success" className="mb-4">Features</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-6">
            Everything You Need to Run a Construction Business
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Nine core modules covering the full lifecycle of every project — from tender to final account. Built for UK construction SMEs who are tired of spreadsheets.
          </p>
          <Link href="/register">
            <Button size="lg">
              Start Free Trial <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {features.map((feature, index) => (
            <div key={feature.title} className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F97316]/10 mb-6">
                  <feature.icon className="w-6 h-6 text-[#F97316]" />
                </div>
                <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">{feature.title}</h2>
                <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                <ul className="space-y-3">
                  {feature.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#10B981] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-[400px] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1A1A2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            See BuildFlow in Action
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Book a 15-minute demo and we'll show you exactly how BuildFlow works for businesses like yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="default">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-[#1A1A2E]">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2026 BuildFlow. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
