export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 600 400" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Sky gradient */}
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1A1A2E" />
          <stop offset="100%" stopColor="#16213E" />
        </linearGradient>
        <linearGradient id="building1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#4B5563" />
        </linearGradient>
        <linearGradient id="crane-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#EA580C" />
        </linearGradient>
        <linearGradient id="glass" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#60A5FA" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="600" height="400" fill="url(#sky)" rx="12" />

      {/* Stars */}
      <circle cx="50" cy="30" r="1.5" fill="white" opacity="0.6" />
      <circle cx="150" cy="50" r="1" fill="white" opacity="0.4" />
      <circle cx="250" cy="25" r="1.5" fill="white" opacity="0.5" />
      <circle cx="400" cy="40" r="1" fill="white" opacity="0.3" />
      <circle cx="500" cy="20" r="1.5" fill="white" opacity="0.6" />
      <circle cx="550" cy="60" r="1" fill="white" opacity="0.4" />

      {/* Moon */}
      <circle cx="480" cy="70" r="25" fill="#FDE68A" opacity="0.9" />
      <circle cx="490" cy="65" r="22" fill="#1A1A2E" />

      {/* Ground */}
      <rect x="0" y="320" width="600" height="80" fill="#1F2937" rx="0" />
      <rect x="0" y="320" width="600" height="3" fill="#F97316" opacity="0.3" />

      {/* Building under construction - left */}
      <rect x="60" y="140" width="120" height="180" fill="url(#building1)" />
      {/* Floors */}
      <rect x="60" y="140" width="120" height="4" fill="#6B7280" />
      <rect x="60" y="180" width="120" height="3" fill="#6B7280" />
      <rect x="60" y="220" width="120" height="3" fill="#6B7280" />
      <rect x="60" y="260" width="120" height="3" fill="#6B7280" />
      <rect x="60" y="300" width="120" height="3" fill="#6B7280" />
      {/* Windows */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`w1-${row}-${col}`}
            x={72 + col * 28}
            y={150 + row * 40}
            width="18"
            height="24"
            fill="url(#glass)"
            rx="2"
          />
        ))
      )}
      {/* Scaffolding */}
      <rect x="55" y="130" width="3" height="195" fill="#9CA3AF" />
      <rect x="182" y="130" width="3" height="195" fill="#9CA3AF" />
      <rect x="55" y="130" width="130" height="3" fill="#9CA3AF" />
      <rect x="55" y="190" width="130" height="2" fill="#9CA3AF" />
      <rect x="55" y="250" width="130" height="2" fill="#9CA3AF" />

      {/* Tower Crane */}
      <rect x="295" y="60" width="10" height="260" fill="url(#crane-grad)" />
      {/* Crane base */}
      <rect x="275" y="310" width="50" height="15" fill="#F97316" rx="2" />
      {/* Crane jib (horizontal arm) */}
      <rect x="200" y="58" width="200" height="8" fill="#F97316" rx="2" />
      {/* Counter jib */}
      <rect x="305" y="58" width="80" height="8" fill="#EA580C" rx="2" />
      {/* Counterweight */}
      <rect x="365" y="48" width="20" height="18" fill="#6B7280" rx="2" />
      {/* Crane top */}
      <polygon points="300,40 290,60 310,60" fill="#F97316" />
      {/* Cable */}
      <line x1="230" y1="66" x2="230" y2="200" stroke="#D1D5DB" strokeWidth="1.5" />
      {/* Hook */}
      <path d="M225 200 L235 200 L235 210 Q230 218 225 210 Z" fill="#9CA3AF" />
      {/* Load (steel beam) */}
      <rect x="215" y="215" width="30" height="8" fill="#6B7280" rx="1" />

      {/* Completed building - right */}
      <rect x="420" y="100" width="130" height="220" fill="#374151" />
      <rect x="420" y="100" width="130" height="220" fill="url(#building1)" />
      {/* Windows with lights */}
      {[0, 1, 2, 3, 4].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect
            key={`w2-${row}-${col}`}
            x={430 + col * 30}
            y={112 + row * 40}
            width="20"
            height="28"
            fill={row % 2 === col % 2 ? "#FDE68A" : "url(#glass)"}
            opacity={row % 2 === col % 2 ? 0.8 : 1}
            rx="2"
          />
        ))
      )}
      {/* Building top detail */}
      <rect x="420" y="96" width="130" height="8" fill="#4B5563" />

      {/* Worker 1 - with hard hat */}
      <circle cx="330" cy="290" r="8" fill="#FBBF24" /> {/* Hard hat */}
      <rect x="326" y="286" width="12" height="4" fill="#FBBF24" rx="2" />
      <circle cx="330" cy="296" r="6" fill="#D4A574" /> {/* Head */}
      <rect x="325" y="302" width="10" height="16" fill="#F97316" rx="2" /> {/* Hi-vis vest */}
      <rect x="323" y="318" width="5" height="10" fill="#1F2937" /> {/* Left leg */}
      <rect x="332" y="318" width="5" height="10" fill="#1F2937" /> {/* Right leg */}

      {/* Worker 2 */}
      <circle cx="365" cy="294" r="7" fill="#FBBF24" />
      <rect x="362" y="290" width="10" height="4" fill="#FBBF24" rx="2" />
      <circle cx="365" cy="299" r="5" fill="#8B6C5C" />
      <rect x="361" y="304" width="8" height="14" fill="#F97316" rx="2" />
      <rect x="359" y="318" width="4" height="9" fill="#1F2937" />
      <rect x="367" y="318" width="4" height="9" fill="#1F2937" />

      {/* Cement mixer */}
      <ellipse cx="160" cy="340" rx="18" ry="14" fill="#6B7280" />
      <rect x="142" y="330" width="10" height="4" fill="#9CA3AF" />
      <circle cx="148" cy="348" r="5" fill="#374151" />
      <circle cx="172" cy="348" r="5" fill="#374151" />

      {/* Safety cones */}
      <polygon points="250,328 245,340 255,340" fill="#F97316" />
      <rect x="244" y="336" width="2" height="4" fill="white" />
      <polygon points="270,328 265,340 275,340" fill="#F97316" />
      <rect x="264" y="336" width="2" height="4" fill="white" />

      {/* Bricks pile */}
      <rect x="400" y="334" width="12" height="6" fill="#B45309" rx="1" />
      <rect x="396" y="340" width="12" height="6" fill="#D97706" rx="1" />
      <rect x="404" y="340" width="12" height="6" fill="#B45309" rx="1" />
      <rect x="398" y="346" width="12" height="6" fill="#D97706" rx="1" />
      <rect x="406" y="346" width="12" height="6" fill="#B45309" rx="1" />

      {/* BuildFlow tablet overlay */}
      <g transform="translate(440, 270)">
        <rect width="60" height="45" fill="white" rx="4" stroke="#E5E7EB" strokeWidth="1" />
        <rect x="5" y="5" width="50" height="6" fill="#10B981" rx="2" opacity="0.8" />
        <rect x="5" y="14" width="30" height="3" fill="#E5E7EB" rx="1" />
        <rect x="5" y="20" width="40" height="3" fill="#E5E7EB" rx="1" />
        <rect x="5" y="26" width="22" height="8" fill="#F97316" rx="2" opacity="0.8" />
        <rect x="30" y="26" width="22" height="8" fill="#3B82F6" rx="2" opacity="0.6" />
      </g>
    </svg>
  )
}
