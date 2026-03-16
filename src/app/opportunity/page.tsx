"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HardHat, Menu, X, TrendingUp, Users, Shield, Target, BarChart3, Zap, Building2, PoundSterling, ArrowRight, Check, AlertTriangle, FileText, Briefcase, Globe } from "lucide-react"
import { useState } from "react"

function Navbar() {
  const [open, setOpen] = useState(false)
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
            <Link href="/about" className="text-sm text-gray-600 hover:text-[#1A1A2E]">About</Link>
            <Link href="/opportunity" className="text-sm text-[#F97316] font-medium">Opportunity</Link>
            <Link href="/market" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Market Research</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Contact</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/register"><Button size="sm">Start Free Trial</Button></Link>
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <Link href="/features" className="block text-sm text-gray-600 py-2">Features</Link>
            <Link href="/pricing" className="block text-sm text-gray-600 py-2">Pricing</Link>
            <Link href="/about" className="block text-sm text-gray-600 py-2">About</Link>
            <Link href="/opportunity" className="block text-sm text-[#F97316] font-medium py-2">Opportunity</Link>
            <Link href="/market" className="block text-sm text-gray-600 py-2">Market Research</Link>
            <Link href="/contact" className="block text-sm text-gray-600 py-2">Contact</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

function StatCard({ value, label, icon: Icon, color = "orange" }: { value: string; label: string; icon: React.ElementType; color?: string }) {
  const colors: Record<string, string> = {
    orange: "bg-orange-50 text-orange-600 border-orange-200",
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  }
  return (
    <div className={`rounded-2xl border p-6 ${colors[color]} transition-transform hover:scale-105`}>
      <Icon className="w-8 h-8 mb-3 opacity-80" />
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm opacity-70">{label}</div>
    </div>
  )
}

export default function OpportunityPage() {
  const competitors = [
    { name: "Procore", pricing: "£375+/user/mo", strengths: "Enterprise features, unlimited users", weaknesses: "Overkill for SMEs, very expensive", target: "Enterprise" },
    { name: "Fieldwire", pricing: "£29–89/user/mo", strengths: "Good field execution tools", weaknesses: "No CIS, limited financial tools", target: "Mid-market" },
    { name: "Buildertrend", pricing: "£240–720/mo", strengths: "Residential focus, client portal", weaknesses: "US-centric, no UK compliance", target: "Residential" },
    { name: "Archdesk", pricing: "£690+/mo", strengths: "ERP-style, comprehensive", weaknesses: "Complex setup, expensive", target: "Large contractors" },
    { name: "Contractor Foreman", pricing: "£40+/mo", strengths: "Affordable, wide features", weaknesses: "US-built, basic UI", target: "Small contractors" },
    { name: "Eque2", pricing: "On request", strengths: "UK-built, CIS support", weaknesses: "Legacy UI, slow innovation", target: "Mid-market UK" },
  ]

  const projections = [
    { customers: "500", mrr: "£22,500", arr: "£270,000" },
    { customers: "1,000", mrr: "£45,000", arr: "£540,000" },
    { customers: "5,000", mrr: "£225,000", arr: "£2,700,000" },
    { customers: "10,000", mrr: "£450,000", arr: "£5,400,000" },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm text-orange-300 mb-6">
            📊 Business Plan & Market Opportunity
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            A £140B Industry.<br />
            <span className="text-[#F97316]">Still Running on Spreadsheets.</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
            UK construction output hit £140.7 billion in 2024. Over 370,000 firms operate in the sector — 
            and the vast majority still manage projects with paper, WhatsApp, and Excel. BuildFlow is the modern alternative.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-[#F97316] hover:bg-orange-600 text-white px-8 py-3 text-lg">
                Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/market">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg">
                View Market Research
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Market Size Stats */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-4">Market Size</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            The UK construction market is enormous — and growing. Here&apos;s the opportunity in numbers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard value="£140.7B" label="UK Construction Output (2024)" icon={Building2} color="orange" />
            <StatCard value="370,770" label="Registered Construction Firms" icon={Users} color="blue" />
            <StatCard value="97,115" label="Construction Contractors" icon={Briefcase} color="green" />
            <StatCard value="4.3%" label="Market CAGR (2025–2034)" icon={TrendingUp} color="purple" />
          </div>
          <div className="mt-12 bg-white rounded-2xl border p-8">
            <h3 className="text-xl font-bold text-[#1A1A2E] mb-6">TAM → SAM → SOM</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-xl bg-orange-50">
                <div className="text-sm font-semibold text-orange-600 mb-2">Total Addressable Market</div>
                <div className="text-4xl font-bold text-[#1A1A2E]">£2.4B</div>
                <div className="text-sm text-gray-600 mt-2">Construction software spend across 370K+ UK firms</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-blue-50">
                <div className="text-sm font-semibold text-blue-600 mb-2">Serviceable Addressable Market</div>
                <div className="text-4xl font-bold text-[#1A1A2E]">£580M</div>
                <div className="text-sm text-gray-600 mt-2">SME contractors (2–50 employees) needing project + finance tools</div>
              </div>
              <div className="text-center p-6 rounded-xl bg-green-50">
                <div className="text-sm font-semibold text-green-600 mb-2">Serviceable Obtainable Market</div>
                <div className="text-4xl font-bold text-[#1A1A2E]">£29M</div>
                <div className="text-sm text-gray-600 mt-2">5% capture of SAM within 5 years — 5,400 paying customers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-4">The Problem</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Construction SMEs are drowning in admin. Here&apos;s what they&apos;re dealing with every day.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: "Paper-Based Processes", desc: "73% of UK construction firms use digital tools on fewer than 30% of projects. The rest? Paper, spreadsheets, and WhatsApp groups." },
              { icon: AlertTriangle, title: "CIS Compliance Nightmares", desc: "Monthly CIS returns, subcontractor verification, tax deduction calculations — most firms still do this manually, risking HMRC penalties." },
              { icon: PoundSterling, title: "Cash Flow Blindness", desc: "Valuations, variations, and retentions managed across disconnected spreadsheets. Many firms don't know their true margin until the job is finished." },
              { icon: Users, title: "Subcontractor Chaos", desc: "Tracking subcontractor costs, payments, and compliance across dozens of subbies — with phone calls and emails." },
              { icon: Shield, title: "H&S Documentation Gaps", desc: "CDM 2015 compliance, risk assessments, method statements — often stored in filing cabinets or random email attachments." },
              { icon: BarChart3, title: "No Real-Time Visibility", desc: "Directors and project managers have no dashboard, no live data. Decisions are made on gut feel, not data." },
            ].map((problem) => (
              <div key={problem.title} className="bg-red-50 border border-red-100 rounded-2xl p-6">
                <problem.icon className="w-8 h-8 text-red-500 mb-3" />
                <h3 className="font-bold text-[#1A1A2E] mb-2">{problem.title}</h3>
                <p className="text-sm text-gray-600">{problem.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Regulatory Drivers */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-4">Regulatory Drivers</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            UK construction regulation is tightening. Non-compliance isn&apos;t an option — it&apos;s a business risk.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: "CIS (Construction Industry Scheme)", desc: "HMRC mandates monthly CIS returns for all contractors. Incorrect deductions or late filings attract penalties of £100–£3,000+. BuildFlow automates verification and calculations." },
              { title: "CDM 2015 Regulations", desc: "Construction (Design and Management) Regulations require principal contractors to maintain detailed H&S documentation, pre-construction information, and construction phase plans." },
              { title: "Building Safety Act 2022", desc: "Post-Grenfell legislation requires a 'golden thread' of digital building information throughout the building lifecycle. Paper records no longer suffice." },
              { title: "Making Tax Digital (MTD)", desc: "HMRC's MTD programme requires digital record-keeping and quarterly reporting. Construction firms must use compliant software — spreadsheets alone won't cut it." },
            ].map((reg) => (
              <div key={reg.title} className="bg-white rounded-2xl border p-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-[#F97316] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-[#1A1A2E] mb-2">{reg.title}</h3>
                    <p className="text-sm text-gray-600">{reg.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Target Customer */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-4">Target Customer</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-200 p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg text-[#1A1A2E] mb-4">👷 Primary: SME Contractors</h3>
                  <ul className="space-y-3">
                    {[
                      "2–50 employees",
                      "Turnover £500K – £20M",
                      "Residential, commercial, or mixed projects",
                      "Use subcontractors regularly",
                      "Need CIS compliance",
                      "Currently using spreadsheets or basic tools",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <Check className="w-4 h-4 text-orange-500 flex-shrink-0" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1A1A2E] mb-4">📊 Market Metrics</h3>
                  <div className="space-y-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-[#F97316]">~97,000</div>
                      <div className="text-sm text-gray-600">Construction contractors in the UK</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-[#F97316]">£45/mo</div>
                      <div className="text-sm text-gray-600">Average target price point per user</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-2xl font-bold text-[#F97316]">83%</div>
                      <div className="text-sm text-gray-600">Of UK firms prioritise digital transformation</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Landscape */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-4">Competitive Landscape</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Most competitors are either too expensive, too complex, or not built for the UK market.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-2xl border overflow-hidden">
              <thead>
                <tr className="bg-[#1A1A2E] text-white">
                  <th className="text-left p-4 text-sm font-semibold">Competitor</th>
                  <th className="text-left p-4 text-sm font-semibold">Pricing</th>
                  <th className="text-left p-4 text-sm font-semibold">Strengths</th>
                  <th className="text-left p-4 text-sm font-semibold">Weaknesses</th>
                  <th className="text-left p-4 text-sm font-semibold">Target</th>
                </tr>
              </thead>
              <tbody>
                {competitors.map((c, i) => (
                  <tr key={c.name} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-4 font-medium text-sm">{c.name}</td>
                    <td className="p-4 text-sm text-gray-600">{c.pricing}</td>
                    <td className="p-4 text-sm text-green-600">{c.strengths}</td>
                    <td className="p-4 text-sm text-red-500">{c.weaknesses}</td>
                    <td className="p-4 text-sm text-gray-600">{c.target}</td>
                  </tr>
                ))}
                <tr className="bg-orange-50 border-t-2 border-orange-300">
                  <td className="p-4 font-bold text-sm text-[#F97316]">BuildFlow ✦</td>
                  <td className="p-4 text-sm font-medium">£29–59/user/mo</td>
                  <td className="p-4 text-sm text-green-600">UK-native, CIS built-in, SME-first</td>
                  <td className="p-4 text-sm text-gray-400">New entrant, building brand</td>
                  <td className="p-4 text-sm font-medium">UK SME contractors</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Why BuildFlow */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-12">Why BuildFlow Wins</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🇬🇧", title: "Built for the UK", desc: "CIS, CDM 2015, Building Safety Act, MTD — compliance is native, not bolted on." },
              { icon: "💷", title: "SME Pricing", desc: "Starting at £29/user/month. No enterprise quotes, no hidden costs, no annual lock-in." },
              { icon: "⚡", title: "Live in 15 Minutes", desc: "Self-service onboarding. Import your data, invite your team, start tracking jobs today." },
              { icon: "📱", title: "Mobile-First", desc: "Site managers and subbies need it on their phone. Offline-capable, built for the field." },
              { icon: "🔗", title: "Xero & Sage Integration", desc: "Two-way sync with the accounting tools UK builders actually use." },
              { icon: "📊", title: "Real-Time Dashboards", desc: "Live P&L per job, cash flow forecasting, margin tracking. No more end-of-job surprises." },
            ].map((item) => (
              <div key={item.title} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-[#1A1A2E] mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revenue Projections */}
      <section className="py-16 bg-gradient-to-br from-[#1A1A2E] to-[#0F3460]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-white mb-4">Revenue Projections</h2>
          <p className="text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Based on average revenue of £45/user/month across blended plans.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projections.map((p) => (
              <div key={p.customers} className="bg-white/10 backdrop-blur rounded-2xl border border-white/20 p-6 text-center">
                <div className="text-sm text-orange-300 font-medium mb-1">{p.customers} Customers</div>
                <div className="text-3xl font-bold text-white mb-2">{p.arr}</div>
                <div className="text-sm text-gray-400">ARR ({p.mrr} MRR)</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Go-to-Market */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#1A1A2E] mb-12">Go-to-Market Strategy</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              { icon: Globe, title: "Product-Led Growth", desc: "Free trial, self-serve onboarding, upgrade within the product. No sales calls needed for SMEs." },
              { icon: Target, title: "Content & SEO", desc: "Rank for 'CIS software', 'construction project management UK', 'builder job tracking'. Education-first marketing." },
              { icon: Users, title: "Industry Partnerships", desc: "Partner with builders' merchants, trade associations (FMB, CIOB), and accountants who serve construction clients." },
              { icon: Zap, title: "Referral Programme", desc: "Happy builders tell other builders. 20% referral discount drives organic word-of-mouth growth." },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 p-6 bg-gray-50 rounded-2xl">
                <item.icon className="w-8 h-8 text-[#F97316] flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-[#1A1A2E] mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#F97316] to-[#EA580C]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to modernise your construction business?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join hundreds of UK builders who&apos;ve ditched spreadsheets for BuildFlow.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-white text-[#F97316] hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <p className="text-sm text-orange-200 mt-4">No credit card required • Free 14-day trial • Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="/features" className="block text-gray-400 hover:text-white">Features</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white">Pricing</Link>
                <Link href="/integrations" className="block text-gray-400 hover:text-white">Integrations</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-white">About</Link>
                <Link href="/opportunity" className="block text-gray-400 hover:text-white">Opportunity</Link>
                <Link href="/market" className="block text-gray-400 hover:text-white">Market Research</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <div className="space-y-2">
                <Link href="/case-studies" className="block text-gray-400 hover:text-white">Case Studies</Link>
                <Link href="/cis-guide" className="block text-gray-400 hover:text-white">CIS Guide</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-gray-400 hover:text-white">Privacy</Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white">Terms</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} BuildFlow by Data & Digital. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
