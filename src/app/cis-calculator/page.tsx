"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HardHat, Calculator, ArrowRight, Copy, Check, RotateCcw, Download } from "lucide-react"

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
            <Link href="/cis" className="text-sm text-[#F97316] font-medium">CIS</Link>
            <Link href="/compare" className="text-sm text-gray-600 hover:text-[#1A1A2E]">Compare</Link>
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
            <h4 className="text-white font-semibold mb-4">Tools</h4>
            <div className="space-y-2 text-sm">
              <Link href="/cis-calculator" className="block hover:text-white">CIS Calculator</Link>
              <Link href="/roi-calculator" className="block hover:text-white">ROI Calculator</Link>
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

type CalcMode = "forward" | "reverse"
type SubStatus = "gross" | "net" | "higher"

const RATES: Record<SubStatus, number> = { gross: 0, net: 20, higher: 30 }
const STATUS_LABELS: Record<SubStatus, string> = {
  gross: "Gross (0%)",
  net: "Registered (20%)",
  higher: "Unregistered (30%)",
}

export default function CISCalculatorPage() {
  const [mode, setMode] = useState<CalcMode>("forward")
  const [status, setStatus] = useState<SubStatus>("net")
  const [grossInput, setGrossInput] = useState("")
  const [materialsInput, setMaterialsInput] = useState("")
  const [netDesired, setNetDesired] = useState("")
  const [vatRate, setVatRate] = useState("20")
  const [includeVat, setIncludeVat] = useState(false)
  const [copied, setCopied] = useState(false)

  // Monthly return estimator
  const [monthlySubbies, setMonthlySubbies] = useState("")
  const [avgPayment, setAvgPayment] = useState("")

  const rate = RATES[status]

  // Forward calculation
  const gross = parseFloat(grossInput) || 0
  const materials = parseFloat(materialsInput) || 0
  const cisLiable = Math.max(0, gross - materials)
  const deduction = cisLiable * (rate / 100)
  const netPayment = gross - deduction
  const vatAmount = includeVat ? gross * (parseFloat(vatRate) / 100) : 0
  const totalWithVat = gross + vatAmount

  // Reverse calculation: desired net → required gross
  const desiredNet = parseFloat(netDesired) || 0
  const reverseGross = rate === 100 ? 0 : desiredNet / (1 - rate / 100)
  const reverseDeduction = reverseGross - desiredNet
  const reverseVat = includeVat ? reverseGross * (parseFloat(vatRate) / 100) : 0

  // Monthly return estimator
  const subbieCount = parseInt(monthlySubbies) || 0
  const avgPay = parseFloat(avgPayment) || 0
  const monthlyGross = subbieCount * avgPay
  const monthlyDeductions = monthlyGross * (rate / 100)

  const formatMoney = (n: number) => `£${n.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  const handleCopy = () => {
    const text = mode === "forward"
      ? `CIS Calculation:\nGross: ${formatMoney(gross)}\nMaterials: ${formatMoney(materials)}\nCIS Liable: ${formatMoney(cisLiable)}\nDeduction (${rate}%): ${formatMoney(deduction)}\nNet Payment: ${formatMoney(netPayment)}${includeVat ? `\nVAT: ${formatMoney(vatAmount)}\nTotal inc VAT: ${formatMoney(totalWithVat)}` : ""}`
      : `CIS Reverse Calculation:\nDesired Net: ${formatMoney(desiredNet)}\nRequired Gross: ${formatMoney(reverseGross)}\nDeduction (${rate}%): ${formatMoney(reverseDeduction)}${includeVat ? `\nVAT: ${formatMoney(reverseVat)}` : ""}`
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
            CIS Deduction Calculator
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Calculate CIS deductions instantly. Forward or reverse. Free, no signup required.
          </p>
        </div>
      </section>

      {/* Calculator */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Inputs */}
            <div className="lg:col-span-3 space-y-6">
              {/* Mode toggle */}
              <div className="flex gap-2 bg-white rounded-xl p-1 border border-gray-200">
                <button
                  onClick={() => setMode("forward")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === "forward" ? "bg-[#F97316] text-white" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <Calculator className="w-4 h-4 inline mr-2" />
                  Gross → Net
                </button>
                <button
                  onClick={() => setMode("reverse")}
                  className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${mode === "reverse" ? "bg-[#F97316] text-white" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <RotateCcw className="w-4 h-4 inline mr-2" />
                  Net → Gross
                </button>
              </div>

              {/* Subcontractor status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Subcontractor Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(RATES) as SubStatus[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`p-3 rounded-xl border-2 text-center transition-all ${status === s ? "border-[#F97316] bg-[#F97316]/5" : "border-gray-200 hover:border-gray-300"}`}
                      >
                        <div className={`text-2xl font-bold ${s === "gross" ? "text-green-600" : s === "net" ? "text-amber-600" : "text-red-600"}`}>
                          {RATES[s]}%
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{STATUS_LABELS[s]}</div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Amount inputs */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    {mode === "forward" ? "Payment Details" : "Desired Net Payment"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mode === "forward" ? (
                    <>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Gross Payment (£)</label>
                        <Input
                          type="number"
                          placeholder="e.g. 5000"
                          value={grossInput}
                          onChange={(e) => setGrossInput(e.target.value)}
                          className="text-lg"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-600 mb-1 block">Materials Cost (£) — exempt from CIS</label>
                        <Input
                          type="number"
                          placeholder="e.g. 1000"
                          value={materialsInput}
                          onChange={(e) => setMaterialsInput(e.target.value)}
                        />
                      </div>
                    </>
                  ) : (
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">I want to pay the subcontractor (£)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 4000"
                        value={netDesired}
                        onChange={(e) => setNetDesired(e.target.value)}
                        className="text-lg"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="includeVat"
                      checked={includeVat}
                      onChange={(e) => setIncludeVat(e.target.checked)}
                      className="w-4 h-4 accent-[#F97316]"
                    />
                    <label htmlFor="includeVat" className="text-sm text-gray-600">Include VAT calculation</label>
                    {includeVat && (
                      <select
                        value={vatRate}
                        onChange={(e) => setVatRate(e.target.value)}
                        className="ml-2 text-sm border rounded-lg px-2 py-1"
                      >
                        <option value="20">20% (standard)</option>
                        <option value="5">5% (reduced)</option>
                        <option value="0">0% (zero-rated)</option>
                      </select>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Monthly return estimator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Monthly Return Estimator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Number of subcontractors</label>
                      <Input
                        type="number"
                        placeholder="e.g. 5"
                        value={monthlySubbies}
                        onChange={(e) => setMonthlySubbies(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-600 mb-1 block">Avg payment per subbie (£)</label>
                      <Input
                        type="number"
                        placeholder="e.g. 3000"
                        value={avgPayment}
                        onChange={(e) => setAvgPayment(e.target.value)}
                      />
                    </div>
                  </div>
                  {subbieCount > 0 && avgPay > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly gross payments</span>
                        <span className="font-mono font-bold">{formatMoney(monthlyGross)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly CIS deductions ({rate}%)</span>
                        <span className="font-mono font-bold text-red-600">{formatMoney(monthlyDeductions)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2">
                        <span className="text-gray-600">Annual CIS deductions</span>
                        <span className="font-mono font-bold">{formatMoney(monthlyDeductions * 12)}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-2">
              <div className="sticky top-24 space-y-6">
                <Card className="border-[#F97316]/30 bg-[#F97316]/5">
                  <CardHeader>
                    <CardTitle className="text-base flex items-center justify-between">
                      Results
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCopy} className="text-[#F97316]">
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mode === "forward" ? (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Gross Payment</span>
                          <span className="font-mono font-bold">{formatMoney(gross)}</span>
                        </div>
                        {materials > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Materials (exempt)</span>
                            <span className="font-mono text-gray-500">−{formatMoney(materials)}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">CIS-Liable Amount</span>
                          <span className="font-mono font-bold">{formatMoney(cisLiable)}</span>
                        </div>
                        <div className="flex justify-between text-sm border-t pt-3">
                          <span className="text-gray-600">CIS Deduction ({rate}%)</span>
                          <span className="font-mono font-bold text-red-600">−{formatMoney(deduction)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-3 border-[#F97316]/30">
                          <span className="text-[#1A1A2E]">Net Payment</span>
                          <span className="text-green-600 font-mono">{formatMoney(netPayment)}</span>
                        </div>
                        {includeVat && (
                          <>
                            <div className="flex justify-between text-sm border-t pt-3">
                              <span className="text-gray-600">VAT ({vatRate}%)</span>
                              <span className="font-mono">{formatMoney(vatAmount)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total inc. VAT</span>
                              <span className="font-mono font-bold">{formatMoney(totalWithVat)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Desired Net Payment</span>
                          <span className="font-mono font-bold">{formatMoney(desiredNet)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-bold border-t pt-3">
                          <span className="text-[#1A1A2E]">Required Gross</span>
                          <span className="text-[#F97316] font-mono">{formatMoney(reverseGross)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">CIS Deduction ({rate}%)</span>
                          <span className="font-mono text-red-600">−{formatMoney(reverseDeduction)}</span>
                        </div>
                        {includeVat && (
                          <>
                            <div className="flex justify-between text-sm border-t pt-3">
                              <span className="text-gray-600">VAT ({vatRate}%)</span>
                              <span className="font-mono">{formatMoney(reverseVat)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Total inc. VAT</span>
                              <span className="font-mono font-bold">{formatMoney(reverseGross + reverseVat)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* CTA */}
                <Card className="bg-[#1A1A2E] text-white border-0">
                  <CardContent className="p-6 text-center space-y-3">
                    <h3 className="font-bold text-lg">Automate Your CIS</h3>
                    <p className="text-sm text-gray-300">
                      Stop calculating by hand. BuildFlow does CIS verification, deductions, and returns automatically.
                    </p>
                    <Link href="/register">
                      <Button className="w-full bg-[#F97316] hover:bg-[#EA580C]">
                        Start Free Trial <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <Link href="/cis" className="block text-sm text-[#F97316] hover:underline mt-2">
                      Learn about CIS in BuildFlow →
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
