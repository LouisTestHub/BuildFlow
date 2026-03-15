export function DashboardMockup({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 500" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Browser chrome */}
      <rect width="800" height="500" rx="12" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="2" />
      <rect width="800" height="36" rx="12" fill="#F3F4F6" />
      <rect x="0" y="24" width="800" height="12" fill="#F3F4F6" />
      {/* Traffic lights */}
      <circle cx="20" cy="18" r="5" fill="#EF4444" />
      <circle cx="36" cy="18" r="5" fill="#FBBF24" />
      <circle cx="52" cy="18" r="5" fill="#10B981" />
      {/* URL bar */}
      <rect x="200" y="8" width="400" height="20" rx="10" fill="white" stroke="#E5E7EB" strokeWidth="1" />
      <text x="400" y="22" textAnchor="middle" fill="#9CA3AF" fontSize="9">app.buildflow.co.uk/dashboard</text>

      {/* Sidebar */}
      <rect x="0" y="36" width="180" height="464" fill="#1A1A2E" />
      {/* Logo */}
      <rect x="16" y="48" width="28" height="28" rx="6" fill="#F97316" />
      <text x="22" y="67" fill="white" fontSize="14" fontWeight="bold">B</text>
      <text x="52" y="68" fill="white" fontSize="14" fontWeight="600">BuildFlow</text>

      {/* Nav items */}
      {["Dashboard", "Jobs", "Estimates", "Subcontractors", "Finance", "Safety", "Snagging", "Team", "Documents"].map((item, i) => (
        <g key={item}>
          <rect x="8" y={92 + i * 36} width="164" height="30" rx="6" fill={i === 0 ? "#F97316" : "transparent"} opacity={i === 0 ? 0.15 : 1} />
          <circle cx="24" cy={107 + i * 36} r="4" fill={i === 0 ? "#F97316" : "#6B7280"} opacity="0.6" />
          <text x="38" y={111 + i * 36} fill={i === 0 ? "#F97316" : "#9CA3AF"} fontSize="11" fontWeight={i === 0 ? "600" : "400"}>{item}</text>
        </g>
      ))}

      {/* Main content */}
      {/* Header */}
      <rect x="180" y="36" width="620" height="52" fill="white" />
      <line x1="180" y1="88" x2="800" y2="88" stroke="#E5E7EB" strokeWidth="1" />
      <text x="200" y="68" fill="#1A1A2E" fontSize="16" fontWeight="bold">Dashboard</text>
      <text x="200" y="82" fill="#9CA3AF" fontSize="10">Welcome back, James</text>

      {/* Search bar */}
      <rect x="500" y="50" width="160" height="28" rx="14" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
      <text x="520" y="68" fill="#D1D5DB" fontSize="10">Search...</text>

      {/* Notification bell */}
      <circle cx="690" cy="64" r="12" fill="#F9FAFB" />
      <circle cx="695" cy="58" r="4" fill="#EF4444" />
      {/* Avatar */}
      <circle cx="730" cy="64" r="14" fill="#F97316" opacity="0.2" />
      <text x="730" y="68" textAnchor="middle" fill="#F97316" fontSize="10" fontWeight="bold">JM</text>

      {/* KPI Cards */}
      {[
        { title: "Active Jobs", value: "7", change: "+2 this month", color: "#F97316" },
        { title: "Revenue MTD", value: "£284k", change: "+12% vs last month", color: "#10B981" },
        { title: "Outstanding", value: "£47.2k", change: "3 invoices overdue", color: "#EF4444" },
        { title: "Team On-Site", value: "14", change: "Across 4 sites", color: "#3B82F6" },
      ].map((kpi, i) => (
        <g key={kpi.title} transform={`translate(${196 + i * 148}, 100)`}>
          <rect width="136" height="80" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
          <text x="12" y="24" fill="#6B7280" fontSize="9">{kpi.title}</text>
          <text x="12" y="48" fill="#1A1A2E" fontSize="22" fontWeight="bold">{kpi.value}</text>
          <text x="12" y="64" fill={kpi.color} fontSize="8">{kpi.change}</text>
          <rect x="100" y="10" width="24" height="24" rx="6" fill={kpi.color} opacity="0.1" />
        </g>
      ))}

      {/* Chart area */}
      <g transform="translate(196, 196)">
        <rect width="350" height="180" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
        <text x="16" y="24" fill="#1A1A2E" fontSize="11" fontWeight="600">Revenue vs Costs</text>
        {/* Chart grid */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1="40" y1={50 + i * 30} x2="330" y2={50 + i * 30} stroke="#F3F4F6" strokeWidth="1" />
        ))}
        {/* Revenue bars */}
        {[65, 80, 55, 90, 75, 95, 70, 85].map((h, i) => (
          <g key={`bar-${i}`}>
            <rect x={50 + i * 35} y={140 - h} width="12" height={h} rx="2" fill="#F97316" opacity="0.7" />
            <rect x={64 + i * 35} y={140 - h * 0.7} width="12" height={h * 0.7} rx="2" fill="#3B82F6" opacity="0.5" />
          </g>
        ))}
        {/* X labels */}
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((m, i) => (
          <text key={m} x={60 + i * 35} y={160} textAnchor="middle" fill="#9CA3AF" fontSize="8">{m}</text>
        ))}
      </g>

      {/* Active Jobs list */}
      <g transform="translate(560, 196)">
        <rect width="224" height="180" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
        <text x="16" y="24" fill="#1A1A2E" fontSize="11" fontWeight="600">Active Jobs</text>
        {[
          { name: "Victoria Rd Extension", status: "LIVE", color: "#10B981" },
          { name: "Canary Wharf Fit-Out", status: "LIVE", color: "#10B981" },
          { name: "Chelmsford School", status: "WON", color: "#3B82F6" },
          { name: "Warehouse Conv.", status: "TENDER", color: "#F97316" },
          { name: "Romford New Build", status: "LIVE", color: "#10B981" },
        ].map((job, i) => (
          <g key={job.name} transform={`translate(12, ${36 + i * 28})`}>
            <circle cx="6" cy="8" r="4" fill={job.color} opacity="0.2" />
            <circle cx="6" cy="8" r="2" fill={job.color} />
            <text x="16" y="12" fill="#374151" fontSize="9">{job.name}</text>
            <rect x="150" y="2" width="40" height="14" rx="7" fill={job.color} opacity="0.1" />
            <text x="170" y="12" textAnchor="middle" fill={job.color} fontSize="7" fontWeight="500">{job.status}</text>
          </g>
        ))}
      </g>

      {/* Bottom cards */}
      {/* Recent activity */}
      <g transform="translate(196, 392)">
        <rect width="350" height="95" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
        <text x="16" y="22" fill="#1A1A2E" fontSize="11" fontWeight="600">Recent Activity</text>
        {[
          "Daily log submitted — Victoria Rd (Dave W.)",
          "Invoice #INV-042 paid — £12,400",
          "RAMS approved — Chelmsford School",
        ].map((item, i) => (
          <g key={i}>
            <circle cx="22" cy={42 + i * 20} r="3" fill="#F97316" opacity="0.3" />
            <text x="32" y={46 + i * 20} fill="#6B7280" fontSize="9">{item}</text>
          </g>
        ))}
      </g>

      {/* CIS summary */}
      <g transform="translate(560, 392)">
        <rect width="224" height="95" rx="8" fill="white" stroke="#E5E7EB" strokeWidth="1" />
        <text x="16" y="22" fill="#1A1A2E" fontSize="11" fontWeight="600">CIS This Month</text>
        <text x="16" y="50" fill="#1A1A2E" fontSize="18" fontWeight="bold">£8,420</text>
        <text x="16" y="66" fill="#6B7280" fontSize="9">Deductions to report</text>
        <rect x="16" y="74" width="80" height="6" rx="3" fill="#E5E7EB" />
        <rect x="16" y="74" width="55" height="6" rx="3" fill="#10B981" />
      </g>
    </svg>
  )
}
