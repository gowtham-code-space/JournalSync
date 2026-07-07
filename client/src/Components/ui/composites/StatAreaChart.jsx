import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * StatAreaChart
 * Filled area chart — useful for showing cumulative/continuous
 * numeric columns (e.g. deep work hours, sleep quality over a month).
 * Shares the same data contract as StatLineChart but renders a
 * more prominent filled area with a gradient.
 *
 * Props:
 *   column     { id, label, type }
 *   entries    Entry[]
 *   monthLabel string
 *   height     number   — SVG height in px (default 100)
 *   color      string   — override stroke/fill colour (default brand.teal)
 */
export default function StatAreaChart({ column, entries = [], monthLabel, height = 100, color }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const strokeColor = color ?? tokens.colors.brand.teal

  const values = entries.map((entry) => {
    if (column.type === 'box') return entry.cells?.[column.id] ? 1 : 0
    const raw    = entry[column.id]
    const parsed = Number.parseFloat(raw)
    return Number.isNaN(parsed) ? 0 : parsed
  })

  const max     = Math.max(...values, 1)
  const total   = values.reduce((s, v) => s + v, 0)
  const average = values.length ? (total / values.length).toFixed(1) : '0.0'
  const gradId  = `area-grad-${column.id}`

  const W   = 300
  const H   = height
  const pad = 6

  const pts = values.map((v, i) => {
    const x = pad + (i / Math.max(values.length - 1, 1)) * (W - pad * 2)
    const y = H - pad - (v / max) * (H - pad * 2)
    return [x, y]
  })

  const linePts = pts.map(([x, y]) => `${x},${y}`).join(' ')

  const areaPath =
    `M ${pts[0]?.[0] ?? pad},${H - pad} ` +
    pts.map(([x, y]) => `L ${x},${y}`).join(' ') +
    ` L ${pts[pts.length - 1]?.[0] ?? W - pad},${H - pad} Z`

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
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={strokeColor} stopOpacity={0.25} />
            <stop offset="100%" stopColor={strokeColor} stopOpacity={0.02} />
          </linearGradient>
        </defs>

        {pts.length > 1 && (
          <>
            <path d={areaPath} fill={`url(#${gradId})`} />
            <polyline
              points={linePts}
              fill="none"
              stroke={strokeColor}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </>
        )}

        {pts.map(([x, y], i) =>
          values[i] > 0 ? (
            <circle key={i} cx={x} cy={y} r={2.5} fill={strokeColor} />
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
