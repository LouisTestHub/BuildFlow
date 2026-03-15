"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, Home, Building2, Hammer, Wrench } from "lucide-react"

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

export default function IndustriesPage() {
  const industries = [
    {
      icon: Home,
      title: "Residential Construction",
      subtitle: "New builds, extensions, conversions",
      image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800",
      challenges: [
        "Managing multiple small jobs simultaneously",
        "Coordinating with homeowners who aren't construction-savvy",
        "Tracking variations and scope changes clearly",
        "Managing subcontractors across sites"
      ],
      solutions: [
        {
          feature: "Job Management",
          description: "Track 20+ residential jobs with client details, site addresses, and individual phases for each property."
        },
        {
          feature: "Client Communication",
          description: "Export professional daily logs with photos to share with homeowners. Build trust with transparency."
        },
        {
          feature: "Variation Tracking",
          description: "Document every scope change with photos, costs, and client sign-off. No more 'he said, she said' disputes."
        },
        {
          feature: "Subcontractor Portal",
          description: "Manage your plumbers, electricians, and specialists with one system. Track certs, insurance, and CIS status."
        }
      ],
      typical: "Extensions, loft conversions, new builds, renovations"
    },
    {
      icon: Building2,
      title: "Commercial Construction",
      subtitle: "Retail fit-outs, office refurbishments, industrial units",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
      challenges: [
        "Strict client deadlines with liquidated damages clauses",
        "Complex H&S requirements (RAMS, method statements)",
        "Multiple trades working simultaneously on tight programmes",
        "Retention and staged valuation management"
      ],
      solutions: [
        {
          feature: "Programme Tracking",
          description: "Monitor job phases and milestones. Get early warnings when tasks are running behind schedule."
        },
        {
          feature: "Health & Safety",
          description: "Digital RAMS, site inductions, and incident reporting. Everything HSE wants to see, ready in minutes."
        },
        {
          feature: "Valuation Management",
          description: "Track retention, payment schedules, and staged valuations. Know exactly what's due and when."
        },
        {
          feature: "Financial Reporting",
          description: "Real-time P&L by job. See margin erosion before it's too late to fix."
        }
      ],
      typical: "Retail units, office fit-outs, warehouses, industrial refurbishment"
    },
    {
      icon: Hammer,
      title: "Civil Engineering & Infrastructure",
      subtitle: "Groundworks, drainage, surfacing, utilities",
      image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800",
      challenges: [
        "Remote sites with limited connectivity",
        "Plant and equipment cost tracking",
        "Weather delays and site conditions documentation",
        "Multi-phase jobs spanning months or years"
      ],
      solutions: [
        {
          feature: "Offline Mode",
          description: "Log daily activities, take photos, and record costs even without internet. Sync when you're back online."
        },
        {
          feature: "Plant & Equipment",
          description: "Track plant usage, fuel costs, and hire charges against jobs. Know if that excavator is making or losing money."
        },
        {
          feature: "Weather & Conditions",
          description: "Daily logs include weather and site conditions. Crucial evidence when delays happen."
        },
        {
          feature: "Long-Term Jobs",
          description: "Manage jobs spanning months with multiple phases, interim valuations, and rolling cost forecasts."
        }
      ],
      typical: "Groundworks, drainage, hard landscaping, road resurfacing, utilities installation"
    },
    {
      icon: Wrench,
      title: "Refurbishment & Maintenance",
      subtitle: "Social housing, commercial repairs, reactive maintenance",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800",
      challenges: [
        "High volume of small reactive jobs",
        "Quick turnaround requirements",
        "Snagging and defect tracking",
        "Compliance documentation (especially for social housing)"
      ],
      solutions: [
        {
          feature: "Rapid Job Creation",
          description: "Create jobs on the go from mobile. Log details, take photos, assign teams — all in under 2 minutes."
        },
        {
          feature: "Snagging Module",
          description: "Track defects from identification to resolution. Assign responsibility, set priorities, and close out with photos."
        },
        {
          feature: "Compliance Audit Trail",
          description: "Full audit trail for social housing and public sector work. Who did what, when, with photographic evidence."
        },
        {
          feature: "Quick Reporting",
          description: "Generate completion reports and defects lists for clients in seconds. Export as PDF or share via email."
        }
      ],
      typical: "Social housing repairs, planned maintenance, reactive works, void refurbishments"
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Industries</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-6">
            Built for Every Type of Construction Project
          </h1>
          <p className="text-lg text-gray-600">
            Whether you're building homes, fitting out retail units, laying groundworks, or managing maintenance contracts — BuildFlow adapts to your workflow.
          </p>
        </div>
      </section>

      {/* Industries */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {industries.map((industry, index) => (
            <div key={industry.title}>
              {/* Industry Header */}
              <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#F97316]/10 mb-6">
                    <industry.icon className="w-8 h-8 text-[#F97316]" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-[#1A1A2E] mb-3">{industry.title}</h2>
                  <p className="text-lg text-gray-600 mb-6">{industry.subtitle}</p>
                  <p className="text-sm text-gray-500 mb-8">
                    <strong>Typical projects:</strong> {industry.typical}
                  </p>
                  
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="font-semibold text-[#1A1A2E] mb-4">Common Challenges</h3>
                    <ul className="space-y-2">
                      {industry.challenges.map((challenge) => (
                        <li key={challenge} className="flex items-start gap-3 text-sm text-gray-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F97316] mt-2 flex-shrink-0"></span>
                          {challenge}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative rounded-xl overflow-hidden shadow-2xl">
                    <img 
                      src={industry.image} 
                      alt={industry.title}
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  </div>
                </div>
              </div>

              {/* Solutions Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {industry.solutions.map((solution) => (
                  <div key={solution.feature} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <h4 className="font-bold text-[#1A1A2E] mb-3">{solution.feature}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{solution.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Universal Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="success" className="mb-4">Core Features</Badge>
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">
              Features That Work Across All Industries
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              No matter what you build, these features are non-negotiable for running a compliant, profitable business.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1A1A2E] mb-3">CIS Compliance</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Automated CIS deductions, monthly returns, and verification statements. Works for any contractor employing subbies, regardless of sector.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1A1A2E] mb-3">Mobile-First Logging</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Site teams log daily activities, costs, and photos from mobile. Works offline. Whether you're on a muddy site or a retail fit-out, the workflow is identical.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1A1A2E] mb-3">Financial Visibility</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Real-time P&L, cost tracking against estimates, and cash flow forecasting. Critical for profitability, regardless of project type.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1A1A2E] mb-3">Document Management</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Upload contracts, drawings, specs, certs, and invoices. Tag by job, search across everything. Never lose a critical document again.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1A1A2E] mb-3">Subcontractor Control</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Track insurance, accreditations, and CIS status. Portal for subbies to view orders and submit invoices. Compliance made simple.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="font-bold text-[#1A1A2E] mb-3">Audit Trail</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Full audit trail of who changed what, when. Essential for disputes, HMRC enquiries, and client audits. Evidence you can trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1A1A2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            No Matter What You Build, We've Got You Covered
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Start your 14-day free trial today and see how BuildFlow adapts to your workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white hover:text-[#1A1A2E]">
                Talk to Sales
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
