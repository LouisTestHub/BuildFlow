"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { HardHat, Menu, X, ArrowRight, ExternalLink } from "lucide-react"
import { useState } from "react"

function Navbar() {
  const [open, setOpen] = useState(false)
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
            <Link href="/opportunity" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Opportunity</Link>
            <Link href="/market" className="text-sm text-[#F97316] font-medium">Market Research</Link>
            <Link href="/contact" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Contact</Link>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login"><Button variant="ghost" size="sm">Sign In</Button></Link>
            <Link href="/register"><Button size="sm">Start Free Trial</Button></Link>
          </div>
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {open && (
          <div className="md:hidden py-4 space-y-3 border-t">
            <Link href="/features" className="block text-sm text-gray-600 py-2">Features</Link>
            <Link href="/pricing" className="block text-sm text-gray-600 py-2">Pricing</Link>
            <Link href="/about" className="block text-sm text-gray-600 py-2">About</Link>
            <Link href="/opportunity" className="block text-sm text-gray-600 py-2">Opportunity</Link>
            <Link href="/market" className="block text-sm text-[#F97316] font-medium py-2">Market Research</Link>
            <Link href="/contact" className="block text-sm text-gray-600 py-2">Contact</Link>
          </div>
        )}
      </div>
    </nav>
  )
}

function DataCard({ title, value, source }: { title: string; value: string; source?: string }) {
  return (
    <div className="bg-white rounded-xl border p-5 hover:shadow-md transition-shadow">
      <div className="text-sm text-gray-500 mb-1">{title}</div>
      <div className="text-2xl font-bold text-[#1A1A2E]">{value}</div>
      {source && <div className="text-xs text-gray-400 mt-2 flex items-center gap-1"><ExternalLink className="w-3 h-3" /> {source}</div>}
    </div>
  )
}

function Section({ title, subtitle, children, bg = "white" }: { title: string; subtitle?: string; children: React.ReactNode; bg?: string }) {
  return (
    <section className={`py-16 ${bg === "gray" ? "bg-gray-50" : "bg-white"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-[#1A1A2E] mb-2">{title}</h2>
        {subtitle && <p className="text-gray-600 mb-10 max-w-3xl">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}

export default function MarketResearchPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm text-orange-300 mb-6">
            🔬 Industry Research Report
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            UK Construction Industry<br />
            <span className="text-[#F97316]">Market Intelligence</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-3xl">
            Comprehensive research into the UK construction sector — market size, digital adoption, 
            regulatory landscape, and technology trends. Updated March 2026.
          </p>
        </div>
      </section>

      {/* Industry Size */}
      <Section title="🏗️ Industry Size & Scale" subtitle="The UK construction industry is one of the largest sectors in the national economy." bg="gray">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <DataCard title="Construction Output (2024)" value="£140.7B" source="ONS Construction Statistics 2024" />
          <DataCard title="Market Valuation (2024)" value="$256.6B" source="GM Insights" />
          <DataCard title="Projected Market (2034)" value="$388.6B" source="GM Insights" />
          <DataCard title="Growth Rate" value="4.3% CAGR" source="2025–2034 forecast" />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-bold text-lg text-[#1A1A2E] mb-4">Output Breakdown (2024)</h3>
            <div className="space-y-3">
              {[
                { label: "Public sector new work", change: "+6.7%", positive: true },
                { label: "Private sector new work", change: "-0.7%", positive: false },
                { label: "Residential (projected 2034)", change: "$80.4B", positive: true },
                { label: "Overall output growth (2025)", change: "+1.1%", positive: true },
                { label: "Overall output growth (2026)", change: "+2.8%", positive: true },
              ].map((item) => (
                <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  <span className={`text-sm font-semibold ${item.positive ? "text-green-600" : "text-red-500"}`}>{item.change}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-bold text-lg text-[#1A1A2E] mb-4">Key Growth Drivers</h3>
            <ul className="space-y-3">
              {[
                "Government commitment to 1.5M new homes over 5 years",
                "Aviation network expansion investment",
                "Public infrastructure spending increases",
                "Building Safety Act compliance requirements",
                "Net zero construction mandates",
                "HS2 and major transport projects",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-[#F97316] mt-1">▸</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Number of Firms */}
      <Section title="🏢 SME Construction Firms" subtitle="The UK construction sector is dominated by small and medium-sized enterprises.">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <DataCard title="VAT/PAYE Registered Firms (Q3 2024)" value="370,770" source="ONS Business Statistics" />
          <DataCard title="Year-on-Year Growth" value="+1.7%" source="vs 2023" />
          <DataCard title="Construction Contractors (2025)" value="97,115" source="IBISWorld" />
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
          <h3 className="font-bold text-lg text-[#1A1A2E] mb-4">💡 The IT Challenge for SMEs</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-700 mb-4">
                Construction SMEs face unique IT challenges that keep them tied to manual processes:
              </p>
              <ul className="space-y-2">
                {[
                  "Limited IT budgets — most can't afford enterprise software",
                  "Site-based workforce with poor connectivity",
                  "Complex compliance requirements (CIS, CDM, H&S)",
                  "Fragmented supply chains with dozens of subcontractors",
                  "Project-based work makes standardisation difficult",
                  "Owner-operators wearing multiple hats",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-orange-500">•</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-gray-700 mb-4">
                Despite challenges, the appetite for digital tools is growing:
              </p>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-[#F97316]">83%</div>
                  <div className="text-sm text-gray-600">of UK construction firms prioritise digital transformation</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-[#F97316]">97%</div>
                  <div className="text-sm text-gray-600">expect to increase investment in digital project management tools within 3 years</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-3xl font-bold text-[#F97316]">73%</div>
                  <div className="text-sm text-gray-600">use digital solutions on fewer than 30% of their projects</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Digital Adoption */}
      <Section title="📱 Digital Adoption Rates" subtitle="The construction sector has historically lagged behind other industries in technology adoption — but that's changing rapidly." bg="gray">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-bold text-lg text-[#1A1A2E] mb-4">Current State</h3>
            <div className="space-y-4">
              {[
                { metric: "Firms actively engaged in digital transformation", value: "81%", note: "Higher than global average" },
                { metric: "Projects using digital solutions", value: "<30%", note: "For 73% of firms" },
                { metric: "Companies reporting implementation challenges", value: "70%+", note: "Globally" },
                { metric: "Expected increase in digital PM tool investment", value: "97%", note: "Within 3 years" },
              ].map((item) => (
                <div key={item.metric} className="border-b border-gray-100 pb-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-gray-700">{item.metric}</span>
                    <span className="text-lg font-bold text-[#F97316]">{item.value}</span>
                  </div>
                  <span className="text-xs text-gray-400">{item.note}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="font-bold text-lg text-[#1A1A2E] mb-4">Adoption Accelerators</h3>
            <div className="space-y-4">
              {[
                { title: "Made Smarter Programme", desc: "Government initiative encouraging SME digital adoption with funding and support." },
                { title: "CLC Digital Initiative", desc: "Construction Leadership Council promoting AI, IoT, and digital twins in the sector." },
                { title: "Building Safety Act", desc: "Mandates digital 'golden thread' of building information — forcing digital adoption." },
                { title: "Making Tax Digital", desc: "HMRC requires digital record-keeping, pushing firms away from paper systems." },
                { title: "Lower-Cost SaaS Options", desc: "Affordable, user-friendly software options now accessible to smaller contractors." },
              ].map((item) => (
                <div key={item.title} className="bg-gray-50 rounded-lg p-3">
                  <div className="font-medium text-sm text-[#1A1A2E]">{item.title}</div>
                  <div className="text-xs text-gray-600 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Key Regulations */}
      <Section title="⚖️ Key Regulations" subtitle="UK construction is one of the most heavily regulated industries. Compliance drives software adoption.">
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              title: "CDM 2015 — Construction (Design and Management) Regulations",
              items: [
                "Applies to all construction projects in the UK",
                "Principal contractor must maintain H&S documentation",
                "Pre-construction information and phase plans required",
                "Notification to HSE for projects lasting >30 days or >500 person-days",
                "Duty holders must demonstrate competence and compliance",
              ],
            },
            {
              title: "Building Safety Act 2022",
              items: [
                "Post-Grenfell legislation for higher-risk buildings",
                "Requires 'golden thread' of digital building information",
                "Building Safety Regulator oversight throughout lifecycle",
                "Paper records insufficient — digital systems required",
                "Criminal liability for non-compliance",
              ],
            },
            {
              title: "CIS — Construction Industry Scheme",
              items: [
                "HMRC mandates monthly CIS returns for contractors",
                "Subcontractor verification required before each payment",
                "Tax deductions at 20% (registered) or 30% (unregistered)",
                "Penalties of £100–£3,000+ for late/incorrect filing",
                "Applies to all businesses paying subcontractors in construction",
              ],
            },
            {
              title: "Health & Safety at Work Act 1974",
              items: [
                "Employers must ensure worker safety as far as reasonably practicable",
                "Risk assessments and method statements (RAMS) required",
                "HSE inspectors can issue improvement/prohibition notices",
                "Maximum penalty: unlimited fines and imprisonment",
                "Accident reporting under RIDDOR regulations",
              ],
            },
          ].map((reg) => (
            <div key={reg.title} className="bg-white rounded-2xl border p-6">
              <h3 className="font-bold text-[#1A1A2E] mb-4 text-sm">{reg.title}</h3>
              <ul className="space-y-2">
                {reg.items.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-gray-600">
                    <span className="text-[#F97316] mt-0.5">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Industry Trends */}
      <Section title="🔮 Industry Trends" subtitle="The construction industry is undergoing significant transformation." bg="gray">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Building Information Modelling (BIM)",
              desc: "BIM Level 2 mandated on government projects since 2016. Driving demand for digital collaboration tools across the supply chain. The 'golden thread' concept extends BIM principles to all building information.",
              trend: "Growing",
            },
            {
              title: "Modular & Off-Site Construction",
              desc: "Modern Methods of Construction (MMC) are growing rapidly, supported by government housing targets. MMC requires precise digital planning, scheduling, and quality tracking.",
              trend: "Accelerating",
            },
            {
              title: "Sustainability & Net Zero",
              desc: "The construction industry accounts for ~40% of UK carbon emissions. New regulations on embodied carbon, energy performance, and whole-life carbon assessment are driving digital monitoring.",
              trend: "Regulatory push",
            },
            {
              title: "AI & Automation",
              desc: "CLC Construct AI initiative promoting AI adoption. Applications include automated scheduling, cost estimation, safety monitoring, and predictive maintenance. Still early for SMEs.",
              trend: "Emerging",
            },
            {
              title: "Labour Shortages",
              desc: "Post-Brexit labour shortages making efficiency tools essential. The CITB forecasts 225,000 extra workers needed by 2027. Technology helps firms do more with fewer people.",
              trend: "Critical",
            },
            {
              title: "Supply Chain Digitisation",
              desc: "Material cost volatility driving demand for better procurement tracking. Digital supply chain tools help manage pricing, deliveries, and stock across projects.",
              trend: "Growing",
            },
          ].map((trend) => (
            <div key={trend.title} className="bg-white rounded-2xl border p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-sm text-[#1A1A2E]">{trend.title}</h3>
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{trend.trend}</span>
              </div>
              <p className="text-sm text-gray-600">{trend.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Sources */}
      <Section title="📚 Sources & References" subtitle="This research draws from official government statistics, industry bodies, and market research firms.">
        <div className="bg-gray-50 rounded-2xl border p-6">
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            {[
              "ONS — Construction Statistics Annual Report 2024",
              "GM Insights — UK Construction Market Report",
              "IMARC Group — UK Construction Market Size & Forecast",
              "IBISWorld — Construction Contractors UK Industry Report",
              "Construction Leadership Council — Digital Transformation Initiative",
              "HSE — CDM 2015 Regulations Guide",
              "HMRC — Construction Industry Scheme Documentation",
              "Building Safety Act 2022 — Legislation.gov.uk",
              "CITB — Construction Skills Network Reports",
              "Research & Markets — UK Construction Market Analysis",
            ].map((source) => (
              <div key={source} className="flex items-start gap-2 py-1">
                <ExternalLink className="w-3 h-3 text-gray-400 mt-1 flex-shrink-0" />
                <span>{source}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-[#F97316] to-[#EA580C]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            See why BuildFlow is the right tool for this market
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Purpose-built for UK construction SMEs. CIS-compliant. Mobile-first. Affordable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="bg-white text-[#F97316] hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/opportunity">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                View Business Plan
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1A1A2E] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <div className="space-y-2">
                <Link href="/features" className="block text-gray-400 hover:text-white">Features</Link>
                <Link href="/pricing" className="block text-gray-400 hover:text-white">Pricing</Link>
                <Link href="/integrations" className="block text-gray-400 hover:text-white">Integrations</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <div className="space-y-2">
                <Link href="/about" className="block text-gray-400 hover:text-white">About</Link>
                <Link href="/opportunity" className="block text-gray-400 hover:text-white">Opportunity</Link>
                <Link href="/market" className="block text-gray-400 hover:text-white">Market Research</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Resources</h4>
              <div className="space-y-2">
                <Link href="/case-studies" className="block text-gray-400 hover:text-white">Case Studies</Link>
                <Link href="/cis-guide" className="block text-gray-400 hover:text-white">CIS Guide</Link>
                <Link href="/contact" className="block text-gray-400 hover:text-white">Contact</Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <div className="space-y-2">
                <Link href="/privacy" className="block text-gray-400 hover:text-white">Privacy</Link>
                <Link href="/terms" className="block text-gray-400 hover:text-white">Terms</Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} BuildFlow by Data & Digital. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
