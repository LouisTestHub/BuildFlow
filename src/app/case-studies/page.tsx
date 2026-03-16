"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, TrendingUp, ChevronRight } from "lucide-react"

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
            <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/register"><Button size="sm">Start Free Trial</Button></Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

const caseStudies = [
  {
    slug: "webb-construction",
    company: "Webb Construction",
    person: "Marcus Webb",
    location: "Surrey",
    sector: "Commercial Fit-Outs",
    size: "25 staff",
    headline: "15 hours/week saved on admin, project overruns reduced 60%, CIS errors eliminated",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80",
    logo: "WC",
    stats: [
      { label: "Admin saved", value: "15 hrs/week" },
      { label: "Overruns reduced", value: "-60%" },
      { label: "CIS errors", value: "Zero" },
    ],
  },
  {
    slug: "chen-developments",
    company: "Chen Developments",
    person: "Sarah Chen",
    location: "Buckinghamshire",
    sector: "Residential Development",
    size: "8-person team",
    headline: "30% faster completion, £40k/year saved on CIS, zero H&S incidents",
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
    logo: "CD",
    stats: [
      { label: "Faster completion", value: "30%" },
      { label: "CIS savings", value: "£40k/year" },
      { label: "H&S incidents", value: "Zero" },
    ],
  },
  {
    slug: "morton-groundworks",
    company: "Morton Groundworks",
    person: "Dave Morton",
    location: "West Midlands",
    sector: "Highway & Drainage",
    size: "15 staff",
    headline: "Subbie compliance 60%→100%, invoice cycle cut from 45 to 14 days",
    image: "https://images.unsplash.com/photo-1590496793929-36417d3117de?w=800&q=80",
    logo: "MG",
    stats: [
      { label: "Compliance", value: "60→100%" },
      { label: "Invoice cycle", value: "45→14 days" },
      { label: "Cash flow gain", value: "£62k/year" },
    ],
  },
]

export default function CaseStudiesPage() {
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

      {/* Case Study Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => (
              <Link
                key={study.slug}
                href={`/case-studies/${study.slug}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={study.image}
                    alt={study.company}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-[#F97316] flex items-center justify-center font-bold text-sm">
                        {study.logo}
                      </div>
                      <div>
                        <div className="font-bold">{study.company}</div>
                        <div className="text-xs text-gray-300">{study.sector} · {study.location}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <p className="text-sm font-semibold text-[#1A1A2E] mb-4">&ldquo;{study.headline}&rdquo;</p>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {study.stats.map((stat, i) => (
                      <div key={i} className="text-center">
                        <div className="text-lg font-bold text-[#F97316]">{stat.value}</div>
                        <div className="text-xs text-gray-500">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[#F97316] font-medium text-sm group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Read full story <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-20 bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">The BuildFlow Impact</h2>
            <p className="text-gray-400">Average improvements across our customer base</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "+3.8%", label: "Average Margin Improvement" },
              { value: "12 hrs", label: "Admin Time Saved per Week" },
              { value: "-70%", label: "Reduction in Disputes" },
              { value: "100%", label: "CIS Compliance Rate" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-[#F97316] mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
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
            Join hundreds of UK builders who&apos;ve transformed their businesses with BuildFlow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register"><Button size="lg">Start Free Trial</Button></Link>
            <Link href="/contact"><Button size="lg" variant="outline">Book a Demo</Button></Link>
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
