import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * ProfileSkeleton
 * Use for: loading state of any user profile header — the sidebar
 * user card, a profile settings section, or an author card.
 */
export default function ProfileSkeleton({ className = '' }) {
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
        padding: tokens.spacing.xl2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: tokens.spacing.xl,
      }}
      className={className}
      aria-hidden="true"
    >
      {/* Avatar */}
      <div
        className="skeleton"
        style={{
          width: 72,
          height: 72,
          borderRadius: tokens.radius.full,
          backgroundColor: shimmerColor,
        }}
      />

      {/* Name + role */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.spacing.sm }}>
        <div className="skeleton" style={bar('140px', 16)} />
        <div className="skeleton skeleton-delay-1" style={bar('100px', 10)} />
      </div>

      {/* Stats row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: tokens.spacing.xl,
          width: '100%',
          borderTop: `1px solid ${tokens.colors.border}`,
          paddingTop: tokens.spacing.xl,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: tokens.spacing.sm }}>
            <div className={`skeleton skeleton-delay-${i + 1}`} style={bar('40px', 18)} />
            <div className="skeleton" style={bar('56px', 10)} />
          </div>
        ))}
      </div>
    </div>
  )
}
