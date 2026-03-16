"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HardHat, ArrowRight, Check, X, Table2, Building2, Hammer } from "lucide-react"

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
            <Link href="/cis" className="text-sm text-gray-600 hover:text-[#1A1A2E]">CIS</Link>
            <Link href="/compare" className="text-sm text-[#F97316] font-medium">Compare</Link>
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
              <Link href="/integrations" className="block hover:text-white">Integrations</Link>
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
              <Link href="/cis-guide" className="block hover:text-white">CIS Guide</Link>
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

const comparisons = [
  {
    slug: "spreadsheets",
    name: "Spreadsheets",
    desc: "Still tracking jobs in Excel? See how BuildFlow replaces spreadsheet chaos with one integrated platform.",
    icon: Table2,
    highlight: "94% of UK construction SMEs are still using spreadsheets",
    color: "bg-green-50 border-green-200",
  },
  {
    slug: "procore",
    name: "Procore",
    desc: "Enterprise pricing shouldn't be the cost of going digital. See how BuildFlow delivers more for UK builders at a fraction of the price.",
    icon: Building2,
    highlight: "7x cheaper with UK-specific features Procore doesn't have",
    color: "bg-blue-50 border-blue-200",
  },
  {
    slug: "buildertrend",
    name: "Buildertrend",
    desc: "Buildertrend is built for the US market. BuildFlow is built for UK construction — CIS, H&S regs, and all.",
    icon: Hammer,
    highlight: "Built for UK construction from day one",
    color: "bg-purple-50 border-purple-200",
  },
]

const featureMatrix = [
  { feature: "Starting price", buildflow: "£49/mo", spreadsheets: "Free", procore: "£350+/mo", buildertrend: "$99+/mo" },
  { feature: "UK CIS compliance", buildflow: true, spreadsheets: false, procore: false, buildertrend: false },
  { feature: "UK H&S regulations", buildflow: true, spreadsheets: false, procore: false, buildertrend: false },
  { feature: "Setup time", buildflow: "< 1 hour", spreadsheets: "Hours", procore: "Days", buildertrend: "Days" },
  { feature: "Mobile app", buildflow: true, spreadsheets: false, procore: true, buildertrend: true },
  { feature: "Offline mode", buildflow: true, spreadsheets: "Partial", procore: false, buildertrend: false },
  { feature: "Job costing", buildflow: true, spreadsheets: "Manual", procore: true, buildertrend: true },
  { feature: "Subcontractor portal", buildflow: true, spreadsheets: false, procore: true, buildertrend: true },
  { feature: "Estimating", buildflow: true, spreadsheets: "Manual", procore: true, buildertrend: true },
  { feature: "RAMS management", buildflow: true, spreadsheets: false, procore: false, buildertrend: false },
  { feature: "Snagging lists", buildflow: true, spreadsheets: false, procore: true, buildertrend: false },
  { feature: "No long-term contract", buildflow: true, spreadsheets: true, procore: false, buildertrend: false },
]

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-[#F97316]/20 text-[#F97316] border-0 mb-4">Compare</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            See How BuildFlow Compares
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Built for UK construction SMEs. No enterprise pricing, no US-only features, no spreadsheet chaos.
          </p>
        </div>
      </section>

      {/* Comparison cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {comparisons.map((c) => (
              <Link href={`/compare/${c.slug}`} key={c.slug}>
                <Card className={`h-full hover:shadow-lg transition-all hover:-translate-y-1 border ${c.color}`}>
                  <CardContent className="p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center border border-gray-200">
                      <c.icon className="w-6 h-6 text-[#F97316]" />
                    </div>
                    <h3 className="font-bold text-[#1A1A2E] text-lg">BuildFlow vs {c.name}</h3>
                    <p className="text-sm text-gray-600">{c.desc}</p>
                    <p className="text-xs font-medium text-[#F97316]">{c.highlight}</p>
                    <div className="flex items-center gap-1 text-sm text-[#F97316] font-medium">
                      Read comparison <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feature matrix */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-8">Quick Feature Matrix</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Feature</th>
                  <th className="text-center py-3 px-4 font-bold text-[#F97316]">BuildFlow</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Spreadsheets</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Procore</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-600">Buildertrend</th>
                </tr>
              </thead>
              <tbody>
                {featureMatrix.map((row, i) => (
                  <tr key={i} className={`border-t border-gray-100 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                    <td className="py-3 px-4 font-medium text-[#1A1A2E]">{row.feature}</td>
                    {["buildflow", "spreadsheets", "procore", "buildertrend"].map((key) => {
                      const val = row[key as keyof typeof row]
                      return (
                        <td key={key} className="py-3 px-4 text-center">
                          {val === true ? (
                            <Check className={`w-5 h-5 mx-auto ${key === "buildflow" ? "text-[#F97316]" : "text-green-500"}`} />
                          ) : val === false ? (
                            <X className="w-5 h-5 mx-auto text-gray-300" />
                          ) : (
                            <span className={`text-sm ${key === "buildflow" ? "font-bold text-[#F97316]" : "text-gray-600"}`}>{val}</span>
                          )}
                        </td>
                      )
                    })}
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to switch?</h2>
          <p className="text-lg text-white/80 mb-8">
            14-day free trial. No credit card required. No lock-in contract.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#F97316] hover:bg-gray-100 px-8">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/roi-calculator">
              <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10 px-8">
                Calculate Your ROI
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
