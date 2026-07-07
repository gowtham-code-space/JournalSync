import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * TableSkeleton
 * Use for: loading state of any data table (Dashboard grid,
 * Notes list table, etc.).
 * @param {number} rows   - number of row skeletons to render (default 6)
 * @param {number} cols   - number of column skeletons per row (default 5)
 */
export default function TableSkeleton({ rows = 6, cols = 5, className = '' }) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const shimmerColor = theme === 'dark'
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.06)'

  const cell = (w = '100%', h = 11) => ({
    width: w,
    height: h,
    borderRadius: tokens.radius.base,
    backgroundColor: shimmerColor,
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
      {/* Header row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gap: tokens.spacing.xl,
          padding: `${tokens.spacing.lg} ${tokens.spacing.xl}`,
          borderBottom: `1px solid ${tokens.colors.border}`,
        }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="skeleton" style={cell('70%', 10)} />
        ))}
      </div>

      {/* Data rows */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div
          key={rowIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            gap: tokens.spacing.xl,
            padding: `${tokens.spacing.md2} ${tokens.spacing.xl}`,
            borderBottom: rowIdx < rows - 1
              ? `1px solid ${tokens.colors.border}`
              : 'none',
          }}
        >
          {Array.from({ length: cols }).map((_, colIdx) => (
            <div
              key={colIdx}
              className={`skeleton skeleton-delay-${(colIdx % 4) + 1}`}
              style={cell(colIdx === 0 ? '80px' : '60%')}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
