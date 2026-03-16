"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HardHat, ArrowRight, Check, ArrowLeftRight, Shield, FileText, Users, Clock, AlertTriangle } from "lucide-react"

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
            <Link href="/integrations" className="text-sm text-[#F97316] font-medium">Integrations</Link>
            <Link href="/compare" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Compare</Link>
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
              <Link href="/integrations" className="block hover:text-white">All Integrations</Link>
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

const features = [
  {
    icon: Users,
    title: "CIS Verification",
    desc: "Verify subcontractors with HMRC directly from BuildFlow. Enter their UTR and NI number — we check their registration status and deduction rate in seconds.",
    details: [
      "Instant verification of subcontractor CIS status",
      "Supports individuals, sole traders, partnerships, and limited companies",
      "Verification status stored and tracked per subcontractor",
      "Re-verification prompts at the start of each tax year",
    ],
  },
  {
    icon: FileText,
    title: "Monthly Return Submission",
    desc: "Generate and submit your CIS monthly return to HMRC with one click. All deductions, payments, and subcontractor details compiled automatically.",
    details: [
      "One-click return generation from payment data",
      "Covers all subcontractor payments in the tax month",
      "Nil returns supported for months with no payments",
      "Submission confirmation and reference number stored",
    ],
  },
  {
    icon: Shield,
    title: "Making Tax Digital (MTD)",
    desc: "BuildFlow is preparing for full MTD compliance. Digital record-keeping is already built in — VAT return submission is coming soon.",
    badge: "Coming Soon",
    details: [
      "Digital record-keeping already compliant",
      "VAT return submission via MTD API (coming soon)",
      "Bridging software capability planned",
      "Automatic digital links between records",
    ],
  },
]

const verificationStatuses = [
  { status: "Verified — Gross (0%)", color: "bg-green-100 text-green-800", desc: "Subcontractor has gross payment status. Pay in full." },
  { status: "Verified — Net (20%)", color: "bg-amber-100 text-amber-800", desc: "Registered subcontractor. Standard 20% deduction applies." },
  { status: "Verified — Higher Rate (30%)", color: "bg-red-100 text-red-800", desc: "Unregistered. Higher 30% deduction rate. Advise them to register." },
  { status: "Unmatched", color: "bg-gray-100 text-gray-600", desc: "HMRC couldn't match the details. Check UTR/NI number and retry." },
  { status: "Not Yet Verified", color: "bg-gray-100 text-gray-600", desc: "Verification not yet performed. Must verify before first payment." },
]

export default function HMRCIntegrationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <Link href="/integrations" className="text-sm text-gray-400 hover:text-white">Integrations</Link>
                <span className="text-gray-500">/</span>
                <span className="text-white text-sm">HMRC</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-0 mb-4">Live Integration</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                BuildFlow + HMRC
              </h1>
              <p className="text-lg text-gray-300 mb-6">
                Direct HMRC integration for CIS verification and monthly return submission.
                Never miss a deadline. Never miscalculate a deduction.
              </p>
              <Link href="/register">
                <Button size="lg" className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8">
                  Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
            <div className="flex-shrink-0">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 flex items-center gap-6">
                <div className="w-16 h-16 rounded-xl bg-[#F97316] flex items-center justify-center">
                  <HardHat className="w-8 h-8 text-white" />
                </div>
                <ArrowLeftRight className="w-8 h-8 text-[#F97316]" />
                <div className="w-16 h-16 rounded-xl bg-[#00703C] flex items-center justify-center text-3xl">
                  🏛️
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-10">
            HMRC Integration Features
          </h2>
          <div className="space-y-8">
            {features.map((f, i) => (
              <Card key={i}>
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                        <f.icon className="w-6 h-6 text-[#F97316]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-[#1A1A2E] text-lg">{f.title}</h3>
                        {f.badge && <Badge className="bg-blue-100 text-blue-800 border-0 text-xs">{f.badge}</Badge>}
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{f.desc}</p>
                      <ul className="grid md:grid-cols-2 gap-2">
                        {f.details.map((d, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                            <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Verification status per subcontractor */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-4">
            Verification Status Per Subcontractor
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Every subcontractor in BuildFlow shows their current CIS verification status.
            At a glance, you know who&apos;s verified, who needs re-verification, and what rate to apply.
          </p>
          <div className="space-y-3">
            {verificationStatuses.map((v, i) => (
              <div key={i} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <Badge className={`${v.color} border-0 text-xs flex-shrink-0 mt-0.5`}>{v.status}</Badge>
                <p className="text-sm text-gray-600">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deadline management */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-10">
            Never Miss an HMRC Deadline
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
                <h3 className="font-bold text-[#1A1A2E] mb-2">Automated Reminders</h3>
                <p className="text-sm text-gray-600">
                  Get notified 7 days, 3 days, and 1 day before the 19th monthly deadline.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
                <h3 className="font-bold text-[#1A1A2E] mb-2">One-Click Returns</h3>
                <p className="text-sm text-gray-600">
                  Your monthly CIS return is pre-compiled from payment data. Review and submit in seconds.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-[#F97316] mx-auto mb-3" />
                <h3 className="font-bold text-[#1A1A2E] mb-2">Penalty Prevention</h3>
                <p className="text-sm text-gray-600">
                  Track submission status per month. See which returns are submitted, pending, or overdue.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F97316]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Automate Your HMRC Compliance
          </h2>
          <p className="text-lg text-white/80 mb-8">
            CIS verification, monthly returns, and deadline management — all built in.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#F97316] hover:bg-gray-100 px-8">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/cis">
              <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10 px-8">
                Learn About CIS
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
