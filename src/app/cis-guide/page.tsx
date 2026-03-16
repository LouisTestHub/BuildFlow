"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, ArrowRight, BookOpen, Download, Check, AlertTriangle, Clock, FileText } from "lucide-react"

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
            <h4 className="text-white font-semibold mb-4">Tools</h4>
            <div className="space-y-2 text-sm">
              <Link href="/cis-calculator" className="block hover:text-white">CIS Calculator</Link>
              <Link href="/roi-calculator" className="block hover:text-white">ROI Calculator</Link>
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

function TableOfContents() {
  const sections = [
    { id: "what-is-cis", label: "What is CIS?" },
    { id: "registration", label: "Registration" },
    { id: "verification", label: "Verification" },
    { id: "deductions", label: "Deductions" },
    { id: "returns", label: "Monthly Returns" },
    { id: "penalties", label: "Penalties" },
    { id: "mistakes", label: "Common Mistakes" },
    { id: "download", label: "Download Guide" },
  ]
  return (
    <nav className="bg-white border border-gray-200 rounded-xl p-6 sticky top-24">
      <h3 className="font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
        <BookOpen className="w-4 h-4 text-[#F97316]" /> Contents
      </h3>
      <ul className="space-y-2 text-sm">
        {sections.map((s) => (
          <li key={s.id}>
            <a href={`#${s.id}`} className="text-gray-600 hover:text-[#F97316] transition-colors">{s.label}</a>
          </li>
        ))}
      </ul>
      <div className="mt-6 pt-4 border-t border-gray-200">
        <Link href="/cis-calculator">
          <Button variant="outline" size="sm" className="w-full text-[#F97316] border-[#F97316]/30">
            CIS Calculator →
          </Button>
        </Link>
      </div>
    </nav>
  )
}

export default function CISGuidePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge className="bg-[#F97316]/20 text-[#F97316] border-0 mb-4">Complete Guide</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              The Complete CIS Compliance Guide for UK Contractors
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Everything you need to know about the Construction Industry Scheme — from registration to monthly returns.
              Updated for the 2025/26 tax year.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 15 min read</span>
              <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> Last updated: March 2026</span>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="hidden lg:block">
              <TableOfContents />
            </div>

            {/* Main content */}
            <div className="lg:col-span-3">
              <article className="bg-white rounded-xl border border-gray-200 p-8 md:p-12 space-y-12">

                {/* What is CIS */}
                <section id="what-is-cis">
                  <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">What is the Construction Industry Scheme (CIS)?</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    The Construction Industry Scheme (CIS) is a tax deduction scheme introduced by HMRC that applies to payments
                    made by contractors to subcontractors for construction work in the United Kingdom.
                  </p>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Under CIS, contractors are required to deduct money from subcontractor payments and pass it to HMRC.
                    These deductions count as advance payments towards the subcontractor&apos;s tax and National Insurance contributions.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <strong>Key Point:</strong> CIS applies to the construction industry specifically. It covers building work,
                    repairs, decorating, demolition, and civil engineering — but not architecture, surveying, or off-site manufacturing.
                  </div>
                </section>

                {/* Registration */}
                <section id="registration">
                  <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">CIS Registration</h2>

                  <h3 className="text-lg font-bold text-[#1A1A2E] mt-6 mb-3">For Contractors</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    If you pay subcontractors for construction work, you <strong>must</strong> register as a contractor with HMRC
                    before you take on your first subcontractor. This applies whether you&apos;re a sole trader, partnership, or limited company.
                  </p>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    To register, you&apos;ll need your UTR (Unique Taxpayer Reference), your National Insurance number (individuals),
                    or your company registration number (limited companies). Register online via the HMRC website or by phone.
                  </p>

                  <h3 className="text-lg font-bold text-[#1A1A2E] mt-6 mb-3">For Subcontractors</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Subcontractors don&apos;t <em>have</em> to register for CIS, but it&apos;s strongly recommended. Without registration,
                    they&apos;ll have 30% deducted from payments instead of 20%. That&apos;s an unnecessary 10% reduction in cash flow.
                  </p>

                  <div className="bg-[#F97316]/5 border border-[#F97316]/20 rounded-lg p-4">
                    <h4 className="font-bold text-[#1A1A2E] mb-2">Gross Payment Status</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      Subcontractors can apply for gross payment status (0% deduction) if they meet three tests:
                    </p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> <strong>Business test</strong> — the business is run through a bank account and carried on in the UK</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> <strong>Turnover test</strong> — minimum annual turnover of £30,000 (excluding materials and VAT)</li>
                      <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" /> <strong>Compliance test</strong> — up to date with tax returns and payments</li>
                    </ul>
                  </div>
                </section>

                {/* Verification */}
                <section id="verification">
                  <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">Subcontractor Verification</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Before making the first payment to a subcontractor in each tax year, contractors must verify them with HMRC.
                    Verification confirms the subcontractor&apos;s registration status and the correct deduction rate to apply.
                  </p>

                  <h3 className="text-lg font-bold text-[#1A1A2E] mt-6 mb-3">What You Need for Verification</h3>
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-bold text-sm text-[#1A1A2E] mb-2">For Individuals / Sole Traders</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Full name</li>
                        <li>• Unique Taxpayer Reference (UTR)</li>
                        <li>• National Insurance number</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-bold text-sm text-[#1A1A2E] mb-2">For Limited Companies</h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        <li>• Company name</li>
                        <li>• Company UTR</li>
                        <li>• Company registration number</li>
                      </ul>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-[#1A1A2E] mt-6 mb-3">Verification Outcomes</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <Badge className="bg-green-100 text-green-800 border-0 mt-0.5">Gross</Badge>
                      <p className="text-sm text-gray-700">Subcontractor has gross payment status — pay in full, no deduction required.</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <Badge className="bg-amber-100 text-amber-800 border-0 mt-0.5">Net</Badge>
                      <p className="text-sm text-gray-700">Registered subcontractor — deduct at 20% from the labour element.</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                      <Badge className="bg-red-100 text-red-800 border-0 mt-0.5">30%</Badge>
                      <p className="text-sm text-gray-700">Unregistered or unmatched — deduct at 30%. Advise subcontractor to register.</p>
                    </div>
                  </div>
                </section>

                {/* Deductions */}
                <section id="deductions">
                  <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">How CIS Deductions Work</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    CIS deductions are calculated on the <strong>labour element</strong> of a payment only. Materials costs,
                    equipment hire, and VAT are excluded from the deduction calculation.
                  </p>

                  <div className="bg-gray-50 rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-[#1A1A2E] mb-3">Example Calculation</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between py-1"><span className="text-gray-600">Invoice total</span><span className="font-mono font-bold">£6,000.00</span></div>
                      <div className="flex justify-between py-1"><span className="text-gray-600">Less: Materials</span><span className="font-mono text-gray-500">−£1,000.00</span></div>
                      <div className="flex justify-between py-1 border-t border-gray-200 pt-2"><span className="text-gray-600">CIS-liable amount</span><span className="font-mono font-bold">£5,000.00</span></div>
                      <div className="flex justify-between py-1"><span className="text-gray-600">CIS deduction at 20%</span><span className="font-mono text-red-600 font-bold">−£1,000.00</span></div>
                      <div className="flex justify-between py-1 border-t border-gray-300 pt-2 text-base"><span className="font-bold text-[#1A1A2E]">Net payment to subcontractor</span><span className="font-mono font-bold text-green-600">£5,000.00</span></div>
                    </div>
                    <p className="text-xs text-gray-500 mt-3">
                      Note: The £1,000.00 deduction is paid to HMRC and counts as an advance tax payment for the subcontractor.
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
                    <strong>VAT Note:</strong> VAT is charged on the full invoice amount (labour + materials) but CIS deductions
                    are calculated before VAT. The subcontractor invoices the full amount including VAT, and the contractor deducts
                    CIS from the labour element only.
                  </div>
                </section>

                {/* Monthly Returns */}
                <section id="returns">
                  <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">Monthly CIS Returns</h2>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Contractors must submit a monthly return to HMRC by the <strong>19th of each month</strong>, covering the
                    tax month that runs from the 6th of the previous month to the 5th of the current month.
                  </p>

                  <h3 className="text-lg font-bold text-[#1A1A2E] mt-6 mb-3">What to Include in a CIS Return</h3>
                  <ul className="space-y-2 text-gray-600 mb-6">
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /> Details of all subcontractors paid during the tax month</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /> Gross amount paid to each subcontractor</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /> Cost of materials for each subcontractor</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /> Amount of CIS deducted from each subcontractor</li>
                    <li className="flex items-start gap-2"><Check className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /> A declaration that the employment status of each subcontractor has been considered</li>
                  </ul>

                  <h3 className="text-lg font-bold text-[#1A1A2E] mt-6 mb-3">Nil Returns</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    Even if you haven&apos;t paid any subcontractors during a tax month, you must still file a return — called a
                    &quot;nil return&quot;. Failure to submit a nil return incurs the same penalties as a late return.
                  </p>

                  <h3 className="text-lg font-bold text-[#1A1A2E] mt-6 mb-3">Inactivity Requests</h3>
                  <p className="text-gray-600 leading-relaxed">
                    If you won&apos;t be paying subcontractors for a sustained period (e.g., over winter), you can request an inactivity
                    period with HMRC to temporarily stop the requirement for monthly returns.
                  </p>
                </section>

                {/* Penalties */}
                <section id="penalties">
                  <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">CIS Penalties</h2>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    HMRC takes CIS compliance seriously. Late or incorrect returns can result in significant penalties.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left py-3 px-4 font-medium text-gray-600">How Late</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Penalty</th>
                          <th className="text-left py-3 px-4 font-medium text-gray-600">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-gray-100">
                          <td className="py-3 px-4 font-medium">1 day late</td>
                          <td className="py-3 px-4 text-red-600 font-bold">£100</td>
                          <td className="py-3 px-4 text-gray-500">Per return, per month</td>
                        </tr>
                        <tr className="border-t border-gray-100 bg-gray-50/50">
                          <td className="py-3 px-4 font-medium">2 months late</td>
                          <td className="py-3 px-4 text-red-600 font-bold">£200</td>
                          <td className="py-3 px-4 text-gray-500">Additional penalty</td>
                        </tr>
                        <tr className="border-t border-gray-100">
                          <td className="py-3 px-4 font-medium">6 months late</td>
                          <td className="py-3 px-4 text-red-600 font-bold">£300 or 5%</td>
                          <td className="py-3 px-4 text-gray-500">Whichever is greater</td>
                        </tr>
                        <tr className="border-t border-gray-100 bg-gray-50/50">
                          <td className="py-3 px-4 font-medium">12 months late</td>
                          <td className="py-3 px-4 text-red-600 font-bold">£300 or 5%</td>
                          <td className="py-3 px-4 text-gray-500">Additional to 6-month penalty</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6 text-sm text-red-800">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    <strong>Warning:</strong> Penalties apply per return, per month. If you have multiple late returns, penalties
                    stack quickly. A contractor with 3 late returns over 6 months could face £1,800+ in penalties.
                  </div>
                </section>

                {/* Common Mistakes */}
                <section id="mistakes">
                  <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4">Common CIS Mistakes to Avoid</h2>
                  <div className="space-y-4">
                    {[
                      { title: "Not verifying subcontractors", desc: "Every subcontractor must be verified with HMRC before their first payment in each tax year. Failure to verify means you should deduct at 30%." },
                      { title: "Deducting from materials costs", desc: "CIS deductions apply only to the labour element. Materials, equipment hire, and consumables should be excluded from the deduction calculation." },
                      { title: "Forgetting nil returns", desc: "Even if you made no payments to subcontractors in a tax month, you must still submit a nil return or face penalties." },
                      { title: "Missing the 19th deadline", desc: "CIS returns must be filed by the 19th of each month. Even one day late triggers a £100 penalty." },
                      { title: "Not issuing deduction statements", desc: "You must provide each subcontractor with a written statement showing the deductions made. Failure to do so is a separate offence." },
                      { title: "Incorrect employment status", desc: "CIS applies to subcontractors, not employees. If HMRC determines a worker is actually an employee, you could face additional tax, NI, and penalties." },
                      { title: "Not keeping records", desc: "You must keep CIS records for at least 3 years after the end of the tax year they relate to. This includes payment records, deduction statements, and verification details." },
                      { title: "Ignoring VAT reverse charge", desc: "Since March 2021, the domestic VAT reverse charge applies to most CIS-regulated services. The customer accounts for VAT, not the supplier. Make sure your invoicing reflects this." },
                    ].map((mistake, i) => (
                      <div key={i} className="flex gap-4 p-4 bg-amber-50/50 rounded-lg border border-amber-100">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-amber-600 font-bold text-sm">{i + 1}</span>
                        </div>
                        <div>
                          <h3 className="font-bold text-[#1A1A2E] mb-1">{mistake.title}</h3>
                          <p className="text-sm text-gray-600">{mistake.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Download */}
                <section id="download" className="bg-[#1A1A2E] rounded-xl p-8 text-center">
                  <Download className="w-10 h-10 text-[#F97316] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-3">Download the Complete CIS Guide</h2>
                  <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                    Get this guide as a PDF to share with your team or accountant. Includes checklists,
                    calculation examples, and deadline reminders.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/register">
                      <Button size="lg" className="bg-[#F97316] hover:bg-[#EA580C] text-white px-8">
                        Get PDF (Free with Trial) <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                  </div>
                  <p className="text-xs text-gray-500 mt-4">14-day free trial. No credit card required.</p>
                </section>

              </article>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
