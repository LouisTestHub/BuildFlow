"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, TrendingUp, Clock, Users, ArrowLeft, Building2, MapPin, CheckCircle } from "lucide-react"

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
            <Link href="/case-studies" className="text-sm text-[#F97316] font-medium">Case Studies</Link>
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

export default function WebbConstructionCaseStudy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 relative">
        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
          <img
            src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80"
            alt="Commercial fit-out construction site"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
              <Link href="/case-studies" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to case studies
              </Link>
              <Badge className="mb-3 bg-[#F97316] text-white border-0">Commercial Fit-Outs</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How Webb Construction Saved 15 Hours/Week and Eliminated CIS Errors
              </h1>
              <div className="flex flex-wrap gap-6 text-sm text-white/80">
                <div className="flex items-center gap-1"><Building2 className="w-4 h-4" /> Webb Construction Ltd</div>
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Surrey</div>
                <div className="flex items-center gap-1"><Users className="w-4 h-4" /> 25 staff</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#F97316]">15 hrs/week</div>
              <div className="text-sm text-gray-600 mt-1">Admin time saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F97316]">-60%</div>
              <div className="text-sm text-gray-600 mt-1">Project overruns reduced</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F97316]">Zero</div>
              <div className="text-sm text-gray-600 mt-1">CIS errors since switching</div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">⚠️</span>
                  The Challenge
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Marcus Webb runs Webb Construction, a 25-person firm specialising in commercial fit-outs across the South East. With 6–8 active projects at any one time — from office refurbishments to retail shell-and-core — Marcus was drowning in paperwork. Project managers were spending their evenings updating spreadsheets, chasing subcontractor CIS verification, and manually tracking variations.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  CIS compliance was the biggest headache. With 30+ subbies on the books, verifying UTR numbers, applying correct deduction rates, and filing monthly returns was eating two full days per month. HMRC had flagged errors twice in the past year — once resulting in a £3,200 penalty for incorrect deduction rates.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Project overruns were also costing the business. Without real-time visibility into programme status, cost tracking, or subcontractor performance, problems only surfaced when it was too late to fix them. A recent restaurant fit-out ran £45k over budget because variation orders weren&apos;t captured until the final account stage.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">✓</span>
                  The Solution
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Webb Construction implemented BuildFlow across all active projects. The rollout took one week, with site managers trained on mobile data entry and the office team set up on CIS automation and job costing.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>Automated CIS verification</strong> — UTR numbers checked against HMRC in real-time. Deduction rates auto-applied. Monthly returns generated with one click.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>Live project dashboards</strong> — Cost vs budget, programme status, and margin tracking updated daily from site.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>Digital variation tracking</strong> — Every VO captured with photos, client approval, and automatic cost adjustment to the project budget.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>Subcontractor management</strong> — Compliance status, insurance expiry alerts, and performance scoring for all subbies in one place.</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#F97316]" />
                  The Results
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {[
                    { value: "15 hrs/week", label: "Admin time saved across the team" },
                    { value: "-60%", label: "Reduction in project overruns" },
                    { value: "Zero", label: "CIS errors since switching" },
                    { value: "£0", label: "HMRC penalties (down from £3.2k)" },
                    { value: "100%", label: "Variation orders captured and invoiced" },
                  ].map((r) => (
                    <div key={r.label} className="bg-gray-50 rounded-xl p-5 text-center">
                      <div className="text-2xl font-bold text-[#F97316]">{r.value}</div>
                      <div className="text-sm text-gray-600 mt-1">{r.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="border-l-4 border-[#F97316] pl-6 py-2 bg-orange-50 rounded-r-xl p-6">
                <p className="text-lg text-gray-700 italic mb-4">
                  &ldquo;BuildFlow changed how we run projects. CIS used to take me two days a month — now it&apos;s automatic. My project managers have their evenings back, and I can see exactly where every job stands from my phone. The variation tracking alone has probably saved us £80k this year in unbilled work we would have missed.&rdquo;
                </p>
                <p className="text-sm font-semibold text-[#1A1A2E]">— Marcus Webb, Managing Director, Webb Construction</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24 space-y-6">
                <h3 className="font-bold text-[#1A1A2E]">Company Profile</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-gray-500">Company</div>
                    <div className="font-semibold text-[#1A1A2E]">Webb Construction Ltd</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Director</div>
                    <div className="font-semibold text-[#1A1A2E]">Marcus Webb</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Location</div>
                    <div className="font-semibold text-[#1A1A2E]">Surrey</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Team Size</div>
                    <div className="font-semibold text-[#1A1A2E]">25 staff</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Sector</div>
                    <div className="font-semibold text-[#1A1A2E]">Commercial Fit-Outs</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Key Challenge</div>
                    <div className="font-semibold text-[#1A1A2E]">CIS compliance &amp; admin overload</div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h4 className="font-bold text-[#1A1A2E] mb-3">Get Similar Results</h4>
                  <p className="text-sm text-gray-600 mb-4">See how BuildFlow can transform your construction business.</p>
                  <Link href="/register">
                    <Button className="w-full">Start Free Trial</Button>
                  </Link>
                  <Link href="/contact" className="block mt-2">
                    <Button variant="outline" className="w-full">Book a Demo</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2026 BuildFlow. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/about" className="hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
