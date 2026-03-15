export function JobTrackingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="16" fill="#FFF7ED" />
      <rect x="14" y="16" width="36" height="32" rx="4" fill="white" stroke="#F97316" strokeWidth="2" />
      <rect x="20" y="22" width="24" height="3" rx="1.5" fill="#F97316" opacity="0.3" />
      <rect x="20" y="28" width="18" height="3" rx="1.5" fill="#F97316" opacity="0.2" />
      <rect x="20" y="34" width="24" height="3" rx="1.5" fill="#10B981" opacity="0.5" />
      <circle cx="42" cy="40" r="6" fill="#10B981" />
      <polyline points="39,40 41,42 45,38" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function EstimatingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="16" fill="#F0FDF4" />
      <rect x="16" y="14" width="22" height="36" rx="3" fill="white" stroke="#10B981" strokeWidth="2" />
      {/* Calculator keys */}
      <rect x="20" y="18" width="14" height="6" rx="1" fill="#10B981" opacity="0.3" />
      {[0, 1, 2].map(row =>
        [0, 1, 2].map(col => (
          <rect key={`k-${row}-${col}`} x={20 + col * 5} y={28 + row * 6} width="4" height="4" rx="0.5" fill="#10B981" opacity={0.2 + row * 0.1} />
        ))
      )}
      {/* Pound sign */}
      <text x="46" y="38" textAnchor="middle" fill="#10B981" fontSize="20" fontWeight="bold">£</text>
    </svg>
  )
}

export function CISIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="16" fill="#EFF6FF" />
      <rect x="12" y="18" width="40" height="28" rx="4" fill="white" stroke="#3B82F6" strokeWidth="2" />
      <rect x="12" y="18" width="40" height="10" rx="4" fill="#3B82F6" opacity="0.15" />
      <text x="32" y="26" textAnchor="middle" fill="#3B82F6" fontSize="8" fontWeight="bold">HMRC</text>
      <rect x="18" y="34" width="12" height="2" rx="1" fill="#3B82F6" opacity="0.3" />
      <rect x="18" y="38" width="16" height="2" rx="1" fill="#3B82F6" opacity="0.2" />
      <circle cx="42" cy="38" r="5" fill="#10B981" opacity="0.2" />
      <polyline points="39,38 41,40 45,36" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function SafetyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="16" fill="#FEF3C7" />
      {/* Hard hat */}
      <path d="M22 34 Q22 20 32 18 Q42 20 42 34 Z" fill="#FBBF24" stroke="#F59E0B" strokeWidth="1.5" />
      <rect x="18" y="32" width="28" height="5" rx="2.5" fill="#F59E0B" />
      {/* Shield below */}
      <path d="M26 42 L32 40 L38 42 L38 50 Q32 54 26 50 Z" fill="#10B981" opacity="0.3" stroke="#10B981" strokeWidth="1" />
      <polyline points="30,46 32,48 36,44" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function SubcontractorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="16" fill="#F5F3FF" />
      {/* People network */}
      <circle cx="32" cy="22" r="6" fill="#8B5CF6" opacity="0.3" />
      <circle cx="32" cy="22" r="4" fill="white" stroke="#8B5CF6" strokeWidth="1.5" />
      <circle cx="18" cy="38" r="4" fill="white" stroke="#8B5CF6" strokeWidth="1.5" />
      <circle cx="46" cy="38" r="4" fill="white" stroke="#8B5CF6" strokeWidth="1.5" />
      <circle cx="24" cy="50" r="4" fill="white" stroke="#8B5CF6" strokeWidth="1.5" />
      <circle cx="40" cy="50" r="4" fill="white" stroke="#8B5CF6" strokeWidth="1.5" />
      {/* Connections */}
      <line x1="32" y1="28" x2="18" y2="34" stroke="#8B5CF6" strokeWidth="1" opacity="0.4" />
      <line x1="32" y1="28" x2="46" y2="34" stroke="#8B5CF6" strokeWidth="1" opacity="0.4" />
      <line x1="18" y1="42" x2="24" y2="46" stroke="#8B5CF6" strokeWidth="1" opacity="0.4" />
      <line x1="46" y1="42" x2="40" y2="46" stroke="#8B5CF6" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

export function ReportingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="64" height="64" rx="16" fill="#FDF2F8" />
      {/* Chart bars */}
      <rect x="16" y="38" width="8" height="14" rx="2" fill="#EC4899" opacity="0.3" />
      <rect x="28" y="28" width="8" height="24" rx="2" fill="#EC4899" opacity="0.5" />
      <rect x="40" y="20" width="8" height="32" rx="2" fill="#EC4899" opacity="0.7" />
      {/* Trend line */}
      <polyline points="20,36 32,26 44,18" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="20" cy="36" r="2.5" fill="#EC4899" />
      <circle cx="32" cy="26" r="2.5" fill="#EC4899" />
      <circle cx="44" cy="18" r="2.5" fill="#EC4899" />
    </svg>
  )
}
