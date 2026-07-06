import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

export default function ColumnStatCard({ column, entries = [], monthLabel }) {
  const theme = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const values = entries.map((entry) => {
    if (column.type === 'box') return entry.cells?.[column.id] ? 1 : 0
    const raw = entry[column.id]
    if (typeof raw === 'number') return raw
    const parsed = Number.parseFloat(raw)
    return Number.isNaN(parsed) ? 0 : parsed
  })

  const total = values.reduce((sum, value) => sum + value, 0)
  const average = values.length ? (total / values.length).toFixed(1) : '0.0'
  const activeDays = values.filter(Boolean).length

  return (
    <div className="rounded-xl p-4 shadow-sm" style={{ border: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.surface }}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: tokens.colors.textMuted }}>{column.label}</p>
          <h3 className="mt-1" style={{ fontSize: 15, fontWeight: 600, color: tokens.colors.textPrimary }}>{monthLabel}</h3>
        </div>
        <div className="rounded-lg px-3 py-1.5 text-right" style={{ backgroundColor: tokens.colors.surfaceSubtle }}>
          <p style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: tokens.colors.textMuted }}>Avg</p>
          <p style={{ fontSize: 14, fontWeight: 600, color: tokens.colors.textPrimary }}>{average}</p>
        </div>
      </div>
      <div className="mt-4 flex items-end gap-2">
        {values.slice(0, 12).map((value, index) => (
          <div key={index} className="flex-1 rounded-t-md" style={{ backgroundColor: tokens.colors.status.success, height: `${Math.max(12, value * 18)}px` }} />
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between" style={{ fontSize: 11, color: tokens.colors.textMuted }}>
        <span>{activeDays} active day{activeDays === 1 ? '' : 's'}</span>
        <span>{total} total</span>
      </div>
    </div>
  )
}