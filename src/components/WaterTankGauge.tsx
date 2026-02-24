type Status = 'safe' | 'warning' | 'danger'

interface WaterTankGaugeProps {
  level: number
  maxLevel: number
  status: Status
}

const STATUS_COLORS: Record<Status, { fill: string; fillLight: string; stroke: string; text: string }> = {
  safe:    { fill: '#3b82f6', fillLight: '#dbeafe', stroke: '#2563eb', text: '#1d4ed8' },
  warning: { fill: '#f59e0b', fillLight: '#fef3c7', stroke: '#d97706', text: '#92400e' },
  danger:  { fill: '#ef4444', fillLight: '#fee2e2', stroke: '#dc2626', text: '#991b1b' },
}

export default function WaterTankGauge({ level, maxLevel, status }: WaterTankGaugeProps) {
  const c = STATUS_COLORS[status]
  const pct = Math.min(100, Math.max(0, (level / maxLevel) * 100))
  const tankH = 200
  const tankY = 40
  const fillH = (tankH * pct) / 100
  const fillY = tankY + tankH - fillH
  const waveY = fillY

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="140" height="280" viewBox="0 0 140 280" aria-label={`Water tank at ${pct.toFixed(0)}%`}>
        {/* Tank body background */}
        <rect x="20" y={tankY} width="100" height={tankH} rx="8" ry="8"
          fill={c.fillLight} stroke="#d1d5db" strokeWidth="2" />

        {/* Clip path for water fill */}
        <defs>
          <clipPath id="tankClip">
            <rect x="21" y={tankY + 1} width="98" height={tankH - 2} rx="7" ry="7" />
          </clipPath>
          <style>{`
            @keyframes wave {
              0%   { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .water-wave { animation: wave 2s linear infinite; }
          `}</style>
        </defs>

        {/* Water fill rect */}
        <rect x="21" y={fillY} width="98" height={fillH}
          fill={c.fill} fillOpacity="0.75" clipPath="url(#tankClip)" />

        {/* Wave path (animated) */}
        {pct > 2 && (
          <g clipPath="url(#tankClip)">
            <g className="water-wave">
              <path
                d={`M-100,${waveY} q12.5,-8 25,0 q12.5,8 25,0 q12.5,-8 25,0 q12.5,8 25,0 q12.5,-8 25,0 q12.5,8 25,0 q12.5,-8 25,0 q12.5,8 25,0 q12.5,-8 25,0 q12.5,8 25,0 V${tankY + tankH} H-100 Z`}
                fill={c.fill} fillOpacity="0.9"
              />
            </g>
          </g>
        )}

        {/* Scale tick marks */}
        {[0, 25, 50, 75, 100].map(p => {
          const y = tankY + tankH - (tankH * p) / 100
          return (
            <g key={p}>
              <line x1="20" y1={y} x2="30" y2={y} stroke="#9ca3af" strokeWidth="1.5" />
              <text x="16" y={y + 4} textAnchor="end" fontSize="9" fill="#6b7280">{p}%</text>
            </g>
          )
        })}

        {/* Tank cap */}
        <rect x="40" y="28" width="60" height="16" rx="5" fill="#9ca3af" />
        <rect x="55" y="20" width="30" height="12" rx="3" fill="#6b7280" />

        {/* Tank stand */}
        <rect x="45" y={tankY + tankH} width="12" height="20" rx="3" fill="#9ca3af" />
        <rect x="83" y={tankY + tankH} width="12" height="20" rx="3" fill="#9ca3af" />
        <rect x="35" y={tankY + tankH + 16} width="70" height="8" rx="3" fill="#6b7280" />

        {/* Level reading text inside tank */}
        {pct > 15 && (
          <text x="70" y={fillY + fillH / 2 + 5} textAnchor="middle"
            fontSize="13" fontWeight="bold" fill="white">
            {level.toFixed(2)} m
          </text>
        )}
      </svg>

      {/* Percentage label below */}
      <div className="text-center">
        <span className="text-2xl font-bold" style={{ color: c.text }}>{pct.toFixed(1)}%</span>
        <p className="text-xs text-gray-500 mt-0.5">of {maxLevel} m max</p>
      </div>
    </div>
  )
}
