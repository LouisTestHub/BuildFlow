export function IntegrationDiagram({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Left side - Frankenstack chaos */}
      <g transform="translate(0, 0)">
        <text x="160" y="25" textAnchor="middle" fill="#EF4444" fontSize="16" fontWeight="bold">The Frankenstack</text>

        {/* Scattered tools */}
        <rect x="20" y="50" width="90" height="40" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" rx="6" />
        <text x="65" y="75" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="500">Spreadsheets</text>

        <rect x="130" y="40" width="80" height="40" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" rx="6" />
        <text x="170" y="65" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="500">WhatsApp</text>

        <rect x="230" y="55" width="80" height="40" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" rx="6" />
        <text x="270" y="80" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="500">Paper Files</text>

        <rect x="40" y="110" width="85" height="40" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" rx="6" />
        <text x="82" y="135" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="500">Email</text>

        <rect x="150" y="105" width="90" height="40" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" rx="6" />
        <text x="195" y="130" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="500">Accounting</text>

        <rect x="260" y="115" width="70" height="40" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" rx="6" />
        <text x="295" y="140" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="500">Diaries</text>

        <rect x="60" y="170" width="100" height="40" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" rx="6" />
        <text x="110" y="195" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="500">Photo Albums</text>

        <rect x="180" y="175" width="90" height="40" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1.5" rx="6" />
        <text x="225" y="200" textAnchor="middle" fill="#EF4444" fontSize="11" fontWeight="500">CIS Returns</text>

        {/* Messy connecting lines */}
        <line x1="110" y1="70" x2="130" y2="60" stroke="#EF4444" strokeWidth="1" opacity="0.4" strokeDasharray="4" />
        <line x1="170" y1="80" x2="195" y2="105" stroke="#EF4444" strokeWidth="1" opacity="0.4" strokeDasharray="4" />
        <line x1="82" y1="110" x2="150" y2="125" stroke="#EF4444" strokeWidth="1" opacity="0.4" strokeDasharray="4" />
        <line x1="125" y1="130" x2="150" y2="125" stroke="#EF4444" strokeWidth="1" opacity="0.4" strokeDasharray="4" />
        <line x1="65" y1="90" x2="82" y2="110" stroke="#EF4444" strokeWidth="1" opacity="0.4" strokeDasharray="4" />
        <line x1="270" y1="95" x2="295" y2="115" stroke="#EF4444" strokeWidth="1" opacity="0.4" strokeDasharray="4" />
        <line x1="110" y1="170" x2="195" y2="150" stroke="#EF4444" strokeWidth="1" opacity="0.4" strokeDasharray="4" />

        {/* X mark */}
        <circle cx="160" cy="250" r="22" fill="#FEE2E2" />
        <line x1="148" y1="238" x2="172" y2="262" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        <line x1="172" y1="238" x2="148" y2="262" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" />
        <text x="160" y="285" textAnchor="middle" fill="#6B7280" fontSize="12">Chaos. Errors. Lost data.</text>
      </g>

      {/* Arrow */}
      <g transform="translate(360, 120)">
        <line x1="0" y1="30" x2="60" y2="30" stroke="#F97316" strokeWidth="3" />
        <polygon points="60,20 80,30 60,40" fill="#F97316" />
      </g>

      {/* Right side - BuildFlow unified */}
      <g transform="translate(450, 0)">
        <text x="170" y="25" textAnchor="middle" fill="#10B981" fontSize="16" fontWeight="bold">BuildFlow — One Platform</text>

        {/* Central hub */}
        <circle cx="170" cy="150" r="55" fill="#1A1A2E" />
        <circle cx="170" cy="150" r="50" fill="#16213E" />
        <text x="170" y="145" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">Build</text>
        <text x="170" y="162" textAnchor="middle" fill="#F97316" fontSize="14" fontWeight="bold">Flow</text>

        {/* Connected modules */}
        {[
          { x: 170, y: 55, label: "Jobs" },
          { x: 270, y: 90, label: "Estimates" },
          { x: 290, y: 170, label: "Finance" },
          { x: 260, y: 230, label: "Safety" },
          { x: 170, y: 255, label: "Snagging" },
          { x: 80, y: 230, label: "Team" },
          { x: 50, y: 170, label: "CIS" },
          { x: 70, y: 90, label: "Docs" },
        ].map((item, i) => (
          <g key={i}>
            <line x1="170" y1="150" x2={item.x} y2={item.y} stroke="#10B981" strokeWidth="2" opacity="0.5" />
            <circle cx={item.x} cy={item.y} r="24" fill="#D1FAE5" stroke="#10B981" strokeWidth="1.5" />
            <text x={item.x} y={item.y + 4} textAnchor="middle" fill="#065F46" fontSize="10" fontWeight="500">
              {item.label}
            </text>
          </g>
        ))}

        {/* Checkmark */}
        <circle cx="170" cy="250" r="0" fill="none" />
        <text x="170" y="295" textAnchor="middle" fill="#6B7280" fontSize="12">Connected. Accurate. Real-time.</text>
      </g>
    </svg>
  )
}
