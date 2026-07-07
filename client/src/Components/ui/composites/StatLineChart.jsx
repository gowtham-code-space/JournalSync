import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * StatLineChart
 * SVG polyline chart for a single column's numeric time series.
 *
 * Props:
 *   column     { id, label, type }
 *   entries    Entry[]
 *   monthLabel string
 *   height     number   — SVG viewBox height (default 80)
 */
export default function StatLineChart({ column, entries = [], monthLabel, height = 80 }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const values = entries.map((entry) => {
    if (column.type === 'box') return entry.cells?.[column.id] ? 1 : 0
    const raw    = entry[column.id]
    const parsed = Number.parseFloat(raw)
    return Number.isNaN(parsed) ? 0 : parsed
  })

  const max     = Math.max(...values, 1)
  const total   = values.reduce((s, v) => s + v, 0)
  const average = values.length ? (total / values.length).toFixed(1) : '0.0'

  const w   = 300
  const h   = height
  const pad = 8

  const points = values.map((v, i) => {
    const x = pad + (i / Math.max(values.length - 1, 1)) * (w - pad * 2)
    const y = h - pad - (v / max) * (h - pad * 2)
    return [x, y]
  })

  const polyline = points.map(([x, y]) => `${x},${y}`).join(' ')

  // Area fill path
  const area =
    `M ${points[0]?.[0] ?? pad},${h - pad} ` +
    points.map(([x, y]) => `L ${x},${y}`).join(' ') +
    ` L ${points[points.length - 1]?.[0] ?? w - pad},${h - pad} Z`

  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.xl,
        padding: tokens.spacing.xl,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: tokens.spacing.lg }}>
        <div>
          <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.colors.textMuted }}>
            {column.label}
          </p>
          <p style={{ fontSize: 13, color: tokens.colors.textSecondary, marginTop: 2 }}>{monthLabel}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: tokens.colors.textMuted }}>Avg</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: tokens.colors.textPrimary }}>{average}</p>
        </div>
      </div>

      {/* SVG */}
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        height={h}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* Area */}
        {points.length > 1 && (
          <path
            d={area}
            fill={tokens.colors.brand.teal}
            fillOpacity={0.12}
          />
        )}
        {/* Line */}
        {points.length > 1 && (
          <polyline
            points={polyline}
            fill="none"
            stroke={tokens.colors.brand.teal}
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
        {/* Dots for non-zero values */}
        {points.map(([x, y], i) =>
          values[i] > 0 ? (
            <circle key={i} cx={x} cy={y} r={2} fill={tokens.colors.brand.teal} />
          ) : null
        )}
      </svg>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: tokens.spacing.md, fontSize: 11, color: tokens.colors.textMuted }}>
        <span>{values.filter(Boolean).length} active days</span>
        <span>Total {total}</span>
      </div>
    </div>
  )
}
