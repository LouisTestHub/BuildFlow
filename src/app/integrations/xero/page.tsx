"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { HardHat, ArrowRight, Check, ArrowLeftRight, FileText, Receipt, Users, Shield } from "lucide-react"

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

const syncFeatures = [
  {
    icon: Receipt,
    title: "Invoice Sync",
    desc: "Sales and purchase invoices sync automatically between BuildFlow and Xero. Create an invoice in BuildFlow and it appears in Xero within minutes — with correct nominal codes, tax rates, and project tracking.",
    details: ["Sales invoices push to Xero Accounts Receivable", "Purchase invoices from subbies map to Accounts Payable", "Line items map to construction-specific nominal codes", "Payment status syncs both ways"],
  },
  {
    icon: Shield,
    title: "CIS Deduction Mapping",
    desc: "CIS deductions calculated in BuildFlow automatically map to the correct Xero accounts. No manual journal entries, no reconciliation headaches.",
    details: ["CIS deductions post to CIS liability account", "Gross and net amounts correctly split", "Monthly CIS return totals reconcile with Xero", "Subcontractor payment statements match Xero records"],
  },
  {
    icon: Users,
    title: "Subcontractor Payment Sync",
    desc: "When you pay a subcontractor in BuildFlow, the payment records in Xero automatically — including CIS deductions, materials, and net amounts.",
    details: ["Subcontractor contacts sync to Xero", "Payment allocations match automatically", "CIS certificates reference in transaction notes", "Batch payment files compatible with Xero bank feeds"],
  },
  {
    icon: FileText,
    title: "Valuation Sync",
    desc: "Monthly valuations and applications for payment sync to Xero as draft invoices, ready for your QS to review and approve.",
    details: ["Interim valuations create Xero draft invoices", "Retention amounts tracked separately", "Variation values included automatically", "Final account reconciliation supported"],
  },
]

export default function XeroIntegrationPage() {
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
                <span className="text-white text-sm">Xero</span>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-0 mb-4">Live Integration</Badge>
              <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
                BuildFlow + Xero
              </h1>
              <p className="text-lg text-gray-300 mb-6">
                The construction-focused Xero integration. Sync invoices, map CIS deductions, track subcontractor
                payments, and reconcile valuations — all automatically.
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
                <div className="w-16 h-16 rounded-xl bg-[#13B5EA] flex items-center justify-center text-3xl">
                  📊
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-6 bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> One-click setup</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Two-way sync</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Construction-specific mapping</div>
            <div className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Included on all plans</div>
          </div>
        </div>
      </section>

      {/* Sync features */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-10">
            Construction-Focused Accounting Sync
          </h2>
          <div className="space-y-8">
            {syncFeatures.map((f, i) => (
              <Card key={i}>
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                        <f.icon className="w-6 h-6 text-[#F97316]" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">{f.title}</h3>
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

      {/* Why construction teams need this */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1A1A2E] text-center mb-4">
            Why Generic Xero Integrations Don&apos;t Work for Construction
          </h2>
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
            Most project management tools have basic Xero sync. BuildFlow&apos;s integration understands construction accounting.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="font-bold text-red-800 mb-3">Generic integrations</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>✗ Don&apos;t understand CIS deductions</li>
                <li>✗ No retention tracking</li>
                <li>✗ Can&apos;t handle valuations</li>
                <li>✗ Wrong nominal code mapping</li>
                <li>✗ No subcontractor payment splitting</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border border-green-100">
              <h3 className="font-bold text-green-800 mb-3">BuildFlow + Xero</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> CIS deductions mapped correctly</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Retention tracked and released</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Valuations sync as draft invoices</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Construction nominal codes pre-configured</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" /> Gross, net, deductions split per subbie</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F97316]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Connect BuildFlow to Xero in Under a Minute
          </h2>
          <p className="text-lg text-white/80 mb-8">
            One-click OAuth setup. Construction-ready mapping. Included on every plan.
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
