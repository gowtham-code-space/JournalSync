import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * StatPieChart
 * SVG donut/pie chart — best used for boolean (box) columns to show
 * the proportion of active vs inactive days in a month.
 *
 * Props:
 *   column     { id, label, type }
 *   entries    Entry[]
 *   monthLabel string
 *   size       number   — diameter in px (default 80)
 */
export default function StatPieChart({ column, entries = [], monthLabel, size = 80 }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const values    = entries.map((entry) => {
    if (column.type === 'box') return entry.cells?.[column.id] ? 1 : 0
    const parsed = Number.parseFloat(entry[column.id])
    return Number.isNaN(parsed) ? 0 : parsed
  })

  const active   = values.filter(Boolean).length
  const inactive = values.length - active
  const pct      = values.length ? Math.round((active / values.length) * 100) : 0

  const cx  = size / 2
  const cy  = size / 2
  const r   = (size / 2) * 0.75
  const cir = 2 * Math.PI * r
  const activeArc = (active / Math.max(values.length, 1)) * cir

  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.xl,
        padding: tokens.spacing.xl,
        display: 'flex',
        alignItems: 'center',
        gap: tokens.spacing.xl,
      }}
    >
      {/* Donut */}
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }} aria-hidden="true">
        {/* Track */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={tokens.colors.border}
          strokeWidth={size * 0.12}
        />
        {/* Arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={tokens.colors.brand.teal}
          strokeWidth={size * 0.12}
          strokeDasharray={`${activeArc} ${cir - activeArc}`}
          strokeDashoffset={cir / 4}
          strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 0.4s ease' }}
        />
        {/* Centre label */}
        <text
          x={cx}
          y={cy + 1}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize={size * 0.22}
          fontWeight={700}
          fill={tokens.colors.textPrimary}
        >
          {pct}%
        </text>
      </svg>

      {/* Legend */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
        <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.colors.textMuted }}>
          {column.label}
        </p>
        <p style={{ fontSize: 13, color: tokens.colors.textSecondary }}>{monthLabel}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.xs, marginTop: tokens.spacing.sm }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: tokens.colors.textMuted }}>
            <span style={{ color: tokens.colors.brand.teal }}>● Active</span>
            <span>{active} days</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: tokens.colors.textMuted }}>
            <span>○ Inactive</span>
            <span>{inactive} days</span>
          </div>
        </div>
      </div>
    </div>
  )
}
