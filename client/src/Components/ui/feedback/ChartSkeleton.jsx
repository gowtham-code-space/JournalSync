import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * ChartSkeleton
 * Use for: loading state of any chart — bar, line, area, pie, heatmap.
 * Renders a card frame with a label, axis lines, and shimmer bars.
 */
export default function ChartSkeleton({ height = 200, className = '' }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const shimmerColor = theme === 'dark'
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.06)'

  const bar = (w, h, style = {}) => ({
    width: w,
    height: h,
    borderRadius: tokens.radius.base,
    backgroundColor: shimmerColor,
    ...style,
  })

  const barHeights = [55, 80, 40, 95, 60, 75, 50, 85, 45, 70, 90, 65]

  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.xl,
        padding: tokens.spacing.xl,
      }}
      className={className}
      aria-hidden="true"
    >
      {/* Title + legend */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: tokens.spacing.xl }}>
        <div className="skeleton" style={bar('140px', 14)} />
        <div style={{ display: 'flex', gap: tokens.spacing.md }}>
          <div className="skeleton" style={bar('48px', 10)} />
          <div className="skeleton" style={bar('48px', 10)} />
        </div>
      </div>

      {/* Chart area */}
      <div
        style={{
          position: 'relative',
          height,
          display: 'flex',
          alignItems: 'flex-end',
          gap: tokens.spacing.sm,
        }}
      >
        {/* Y-axis */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', marginRight: tokens.spacing.sm }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={bar('24px', 8)} />
          ))}
        </div>

        {/* Bars */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: tokens.spacing.sm, height: '100%' }}>
          {barHeights.map((h, i) => (
            <div
              key={i}
              className={`skeleton skeleton-delay-${(i % 4) + 1}`}
              style={{
                flex: 1,
                height: `${h}%`,
                borderRadius: `${tokens.radius.base} ${tokens.radius.base} 0 0`,
                backgroundColor: shimmerColor,
              }}
            />
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: tokens.spacing.md }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={bar('24px', 8)} />
        ))}
      </div>
    </div>
  )
}
