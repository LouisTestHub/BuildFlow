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
      company: "Harrington Builders Ltd",
      location: "Chelmsford, Essex",
      industry: "Residential Refurbishment",
      size: "12 employees, £2.5M annual turnover",
      challenge: "Lost £15k on a recent project due to poor cost tracking and variations that weren't properly documented. Daily logs were in WhatsApp, costs in Excel, and site photos scattered across phones.",
      solution: "Implemented BuildFlow across all 8 active sites. Site managers now log daily from mobile, all costs tracked against estimates in real-time, and every variation documented with photos and client approval.",
      results: [
        { metric: "Margin improvement", value: "+4.2%" },
        { metric: "Admin time saved", value: "10 hours/week" },
        { metric: "Dispute resolution time", value: "-75%" },
        { metric: "CIS compliance time", value: "-90%" }
      ],
      quote: "We were losing £2-3k per job on things we couldn't track. BuildFlow paid for itself in the first month. The CIS module alone saves us a day every month.",
      author: "Steve Harrington, Director",
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200",
      logo: "HB"
    },
    {
      company: "MK Construction Group",
      location: "Milton Keynes",
      industry: "Commercial Fit-Out",
      size: "28 employees, £6M annual turnover",
      challenge: "Managing 15+ live sites with paper-based systems. Office manager spent Friday afternoons chasing site managers for daily logs via WhatsApp. Health & Safety documentation was a filing cabinet nightmare. No real-time view of job profitability.",
      solution: "Rolled out BuildFlow company-wide with full H&S module. Digital RAMS, site induction tracking, and incident reporting. Real-time dashboards give contracts manager full visibility of all jobs. Subcontractor portal eliminated invoice chaos.",
      results: [
        { metric: "Sites managed simultaneously", value: "15 → 22" },
        { metric: "H&S compliance score", value: "+35%" },
        { metric: "Invoice processing time", value: "-60%" },
        { metric: "Real-time job visibility", value: "100%" }
      ],
      quote: "Before BuildFlow, I'd spend Friday afternoons chasing site managers for their daily logs via WhatsApp. Now everything's in the system before lunch. Game changer.",
      author: "Rachel Okonkwo, Office Manager",
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=1200",
      logo: "MK"
    },
    {
      company: "Thompson & Sons Building",
      location: "Romford, London",
      industry: "Residential New Build",
      size: "35 employees, £8M annual turnover",
      challenge: "Estimating took 2 days per tender, often missing items or miscalculating subcontractor costs. Once a job started, no way to track actual costs vs estimate until month-end. Lost three tenders in a row due to slow turnaround.",
      solution: "Built a library of estimating templates in BuildFlow with standard rates for labour, materials, and plant. Tenders now take 4-6 hours instead of 2 days. Live cost tracking shows margin erosion before it's too late.",
      results: [
        { metric: "Estimating speed", value: "+75%" },
        { metric: "Tender win rate", value: "+22%" },
        { metric: "Budget overruns", value: "-68%" },
        { metric: "Early warnings on margin issues", value: "Real-time" }
      ],
      quote: "The estimating tool is brilliant. We can knock out a detailed estimate in half the time and actually track if we're hitting our margins on site. Absolute no-brainer.",
      author: "Gary Thompson, Contracts Manager",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=1200",
      logo: "TS"
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
