"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeroIllustration } from "@/components/svg/hero-illustration"
import { IntegrationDiagram } from "@/components/svg/integration-diagram"
import { JobTrackingIcon, EstimatingIcon, CISIcon, SafetyIcon, SubcontractorIcon, ReportingIcon } from "@/components/svg/feature-icons"
import { DashboardMockup } from "@/components/svg/dashboard-mockup"
import { MobileAppMockup } from "@/components/svg/mobile-mockup"
import { HardHat, Menu, X, ChevronDown, Check, ArrowRight, Star, Play, Users, FolderKanban, HeadphonesIcon, Calculator, Link2, GitCompare, FileCheck, BarChart3, Zap, ShieldCheck } from "lucide-react"

function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center">
              <HardHat className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#1A1A2E]">BuildFlow</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/features" className="text-sm text-gray-600 hover:text-[#1A1A2E] transition-colors">Features</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-[#1A1A2E] transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm text-gray-600 hover:text-[#1A1A2E] transition-colors">About</Link>
            <Link href="/case-studies" className="text-sm text-gray-600 hover:text-[#1A1A2E] transition-colors">Case Studies</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-[#1A1A2E] transition-colors">Contact</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Start Free Trial</Button>
            </Link>
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <Link href="/features" className="block text-sm text-gray-600 py-2" onClick={() => setOpen(false)}>Features</Link>
            <Link href="/pricing" className="block text-sm text-gray-600 py-2" onClick={() => setOpen(false)}>Pricing</Link>
            <Link href="/about" className="block text-sm text-gray-600 py-2" onClick={() => setOpen(false)}>About</Link>
            <Link href="/case-studies" className="block text-sm text-gray-600 py-2" onClick={() => setOpen(false)}>Case Studies</Link>
            <Link href="/contact" className="block text-sm text-gray-600 py-2" onClick={() => setOpen(false)}>Contact</Link>
            <div className="flex gap-2 pt-2">
              <Link href="/login"><Button variant="outline" size="sm" className="w-full">Sign In</Button></Link>
              <Link href="/register"><Button size="sm" className="w-full">Free Trial</Button></Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

function TrustStatsBar() {
  return (
    <section className="bg-[#1A1A2E] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          {[
            { value: "500+", label: "UK Builders" },
            { value: "10,000+", label: "Projects Managed" },
            { value: "98%", label: "Satisfaction Rate" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl md:text-3xl font-bold text-[#F97316] tabular-nums">{stat.value}</div>
              <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function ReviewBadges() {
  return (
    <section className="py-10 bg-gray-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500 mb-6">Trusted by builders. Rated by the industry.</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {[
            { name: "Capterra", rating: "4.8/5" },
            { name: "G2", rating: "4.8/5" },
            { name: "Software Advice", rating: "4.9/5" },
            { name: "GetApp", rating: "4.8/5" },
          ].map((badge) => (
            <div key={badge.name} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>
              <div>
                <span className="text-sm font-semibold text-[#1A1A2E]">{badge.rating}</span>
                <span className="text-xs text-gray-500 ml-1">on {badge.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function UnlimitedSection() {
  return (
    <section className="py-16 bg-gradient-to-r from-[#F97316] to-[#EA580C]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">No Limits. No Surprises.</h2>
        <p className="text-orange-100 text-lg mb-8">Every plan gives you room to grow — without per-seat gotchas.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Users, label: "Unlimited Users" },
            { icon: FolderKanban, label: "Unlimited Projects" },
            { icon: HeadphonesIcon, label: "Unlimited Support" },
          ].map((item) => (
            <div key={item.label} className="bg-white/15 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <item.icon className="w-10 h-10 text-white mx-auto mb-3" />
              <div className="text-xl font-bold text-white">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function VideoDemoSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Badge variant="secondary" className="mb-4">Product Demo</Badge>
        <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">See BuildFlow in 2 Minutes</h2>
        <p className="text-gray-600 mb-8 max-w-xl mx-auto">Watch how UK builders manage projects, track costs, and stay CIS-compliant — all from one dashboard.</p>
        <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl group cursor-pointer">
          <DashboardMockup className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-[#F97316] rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-4 left-4 bg-black/60 text-white text-xs px-3 py-1 rounded-full">2:15</div>
        </div>
      </div>
    </section>
  )
}

function NewFeaturesShowcase() {
  const features = [
    {
      icon: ShieldCheck,
      title: "CIS Compliance Tools",
      desc: "Automated CIS deductions, monthly return generation, and subcontractor verification — all in a few clicks. Stay HMRC-compliant without the headache.",
      badge: "Compliance",
    },
    {
      icon: Calculator,
      title: "ROI Calculator",
      desc: "See exactly how much BuildFlow saves your business. Input your current costs and get a personalised ROI report in seconds.",
      badge: "New",
    },
    {
      icon: Link2,
      title: "Integrations Hub",
      desc: "Connect BuildFlow to Xero for automatic invoice sync and HMRC for CIS submissions. Your tools, working together seamlessly.",
      badge: "Xero & HMRC",
    },
    {
      icon: GitCompare,
      title: "Comparison Tools",
      desc: "See how BuildFlow stacks up against competitors. Side-by-side feature comparisons so you can make an informed decision.",
      badge: "Compare",
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Badge variant="warning" className="mb-4">New Features</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
            Just Launched — Built for Your Business
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            New tools designed to save you time, keep you compliant, and help you make smarter decisions.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-6 bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg hover:border-[#F97316]/30 transition-all">
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-[#F97316]/10 flex items-center justify-center">
                  <feature.icon className="w-7 h-7 text-[#F97316]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-lg font-bold text-[#1A1A2E]">{feature.title}</h3>
                  <span className="text-xs font-medium bg-[#F97316]/10 text-[#F97316] px-2 py-0.5 rounded-full">{feature.badge}</span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const faqs = [
    { q: "How long does it take to get set up?", a: "Most teams are up and running within an hour. Import your existing projects, invite your team, and start logging from day one. We handle data migration from spreadsheets for free on Pro plans and above." },
    { q: "Do I need to be tech-savvy to use BuildFlow?", a: "Absolutely not. BuildFlow is designed for builders, not IT departments. If you can use WhatsApp, you can use BuildFlow. Our mobile app is built for muddy hands and bright sunlight." },
    { q: "How does CIS compliance work?", a: "BuildFlow automates your CIS deductions based on each subcontractor's verified tax status. We calculate deductions at 20% (standard) or 30% (unverified), generate monthly returns, and produce verification statements — all in a few clicks." },
    { q: "Can I manage multiple projects at once?", a: "Yes — that's the whole point. See all your live jobs on one dashboard, with real-time budgets, daily logs, and team allocation across every site." },
    { q: "What about data security?", a: "Your data is encrypted at rest and in transit. We use enterprise-grade cloud infrastructure with daily backups. Your data is yours — export anytime, and we're fully GDPR compliant." },
    { q: "Can subcontractors access the system?", a: "Yes. Subcontractors get their own portal to view orders, submit invoices, and upload certificates. They don't see your margins or other project data." },
    { q: "Do you offer a free trial?", a: "Yes — 14 days free on any plan, no credit card required. Start building today and see the difference it makes to your bottom line." },
    { q: "Can I switch plans later?", a: "Absolutely. Upgrade or downgrade at any time. Changes take effect on your next billing cycle. No lock-in contracts — ever." },
  ]

  return (
    <section id="faq" className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">FAQ</Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">Common Questions</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-[#1A1A2E] pr-4">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white scroll-smooth" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="warning" className="mb-4">
                Built for UK Construction SMEs
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1A2E] leading-tight">
                Stop Losing Money on Every Job
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                Replace your spreadsheets, WhatsApp groups, and paper diaries with one platform that tracks every job from tender to final account. CIS-compliant. Built by builders.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8">
                    Start Free Trial
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-8 border-[#F97316] text-[#F97316] hover:bg-[#F97316] hover:text-white">
                    Try Demo →
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 mt-8 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-[#10B981]" /> 14-day free trial</span>
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-[#10B981]" /> No credit card</span>
                <span className="flex items-center gap-1"><Check className="w-4 h-4 text-[#10B981]" /> HMRC compliant</span>
              </div>
            </div>
            <div className="relative">
              <HeroIllustration className="w-full max-w-lg mx-auto drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats */}
      <TrustStatsBar />

      {/* Review Badges */}
      <ReviewBadges />

      {/* Pain Points */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="destructive" className="mb-4">The Problem</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              Your &ldquo;System&rdquo; Is Costing You Thousands
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Most construction SMEs cobble together a Frankenstack of disconnected tools. Data falls through the cracks, margins leak, and nobody has the full picture.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { title: "Lost Information", desc: "Photos in camera rolls. Notes in WhatsApp. Costs in Excel. Nothing talks to anything else. When a dispute arises, you can't find the evidence.", icon: "📱" },
              { title: "Margin Leakage", desc: "Without real-time cost tracking against estimates, you don't know you've lost money until the job's done. By then it's too late.", icon: "💸" },
              { title: "Compliance Risk", desc: "CIS returns done manually. RAMS on paper. No audit trail. One HMRC enquiry or HSE visit and you're scrambling.", icon: "⚠️" },
            ].map((pain) => (
              <div key={pain.title} className="bg-white p-8 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">{pain.icon}</div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-3">{pain.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{pain.desc}</p>
              </div>
            ))}
          </div>
          <IntegrationDiagram className="max-w-4xl mx-auto" />
        </div>
      </section>

      {/* Unlimited Messaging */}
      <UnlimitedSection />

      {/* Video Demo */}
      <VideoDemoSection />

      {/* Features */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              Everything You Need. Nothing You Don&apos;t.
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Six core modules that cover the full lifecycle of every construction project.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { Icon: JobTrackingIcon, title: "Job Tracking", desc: "From tender to final account. Track every job with phases, daily logs, valuations, and real-time budget monitoring. Know exactly where every project stands." },
              { Icon: EstimatingIcon, title: "Estimating", desc: "Build detailed estimates with material, labour, plant, and subcontract costs. Set margins, create revisions, and convert won tenders straight into live jobs." },
              { Icon: CISIcon, title: "CIS Management", desc: "Automated CIS deductions based on verified tax status. Generate monthly returns, produce verification statements, and stay HMRC compliant without the headache." },
              { Icon: SafetyIcon, title: "Health & Safety", desc: "Digital RAMS, site inductions, incident reporting with RIDDOR severity tracking, and a complete audit trail. Everything HSE inspectors want to see." },
              { Icon: SubcontractorIcon, title: "Subcontractor Portal", desc: "Manage your subbies in one place. Track certifications, insurance expiry, CIS status, and give them their own portal to view orders and submit invoices." },
              { Icon: ReportingIcon, title: "Financial Reporting", desc: "Real-time P&L by job, cash flow forecasts, retention tracking, and valuation management. See your margins before it's too late to fix them." },
            ].map((feature) => (
              <div key={feature.title} className="group p-8 rounded-xl border border-gray-200 hover:border-[#F97316] hover:shadow-lg transition-all duration-300">
                <feature.Icon className="w-16 h-16 mb-6" />
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-3 group-hover:text-[#F97316] transition-colors">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Features Showcase */}
      <NewFeaturesShowcase />

      {/* Dashboard Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">The Platform</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              Your Entire Business, One Screen
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              No more switching between apps. See every job, every cost, every team member — in real time.
            </p>
          </div>
          <DashboardMockup className="max-w-5xl mx-auto rounded-xl shadow-2xl" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              Up and Running in 3 Steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Sign Up & Import", desc: "Create your account, add your team, and import existing projects. We'll help migrate your spreadsheet data for free.", icon: "🚀" },
              { step: "2", title: "Set Up Your Sites", desc: "Configure your projects, invite subcontractors, and set up your CIS preferences. Takes less than an hour.", icon: "⚙️" },
              { step: "3", title: "Start Managing", desc: "Your team logs daily activities from site using the mobile app. Costs, photos, and safety records flow in automatically.", icon: "📊" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#F97316] text-white text-2xl font-bold flex items-center justify-center mx-auto mb-6">{item.step}</div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <MobileAppMockup className="w-56 drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section id="testimonials" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              Trusted by UK Builders
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Steve Harrington",
                role: "Director",
                company: "Harrington Builders Ltd",
                photo: "SH",
                quote: "We were losing £2-3k per job on things we couldn't track. BuildFlow paid for itself in the first month. The CIS module alone saves us a day every month.",
                result: "Saved £36k/year",
                stars: 5,
              },
              {
                name: "Rachel Okonkwo",
                role: "Office Manager",
                company: "MK Construction Group",
                photo: "RO",
                quote: "Before BuildFlow, I'd spend Friday afternoons chasing site managers for their daily logs via WhatsApp. Now everything's in the system before lunch.",
                result: "10 hours/week saved",
                stars: 5,
              },
              {
                name: "Gary Thompson",
                role: "Contracts Manager",
                company: "Thompson & Sons Building",
                photo: "GT",
                quote: "The estimating tool is brilliant. We can knock out a detailed estimate in half the time and actually track if we're hitting our margins on site.",
                result: "50% faster estimates",
                stars: 5,
              },
            ].map((t) => (
              <div key={t.name} className="bg-white p-8 rounded-xl border border-gray-200 flex flex-col">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed flex-1">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-4 mb-3">
                  <span className="inline-block bg-[#10B981]/10 text-[#10B981] text-xs font-semibold px-3 py-1 rounded-full">{t.result}</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F97316] flex items-center justify-center text-white text-sm font-bold">{t.photo}</div>
                  <div>
                    <div className="font-semibold text-[#1A1A2E] text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.role}, {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-gray-600">All plans include a 14-day free trial. No credit card required.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Starter", price: "49", desc: "For sole traders and small teams",
                features: ["Up to 5 active jobs", "3 team members", "Daily logs & photos", "Basic estimating", "Email support"],
                popular: false,
              },
              {
                name: "Pro", price: "149", desc: "For growing construction businesses",
                features: ["Up to 20 active jobs", "10 team members", "CIS management", "Full estimating suite", "Subcontractor portal", "Financial reporting", "Priority support"],
                popular: true,
              },
              {
                name: "Business", price: "299", desc: "For established contractors",
                features: ["Unlimited jobs", "25 team members", "Everything in Pro", "H&S module (RAMS, incidents)", "Snagging & defects", "Cash flow forecasting", "API access", "Phone support"],
                popular: false,
              },
              {
                name: "Enterprise", price: "499", desc: "For large operations",
                features: ["Unlimited everything", "Unlimited team members", "Everything in Business", "Custom integrations", "Dedicated account manager", "On-site training", "Custom reporting", "SLA guarantee"],
                popular: false,
              },
            ].map((plan) => (
              <div key={plan.name} className={`relative rounded-xl border-2 p-6 flex flex-col ${plan.popular ? "border-[#F97316] shadow-xl scale-105" : "border-gray-200"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="warning">Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-lg font-bold text-[#1A1A2E]">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{plan.desc}</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-bold text-[#1A1A2E]">£{plan.price}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <ul className="space-y-3 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-6">
                  <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                    Start Free Trial
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <FAQ />

      {/* Final CTA */}
      <section className="py-20 bg-[#1A1A2E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Stop Losing Money?
          </h2>
          <p className="text-gray-400 mb-2 text-lg">
            Join hundreds of UK builders who&apos;ve ditched the spreadsheets.
          </p>
          <p className="text-[#F97316] font-semibold mb-8">
            Start your free 14-day trial — no credit card required
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/register">
              <Button size="lg" className="px-8 text-base">
                Start Free Trial
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-8 text-base border-gray-600 text-gray-300 hover:text-white hover:border-white">
                Book a Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111827] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center">
                  <HardHat className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white">BuildFlow</span>
              </div>
              <p className="text-gray-400 text-sm">Construction management software built for UK SMEs. From tender to final account.</p>
              <div className="flex gap-3 mt-4">
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-gray-700 transition-colors">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#9CA3AF"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/features" className="hover:text-white transition-colors">Features</Link></li>
                <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/industries" className="hover:text-white transition-colors">Industries</Link></li>
                <li><Link href="/comparison" className="hover:text-white transition-colors">Compare</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/case-studies" className="hover:text-white transition-colors">Case Studies</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <p>© 2026 BuildFlow. All rights reserved.</p>
            <p className="mt-2 md:mt-0">Designed & Developed by <span className="text-[#F97316]">D&D</span></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
