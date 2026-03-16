"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, Check, ArrowRight, Shield, Calculator, FileText, Users, ChevronDown, ChevronUp, Clock, AlertTriangle, Zap, RefreshCw } from "lucide-react"

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
              <Link href="/integrations" className="block hover:text-white">Integrations</Link>
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
              <Link href="/cis-guide" className="block hover:text-white">CIS Guide</Link>
              <Link href="/cis-calculator" className="block hover:text-white">CIS Calculator</Link>
              <Link href="/roi-calculator" className="block hover:text-white">ROI Calculator</Link>
              <Link href="/case-studies" className="block hover:text-white">Case Studies</Link>
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

export default function CISPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const faqs = [
    { q: "What is CIS?", a: "The Construction Industry Scheme (CIS) is a tax deduction scheme set up by HMRC. It requires contractors to deduct money from subcontractor payments and pass it to HMRC. These deductions count as advance payments towards the subcontractor's tax and National Insurance." },
    { q: "Who needs to register for CIS?", a: "All contractors paying subcontractors for construction work must register for CIS. Subcontractors don't have to register, but if they don't, they'll have 30% deducted instead of 20%." },
    { q: "What are the CIS deduction rates?", a: "There are three rates: 0% (gross payment status — subcontractor receives full payment), 20% (standard rate — registered subcontractors), and 30% (higher rate — unregistered or unverified subcontractors)." },
    { q: "How does BuildFlow automate CIS?", a: "BuildFlow automatically verifies subcontractors with HMRC, calculates the correct deduction rate, generates monthly CIS returns, produces payment and deduction statements, and tracks everything in one place." },
    { q: "When are CIS returns due?", a: "CIS returns must be submitted to HMRC by the 19th of each month, covering the tax month from the 6th of the previous month to the 5th of the current month. BuildFlow sends reminders and can prepare your return with one click." },
    { q: "What happens if I submit CIS returns late?", a: "Late filing incurs penalties: £100 for 1 day late, £200 for 2 months late, £300 or 5% of the CIS deductions (whichever is higher) for 6 months late, and an additional £300 or 5% for 12 months late." },
    { q: "Do I need to verify subcontractors every time?", a: "You must verify each subcontractor with HMRC before making their first payment in a tax year. BuildFlow tracks verification status and prompts you when re-verification is needed." },
    { q: "What information do I need to verify a subcontractor?", a: "You need their legal name (business or individual), Unique Taxpayer Reference (UTR), and National Insurance number (for individuals). BuildFlow stores this securely and uses it for verification." },
    { q: "Can subcontractors see their CIS deductions?", a: "Yes. BuildFlow generates CIS payment and deduction statements for each subcontractor, which they can access through the subcontractor portal." },
    { q: "How does CIS work with VAT?", a: "CIS deductions are calculated on the labour element only, excluding VAT and materials costs. BuildFlow automatically separates these components when calculating deductions." },
    { q: "What if a subcontractor has gross payment status?", a: "Subcontractors with gross payment status (0% deduction) receive their full payment without deductions. BuildFlow tracks this status and applies the correct rate automatically." },
    { q: "Can I export CIS data for my accountant?", a: "Yes. BuildFlow exports CIS returns, deduction statements, and summaries in CSV format. You can also grant your accountant read-only access to the CIS section." },
    { q: "Does BuildFlow handle CIS for partnerships?", a: "Yes. BuildFlow supports individual subcontractors, sole traders, partnerships, and limited companies — each with their specific verification requirements." },
    { q: "What construction work falls under CIS?", a: "CIS covers most construction work including building, repairs, decorating, demolition, and civil engineering. It does not cover architecture, surveying, or the manufacture of building components off-site." },
    { q: "How does BuildFlow handle CIS materials deductions?", a: "When recording subcontractor invoices, you can specify the materials cost separately. BuildFlow deducts this from the gross payment before calculating CIS, ensuring subcontractors aren't overtaxed." },
    { q: "Is BuildFlow approved by HMRC for CIS?", a: "BuildFlow uses HMRC's official verification processes and generates returns in the correct format. While we facilitate CIS compliance, the responsibility for accurate submissions remains with the contractor." },
  ]

  const automationSteps = [
    { icon: Users, title: "Auto-Verify", desc: "Verify subcontractors with HMRC in seconds. BuildFlow checks UTR, NI number, and company details automatically." },
    { icon: Calculator, title: "Auto-Calculate", desc: "Correct deduction rates applied instantly. 0%, 20%, or 30% — based on verified status, with materials separated automatically." },
    { icon: RefreshCw, title: "Auto-Generate Returns", desc: "Monthly CIS returns prepared with one click. All deductions, payments, and subcontractor details compiled and ready to submit." },
    { icon: FileText, title: "Payslip Generation", desc: "CIS payment and deduction statements generated automatically for every subcontractor, every month. Accessible via the subcontractor portal." },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-[#1A1A2E] via-[#1A1A2E] to-[#2D2D4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-[#F97316]/20 text-[#F97316] border-0 mb-6">CIS Compliance</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            The Only Construction Software<br />
            <span className="text-[#F97316]">with CIS Built In</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Stop wrestling with spreadsheets and HMRC deadlines. BuildFlow automates your entire CIS workflow —
            from subcontractor verification to monthly returns — so you never miss a deadline or overpay again.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/cis-calculator">
              <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10 px-8">
                Try CIS Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* What is CIS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">What is the Construction Industry Scheme?</h2>
            <p className="text-lg text-gray-600">
              CIS is HMRC&apos;s tax deduction scheme for the construction industry. If you&apos;re a contractor paying subcontractors
              for construction work, you <strong>must</strong> deduct money from their payments and pass it to HMRC.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-[#1A1A2E] text-lg mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#F97316]" /> Who Needs to Verify?
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Main contractors paying subcontractors</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Builders hiring specialist trades</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Property developers using construction labour</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Government bodies commissioning construction</li>
                <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> Housing associations with maintenance contracts</li>
              </ul>
            </div>
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-[#1A1A2E] text-lg mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" /> Penalties for Non-Compliance
              </h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">£100</span> per return — 1 day late</li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">£200</span> per return — 2 months late</li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">£300</span> or 5% of CIS — 6 months late</li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">£300+</span> additional — 12 months late</li>
                <li className="flex items-start gap-2"><span className="text-red-500 font-bold">Interest</span> on all late payments</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Deduction Rates */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] text-center mb-12">CIS Deduction Rates</h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
              <div className="text-5xl font-bold text-green-600 mb-2">0%</div>
              <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">Gross Payment</h3>
              <p className="text-sm text-gray-600">
                Subcontractor has applied for and been granted gross payment status by HMRC.
                They receive 100% of their payment.
              </p>
              <Badge className="mt-3 bg-green-100 text-green-800 border-0">No deduction</Badge>
            </div>
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 text-center">
              <div className="text-5xl font-bold text-amber-600 mb-2">20%</div>
              <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">Standard Rate</h3>
              <p className="text-sm text-gray-600">
                Registered subcontractor verified with HMRC. The standard deduction rate
                for most construction subcontractors.
              </p>
              <Badge className="mt-3 bg-amber-100 text-amber-800 border-0">Most common</Badge>
            </div>
            <div className="bg-red-50 rounded-xl p-6 border border-red-200 text-center">
              <div className="text-5xl font-bold text-red-600 mb-2">30%</div>
              <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">Higher Rate</h3>
              <p className="text-sm text-gray-600">
                Unregistered or unverified subcontractor. Costs your subbies an extra 10%.
                Register to avoid this rate.
              </p>
              <Badge className="mt-3 bg-red-100 text-red-800 border-0">Avoidable</Badge>
            </div>
          </div>
        </div>
      </section>

      {/* How BuildFlow Automates CIS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] text-center mb-4">
            How BuildFlow Automates CIS
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Four steps. Zero spreadsheets. Complete compliance.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {automationSteps.map((step, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 hover:border-[#F97316]/30 hover:shadow-lg transition-all">
                <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center mb-4">
                  <step.icon className="w-6 h-6 text-[#F97316]" />
                </div>
                <div className="text-sm font-bold text-[#F97316] mb-1">Step {i + 1}</div>
                <h3 className="font-bold text-[#1A1A2E] text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Before / After comparison */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] text-center mb-12">
            Without BuildFlow vs With BuildFlow
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="font-bold text-red-800 text-lg mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" /> Without BuildFlow
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {[
                  "Manually log into HMRC to verify each subbie",
                  "Track deduction rates in spreadsheets",
                  "Calculate deductions by hand — errors happen",
                  "Chase subbies for UTR numbers",
                  "Manually prepare monthly CIS returns",
                  "Risk £100+ penalties for late submissions",
                  "Print and post deduction statements",
                  "Hours of admin every month",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-red-500 font-bold mt-0.5">✗</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="font-bold text-green-800 text-lg mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5" /> With BuildFlow
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                {[
                  "One-click subcontractor verification",
                  "Deduction rates set automatically",
                  "Calculations done instantly — zero errors",
                  "Subbie portal collects UTR on signup",
                  "Monthly returns generated automatically",
                  "Deadline reminders so you never miss",
                  "Digital statements via subbie portal",
                  "Minutes instead of hours",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#F97316]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Never Worry About CIS Again
          </h2>
          <p className="text-lg text-white/80 mb-8">
            Join hundreds of UK contractors who&apos;ve automated their CIS compliance with BuildFlow.
            14-day free trial, no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#F97316] hover:bg-gray-100 px-8">
                Start Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/cis-guide">
              <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10 px-8">
                Read CIS Guide
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] text-center mb-12">
            CIS Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-[#1A1A2E] pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
