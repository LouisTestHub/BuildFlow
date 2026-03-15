"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HardHat, Check, X, ChevronDown } from "lucide-react"

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
            <Link href="/pricing" className="text-sm text-[#F97316] font-medium">Pricing</Link>
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

export default function PricingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const plans = [
    {
      name: "Starter",
      price: "49",
      desc: "Perfect for sole traders and small teams getting started",
      features: [
        "Up to 5 active jobs",
        "3 team members",
        "Daily logs & photo uploads",
        "Basic estimating tools",
        "Document storage (5GB)",
        "Email support",
        "Mobile app access"
      ],
      limits: {
        jobs: "5 active",
        users: "3",
        storage: "5GB",
        estimates: "Basic",
        cis: false,
        subPortal: false,
        safety: false,
        reports: "Basic",
        support: "Email"
      },
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Pro",
      price: "149",
      desc: "For growing businesses ready to scale operations",
      features: [
        "Up to 20 active jobs",
        "10 team members",
        "Everything in Starter, plus:",
        "Full estimating suite with templates",
        "CIS management & monthly returns",
        "Subcontractor portal",
        "Financial reporting & P&L",
        "Valuation management",
        "Document storage (50GB)",
        "Priority email support"
      ],
      limits: {
        jobs: "20 active",
        users: "10",
        storage: "50GB",
        estimates: "Advanced",
        cis: true,
        subPortal: true,
        safety: false,
        reports: "Standard",
        support: "Priority Email"
      },
      cta: "Start Free Trial",
      popular: true
    },
    {
      name: "Business",
      price: "299",
      desc: "For established contractors with complex needs",
      features: [
        "Unlimited active jobs",
        "25 team members",
        "Everything in Pro, plus:",
        "Health & Safety module (RAMS, incidents)",
        "Snagging & defects tracking",
        "Cash flow forecasting",
        "Advanced financial reporting",
        "API access for integrations",
        "Document storage (200GB)",
        "Phone & email support"
      ],
      limits: {
        jobs: "Unlimited",
        users: "25",
        storage: "200GB",
        estimates: "Advanced",
        cis: true,
        subPortal: true,
        safety: true,
        reports: "Advanced",
        support: "Phone & Email"
      },
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Enterprise",
      price: "499",
      desc: "For large operations requiring custom solutions",
      features: [
        "Unlimited everything",
        "Unlimited team members",
        "Everything in Business, plus:",
        "Custom integrations (Xero, Sage, etc.)",
        "Dedicated account manager",
        "On-site training & onboarding",
        "Custom reporting & dashboards",
        "Unlimited storage",
        "SLA guarantee (99.9% uptime)",
        "24/7 priority support"
      ],
      limits: {
        jobs: "Unlimited",
        users: "Unlimited",
        storage: "Unlimited",
        estimates: "Enterprise",
        cis: true,
        subPortal: true,
        safety: true,
        reports: "Custom",
        support: "24/7 Priority"
      },
      cta: "Contact Sales",
      popular: false
    }
  ]

  const comparisonFeatures = [
    { category: "Core Features", items: [
      { name: "Active jobs", starter: "5", pro: "20", business: "Unlimited", enterprise: "Unlimited" },
      { name: "Team members", starter: "3", pro: "10", business: "25", enterprise: "Unlimited" },
      { name: "Document storage", starter: "5GB", pro: "50GB", business: "200GB", enterprise: "Unlimited" },
      { name: "Daily logs & photos", starter: true, pro: true, business: true, enterprise: true },
      { name: "Mobile app", starter: true, pro: true, business: true, enterprise: true },
    ]},
    { category: "Estimating & Finance", items: [
      { name: "Basic estimating", starter: true, pro: true, business: true, enterprise: true },
      { name: "Advanced estimating templates", starter: false, pro: true, business: true, enterprise: true },
      { name: "CIS management", starter: false, pro: true, business: true, enterprise: true },
      { name: "Monthly CIS returns", starter: false, pro: true, business: true, enterprise: true },
      { name: "Financial reporting & P&L", starter: false, pro: true, business: true, enterprise: true },
      { name: "Cash flow forecasting", starter: false, pro: false, business: true, enterprise: true },
      { name: "Custom financial dashboards", starter: false, pro: false, business: false, enterprise: true },
    ]},
    { category: "Subcontractors & Team", items: [
      { name: "Subcontractor portal", starter: false, pro: true, business: true, enterprise: true },
      { name: "Timesheet management", starter: false, pro: true, business: true, enterprise: true },
      { name: "Team utilisation reports", starter: false, pro: false, business: true, enterprise: true },
    ]},
    { category: "Health & Safety", items: [
      { name: "RAMS templates", starter: false, pro: false, business: true, enterprise: true },
      { name: "Incident reporting", starter: false, pro: false, business: true, enterprise: true },
      { name: "Site induction tracking", starter: false, pro: false, business: true, enterprise: true },
    ]},
    { category: "Advanced Features", items: [
      { name: "Snagging & defects", starter: false, pro: false, business: true, enterprise: true },
      { name: "API access", starter: false, pro: false, business: true, enterprise: true },
      { name: "Custom integrations", starter: false, pro: false, business: false, enterprise: true },
      { name: "On-site training", starter: false, pro: false, business: false, enterprise: true },
      { name: "Dedicated account manager", starter: false, pro: false, business: false, enterprise: true },
    ]},
    { category: "Support", items: [
      { name: "Email support", starter: true, pro: true, business: true, enterprise: true },
      { name: "Priority support", starter: false, pro: true, business: true, enterprise: true },
      { name: "Phone support", starter: false, pro: false, business: true, enterprise: true },
      { name: "24/7 support", starter: false, pro: false, business: false, enterprise: true },
      { name: "SLA guarantee", starter: false, pro: false, business: false, enterprise: true },
    ]},
  ]

  const faqs = [
    {
      q: "Is there really a free trial?",
      a: "Yes — 14 days completely free on any plan. No credit card required. Full access to all features in your chosen plan. Cancel anytime during the trial and pay nothing."
    },
    {
      q: "Can I change plans later?",
      a: "Absolutely. Upgrade or downgrade at any time. Changes take effect immediately (upgrades) or at the end of your current billing cycle (downgrades). We'll pro-rate the difference."
    },
    {
      q: "What happens if I go over my job or user limit?",
      a: "We'll send you a friendly reminder that you're approaching your limit. You can archive completed jobs (they're still accessible, just not 'active'), remove users, or upgrade to the next tier."
    },
    {
      q: "Do you offer annual billing?",
      a: "Yes — pay annually and save 15% on any plan. Just toggle 'Annual' on the pricing page or contact us to switch."
    },
    {
      q: "What payment methods do you accept?",
      a: "We accept all major credit/debit cards (Visa, Mastercard, Amex) via Stripe. For Enterprise customers, we can arrange direct bank transfer or invoicing."
    },
    {
      q: "Is my data secure?",
      a: "Your data is encrypted at rest (AES-256) and in transit (TLS 1.3). We use enterprise-grade AWS infrastructure with daily backups. We're fully GDPR compliant and hold Cyber Essentials certification."
    },
    {
      q: "Can I export my data?",
      a: "Yes. You own your data. Export everything as CSV or JSON at any time. If you cancel, we'll keep your data accessible for 30 days before permanent deletion."
    },
    {
      q: "Do you offer discounts for charities or training providers?",
      a: "Yes — we offer 25% off for registered charities and educational institutions. Contact us with your charity/institution details for a custom code."
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-6">
            Simple, Transparent Pricing
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            All plans include a 14-day free trial. No credit card required.
          </p>
          <p className="text-sm text-gray-500">
            Already using spreadsheets? We'll migrate your data for free on Pro plans and above.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div key={plan.name} className={`relative rounded-xl border-2 p-6 flex flex-col ${plan.popular ? "border-[#F97316] shadow-xl scale-105" : "border-gray-200"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge variant="warning">Most Popular</Badge>
                  </div>
                )}
                <h3 className="text-xl font-bold text-[#1A1A2E]">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-2 mb-4">{plan.desc}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#1A1A2E]">£{plan.price}</span>
                  <span className="text-gray-500 text-sm">/month</span>
                </div>
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <Check className="w-4 h-4 text-[#10B981] mt-0.5 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={plan.name === "Enterprise" ? "/contact" : "/register"}>
                  <Button variant={plan.popular ? "default" : "outline"} className="w-full">
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#1A1A2E] mb-4">Full Feature Comparison</h2>
            <p className="text-gray-600">See exactly what's included in each plan</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Feature</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Starter</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                      <div className="inline-flex flex-col items-center">
                        Pro
                        <Badge variant="warning" className="mt-1 text-xs">Popular</Badge>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Business</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {comparisonFeatures.map((category) => (
                    <>
                      <tr key={category.category} className="bg-gray-100">
                        <td colSpan={5} className="px-6 py-3 text-sm font-bold text-[#1A1A2E]">
                          {category.category}
                        </td>
                      </tr>
                      {category.items.map((item) => (
                        <tr key={item.name} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-700">{item.name}</td>
                          <td className="px-6 py-4 text-center">
                            {typeof item.starter === 'boolean' ? (
                              item.starter ? <Check className="w-5 h-5 text-[#10B981] mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                            ) : (
                              <span className="text-sm text-gray-700">{item.starter}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {typeof item.pro === 'boolean' ? (
                              item.pro ? <Check className="w-5 h-5 text-[#10B981] mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                            ) : (
                              <span className="text-sm text-gray-700">{item.pro}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {typeof item.business === 'boolean' ? (
                              item.business ? <Check className="w-5 h-5 text-[#10B981] mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                            ) : (
                              <span className="text-sm text-gray-700">{item.business}</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {typeof item.enterprise === 'boolean' ? (
                              item.enterprise ? <Check className="w-5 h-5 text-[#10B981] mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                            ) : (
                              <span className="text-sm text-gray-700">{item.enterprise}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="text-3xl font-bold text-[#1A1A2E]">Pricing Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-medium text-[#1A1A2E] pr-4">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-gray-600 text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1A1A2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
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
