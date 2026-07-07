import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * StatHeatmap
 * A calendar-grid heatmap showing activity intensity per day in a month.
 * Best for: boolean (box) columns — one cell per day coloured by activity.
 *
 * Props:
 *   column     { id, label, type }
 *   entries    Entry[]
 *   monthLabel string
 *   year       number   — used to determine the starting weekday
 *   month      number   — 0-indexed month number
 */
export default function StatHeatmap({ column, entries = [], monthLabel, year, month }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  // Determine how many empty cells before day 1
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const values = entries.map((entry) => {
    if (column.type === 'box') return entry.cells?.[column.id] ? 1 : 0
    const parsed = Number.parseFloat(entry[column.id])
    return Number.isNaN(parsed) ? 0 : parsed
  })

  const max     = Math.max(...values, 1)
  const active  = values.filter(Boolean).length
  const pct     = values.length ? Math.round((active / values.length) * 100) : 0

  // Intensity → colour opacity
  const cellColor = (val) => {
    if (val === 0) return theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
    const intensity = val / max
    return tokens.colors.brand.teal + Math.round(intensity * 255).toString(16).padStart(2, '0')
  }

  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: tokens.spacing.xl }}>
        <div>
          <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.colors.textMuted }}>
            {column.label}
          </p>
          <p style={{ fontSize: 13, color: tokens.colors.textSecondary, marginTop: 2 }}>{monthLabel}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 22, fontWeight: 700, color: tokens.colors.brand.teal }}>{pct}%</p>
          <p style={{ fontSize: 10, color: tokens.colors.textMuted }}>{active}/{values.length} days</p>
        </div>
      </div>

      {/* Day-of-week header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
        {DAY_LABELS.map((d, i) => (
          <div key={i} style={{ fontSize: 9, textAlign: 'center', color: tokens.colors.textMuted, fontWeight: 500 }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {/* Empty leading cells */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} style={{ aspectRatio: '1', borderRadius: tokens.radius.sm }} />
        ))}

        {/* Day cells */}
        {values.map((val, i) => (
          <div
            key={i}
            title={`Day ${i + 1}: ${val}`}
            style={{
              aspectRatio: '1',
              borderRadius: tokens.radius.sm,
              backgroundColor: cellColor(val),
              transition: 'background-color 0.2s ease',
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: tokens.spacing.sm, marginTop: tokens.spacing.lg }}>
        <span style={{ fontSize: 10, color: tokens.colors.textMuted }}>Less</span>
        {[0.1, 0.3, 0.5, 0.75, 1].map((op, i) => (
          <div
            key={i}
            style={{
              width: 10,
              height: 10,
              borderRadius: tokens.radius.sm,
              backgroundColor: op < 0.2
                ? (theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)')
                : tokens.colors.brand.teal + Math.round(op * 255).toString(16).padStart(2, '0'),
            }}
          />
        ))}
        <span style={{ fontSize: 10, color: tokens.colors.textMuted }}>More</span>
      </div>
    </div>
  )
}
