"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { HardHat, Loader2, Briefcase, HardHat as HardHatIcon, Wrench } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading("form")

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError("Invalid email or password")
      setLoading("")
    } else {
      router.push("/dashboard")
    }
  }

  const handleDemoLogin = async (demoEmail: string, role: string) => {
    setError("")
    setLoading(role)
    setEmail(demoEmail)
    setPassword("BuildFlow2026!")

    const result = await signIn("credentials", {
      email: demoEmail,
      password: "BuildFlow2026!",
      redirect: false,
    })

    if (result?.error) {
      setError("Demo login failed — please try again")
      setLoading("")
    } else {
      router.push("/dashboard")
    }
  }

  const demoAccounts = [
    {
      role: "site-manager",
      emoji: "👔",
      icon: Briefcase,
      label: "Site Manager",
      email: "admin@buildflow.demo",
      description: "Full admin access — jobs, CIS, financials, team",
      color: "from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800",
      ring: "ring-blue-300",
    },
    {
      role: "project-manager",
      emoji: "🏗️",
      icon: HardHatIcon,
      label: "Project Manager",
      email: "pm@buildflow.demo",
      description: "Projects, scheduling, progress tracking",
      color: "from-[#F97316] to-orange-600 hover:from-orange-600 hover:to-orange-700",
      ring: "ring-orange-300",
    },
    {
      role: "subcontractor",
      emoji: "🔨",
      icon: Wrench,
      label: "Subcontractor",
      email: "sub@buildflow.demo",
      description: "Portal view — timesheets, CIS statements, docs",
      color: "from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800",
      ring: "ring-emerald-300",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F3460] flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Demo Section — Top & Prominent */}
        <Card className="border-2 border-[#F97316]/30 shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#F97316] flex items-center justify-center">
                <HardHat className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-[#1A1A2E]">BuildFlow</span>
            </div>
            <CardTitle className="text-xl">Try the Demo — No Sign-Up Required</CardTitle>
            <CardDescription className="text-base">
              Click any role below to explore BuildFlow instantly
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            {demoAccounts.map((demo) => (
              <button
                key={demo.role}
                onClick={() => handleDemoLogin(demo.email, demo.role)}
                disabled={!!loading}
                className={`w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r ${demo.color} text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 ${demo.ring} disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                <span className="text-3xl">{demo.emoji}</span>
                <div className="text-left flex-1">
                  <div className="font-bold text-lg">{demo.label}</div>
                  <div className="text-sm opacity-90">{demo.description}</div>
                </div>
                {loading === demo.role ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <span className="text-xl">→</span>
                )}
              </button>
            ))}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Standard Login — Below */}
        <Card className="opacity-90">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-base">Already have an account?</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>
                <div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-10"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={!!loading}>
                {loading === "form" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Sign In
              </Button>
              <p className="text-center text-sm text-gray-500">
                No account?{" "}
                <Link href="/register" className="text-[#F97316] hover:underline font-medium">
                  Start Free Trial
                </Link>
              </p>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">← Back to BuildFlow.co.uk</Link>
        </p>
      </div>
    </div>
  )
}
