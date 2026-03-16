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

export default function MortonGroundworksCaseStudy() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-16 relative">
        <div className="relative h-80 overflow-hidden bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
          <img
            src="https://images.unsplash.com/photo-1590496793929-36417d3117de?w=1600&q=80"
            alt="Highway drainage and groundworks construction"
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 flex items-end">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 w-full">
              <Link href="/case-studies" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 text-sm">
                <ArrowLeft className="w-4 h-4" /> Back to case studies
              </Link>
              <Badge className="mb-3 bg-[#F97316] text-white border-0">Highway &amp; Drainage</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How Morton Groundworks Achieved 100% Subbie Compliance and Cut Invoice Cycles by 70%
              </h1>
              <div className="flex flex-wrap gap-6 text-sm text-white/80">
                <div className="flex items-center gap-1"><Building2 className="w-4 h-4" /> Morton Groundworks</div>
                <div className="flex items-center gap-1"><MapPin className="w-4 h-4" /> West Midlands</div>
                <div className="flex items-center gap-1"><Users className="w-4 h-4" /> 15 staff</div>
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
              <div className="text-3xl font-bold text-[#F97316]">60→100%</div>
              <div className="text-sm text-gray-600 mt-1">Subbie compliance rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F97316]">45→14 days</div>
              <div className="text-sm text-gray-600 mt-1">Invoice cycle time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-[#F97316]">£62k</div>
              <div className="text-sm text-gray-600 mt-1">Annual cash flow improvement</div>
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
                  Dave Morton runs Morton Groundworks, a 15-person operation specialising in highway construction, drainage, and utility installation across the West Midlands. Working primarily as a subcontractor to tier-1 main contractors on public sector schemes, Dave&apos;s team faces intense compliance requirements — from CSCS cards and CPCS certificates to traffic management qualifications and confined space competencies.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  The problem was visibility. With 15 direct employees and 10–15 regular subcontractors, tracking who held which qualifications — and when they expired — was managed through a spreadsheet that was permanently out of date. At any given time, only about 60% of the workforce was fully compliant. Main contractors had started issuing improvement notices, and one near-miss involving an operative without a valid CSCS card almost cost Morton their place on a framework agreement worth £800k/year.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Invoicing was equally problematic. Applications for payment on highway jobs require detailed breakdowns of measured work, daywork sheets, and supporting documentation. With everything done manually, the average invoice cycle was 45 days from work completion to payment — crippling cash flow for a business with a £120k monthly wage bill.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">✓</span>
                  The Solution
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  Morton Groundworks rolled out BuildFlow with a focus on subcontractor compliance management and streamlined invoicing for measured works.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>Compliance dashboard</strong> — Every operative and subbie tracked with card/cert expiry dates, automatic renewal alerts 30 days before expiry, and real-time compliance status visible to project managers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>CIS automation</strong> — UTR verification, correct deduction rates applied automatically, monthly returns generated in one click.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>Digital applications for payment</strong> — Measured work logged on-site from mobile, daywork sheets captured daily, supporting photos attached automatically. Valuations compiled in minutes, not days.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-[#F97316] mt-0.5 flex-shrink-0" />
                    <span><strong>Site diary &amp; plant tracking</strong> — Daily records of weather, workforce, plant on site, and deliveries — creating a contemporaneous record for any disputes or claims.</span>
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
                    { value: "60→100%", label: "Subcontractor compliance rate" },
                    { value: "45→14 days", label: "Invoice cycle (work to payment)" },
                    { value: "£62k/year", label: "Cash flow improvement" },
                    { value: "Zero", label: "Compliance incidents since go-live" },
                    { value: "100%", label: "Framework agreement retained" },
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
                  &ldquo;In groundworks, compliance isn&apos;t optional — one lapsed CSCS card and the main contractor can kick you off site. BuildFlow gives me a live dashboard showing exactly who&apos;s compliant and who needs renewing. We went from 60% to 100% overnight. On the invoicing side, cutting our payment cycle from 45 to 14 days has been transformational for cash flow. I can actually plan ahead now instead of constantly firefighting.&rdquo;
                </p>
                <p className="text-sm font-semibold text-[#1A1A2E]">— Dave Morton, Director, Morton Groundworks</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-2xl p-6 sticky top-24 space-y-6">
                <h3 className="font-bold text-[#1A1A2E]">Company Profile</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-gray-500">Company</div>
                    <div className="font-semibold text-[#1A1A2E]">Morton Groundworks</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Director</div>
                    <div className="font-semibold text-[#1A1A2E]">Dave Morton</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Location</div>
                    <div className="font-semibold text-[#1A1A2E]">West Midlands</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Team Size</div>
                    <div className="font-semibold text-[#1A1A2E]">15 staff + 10-15 subbies</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Sector</div>
                    <div className="font-semibold text-[#1A1A2E]">Highway &amp; Drainage</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Key Challenge</div>
                    <div className="font-semibold text-[#1A1A2E]">Subbie compliance &amp; slow payments</div>
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
