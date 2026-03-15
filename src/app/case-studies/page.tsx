"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, TrendingUp, Clock, Users, ChevronRight } from "lucide-react"

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
            <Link href="/about" className="text-sm text-gray-600 hover:text-[#1A1A2E]">About</Link>
            <Link href="/case-studies" className="text-sm text-[#F97316] font-medium">Case Studies</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Contact</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default function CaseStudiesPage() {
  const caseStudies = [
    {
      company: "Harrison & Sons Construction",
      location: "Birmingham, West Midlands",
      industry: "Residential Building",
      size: "25 employees, £3.2M annual turnover",
      challenge: "Harrison & Sons was losing money on every third job due to paper-based estimating. Quote preparation took 2 days, often missing hidden costs. Once on site, there was no real-time visibility into whether they were hitting margin targets. A recent extension project lost £18k due to variations that weren't properly tracked and invoiced.",
      solution: "Implemented BuildFlow's estimating and job costing modules. Built a library of standard rates for materials, labour, and plant. Site managers now log costs daily from their phones. Every variation is documented with photos and client approval in the system. The dashboard shows live margin vs estimate for every active job.",
      results: [
        { metric: "Estimate accuracy", value: "+30%" },
        { metric: "First-year savings", value: "£180,000" },
        { metric: "Estimating time", value: "2 days → 4 hours" },
        { metric: "Variation tracking", value: "100% captured" }
      ],
      quote: "Before BuildFlow, we were flying blind on job costs. We'd know we lost money only when the accountant told us at month-end. Now I can see margin erosion in real-time and fix it before it's too late. We've turned our profitability around completely.",
      author: "Tom Harrison, Managing Director",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
      logo: "HS"
    },
    {
      company: "Apex Civil Engineering",
      location: "Manchester, Greater Manchester",
      industry: "Infrastructure & Civil Works",
      size: "42 employees, £8.5M annual turnover",
      challenge: "Apex was managing large infrastructure projects with paper-based Health & Safety documentation. RAMS were created in Word, printed, and filed in site cabinets. Site inductions were logged in ring binders. During an HSE spot check, they couldn't produce signed RAMS for two subcontractors, resulting in a £12k penalty. Management had zero real-time visibility into H&S compliance across 8 live sites.",
      solution: "Rolled out BuildFlow's H&S module across all sites. Digital RAMS creation with templates, site-specific hazard identification, and electronic signatures. Site induction tracking with photo ID and competency checks. Incident reporting from mobile with automatic notification to H&S manager. Real-time compliance dashboard showing RAMS status, overdue inductions, and outstanding actions across all projects.",
      results: [
        { metric: "HSE incidents", value: "Zero in 12 months" },
        { metric: "RAMS creation time", value: "-80%" },
        { metric: "Compliance visibility", value: "Real-time" },
        { metric: "HSE penalty fees", value: "£0 (down from £12k)" }
      ],
      quote: "The H&S module is a game-changer. We went from filing cabinets full of paper to a complete digital audit trail. When HSE turned up last month, I pulled up every RAMS, every induction, every toolbox talk in 5 minutes. They were impressed. So was I.",
      author: "Sarah Mitchell, SHEQ Manager",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200&q=80",
      logo: "AC"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="success" className="mb-4">Case Studies</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-6">
            Real Results from Real Builders
          </h1>
          <p className="text-lg text-gray-600">
            See how UK construction businesses have transformed their operations with BuildFlow — saving time, improving margins, and staying compliant.
          </p>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
          {caseStudies.map((study, index) => (
            <div key={study.company} className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* Image Header */}
              <div className="relative h-80 overflow-hidden">
                <img 
                  src={study.image} 
                  alt={study.company}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-16 h-16 rounded-xl bg-[#F97316] flex items-center justify-center text-2xl font-bold">
                      {study.logo}
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{study.company}</h2>
                      <p className="text-gray-300">{study.location} · {study.industry}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300">{study.size}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-12 mb-12">
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center text-red-600">⚠️</span>
                      The Challenge
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{study.challenge}</p>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A2E] mb-4 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600">✓</span>
                      The Solution
                    </h3>
                    <p className="text-gray-600 leading-relaxed">{study.solution}</p>
                  </div>
                </div>

                {/* Results */}
                <div className="bg-gray-50 rounded-xl p-8 mb-8">
                  <h3 className="text-lg font-bold text-[#1A1A2E] mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-[#F97316]" />
                    Results
                  </h3>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {study.results.map((result) => (
                      <div key={result.metric} className="text-center">
                        <div className="text-3xl font-bold text-[#F97316] mb-2">{result.value}</div>
                        <div className="text-sm text-gray-600">{result.metric}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quote */}
                <div className="border-l-4 border-[#F97316] pl-6 py-2">
                  <p className="text-lg text-gray-700 italic mb-4">&ldquo;{study.quote}&rdquo;</p>
                  <p className="text-sm font-semibold text-[#1A1A2E]">— {study.author}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-20 bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              The BuildFlow Impact
            </h2>
            <p className="text-gray-400">
              Average improvements across our customer base
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-[#F97316] mb-2">+3.8%</div>
              <div className="text-gray-400 text-sm">Average Margin Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#F97316] mb-2">8 hrs</div>
              <div className="text-gray-400 text-sm">Admin Time Saved per Week</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#F97316] mb-2">-70%</div>
              <div className="text-gray-400 text-sm">Reduction in Disputes</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#F97316] mb-2">100%</div>
              <div className="text-gray-400 text-sm">CIS Compliance Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-6">
            Ready to Write Your Own Success Story?
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Join hundreds of UK builders who've transformed their businesses with BuildFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Book a Demo
              </Button>
            </Link>
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
