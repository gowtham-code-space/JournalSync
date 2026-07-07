import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * StatPercentageRing
 * A single circular ring showing one percentage value.
 * Best for: streak %, completion rate, goal progress.
 *
 * Props:
 *   label      string   — descriptor text below the ring
 *   value      number   — 0–100 percentage value
 *   size       number   — diameter in px (default 96)
 *   color      string   — override ring colour (default brand.teal)
 *   subtitle   string?  — optional small text beneath the label
 */
export default function StatPercentageRing({ label, value = 0, size = 96, color, subtitle }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const strokeColor = color ?? tokens.colors.brand.teal
  const cx    = size / 2
  const cy    = size / 2
  const sw    = size * 0.1          // stroke width
  const r     = (size - sw) / 2
  const cir   = 2 * Math.PI * r
  const arc   = ((Math.min(Math.max(value, 0), 100)) / 100) * cir

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: tokens.spacing.md,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${label}: ${value}%`}>
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={tokens.colors.border}
          strokeWidth={sw}
        />
        {/* Progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={sw}
          strokeDasharray={`${arc} ${cir - arc}`}
          strokeDashoffset={cir / 4}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.5s ease' }}
        />
        {/* Centre percentage */}
        <text
          x={cx}
          y={cy}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.2}
          fontWeight={700}
          fill={tokens.colors.textPrimary}
        >
          {Math.round(value)}%
        </text>
      </svg>

      <div style={{ textAlign: 'center' }}>
        <p style={{ fontSize: 12, fontWeight: 500, color: tokens.colors.textPrimary }}>{label}</p>
        {subtitle && (
          <p style={{ fontSize: 10, color: tokens.colors.textMuted, marginTop: 2 }}>{subtitle}</p>
        )}
      </div>
    </div>
  )
}
