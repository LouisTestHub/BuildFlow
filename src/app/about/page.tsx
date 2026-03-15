"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, Target, Users, Award, Shield, TrendingUp } from "lucide-react"

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
            <Link href="/about" className="text-sm text-[#F97316] font-medium">About</Link>
            <Link href="/case-studies" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Case Studies</Link>
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

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Built for Builders",
      description: "We're not a generic project management tool adapted for construction. We were designed from day one for UK construction SMEs — with their language, their workflows, and their compliance requirements baked in."
    },
    {
      icon: Users,
      title: "Customer-Led Development",
      description: "Every feature we build comes from real customer feedback. We listen to site managers, quantity surveyors, contracts managers, and directors. If it doesn't solve a real problem, we don't build it."
    },
    {
      icon: Shield,
      title: "Security & Compliance First",
      description: "Your data is encrypted, backed up daily, and hosted on enterprise-grade infrastructure. We're GDPR compliant, Cyber Essentials certified, and HMRC CIS compliant out of the box."
    },
    {
      icon: TrendingUp,
      title: "Grow With You",
      description: "Whether you're a one-man band or managing 50 sites, BuildFlow scales with your business. No lock-in contracts, no forced upgrades — just software that adapts to where you are now."
    }
  ]

  const team = [
    {
      name: "James Mitchell",
      role: "Co-Founder & CEO",
      bio: "Former site manager turned software founder. Spent 12 years on construction sites before building BuildFlow to solve the problems he lived with daily.",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400"
    },
    {
      name: "Sarah Chen",
      role: "Co-Founder & CTO",
      bio: "Built enterprise SaaS platforms for 15 years. Led engineering at construction tech startups before co-founding BuildFlow to bring modern software to traditional industries.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400"
    },
    {
      name: "David Thompson",
      role: "Head of Product",
      bio: "Former quantity surveyor with deep experience in cost management and financial reporting. Ensures every feature meets the real needs of construction professionals.",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400"
    },
    {
      name: "Rachel Okonkwo",
      role: "Head of Customer Success",
      bio: "20 years in construction operations and office management. Leads onboarding, training, and ensures every customer gets maximum value from BuildFlow.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400"
    }
  ]

  const stats = [
    { label: "Construction Sites Managed", value: "500+" },
    { label: "Estimates Processed", value: "£2M+" },
    { label: "Active Users", value: "1,200+" },
    { label: "Average Time Saved Per Week", value: "8 hours" }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-6">
            Built by Builders, for Builders
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            BuildFlow was born from frustration. Frustration with clunky software, spreadsheet hell, and tools that clearly weren't designed by anyone who'd ever run a construction site.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A2E] mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  In 2023, James Mitchell was a contracts manager for a mid-sized contractor in Essex. He was juggling 12 live sites, a WhatsApp group with 47 unread messages, three different Excel spreadsheets for each job, and a filing cabinet full of paper RAMS that nobody ever looked at.
                </p>
                <p>
                  When a client questioned a £12,000 variation, James couldn't find the site diary entry that proved the work was instructed. The photo was in someone's camera roll. The note was in a WhatsApp chat. The cost was in a spreadsheet on someone else's laptop.
                </p>
                <p>
                  That was the breaking point. He called Sarah Chen, a friend who'd built software for construction tech companies, and said: <span className="italic">"There has to be a better way."</span>
                </p>
                <p>
                  Six months later, BuildFlow was born. Not a generic project management tool with construction buzzwords slapped on. A platform designed from the ground up for UK construction SMEs — built by people who understand the difference between a RAMS and a contract programme.
                </p>
                <p className="font-semibold text-[#1A1A2E]">
                  Today, BuildFlow helps hundreds of contractors track thousands of jobs, manage millions in valuations, and stay compliant without the headache.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800" 
                alt="Construction site meeting"
                className="rounded-xl shadow-2xl w-full h-[500px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="success" className="mb-4">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E]">
              What We Stand For
            </h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#F97316]/10 mb-6">
                  <value.icon className="w-6 h-6 text-[#F97316]" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-[#1A1A2E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-[#F97316] mb-2">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Our Team</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-4">
              Meet the Team
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A mix of construction professionals and software experts who understand both the site and the screen.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center group">
                <div className="relative mb-6 overflow-hidden rounded-xl">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                <h3 className="text-lg font-bold text-[#1A1A2E] mb-1">{member.name}</h3>
                <p className="text-sm text-[#F97316] font-medium mb-3">{member.role}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications & Trust Badges */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">Trust & Compliance</Badge>
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">
              Certified & Compliant
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We take security, compliance, and data protection seriously. BuildFlow meets the standards you'd expect from enterprise software.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10B981]/10 mb-4">
                <Award className="w-8 h-8 text-[#10B981]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Cyber Essentials</h3>
              <p className="text-sm text-gray-600">Government-backed cyber security certification</p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#3B82F6]/10 mb-4">
                <Shield className="w-8 h-8 text-[#3B82F6]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">GDPR Compliant</h3>
              <p className="text-sm text-gray-600">Full data protection compliance and right to erasure</p>
            </div>
            <div className="bg-white p-8 rounded-xl text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F97316]/10 mb-4">
                <HardHat className="w-8 h-8 text-[#F97316]" />
              </div>
              <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">HMRC CIS Compliant</h3>
              <p className="text-sm text-gray-600">Built-in CIS management meets HMRC requirements</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1A1A2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Hundreds of UK Builders
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Start your free trial today and see why contractors across the UK are ditching spreadsheets for BuildFlow.
          </p>
          <Link href="/register">
            <Button size="lg">
              Start Free Trial
            </Button>
          </Link>
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
