"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HardHat, ArrowRight, Check, X, MapPin, Shield, PoundSterling, Globe } from "lucide-react"

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
  { icon: MapPin, title: "Built for the UK", desc: "Buildertrend is designed for the US market. BuildFlow is purpose-built for UK construction — CIS, CDM, RAMS, domestic reverse VAT charge, and UK H&S regulations." },
  { icon: Shield, title: "CIS Compliance", desc: "Buildertrend has zero CIS functionality. BuildFlow automates subcontractor verification, deduction calculations, monthly returns, and payment statements." },
  { icon: PoundSterling, title: "Transparent Pricing in GBP", desc: "Buildertrend prices in USD with tiered plans that get expensive fast. BuildFlow prices in £ with simple, transparent plans and no annual lock-in." },
  { icon: Globe, title: "UK-Based Support", desc: "When you need help, you get a UK team who understands UK construction. No time-zone lag, no explaining what CIS means." },
]

const featureComparison = [
  { feature: "Starting price", buildflow: "£49/mo", buildertrend: "$99+/mo (USD)" },
  { feature: "Pricing currency", buildflow: "GBP (£)", buildertrend: "USD ($)" },
  { feature: "Contract", buildflow: "Monthly", buildertrend: "Annual" },
  { feature: "CIS compliance", buildflow: true, buildertrend: false },
  { feature: "UK H&S regulations", buildflow: true, buildertrend: false },
  { feature: "RAMS management", buildflow: true, buildertrend: false },
  { feature: "CDM compliance", buildflow: true, buildertrend: false },
  { feature: "VAT reverse charge", buildflow: true, buildertrend: false },
  { feature: "Job costing", buildflow: true, buildertrend: true },
  { feature: "Estimating", buildflow: true, buildertrend: true },
  { feature: "Scheduling", buildflow: true, buildertrend: true },
  { feature: "Client portal", buildflow: true, buildertrend: true },
  { feature: "Subcontractor portal", buildflow: true, buildertrend: true },
  { feature: "Document management", buildflow: true, buildertrend: true },
  { feature: "Mobile app", buildflow: true, buildertrend: true },
  { feature: "Offline mode", buildflow: true, buildertrend: false },
  { feature: "Snagging / punch lists", buildflow: true, buildertrend: true },
  { feature: "UK-based support", buildflow: true, buildertrend: false },
  { feature: "Free trial", buildflow: "14 days", buildertrend: "Demo only" },
]

export default function CompareBuildertrend() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-[#F97316]/20 text-[#F97316] border-0 mb-4">Compare</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            BuildFlow vs Buildertrend
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Buildertrend is built for US contractors. BuildFlow is built for UK construction — with CIS, H&amp;S, and transparent pricing in pounds.
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
            Why UK Builders Choose BuildFlow Over Buildertrend
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

      {/* US vs UK focus */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-8">
            US-Built vs UK-Built: It Matters
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">🇺🇸 Buildertrend</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Built for US construction regulations</li>
                <li>• No CIS awareness whatsoever</li>
                <li>• OSHA-focused safety (not UK H&S)</li>
                <li>• US tax integrations only</li>
                <li>• Prices in USD — FX risk on every bill</li>
                <li>• US business hours support</li>
                <li>• Imperial measurements default</li>
              </ul>
            </div>
            <div className="bg-[#F97316]/5 rounded-xl p-6 border border-[#F97316]/20">
              <h3 className="font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">🇬🇧 BuildFlow</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2"><Check className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" /> Built for UK construction from day one</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" /> Full CIS automation</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" /> UK H&S, CDM, RAMS built in</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" /> UK accounting integrations (Xero, Sage)</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" /> Priced in GBP — no currency surprises</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" /> UK-based support team</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-[#F97316] flex-shrink-0 mt-0.5" /> Metric measurements default</li>
              </ul>
            </div>
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
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Buildertrend</th>
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
                      {row.buildertrend === true ? <Check className="w-5 h-5 mx-auto text-green-500" /> : row.buildertrend === false ? <X className="w-5 h-5 mx-auto text-gray-300" /> : <span className="text-gray-600">{row.buildertrend}</span>}
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
            Built for UK construction. Priced for UK builders.
          </h2>
          <p className="text-lg text-white/80 mb-8">
            14-day free trial. No credit card. No annual contract.
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
