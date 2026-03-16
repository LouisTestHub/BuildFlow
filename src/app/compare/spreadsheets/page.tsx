"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HardHat, ArrowRight, Check, X, AlertTriangle, Zap, Clock, FileSpreadsheet } from "lucide-react"

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
            <Link href="/compare" className="text-sm text-[#F97316] font-medium">Compare</Link>
            <Link href="/integrations" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Integrations</Link>
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
            <h4 className="text-white font-semibold mb-4">Compare</h4>
            <div className="space-y-2 text-sm">
              <Link href="/compare/spreadsheets" className="block hover:text-white">vs Spreadsheets</Link>
              <Link href="/compare/procore" className="block hover:text-white">vs Procore</Link>
              <Link href="/compare/buildertrend" className="block hover:text-white">vs Buildertrend</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <div className="space-y-2 text-sm">
              <Link href="/cis-calculator" className="block hover:text-white">CIS Calculator</Link>
              <Link href="/roi-calculator" className="block hover:text-white">ROI Calculator</Link>
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

const painPoints = [
  { icon: AlertTriangle, title: "Version chaos", desc: "Multiple copies of the same spreadsheet floating around. Which one is the latest? Nobody knows." },
  { icon: Clock, title: "Time sink", desc: "Hours every week manually updating costs, chasing figures, and formatting reports — time you should be on-site." },
  { icon: FileSpreadsheet, title: "No real-time visibility", desc: "Your spreadsheet shows yesterday's data at best. By the time you update it, the numbers have changed." },
  { icon: X, title: "No CIS automation", desc: "Manually calculating CIS deductions, tracking verification status, preparing monthly returns. Error-prone and tedious." },
  { icon: AlertTriangle, title: "Formula errors", desc: "One broken formula can cascade through your entire workbook. Construction budgets are too important for Excel errors." },
  { icon: Clock, title: "No mobile access", desc: "You can't meaningfully update a spreadsheet from a building site. Data entry waits until you're back at the desk." },
]

const migrationSteps = [
  { step: 1, title: "Sign up & import", desc: "Create your account and import your existing project data. We support CSV imports from any spreadsheet." },
  { step: 2, title: "Add your team", desc: "Invite site managers, QS, and admin. They get access on their phones immediately." },
  { step: 3, title: "Set up subcontractors", desc: "Import your subbie directory. They get their own portal for orders, invoices, and certs." },
  { step: 4, title: "Go live", desc: "Start logging daily diaries, tracking costs, and managing jobs. Most teams are fully operational within a day." },
]

const features = [
  { feature: "Real-time cost tracking", spreadsheet: "Manual updates", buildflow: "Automatic from invoices & orders" },
  { feature: "CIS compliance", spreadsheet: "Manual calculations", buildflow: "Fully automated with HMRC verification" },
  { feature: "Daily site logs", spreadsheet: "Not practical", buildflow: "Mobile app with GPS & photo capture" },
  { feature: "Subcontractor management", spreadsheet: "Basic contact list", buildflow: "Full portal with compliance tracking" },
  { feature: "Document storage", spreadsheet: "Separate folders", buildflow: "Integrated per project & category" },
  { feature: "Estimating", spreadsheet: "DIY templates", buildflow: "Professional templates with markup" },
  { feature: "Reporting", spreadsheet: "Build your own", buildflow: "One-click dashboards & exports" },
  { feature: "Safety management", spreadsheet: "Not possible", buildflow: "RAMS, incidents, inductions built in" },
  { feature: "Multi-user access", spreadsheet: "File sharing issues", buildflow: "Role-based access, real-time sync" },
  { feature: "Audit trail", spreadsheet: "None", buildflow: "Every change logged with timestamp" },
]

export default function CompareSpreadsheets() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-[#F97316]/20 text-[#F97316] border-0 mb-4">Compare</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            BuildFlow vs Spreadsheets
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-2">
            94% of UK construction SMEs still manage projects in spreadsheets.
            Here&apos;s why the other 6% are winning.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/register">
              <Button size="lg" className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/roi-calculator">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 px-8">
                Calculate Your Savings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-4">
            The Problem with Spreadsheets
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Spreadsheets were great in the 90s. But construction businesses in 2026 need real tools.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {painPoints.map((p, i) => (
              <Card key={i} className="border border-red-100 bg-red-50/30">
                <CardContent className="p-5">
                  <p.icon className="w-8 h-8 text-red-400 mb-3" />
                  <h3 className="font-bold text-[#1A1A2E] mb-1">{p.title}</h3>
                  <p className="text-sm text-gray-600">{p.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Feature comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-8">
            Feature-by-Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Feature</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Spreadsheets</th>
                  <th className="text-left py-3 px-4 font-bold text-[#F97316]">BuildFlow</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                    <td className="py-3 px-4 font-medium text-[#1A1A2E]">{f.feature}</td>
                    <td className="py-3 px-4 text-gray-500">{f.spreadsheet}</td>
                    <td className="py-3 px-4 text-[#1A1A2E] font-medium">{f.buildflow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Migration path */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-4">
            Migrating from Spreadsheets? It&apos;s Easy.
          </h2>
          <p className="text-gray-600 text-center mb-10">Most teams are up and running in under a day.</p>
          <div className="grid md:grid-cols-4 gap-6">
            {migrationSteps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-[#F97316] text-white flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  {s.step}
                </div>
                <h3 className="font-bold text-[#1A1A2E] mb-1">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F97316]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ditch the spreadsheets. Start building smarter.
          </h2>
          <p className="text-lg text-white/80 mb-8">
            14-day free trial. Free data migration on Pro plans. No credit card required.
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
