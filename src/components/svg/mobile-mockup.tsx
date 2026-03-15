export function MobileAppMockup({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 560" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Phone frame */}
      <rect width="280" height="560" rx="36" fill="#1A1A2E" />
      <rect x="8" y="8" width="264" height="544" rx="30" fill="white" />

      {/* Status bar */}
      <rect x="8" y="8" width="264" height="44" rx="30" fill="#1A1A2E" />
      <text x="140" y="34" textAnchor="middle" fill="white" fontSize="12" fontWeight="600">09:41</text>
      {/* Notch */}
      <rect x="96" y="8" width="88" height="28" rx="14" fill="#1A1A2E" />

      {/* App header */}
      <rect x="8" y="52" width="264" height="50" fill="#F97316" />
      <text x="24" y="72" fill="white" fontSize="8">← Back</text>
      <text x="140" y="82" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Daily Log</text>

      {/* Content */}
      {/* Date & Job */}
      <g transform="translate(20, 112)">
        <text x="0" y="0" fill="#6B7280" fontSize="10">Job</text>
        <rect x="0" y="6" width="240" height="32" rx="6" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
        <text x="12" y="26" fill="#1A1A2E" fontSize="11">Victoria Road Extension</text>
      </g>

      <g transform="translate(20, 162)">
        <text x="0" y="0" fill="#6B7280" fontSize="10">Date</text>
        <rect x="0" y="6" width="240" height="32" rx="6" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
        <text x="12" y="26" fill="#1A1A2E" fontSize="11">15 March 2026</text>
      </g>

      {/* Weather */}
      <g transform="translate(20, 212)">
        <text x="0" y="0" fill="#6B7280" fontSize="10">Weather</text>
        <g transform="translate(0, 8)">
          {[
            { label: "☀️", text: "Sunny", selected: false },
            { label: "⛅", text: "Cloudy", selected: true },
            { label: "🌧️", text: "Rain", selected: false },
          ].map((w, i) => (
            <g key={w.text}>
              <rect x={i * 82} y="0" width="76" height="30" rx="6"
                fill={w.selected ? "#FFF7ED" : "#F9FAFB"}
                stroke={w.selected ? "#F97316" : "#E5E7EB"} strokeWidth="1" />
              <text x={38 + i * 82} y="20" textAnchor="middle" fill={w.selected ? "#F97316" : "#6B7280"} fontSize="10">
                {w.text}
              </text>
            </g>
          ))}
        </g>
      </g>

      {/* Labour count */}
      <g transform="translate(20, 264)">
        <text x="0" y="0" fill="#6B7280" fontSize="10">Labour on Site</text>
        <rect x="0" y="6" width="240" height="32" rx="6" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
        <text x="12" y="26" fill="#1A1A2E" fontSize="11">8 operatives</text>
      </g>

      {/* Notes */}
      <g transform="translate(20, 314)">
        <text x="0" y="0" fill="#6B7280" fontSize="10">Notes</text>
        <rect x="0" y="6" width="240" height="72" rx="6" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
        <text x="12" y="24" fill="#374151" fontSize="10">First fix electrics completed on</text>
        <text x="12" y="38" fill="#374151" fontSize="10">ground floor. Plumber arriving</text>
        <text x="12" y="52" fill="#374151" fontSize="10">tomorrow for bathroom rough-in.</text>
        <text x="12" y="66" fill="#374151" fontSize="10">Steel delivery confirmed for Wed.</text>
      </g>

      {/* Photo section */}
      <g transform="translate(20, 400)">
        <text x="0" y="0" fill="#6B7280" fontSize="10">Photos</text>
        <g transform="translate(0, 8)">
          <rect x="0" y="0" width="56" height="56" rx="8" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1" />
          <rect x="12" y="16" width="32" height="24" rx="2" fill="#D1D5DB" />
          <circle cx="22" cy="24" r="4" fill="#9CA3AF" />

          <rect x="62" y="0" width="56" height="56" rx="8" fill="#F3F4F6" stroke="#E5E7EB" strokeWidth="1" />
          <rect x="74" y="16" width="32" height="24" rx="2" fill="#D1D5DB" />
          <circle cx="84" cy="24" r="4" fill="#9CA3AF" />

          <rect x="124" y="0" width="56" height="56" rx="8" fill="#FFF7ED" stroke="#F97316" strokeWidth="1" strokeDasharray="4" />
          <text x="152" y="30" textAnchor="middle" fill="#F97316" fontSize="18">+</text>
          <text x="152" y="46" textAnchor="middle" fill="#F97316" fontSize="8">Add</text>
        </g>
      </g>

      {/* Submit button */}
      <g transform="translate(20, 480)">
        <rect x="0" y="0" width="240" height="44" rx="10" fill="#F97316" />
        <text x="120" y="28" textAnchor="middle" fill="white" fontSize="14" fontWeight="600">Submit Daily Log</text>
      </g>

      {/* Bottom nav */}
      <rect x="8" y="528" width="264" height="24" rx="0" fill="#F9FAFB" />
      <rect x="110" y="542" width="60" height="4" rx="2" fill="#1A1A2E" />
    </svg>
  )
}
