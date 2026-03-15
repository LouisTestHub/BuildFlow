"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { HardHat, Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react"

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
            <Link href="/contact" className="text-sm text-[#F97316] font-medium">Contact</Link>
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

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: ""
  })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would send to an API endpoint
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="secondary" className="mb-4">Contact Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A1A2E] mb-6">
            Let's Talk About Your Business
          </h1>
          <p className="text-lg text-gray-600">
            Whether you need a demo, have questions about pricing, or want to discuss a custom solution — we're here to help.
          </p>
        </div>
      </section>

      {/* Contact Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">Get in Touch</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                We're a small, focused team based in the UK. You won't get a chatbot or a ticketing system — just real people who understand construction software.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] mb-1">Email</h3>
                    <p className="text-gray-600 text-sm mb-2">General enquiries</p>
                    <a href="mailto:hello@buildflow.co.uk" className="text-[#F97316] hover:underline">hello@buildflow.co.uk</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] mb-1">Phone</h3>
                    <p className="text-gray-600 text-sm mb-2">Monday – Friday, 9am – 6pm GMT</p>
                    <a href="tel:+442038074500" className="text-[#F97316] hover:underline">+44 20 3807 4500</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] mb-1">Office</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      BuildFlow Ltd<br />
                      1 Poultry<br />
                      London EC2R 8EJ<br />
                      United Kingdom
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F97316]/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#F97316]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A2E] mb-1">Support Hours</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Monday – Friday: 9:00 AM – 6:00 PM GMT<br />
                      Saturday – Sunday: Closed<br />
                      <span className="text-xs text-gray-500">(Enterprise customers get 24/7 priority support)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <h3 className="font-semibold text-[#1A1A2E] mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-[#F97316]" />
                  Looking for something specific?
                </h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <span className="text-gray-600">Sales enquiries:</span>{" "}
                    <a href="mailto:sales@buildflow.co.uk" className="text-[#F97316] hover:underline">sales@buildflow.co.uk</a>
                  </li>
                  <li>
                    <span className="text-gray-600">Technical support:</span>{" "}
                    <a href="mailto:support@buildflow.co.uk" className="text-[#F97316] hover:underline">support@buildflow.co.uk</a>
                  </li>
                  <li>
                    <span className="text-gray-600">Partnerships:</span>{" "}
                    <a href="mailto:partners@buildflow.co.uk" className="text-[#F97316] hover:underline">partners@buildflow.co.uk</a>
                  </li>
                  <li>
                    <span className="text-gray-600">Media & press:</span>{" "}
                    <a href="mailto:press@buildflow.co.uk" className="text-[#F97316] hover:underline">press@buildflow.co.uk</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-[#1A1A2E] mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="John Smith"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="john@company.co.uk"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                    Company Name
                  </label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({...formData, company: e.target.value})}
                    placeholder="Your Company Ltd"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="07700 900123"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Tell us what you need help with..."
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent resize-none"
                  />
                </div>

                <Button type="submit" className="w-full" size="lg">
                  {submitted ? "Message Sent!" : "Send Message"}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  We typically respond within 2 business hours during office hours.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map or Image */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-xl overflow-hidden shadow-2xl h-96">
            <img 
              src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1600" 
              alt="London cityscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
              <div className="p-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Based in London, Serving the UK</h3>
                <p className="text-gray-200">Our team works with construction businesses across England, Scotland, Wales, and Northern Ireland.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1A1A2E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prefer to Try It First?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Start your 14-day free trial — no credit card required, no commitment.
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
