"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, TrendingUp, Users, ArrowLeft, Building2, MapPin, CheckCircle } from "lucide-react"

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

export default function ChenDevelopmentsCaseStudy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 relative">
        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
          <img
            src="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=1600&q=80"
            alt="Residential housing development under construction"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
              <Link href="/case-studies" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to case studies
              </Link>
              <Badge className="mb-3 bg-[#F97316] text-white border-0">Residential Development</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How Chen Developments Achieved 30% Faster Completions and Zero H&amp;S Incidents
              </h1>
              <div className="flex flex-wrap gap-6 text-sm text-white/80">
                <div className="flex items-center gap-1"><Building2 className="w-4 h-4" /> Chen Developments</div>
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Buckinghamshire</div>
                <div className="flex items-center gap-1"><Users className="w-4 h-4" /> 8-person team</div>
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
              <div className="text-3xl font-bold text-[#F97316]">30%</div>
              <div className="text-sm text-gray-600 mt-1">Faster project completion</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F97316]">£40k/year</div>
              <div className="text-sm text-gray-600 mt-1">Saved on CIS errors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F97316]">Zero</div>
              <div className="text-sm text-gray-600 mt-1">H&amp;S incidents</div>
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
                  Sarah Chen runs Chen Developments, a boutique residential developer delivering 12 homes per year across Buckinghamshire and the Chilterns. With an 8-person core team and 20+ subcontractors per project, Sarah was struggling to keep on top of programmes, compliance, and costs simultaneously.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  CIS was a constant source of friction. Subbies would frequently change from gross to net payment status without informing the office, leading to incorrect deductions. Over two years, CIS errors had cost Chen Developments over £40k in penalties and overpayments that were never recovered. The accountant was spending a full week each month reconciling CIS returns.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Health &amp; Safety documentation was another weak spot. With CDM regulations requiring detailed construction phase plans, RAMS for every trade package, and site induction records, the admin burden was enormous. A near-miss with a scaffolding collapse on a previous project — traced back to an unsigned RAMS — had been a wake-up call. Sarah needed a digital system before something serious happened.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">✓</span>
                  The Solution
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Chen Developments adopted BuildFlow for all new-build projects. The implementation focused on three core areas: CIS automation, H&amp;S compliance, and programme management.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>CIS auto-verification</strong> — Every subcontractor&apos;s UTR verified against HMRC before first payment. Status changes flagged automatically. Monthly returns auto-generated.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>Digital H&amp;S suite</strong> — RAMS templates by trade, electronic sign-off, site induction with photo ID, and automatic expiry alerts. Full CDM compliance documentation in one place.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>Programme tracking</strong> — Gantt charts linked to actual progress. Critical path alerts flag delays before they cascade. Subcontractor scheduling with dependency tracking.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>Snagging module</strong> — Digital snagging lists with photos, assignees, and defect tracking through to completion — speeding up handover to homebuyers.</span>
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
                    { value: "30%", label: "Faster project completion times" },
                    { value: "£40k/year", label: "Saved on CIS penalties & errors" },
                    { value: "Zero", label: "H&S incidents since implementation" },
                    { value: "100%", label: "CDM compliance across all sites" },
                    { value: "-50%", label: "Snagging resolution time" },
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
                  &ldquo;As a residential developer, every week of delay costs us money — mortgage interest, contractor standby charges, unhappy buyers. BuildFlow&apos;s programme management has tightened our delivery by 30%. But what really keeps me up at night is safety. Since going digital with BuildFlow, every RAMS is signed, every induction is logged, and I can prove compliance in seconds. That peace of mind is priceless.&rdquo;
                </p>
                <p className="text-sm font-semibold text-[#1A1A2E]">— Sarah Chen, Director, Chen Developments</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24 space-y-6">
                <h3 className="font-bold text-[#1A1A2E]">Company Profile</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-gray-500">Company</div>
                    <div className="font-semibold text-[#1A1A2E]">Chen Developments</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Director</div>
                    <div className="font-semibold text-[#1A1A2E]">Sarah Chen</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Location</div>
                    <div className="font-semibold text-[#1A1A2E]">Buckinghamshire</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Team Size</div>
                    <div className="font-semibold text-[#1A1A2E]">8 staff + 20 subbies</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Sector</div>
                    <div className="font-semibold text-[#1A1A2E]">Residential Development</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Output</div>
                    <div className="font-semibold text-[#1A1A2E]">12 homes/year</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Key Challenge</div>
                    <div className="font-semibold text-[#1A1A2E]">CIS errors &amp; H&amp;S compliance</div>
                  </div>
                </div>

                <hr className="border-gray-200" />

                <div>
                  <h4 className="font-bold text-[#1A1A2E] mb-3">Get Similar Results</h4>
                  <p className="text-sm text-gray-600 mb-4">See how BuildFlow can transform your construction business.</p>
                  <Link href="/register"><Button className="w-full">Start Free Trial</Button></Link>
                  <Link href="/contact" className="block mt-2"><Button variant="outline" className="w-full">Book a Demo</Button></Link>
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
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
