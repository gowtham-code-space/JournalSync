import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * StatBarChart
 * Renders a vertical bar chart for a single journal column's
 * numeric values across entries.
 *
 * Props:
 *   column     { id, label, type }   — column definition
 *   entries    Entry[]               — journal entries for the month
 *   monthLabel string                — e.g. "October 2023"
 *   height     number                — chart area height in px (default 120)
 */
export default function StatBarChart({ column, entries = [], monthLabel, height = 120 }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const values = entries.map((entry) => {
    if (column.type === 'box') return entry.cells?.[column.id] ? 1 : 0
    const raw = entry[column.id]
    if (typeof raw === 'number') return raw
    const parsed = Number.parseFloat(raw)
    return Number.isNaN(parsed) ? 0 : parsed
  })

  const max = Math.max(...values, 1)
  const total   = values.reduce((s, v) => s + v, 0)
  const average = values.length ? (total / values.length).toFixed(1) : '0.0'

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
          <p style={{ fontSize: 13, fontWeight: 500, color: tokens.colors.textSecondary, marginTop: 2 }}>
            {monthLabel}
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: tokens.colors.textMuted }}>Avg</p>
          <p style={{ fontSize: 16, fontWeight: 700, color: tokens.colors.textPrimary }}>{average}</p>
        </div>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height }}>
        {values.map((value, i) => (
          <div
            key={i}
            title={`Day ${i + 1}: ${value}`}
            style={{
              flex: 1,
              height: `${(value / max) * 100}%`,
              minHeight: value > 0 ? 4 : 0,
              backgroundColor: tokens.colors.brand.teal,
              borderRadius: `${tokens.radius.sm} ${tokens.radius.sm} 0 0`,
              opacity: value > 0 ? 1 : 0.15,
              transition: 'height 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: tokens.spacing.md, fontSize: 11, color: tokens.colors.textMuted }}>
        <span>{values.filter(Boolean).length} active days</span>
        <span>Total {total}</span>
      </div>
    </div>
  )
}
