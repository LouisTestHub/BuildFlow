"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HardHat, ArrowRight, TrendingUp, Clock, PoundSterling, ShieldCheck, Copy, Check } from "lucide-react"

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
            <Link href="/compare" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Compare</Link>
            <Link href="/integrations" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Integrations</Link>
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

function Footer() {
  return (
    <footer className="bg-[#1A1A2E] text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <div className="space-y-2 text-sm">
              <Link href="/features" className="block hover:text-white">Features</Link>
              <Link href="/pricing" className="block hover:text-white">Pricing</Link>
              <Link href="/cis" className="block hover:text-white">CIS Compliance</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Compare</h4>
            <div className="space-y-2 text-sm">
              <Link href="/compare/spreadsheets" className="block hover:text-white">vs Spreadsheets</Link>
              <Link href="/compare/procore" className="block hover:text-white">vs Procore</Link>
              <Link href="/compare/buildertrend" className="block hover:text-white">vs Buildertrend</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Resources</h4>
            <div className="space-y-2 text-sm">
              <Link href="/cis-calculator" className="block hover:text-white">CIS Calculator</Link>
              <Link href="/roi-calculator" className="block hover:text-white">ROI Calculator</Link>
              <Link href="/cis-guide" className="block hover:text-white">CIS Guide</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block hover:text-white">About</Link>
              <Link href="/contact" className="block hover:text-white">Contact</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 mt-8 pt-8 text-sm text-center">
          © {new Date().getFullYear()} BuildFlow. Built for UK construction.
        </div>
      </div>
    </footer>
  )
}

export default function ROICalculatorPage() {
  const [teamSize, setTeamSize] = useState("5")
  const [currentTools, setCurrentTools] = useState("spreadsheets")
  const [projectsPerYear, setProjectsPerYear] = useState("10")
  const [avgProjectValue, setAvgProjectValue] = useState("150000")
  const [adminHoursPerWeek, setAdminHoursPerWeek] = useState("15")
  const [copied, setCopied] = useState(false)

  const team = parseInt(teamSize) || 1
  const projects = parseInt(projectsPerYear) || 1
  const avgValue = parseFloat(avgProjectValue) || 0
  const adminHours = parseFloat(adminHoursPerWeek) || 0

  // Calculations
  const hourlyRate = 35 // avg admin cost
  const timeSavedPercent = currentTools === "spreadsheets" ? 0.6 : currentTools === "paper" ? 0.75 : 0.3
  const timeSavedHoursWeek = adminHours * timeSavedPercent
  const timeSavedHoursYear = timeSavedHoursWeek * 48 // 48 working weeks
  const timeSavingsValue = timeSavedHoursYear * hourlyRate

  const errorReductionPercent = currentTools === "spreadsheets" ? 85 : currentTools === "paper" ? 95 : 50
  const costLeakagePercent = currentTools === "spreadsheets" ? 0.03 : currentTools === "paper" ? 0.05 : 0.015
  const totalRevenue = projects * avgValue
  const costSavings = totalRevenue * costLeakagePercent
  const cashFlowImprovement = totalRevenue * 0.02 // 2% improvement from faster invoicing

  const buildflowCost = team <= 5 ? 49 * 12 : team <= 20 ? 149 * 12 : 349 * 12
  const totalROI = timeSavingsValue + costSavings + cashFlowImprovement - buildflowCost
  const roiMultiple = buildflowCost > 0 ? totalROI / buildflowCost : 0

  const formatMoney = (n: number) => `£${Math.round(n).toLocaleString("en-GB")}`

  const handleCopy = () => {
    const text = `BuildFlow ROI Report
Team Size: ${team}
Current Tools: ${currentTools}
Projects/Year: ${projects}
Avg Project Value: ${formatMoney(avgValue)}
Admin Hours/Week: ${adminHours}

Results:
Time Saved: ${Math.round(timeSavedHoursYear)} hours/year (${formatMoney(timeSavingsValue)})
Cost Savings: ${formatMoney(costSavings)}
Cash Flow Improvement: ${formatMoney(cashFlowImprovement)}
BuildFlow Cost: ${formatMoney(buildflowCost)}/year
Total Annual ROI: ${formatMoney(totalROI)}
ROI Multiple: ${roiMultiple.toFixed(1)}x`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-[#1A1A2E] to-[#2D2D4E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-[#F97316]/20 text-[#F97316] border-0 mb-4">Free Tool</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            BuildFlow ROI Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            See exactly how much time and money BuildFlow can save your construction business.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Inputs */}
            <div className="lg:col-span-3 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Your Business Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Team size (people)</label>
                    <Input type="number" value={teamSize} onChange={(e) => setTeamSize(e.target.value)} min="1" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Current tools</label>
                    <select
                      value={currentTools}
                      onChange={(e) => setCurrentTools(e.target.value)}
                      className="w-full h-10 border border-gray-200 rounded-lg px-3 text-sm"
                    >
                      <option value="spreadsheets">Spreadsheets (Excel/Google Sheets)</option>
                      <option value="paper">Paper / Notebooks</option>
                      <option value="other_software">Other construction software</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Projects per year</label>
                    <Input type="number" value={projectsPerYear} onChange={(e) => setProjectsPerYear(e.target.value)} min="1" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Average project value (£)</label>
                    <Input type="number" value={avgProjectValue} onChange={(e) => setAvgProjectValue(e.target.value)} min="0" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Admin hours per week</label>
                    <Input type="number" value={adminHoursPerWeek} onChange={(e) => setAdminHoursPerWeek(e.target.value)} min="0" />
                  </div>
                </CardContent>
              </Card>

              {/* Before/After comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">You Currently vs You with BuildFlow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <h4 className="font-bold text-red-800 text-sm mb-3">Currently</h4>
                      <ul className="space-y-2 text-xs text-gray-700">
                        <li>⏱️ {adminHours} hours/week on admin</li>
                        <li>📊 {currentTools === "spreadsheets" ? "Multiple spreadsheets" : currentTools === "paper" ? "Paper trail" : "Disconnected tools"}</li>
                        <li>💸 ~{(costLeakagePercent * 100).toFixed(1)}% cost leakage</li>
                        <li>📋 Manual CIS calculations</li>
                        <li>🔍 Limited project visibility</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h4 className="font-bold text-green-800 text-sm mb-3">With BuildFlow</h4>
                      <ul className="space-y-2 text-xs text-gray-700">
                        <li>⏱️ {Math.round(adminHours - timeSavedHoursWeek)} hours/week on admin</li>
                        <li>📊 One platform for everything</li>
                        <li>💸 Near-zero cost leakage</li>
                        <li>📋 Automated CIS compliance</li>
                        <li>🔍 Real-time dashboards</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <Card className="border-[#F97316]/30 bg-[#F97316]/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      Your Annual ROI
                      <Button variant="ghost" size="sm" onClick={handleCopy} className="text-[#F97316]">
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Time Saved</p>
                        <p className="font-bold text-lg text-[#1A1A2E]">{Math.round(timeSavedHoursYear)} hours/year</p>
                        <p className="text-xs text-gray-500">Worth {formatMoney(timeSavingsValue)} at £{hourlyRate}/hr</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        <PoundSterling className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cost Savings</p>
                        <p className="font-bold text-lg text-[#1A1A2E]">{formatMoney(costSavings)}</p>
                        <p className="text-xs text-gray-500">Reduced errors & cost leakage</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <ShieldCheck className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Error Reduction</p>
                        <p className="font-bold text-lg text-[#1A1A2E]">{errorReductionPercent}% fewer errors</p>
                        <p className="text-xs text-gray-500">Automated calculations & checks</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Cash Flow Improvement</p>
                        <p className="font-bold text-lg text-[#1A1A2E]">{formatMoney(cashFlowImprovement)}</p>
                        <p className="text-xs text-gray-500">Faster invoicing & payment tracking</p>
                      </div>
                    </div>

                    <div className="border-t border-[#F97316]/20 pt-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">BuildFlow cost</span>
                        <span className="font-mono text-gray-500">−{formatMoney(buildflowCost)}/yr</span>
                      </div>
                      <div className="flex justify-between text-xl font-bold">
                        <span className="text-[#1A1A2E]">Total Annual ROI</span>
                        <span className="text-green-600 font-mono">{formatMoney(totalROI)}</span>
                      </div>
                      <div className="text-center mt-3">
                        <Badge className="bg-green-100 text-green-800 border-0 text-lg px-4 py-1">
                          {roiMultiple.toFixed(1)}x return on investment
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-[#1A1A2E] text-white border-0">
                  <CardContent className="p-6 text-center space-y-3">
                    <h3 className="font-bold text-lg">Ready to save {formatMoney(totalROI)}/year?</h3>
                    <p className="text-sm text-gray-300">
                      Start your 14-day free trial and see the difference from day one.
                    </p>
                    <Link href="/register">
                      <Button className="w-full bg-[#F97316] hover:bg-[#EA580C]">
                        Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
