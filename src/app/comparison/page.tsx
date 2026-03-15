"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, Check, X, AlertCircle } from "lucide-react"

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

export default function ComparisonPage() {
  const comparisons = [
    { feature: "Starting price (per month)", buildflow: "£49", procore: "£350+", spreadsheets: "Free", paper: "Free" },
    { feature: "Setup time", buildflow: "< 1 hour", procore: "Days/weeks", spreadsheets: "Hours", paper: "N/A" },
    { feature: "Mobile-first design", buildflow: true, procore: "Limited", spreadsheets: false, paper: false },
    { feature: "Works offline", buildflow: true, procore: false, spreadsheets: "Partial", paper: true },
    { feature: "UK CIS compliance built-in", buildflow: true, procore: false, spreadsheets: false, paper: false },
    { feature: "Daily site logs with GPS/timestamps", buildflow: true, procore: true, spreadsheets: false, paper: "Manual" },
    { feature: "Photo storage & organisation", buildflow: true, procore: true, spreadsheets: false, paper: false },
    { feature: "Real-time cost tracking", buildflow: true, procore: true, spreadsheets: "Manual", paper: "Manual" },
    { feature: "Estimating templates", buildflow: true, procore: true, spreadsheets: "DIY", paper: false },
    { feature: "Subcontractor portal", buildflow: true, procore: true, spreadsheets: false, paper: false },
    { feature: "H&S / RAMS management", buildflow: true, procore: true, spreadsheets: false, paper: "Manual" },
    { feature: "Automated CIS monthly returns", buildflow: true, procore: false, spreadsheets: "Manual", paper: "Manual" },
    { feature: "Valuation & retention tracking", buildflow: true, procore: true, spreadsheets: "Manual", paper: "Manual" },
    { feature: "Data loss risk", buildflow: "Minimal", procore: "Minimal", spreadsheets: "High", paper: "Very High" },
    { feature: "Audit trail", buildflow: true, procore: true, spreadsheets: false, paper: false },
    { feature: "Searchable document archive", buildflow: true, procore: true, spreadsheets: "Limited", paper: false },
    { feature: "Learning curve", buildflow: "Low", procore: "High", spreadsheets: "Medium", paper: "N/A" },
    { feature: "Suitable for SMEs (< £10M turnover)", buildflow: true, procore: false, spreadsheets: "Yes*", paper: "Yes*" },
  ]

  const alternatives = [
    {
      title: "Spreadsheets (Excel / Google Sheets)",
      pros: [
        "Free or cheap",
        "You already know how to use them",
        "Flexible — build whatever you want"
      ],
      cons: [
        "No mobile access (or very clunky)",
        "Version control nightmare ('Final_v3_ACTUAL_FINAL.xlsx')",
        "No audit trail — anyone can change anything",
        "Data scattered across multiple files",
        "No photo integration",
        "Formulas break, files get corrupted",
        "Zero CIS automation",
        "Manual everything = human error"
      ],
      verdict: "Great for your first few jobs. Beyond that, it's a liability."
    },
    {
      title: "Paper-Based Systems",
      pros: [
        "Works without internet",
        "Familiar to old-school site teams",
        "No subscription fees"
      ],
      cons: [
        "Lost paperwork = lost evidence",
        "No backups (water damage, fire, theft)",
        "Impossible to search or analyse",
        "Can't share with clients/team remotely",
        "Photos still end up on phones",
        "CIS returns are a monthly nightmare",
        "No real-time visibility for office/directors",
        "Compliance audits are hell"
      ],
      verdict: "Nostalgic, but expensive. Hidden costs in lost time, disputes, and compliance failures."
    },
    {
      title: "Enterprise Tools (Procore, Aconex, etc.)",
      pros: [
        "Feature-rich",
        "Used by large contractors",
        "Strong reporting & integrations"
      ],
      cons: [
        "£300-500+ per month minimum",
        "Complex setup (often requires consultants)",
        "Designed for £50M+ projects, not SME jobs",
        "Overkill for most UK SME workflows",
        "Steep learning curve",
        "Not UK-specific (no CIS module)",
        "Poor mobile experience on site",
        "Lock-in contracts and forced upgrades"
      ],
      verdict: "Built for tier-1 contractors, not UK SMEs. You'll pay for features you'll never use."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Comparison</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-6">
            How BuildFlow Compares
          </h1>
          <p className="text-lg text-gray-600">
            See how BuildFlow stacks up against spreadsheets, paper systems, and enterprise tools like Procore.
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50">Feature</th>
                    <th className="px-6 py-4 text-center bg-[#F97316]/5">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-lg bg-[#F97316] flex items-center justify-center mb-2">
                          <HardHat className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-sm font-bold text-[#1A1A2E]">BuildFlow</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Procore</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Spreadsheets</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Paper</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisons.map((row, i) => (
                    <tr key={row.feature} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 text-sm font-medium text-gray-700 sticky left-0 bg-inherit">{row.feature}</td>
                      <td className="px-6 py-4 text-center bg-[#F97316]/5">
                        {typeof row.buildflow === 'boolean' ? (
                          row.buildflow ? <Check className="w-5 h-5 text-[#10B981] mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : (
                          <span className="text-sm font-semibold text-[#1A1A2E]">{row.buildflow}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.procore === 'boolean' ? (
                          row.procore ? <Check className="w-5 h-5 text-[#10B981] mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : (
                          <span className="text-sm text-gray-700">{row.procore}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.spreadsheets === 'boolean' ? (
                          row.spreadsheets ? <Check className="w-5 h-5 text-[#10B981] mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : (
                          <span className="text-sm text-gray-700">{row.spreadsheets}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof row.paper === 'boolean' ? (
                          row.paper ? <Check className="w-5 h-5 text-[#10B981] mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                        ) : (
                          <span className="text-sm text-gray-700">{row.paper}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Detailed Breakdowns */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">
              The Alternatives: Pros & Cons
            </h2>
            <p className="text-gray-600">
              Every option has trade-offs. Here's the honest breakdown.
            </p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {alternatives.map((alt) => (
              <div key={alt.title} className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-[#1A1A2E] mb-6">{alt.title}</h3>
                
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                    <Check className="w-4 h-4" /> Pros
                  </h4>
                  <ul className="space-y-2">
                    {alt.pros.map((pro) => (
                      <li key={pro} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-green-600 mt-1">•</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-red-600 mb-3 flex items-center gap-2">
                    <X className="w-4 h-4" /> Cons
                  </h4>
                  <ul className="space-y-2">
                    {alt.cons.map((con) => (
                      <li key={con} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-red-600 mt-1">•</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm italic text-gray-700">
                    <strong>Verdict:</strong> {alt.verdict}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why BuildFlow */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="warning" className="mb-4">The BuildFlow Difference</Badge>
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-6">
              Built for UK Construction SMEs
            </h2>
          </div>
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-[#F97316]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A2E] mb-2">Affordable for SMEs</h3>
                <p className="text-sm text-gray-600">Starting at £49/month, not £350+. Pay for what you use, scale as you grow.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-[#F97316]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A2E] mb-2">UK-Specific Features</h3>
                <p className="text-sm text-gray-600">CIS compliance, HMRC returns, RIDDOR-aligned H&S. Built for UK contractors, not adapted.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-[#F97316]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A2E] mb-2">Easy to Use</h3>
                <p className="text-sm text-gray-600">If you can use WhatsApp, you can use BuildFlow. No consultants, no training courses.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-[#F97316]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A2E] mb-2">Mobile-First</h3>
                <p className="text-sm text-gray-600">Designed for muddy hands and bright sunlight. Works offline. Site teams actually use it.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-5 h-5 text-[#F97316]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#1A1A2E] mb-2">No Lock-In</h3>
                <p className="text-sm text-gray-600">Cancel anytime. Export your data. No forced upgrades or sneaky contract clauses.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1A1A2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Leave Spreadsheets Behind?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Start your 14-day free trial today. No credit card required.
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
