"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HardHat, ArrowRight, Check, X, PoundSterling, Shield, MapPin, Users } from "lucide-react"

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

const advantages = [
  { icon: PoundSterling, title: "7x Cheaper", desc: "BuildFlow starts at £49/mo. Procore typically costs £350+/mo with annual contracts. No hidden fees, no per-user upcharges." },
  { icon: Shield, title: "CIS Compliance Built In", desc: "Procore has zero CIS functionality. BuildFlow automates verification, deductions, returns, and statements — critical for UK contractors." },
  { icon: MapPin, title: "Built for UK Construction", desc: "UK H&S regulations, RAMS management, CDM compliance, domestic reverse VAT charge — all built in. Procore is US-first." },
  { icon: Users, title: "SME-Friendly", desc: "Procore is designed for enterprise. BuildFlow is purpose-built for teams of 1–50. No bloat, no features you'll never use." },
]

const featureComparison = [
  { feature: "Starting price", buildflow: "£49/mo", procore: "£350+/mo" },
  { feature: "Contract length", buildflow: "Monthly (cancel anytime)", procore: "Annual minimum" },
  { feature: "CIS compliance", buildflow: true, procore: false },
  { feature: "UK H&S regulations", buildflow: true, procore: false },
  { feature: "RAMS management", buildflow: true, procore: false },
  { feature: "CDM compliance tools", buildflow: true, procore: false },
  { feature: "Site diary with GPS", buildflow: true, procore: true },
  { feature: "Document management", buildflow: true, procore: true },
  { feature: "Estimating", buildflow: true, procore: true },
  { feature: "Subcontractor portal", buildflow: true, procore: true },
  { feature: "Mobile app", buildflow: true, procore: true },
  { feature: "Offline mode", buildflow: true, procore: false },
  { feature: "Snagging lists", buildflow: true, procore: true },
  { feature: "Variation tracking", buildflow: true, procore: true },
  { feature: "Setup time", buildflow: "< 1 hour", procore: "Days/weeks" },
  { feature: "UK-based support", buildflow: true, procore: false },
  { feature: "Free trial", buildflow: "14 days", procore: "Demo only" },
  { feature: "Data export", buildflow: "Anytime, any format", procore: "Limited" },
]

export default function CompareProcore() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-[#F97316]/20 text-[#F97316] border-0 mb-4">Compare</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            BuildFlow vs Procore
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Enterprise pricing shouldn&apos;t be the cost of going digital. Get more features for UK construction at a fraction of the price.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link href="/register">
              <Button size="lg" className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Key advantages */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-10">
            Why UK Builders Choose BuildFlow Over Procore
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {advantages.map((a, i) => (
              <Card key={i}>
                <CardContent className="p-6 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                    <a.icon className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1A1A2E] mb-1">{a.title}</h3>
                    <p className="text-sm text-gray-600">{a.desc}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing comparison */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-4">
            The Pricing Difference
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Procore charges enterprise rates with annual lock-in. BuildFlow gives you transparent, monthly pricing.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2 border-[#F97316]">
              <CardContent className="p-6 text-center">
                <Badge className="bg-[#F97316]/10 text-[#F97316] border-0 mb-3">BuildFlow</Badge>
                <div className="text-4xl font-bold text-[#1A1A2E] mb-1">£49<span className="text-lg text-gray-500">/mo</span></div>
                <p className="text-sm text-gray-500 mb-4">Starting price, cancel anytime</p>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> CIS compliance included</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> No per-user fees</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Monthly billing</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> 14-day free trial</li>
                  <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> All features included</li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border border-gray-200">
              <CardContent className="p-6 text-center">
                <Badge className="bg-gray-100 text-gray-600 border-0 mb-3">Procore</Badge>
                <div className="text-4xl font-bold text-[#1A1A2E] mb-1">£350+<span className="text-lg text-gray-500">/mo</span></div>
                <p className="text-sm text-gray-500 mb-4">Custom pricing, annual contract</p>
                <ul className="text-left space-y-2 text-sm">
                  <li className="flex gap-2"><X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> No CIS compliance</li>
                  <li className="flex gap-2"><X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Per-user licensing</li>
                  <li className="flex gap-2"><X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Annual commitment</li>
                  <li className="flex gap-2"><X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Demo only (no free trial)</li>
                  <li className="flex gap-2"><X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" /> Features by tier</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Full feature comparison */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-8">
            Full Feature Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-xl overflow-hidden border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Feature</th>
                  <th className="text-center py-3 px-4 font-bold text-[#F97316]">BuildFlow</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Procore</th>
                </tr>
              </thead>
              <tbody>
                {featureComparison.map((row, i) => (
                  <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                    <td className="py-3 px-4 font-medium text-[#1A1A2E]">{row.feature}</td>
                    <td className="py-3 px-4 text-center">
                      {row.buildflow === true ? <Check className="w-5 h-5 mx-auto text-[#F97316]" /> : row.buildflow === false ? <X className="w-5 h-5 mx-auto text-gray-300" /> : <span className="font-medium text-[#F97316]">{row.buildflow}</span>}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {row.procore === true ? <Check className="w-5 h-5 mx-auto text-green-500" /> : row.procore === false ? <X className="w-5 h-5 mx-auto text-gray-300" /> : <span className="text-gray-600">{row.procore}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F97316]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            All the power. None of the enterprise price tag.
          </h2>
          <p className="text-lg text-white/80 mb-8">
            14-day free trial. No credit card. No annual lock-in.
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
