"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { HardHat, ArrowRight, Search, Check, Clock, ExternalLink } from "lucide-react"

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
            <Link href="/features" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Features</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Pricing</Link>
            <Link href="/compare" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Compare</Link>
            <Link href="/integrations" className="text-sm text-[#F97316] font-medium">Integrations</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Contact</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/register"><Button size="sm">Start Free Trial</Button></Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <div className="space-y-2 text-sm">
              <Link href="/features" className="block hover:text-white">Features</Link>
              <Link href="/pricing" className="block hover:text-white">Pricing</Link>
              <Link href="/cis" className="block hover:text-white">CIS Compliance</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Integrations</h4>
            <div className="space-y-2 text-sm">
              <Link href="/integrations/xero" className="block hover:text-white">Xero</Link>
              <Link href="/integrations/hmrc" className="block hover:text-white">HMRC</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Compare</h4>
            <div className="space-y-2 text-sm">
              <Link href="/compare/spreadsheets" className="block hover:text-white">vs Spreadsheets</Link>
              <Link href="/compare/procore" className="block hover:text-white">vs Procore</Link>
              <Link href="/compare/buildertrend" className="block hover:text-white">vs Buildertrend</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block hover:text-white">About</Link>
              <Link href="/contact" className="block hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-sm text-center">
          © {new Date().getFullYear()} BuildFlow. Built for UK construction.
        </div>
      </div>
    </footer>
  )
}

type IntegrationStatus = "live" | "coming_soon" | "beta"

interface Integration {
  name: string
  category: string
  status: IntegrationStatus
  description: string
  logo: string
  href?: string
}

const integrations: Integration[] = [
  // Accounting
  { name: "Xero", category: "Accounting", status: "live", description: "Sync invoices, payments, and CIS deductions directly with Xero. Construction-focused mapping.", logo: "📊", href: "/integrations/xero" },
  { name: "Sage", category: "Accounting", status: "coming_soon", description: "Connect to Sage 50 and Sage Business Cloud for seamless accounting sync.", logo: "📗" },
  { name: "QuickBooks", category: "Accounting", status: "coming_soon", description: "Two-way sync with QuickBooks Online for invoices, expenses, and reporting.", logo: "📘" },
  { name: "FreeAgent", category: "Accounting", status: "coming_soon", description: "Sync with FreeAgent for small business accounting, expenses, and tax.", logo: "📙" },
  // Payments
  { name: "Stripe", category: "Payments", status: "live", description: "Accept online payments from clients. Card payments, direct debit, and invoicing.", logo: "💳" },
  { name: "GoCardless", category: "Payments", status: "coming_soon", description: "Set up direct debit collection for recurring payments and retention releases.", logo: "🏦" },
  // Storage
  { name: "Google Drive", category: "Storage", status: "live", description: "Sync project documents with Google Drive. Automatic folder structure per project.", logo: "📁" },
  { name: "Dropbox", category: "Storage", status: "coming_soon", description: "Connect Dropbox for document storage and sharing with your team.", logo: "📦" },
  { name: "OneDrive", category: "Storage", status: "coming_soon", description: "Integrate with Microsoft OneDrive and SharePoint for enterprise document management.", logo: "☁️" },
  // Communication
  { name: "Slack", category: "Communication", status: "live", description: "Get real-time notifications in Slack for job updates, safety alerts, and deadlines.", logo: "💬" },
  { name: "Microsoft Teams", category: "Communication", status: "coming_soon", description: "Receive BuildFlow notifications and updates directly in Microsoft Teams channels.", logo: "👥" },
  { name: "Email", category: "Communication", status: "live", description: "Automated email notifications for invoices, approvals, cert expiries, and deadline reminders.", logo: "📧" },
  // Government
  { name: "HMRC CIS", category: "Government", status: "live", description: "Verify subcontractors and submit CIS returns directly to HMRC.", logo: "🏛️", href: "/integrations/hmrc" },
  { name: "HMRC MTD", category: "Government", status: "coming_soon", description: "Making Tax Digital compliance for VAT returns and digital record-keeping.", logo: "📋" },
  // Maps
  { name: "Google Maps", category: "Maps", status: "live", description: "Site locations, travel time estimates, and GPS-tagged diary entries.", logo: "🗺️" },
]

const categories = ["All", "Accounting", "Payments", "Storage", "Communication", "Government", "Maps"]
const statusConfig: Record<IntegrationStatus, { label: string; bg: string; text: string }> = {
  live: { label: "Live", bg: "bg-green-100", text: "text-green-800" },
  beta: { label: "Beta", bg: "bg-blue-100", text: "text-blue-800" },
  coming_soon: { label: "Coming Soon", bg: "bg-gray-100", text: "text-gray-600" },
}

export default function IntegrationsPage() {
  const [category, setCategory] = useState("All")
  const [search, setSearch] = useState("")
  const [requestName, setRequestName] = useState("")
  const [requestEmail, setRequestEmail] = useState("")
  const [requestTool, setRequestTool] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const filtered = integrations.filter((i) => {
    const matchCategory = category === "All" || i.category === category
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase())
    return matchCategory && matchSearch
  })

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
    setRequestName("")
    setRequestEmail("")
    setRequestTool("")
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-[#F97316]/20 text-[#F97316] border-0 mb-4">Integrations</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Connect BuildFlow to Your Favourite Tools
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            From accounting to HMRC, BuildFlow integrates with the tools UK construction businesses rely on.
            All integrations included on every plan.
          </p>
        </div>
      </section>

      {/* Partner logos bar */}
      <section className="py-6 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-2xl">
            {integrations.filter(i => i.status === "live").map((i) => (
              <div key={i.name} className="flex items-center gap-2 text-gray-400">
                <span>{i.logo}</span>
                <span className="text-sm font-medium">{i.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters + Grid */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search + Category filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Search integrations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${category === c ? "bg-[#F97316] text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Integration grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((integration) => {
              const status = statusConfig[integration.status]
              const inner = (
                <Card className={`h-full hover:shadow-md transition-all ${integration.href ? "cursor-pointer hover:-translate-y-0.5" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                          {integration.logo}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1A1A2E] text-sm">{integration.name}</h3>
                          <p className="text-xs text-gray-500">{integration.category}</p>
                        </div>
                      </div>
                      <Badge className={`${status.bg} ${status.text} border-0 text-xs`}>
                        {integration.status === "live" && <Check className="w-3 h-3 mr-1" />}
                        {integration.status === "coming_soon" && <Clock className="w-3 h-3 mr-1" />}
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                    {integration.href && (
                      <div className="flex items-center gap-1 text-xs text-[#F97316] font-medium mt-3">
                        Learn more <ExternalLink className="w-3 h-3" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
              return integration.href ? (
                <Link key={integration.name} href={integration.href}>{inner}</Link>
              ) : (
                <div key={integration.name}>{inner}</div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Request integration form */}
      <section className="py-16 bg-white">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-[#1A1A2E] text-center mb-2">
                Don&apos;t See Your Tool?
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Request an integration and we&apos;ll prioritise based on demand.
              </p>
              {submitted ? (
                <div className="text-center py-4">
                  <Check className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="font-medium text-green-700">Request submitted! We&apos;ll be in touch.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitRequest} className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Your name</label>
                    <Input value={requestName} onChange={(e) => setRequestName(e.target.value)} required placeholder="John Smith" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Email</label>
                    <Input type="email" value={requestEmail} onChange={(e) => setRequestEmail(e.target.value)} required placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Tool / Software you want integrated</label>
                    <Input value={requestTool} onChange={(e) => setRequestTool(e.target.value)} required placeholder="e.g. Sage 200, Buildxact" />
                  </div>
                  <Button type="submit" className="w-full bg-[#F97316] hover:bg-[#EA580C]">
                    Submit Request
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F97316]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            All Integrations Included on Every Plan
          </h2>
          <p className="text-lg text-white/80 mb-8">
            No add-on fees. No premium tiers for integrations. Connect everything from day one.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-[#F97316] hover:bg-gray-100 px-8">
              Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
