import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * DetailSkeleton
 * Use for: loading state of any detail/single-item view —
 * a note detail panel, a journal entry expanded view,
 * or a settings detail section.
 */
export default function DetailSkeleton({ className = '' }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const shimmerColor = theme === 'dark'
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.06)'

  const bar = (w, h = 12, style = {}) => ({
    width: w,
    height: h,
    borderRadius: tokens.radius.base,
    backgroundColor: shimmerColor,
    ...style,
  })

  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.xl,
        padding: tokens.spacing.xxl,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.xxl,
      }}
      className={className}
      aria-hidden="true"
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm, flex: 1 }}>
          <div className="skeleton" style={bar('55%', 22)} />
          <div className="skeleton skeleton-delay-1" style={bar('35%', 12)} />
        </div>
        <div style={{ display: 'flex', gap: tokens.spacing.md }}>
          <div className="skeleton" style={{ ...bar('32px', 32), borderRadius: tokens.radius.lg }} />
          <div className="skeleton" style={{ ...bar('32px', 32), borderRadius: tokens.radius.lg }} />
        </div>
      </div>

      {/* Meta pills */}
      <div style={{ display: 'flex', gap: tokens.spacing.md }}>
        {['60px', '80px', '50px'].map((w, i) => (
          <div key={i} className={`skeleton skeleton-delay-${i + 1}`} style={{ ...bar(w, 22), borderRadius: tokens.radius.full }} />
        ))}
      </div>

      {/* Body paragraphs */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
        {[100, 90, 100, 75, 95, 60].map((pct, i) => (
          <div key={i} className={`skeleton skeleton-delay-${(i % 4) + 1}`} style={bar(`${pct}%`, 11)} />
        ))}
      </div>

      {/* Section divider + second block */}
      <div style={{ height: 1, backgroundColor: tokens.colors.border }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.md }}>
        <div className="skeleton" style={bar('120px', 14)} />
        {[85, 70, 90].map((pct, i) => (
          <div key={i} className={`skeleton skeleton-delay-${i + 1}`} style={bar(`${pct}%`, 11)} />
        ))}
      </div>
    </div>
  )
}
