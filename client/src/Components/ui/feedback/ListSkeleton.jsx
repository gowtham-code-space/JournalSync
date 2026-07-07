import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * ListSkeleton
 * Use for: loading state of any vertical list — notes list,
 * task list, search results, sidebar lists.
 * @param {number} items - number of list item skeletons (default 5)
 */
export default function ListSkeleton({ items = 5, className = '' }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const shimmerColor = theme === 'dark'
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.06)'

  const bar = (w, h = 11, style = {}) => ({
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
        overflow: 'hidden',
      }}
      className={className}
      aria-hidden="true"
    >
      {Array.from({ length: items }).map((_, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: tokens.spacing.lg,
            padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
            borderBottom: i < items - 1
              ? `1px solid ${tokens.colors.border}`
              : 'none',
          }}
        >
          {/* Avatar / icon placeholder */}
          <div
            className="skeleton"
            style={{
              ...bar('36px', 36),
              borderRadius: tokens.radius.full,
              flexShrink: 0,
            }}
          />

          {/* Text block */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
            <div className={`skeleton skeleton-delay-${(i % 4) + 1}`} style={bar('60%', 13)} />
            <div className={`skeleton skeleton-delay-${(i % 4) + 2}`} style={bar('85%', 10)} />
          </div>

          {/* Trailing badge */}
          <div className="skeleton" style={{ ...bar('40px', 20), borderRadius: tokens.radius.full, flexShrink: 0 }} />
        </div>
      ))}
    </div>
  )
}
