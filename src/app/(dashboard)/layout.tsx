"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard, Briefcase, Calculator, Users, PoundSterling,
  ShieldCheck, CheckSquare, UserCog, FileText, BarChart3, Settings,
  HardHat, Search, Bell, ChevronLeft, Menu, LogOut,
  AlertTriangle, Clock, Bug, Upload, Activity, BookOpen, Receipt,
  FileSpreadsheet, Newspaper, Package, CheckCircle, MessageSquare
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const menuGroups = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ]
  },
  {
    label: "Projects",
    items: [
      { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
      { href: "/dashboard/estimates", label: "Estimates", icon: Calculator },
    ]
  },
  {
    label: "Commercial",
    items: [
      { href: "/dashboard/finance", label: "Finance", icon: PoundSterling },
      { href: "/dashboard/finance/invoices", label: "Invoices", icon: Receipt },
      { href: "/dashboard/finance/valuations", label: "Valuations", icon: FileSpreadsheet },
      { href: "/dashboard/finance/cis", label: "CIS", icon: Newspaper },
      { href: "/dashboard/variations", label: "Variations", icon: Activity },
      { href: "/dashboard/procurement", label: "Procurement", icon: Package },
    ]
  },
  {
    label: "Subcontractors",
    items: [
      { href: "/dashboard/subcontractors", label: "Directory", icon: Users },
    ]
  },
  {
    label: "Quality & Safety",
    items: [
      { href: "/dashboard/quality", label: "Quality", icon: CheckCircle },
      { href: "/dashboard/safety/rams", label: "RAMS", icon: ShieldCheck },
      { href: "/dashboard/safety/incidents", label: "Incidents", icon: AlertTriangle },
      { href: "/dashboard/safety/inductions", label: "Inductions", icon: BookOpen },
      { href: "/dashboard/snagging", label: "Snagging", icon: CheckSquare },
      { href: "/dashboard/snagging/tracker", label: "Snag Tracker", icon: Bug },
    ]
  },
  {
    label: "Documents & Info",
    items: [
      { href: "/dashboard/documents", label: "Documents", icon: FileText },
      { href: "/dashboard/documents/drawings", label: "Drawings", icon: FileText },
      { href: "/dashboard/rfi", label: "RFI", icon: MessageSquare },
    ]
  },
  {
    label: "Resources",
    items: [
      { href: "/dashboard/team", label: "Team", icon: UserCog },
      { href: "/dashboard/team/timesheets", label: "Timesheets", icon: Clock },
      { href: "/dashboard/plant", label: "Plant & Equipment", icon: HardHat },
    ]
  },
  {
    label: "Reports & Settings",
    items: [
      { href: "/dashboard/reports", label: "Reports", icon: BarChart3 },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ]
  },
]

interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  actionUrl: string | null
  createdAt: string
}

function getNotifIcon(type: string) {
  switch (type) {
    case "invoice_overdue": return <AlertTriangle className="w-4 h-4 text-red-500" />
    case "cert_expiring": return <ShieldCheck className="w-4 h-4 text-amber-500" />
    case "timesheet_submitted": return <Clock className="w-4 h-4 text-purple-500" />
    case "incident_reported": return <AlertTriangle className="w-4 h-4 text-red-500" />
    case "snag_assigned": return <Bug className="w-4 h-4 text-amber-500" />
    case "estimate_declined": return <FileText className="w-4 h-4 text-gray-500" />
    case "document_uploaded": return <Upload className="w-4 h-4 text-green-500" />
    case "job_status": return <Briefcase className="w-4 h-4 text-blue-500" />
    default: return <Activity className="w-4 h-4 text-gray-500" />
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const notifRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      }
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { fetchNotifications() }, [fetchNotifications])

  // Close notif dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}`, { method: "PATCH" })
      fetchNotifications()
    } catch { /* ignore */ }
  }

  const markAllRead = async () => {
    try {
      await fetch("/api/notifications", { method: "POST" })
      fetchNotifications()
    } catch { /* ignore */ }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 bg-[#1A1A2E] flex flex-col transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-16 border-b border-white/10">
          <div className="w-8 h-8 rounded-lg bg-[#F97316] flex items-center justify-center flex-shrink-0">
            <HardHat className="w-5 h-5 text-white" />
          </div>
          {!collapsed && <span className="text-lg font-bold text-white">BuildFlow</span>}
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 overflow-y-auto">
          {menuGroups.map((group, groupIdx) => (
            <div key={groupIdx} className={cn("mb-6", groupIdx === 0 && "mb-4")}>
              {!collapsed && (
                <p className="text-[10px] uppercase tracking-wider text-gray-500 px-3 mb-2 font-semibold">
                  {group.label}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                      <div className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                        isActive
                          ? "bg-[#F97316]/15 text-[#F97316]"
                          : "text-gray-400 hover:text-white hover:bg-white/5"
                      )}>
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && <span>{item.label}</span>}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="p-2 border-t border-white/10 hidden lg:block">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors text-sm"
          >
            <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-6 gap-4">
          <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-[#1A1A2E] hidden sm:block">BuildFlow Demo Ltd</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-48 rounded-full bg-gray-100 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316]"
              />
            </div>

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[480px] overflow-hidden flex flex-col">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                    <h3 className="font-semibold text-sm text-[#1A1A2E]">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-[#F97316] hover:underline">Mark all read</button>
                    )}
                  </div>
                  <div className="overflow-y-auto flex-1">
                    {notifications.length === 0 ? (
                      <div className="text-center py-8 text-gray-400 text-sm">No notifications</div>
                    ) : (
                      notifications.slice(0, 10).map((n) => (
                        <div
                          key={n.id}
                          className={cn(
                            "flex items-start gap-3 px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors",
                            !n.read && "bg-[#F97316]/5"
                          )}
                          onClick={() => { if (!n.read) markAsRead(n.id) }}
                        >
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            {getNotifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={cn("text-sm", !n.read ? "font-semibold text-[#1A1A2E]" : "text-gray-600")}>{n.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                            <p className="text-[10px] text-gray-400 mt-1">
                              {new Date(n.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          {!n.read && <span className="w-2 h-2 bg-[#F97316] rounded-full flex-shrink-0 mt-2" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#F97316]/20 flex items-center justify-center">
                <span className="text-xs font-bold text-[#F97316]">JM</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-sm font-medium text-[#1A1A2E]">James Morrison</div>
                <div className="text-xs text-gray-500">Director</div>
              </div>
            </div>
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="icon" className="text-gray-400">
                <LogOut className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-30">
          {[
            { href: "/dashboard", label: "Home", icon: LayoutDashboard },
            { href: "/dashboard/jobs", label: "Jobs", icon: Briefcase },
            { href: "/dashboard/finance", label: "Finance", icon: PoundSterling },
            { href: "/dashboard/safety", label: "Safety", icon: ShieldCheck },
            { href: "/dashboard/settings", label: "More", icon: Settings },
          ].map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div className={cn(
                  "flex flex-col items-center py-2 text-xs",
                  isActive ? "text-[#F97316]" : "text-gray-400"
                )}>
                  <item.icon className="w-5 h-5" />
                  <span className="mt-0.5">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
