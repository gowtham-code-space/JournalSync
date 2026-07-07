import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'
import CardSkeleton from './CardSkeleton'
import ChartSkeleton from './ChartSkeleton'
import TableSkeleton from './TableSkeleton'

/**
 * DashboardSkeleton
 * Use for: full-page loading state of the Dashboard page.
 * Mirrors the exact grid layout of Dashboard.jsx so there's
 * no layout jump when data loads.
 */
export default function DashboardSkeleton() {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const shimmerColor = theme === 'dark'
    ? 'rgba(255,255,255,0.06)'
    : 'rgba(0,0,0,0.06)'

  const bar = (w, h) => ({
    width: w,
    height: h,
    borderRadius: tokens.radius.base,
    backgroundColor: shimmerColor,
  })

  return (
    <div
      style={{
        backgroundColor: tokens.colors.background,
        minHeight: '100vh',
        padding: tokens.spacing.xxl,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.xxl,
      }}
      aria-hidden="true"
      aria-label="Loading dashboard…"
    >
      {/* Top bar skeleton */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
          <div className="skeleton" style={bar('180px', 20)} />
          <div className="skeleton" style={bar('100px', 12)} />
        </div>
        <div style={{ display: 'flex', gap: tokens.spacing.md }}>
          <div className="skeleton" style={{ ...bar('88px', 36), borderRadius: tokens.radius.lg }} />
          <div className="skeleton" style={{ ...bar('88px', 36), borderRadius: tokens.radius.lg }} />
        </div>
      </div>

      {/* Stat cards row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: tokens.spacing.xl }}>
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      {/* Main table */}
      <TableSkeleton rows={8} />

      {/* Bottom chart */}
      <ChartSkeleton height={160} />
    </div>
  )
}
