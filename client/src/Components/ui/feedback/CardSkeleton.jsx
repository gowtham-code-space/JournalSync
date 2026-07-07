import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * CardSkeleton
 * Use for: loading state of any stat/metric card.
 * Renders a surface box with shimmer lines mimicking a card header + body.
 */
export default function CardSkeleton({ className = '' }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const base = {
    backgroundColor: tokens.colors.surface,
    border: `1px solid ${tokens.colors.border}`,
    borderRadius: tokens.radius.xl,
    padding: tokens.spacing.xl,
  }

  const bar = (width, height = 12) => ({
    width,
    height,
    borderRadius: tokens.radius.base,
    backgroundColor: theme === 'dark'
      ? 'rgba(255,255,255,0.06)'
      : 'rgba(0,0,0,0.06)',
  })

  return (
    <div style={base} className={`skeleton-wrapper ${className}`} aria-hidden="true">
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: tokens.spacing.xl }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          <div className="skeleton" style={bar('80px', 10)} />
          <div className="skeleton" style={bar('120px', 18)} />
        </div>
        <div className="skeleton" style={{ ...bar('52px', 36), borderRadius: tokens.radius.lg }} />
      </div>

      {/* Body bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
        <div className="skeleton" style={bar('100%', 10)} />
        <div className="skeleton" style={bar('75%', 10)} />
      </div>

      {/* Footer row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: tokens.spacing.lg }}>
        <div className="skeleton" style={bar('60px', 10)} />
        <div className="skeleton" style={bar('50px', 10)} />
      </div>
    </div>
  )
}
