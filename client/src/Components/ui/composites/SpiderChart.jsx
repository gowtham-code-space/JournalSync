import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

/**
 * SpiderChart  (a.k.a. Radar Chart)
 * Visualises the normalised average value of each supplied column
 * as a filled polygon on a multi-axis radar grid.
 *
 * Props:
 *   columns    { id, label, type }[]  — axes to render (2–10 recommended)
 *   entries    Entry[]                — journal entries for the month
 *   monthLabel string                 — e.g. "October 2023"
 *   size       number                 — SVG diameter in px (default 240)
 *   color      string                 — override polygon stroke/fill colour
 */
export default function SpiderChart({
  columns  = [],
  entries  = [],
  monthLabel,
  size     = 240,
  color,
}) {
  const theme  = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  const strokeColor = color ?? tokens.colors.brand.teal

  // ── 1. Compute per-column averages ───────────────────────────────────────
  const stats = columns.map((col) => {
    const vals = entries.map((entry) => {
      if (col.type === 'box') return entry.cells?.[col.id] ? 1 : 0
      const raw    = entry[col.id] ?? entry.cells?.[col.id]
      const parsed = Number.parseFloat(raw)
      return Number.isNaN(parsed) ? 0 : parsed
    })
    const total   = vals.reduce((s, v) => s + v, 0)
    const average = vals.length ? total / vals.length : 0
    const activeDays = vals.filter(Boolean).length
    return { col, average, activeDays, total: parseFloat(total.toFixed(2)) }
  })

  // ── 2. Determine per-axis max for normalisation ──────────────────────────
  // For "box" columns max = 1; for numeric columns use the observed max or 10
  const axisMax = stats.map(({ col, average }) => {
    if (col.type === 'box') return 1
    return Math.max(10, Math.ceil(average * 1.5) || 10)
  })

  const ratios = stats.map(({ average }, i) =>
    axisMax[i] > 0 ? Math.min(average / axisMax[i], 1) : 0
  )

  // ── 3. Geometry helpers ──────────────────────────────────────────────────
  const N   = columns.length
  const cx  = size / 2
  const cy  = size / 2
  const R   = (size / 2) * 0.68          // usable radius
  const PAD = (size / 2) * 0.22          // label clearance

  const angle = (i) => (i / N) * 2 * Math.PI - Math.PI / 2

  const polarPoint = (ratio, i) => {
    const θ = angle(i)
    return {
      x: cx + ratio * R * Math.cos(θ),
      y: cy + ratio * R * Math.sin(θ),
    }
  }

  const axisEnd = (i) => polarPoint(1, i)

  // Polygon path for a given ratio array
  const polygonPath = (ratioArr) => {
    if (!ratioArr.length) return ''
    return ratioArr
      .map((r, i) => {
        const { x, y } = polarPoint(r, i)
        return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`
      })
      .join(' ') + ' Z'
  }

  // ── 4. Grid level paths (25 / 50 / 75 / 100 %) ──────────────────────────
  const gridLevels = [0.25, 0.5, 0.75, 1]

  // ── 5. Label positions — pushed beyond the axis ends ────────────────────
  const labelPos = (i) => {
    const θ   = angle(i)
    const dist = R + PAD
    return {
      x: cx + dist * Math.cos(θ),
      y: cy + dist * Math.sin(θ),
    }
  }

  // Label alignment depending on quadrant
  const textAnchor = (i) => {
    const θ = angle(i)
    const cos = Math.cos(θ)
    if (cos < -0.35) return 'end'
    if (cos > 0.35)  return 'start'
    return 'middle'
  }

  // ── 6. Format average for legend ────────────────────────────────────────
  const formatAvg = (stat) => {
    if (stat.col.type === 'box') return `${Math.round(stat.average * 100)}%`
    return stat.average.toFixed(1)
  }

  // ── 7. Fallback empty state ──────────────────────────────────────────────
  if (N < 2) {
    return (
      <div
        style={{
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.xl,
          padding: tokens.spacing.xl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: size,
          color: tokens.colors.textMuted,
          fontSize: 13,
        }}
      >
        Add at least 2 columns to render a spider chart.
      </div>
    )
  }

  // ── 8. Unique gradient ID ────────────────────────────────────────────────
  const gradId = `spider-grad-${columns.map((c) => c.id).join('-')}`

  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.xl,
        padding: tokens.spacing.xl,
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: tokens.spacing.lg,
        }}
      >
        <div>
          <p
            style={{
              fontSize: '10.5px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: tokens.colors.textMuted,
            }}
          >
            Spider Chart
          </p>
          <p style={{ fontSize: 13, color: tokens.colors.textSecondary, marginTop: 2 }}>
            {monthLabel}
          </p>
        </div>
        <p style={{ fontSize: 11, color: tokens.colors.textMuted }}>
          {N} axes · {entries.length} days
        </p>
      </div>

      {/* ── SVG + Legend wrapper ────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.xl,
          flexWrap: 'wrap',
        }}
      >
        {/* ── Radar SVG ──────────────────────────────────────────────────── */}
        <svg
          viewBox={`0 0 ${size} ${size}`}
          width={size}
          height={size}
          style={{ flexShrink: 0, overflow: 'visible' }}
          aria-hidden="true"
        >
          <defs>
            {/* Radial gradient for the data polygon fill */}
            <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%"   stopColor={strokeColor} stopOpacity={0.35} />
              <stop offset="100%" stopColor={strokeColor} stopOpacity={0.06} />
            </radialGradient>
          </defs>

          {/* ── Grid polygons ─────────────────────────────────────────────── */}
          {gridLevels.map((level) => (
            <path
              key={level}
              d={polygonPath(Array(N).fill(level))}
              fill="none"
              stroke={tokens.colors.border}
              strokeWidth={1}
              strokeDasharray={level < 1 ? '3 3' : 'none'}
              opacity={level === 1 ? 0.8 : 0.5}
            />
          ))}

          {/* ── Axis lines ────────────────────────────────────────────────── */}
          {Array.from({ length: N }, (_, i) => {
            const end = axisEnd(i)
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={end.x.toFixed(2)}
                y2={end.y.toFixed(2)}
                stroke={tokens.colors.border}
                strokeWidth={1}
                opacity={0.6}
              />
            )
          })}

          {/* ── Data polygon ─────────────────────────────────────────────── */}
          <path
            d={polygonPath(ratios)}
            fill={`url(#${gradId})`}
            stroke={strokeColor}
            strokeWidth={2}
            strokeLinejoin="round"
            style={{ transition: 'd 0.4s ease' }}
          />

          {/* ── Data points on each axis ─────────────────────────────────── */}
          {ratios.map((r, i) => {
            const { x, y } = polarPoint(r, i)
            return (
              <circle
                key={i}
                cx={x.toFixed(2)}
                cy={y.toFixed(2)}
                r={4}
                fill={strokeColor}
                stroke={tokens.colors.surface}
                strokeWidth={2}
              />
            )
          })}

          {/* ── Axis labels ──────────────────────────────────────────────── */}
          {columns.map((col, i) => {
            const { x, y } = labelPos(i)
            const anchor   = textAnchor(i)
            const θ        = angle(i)
            // Slightly lower the label for bottom axes
            const dyBase   = Math.sin(θ) > 0.35 ? 12 : Math.sin(θ) < -0.35 ? -4 : 4
            return (
              <text
                key={col.id}
                x={x.toFixed(2)}
                y={y.toFixed(2)}
                textAnchor={anchor}
                dominantBaseline="middle"
                dy={dyBase}
                fontSize={10}
                fontWeight={600}
                letterSpacing="0.04em"
                fill={tokens.colors.textMuted}
                style={{ textTransform: 'uppercase' }}
              >
                {col.label.length > 10 ? col.label.slice(0, 9) + '…' : col.label}
              </text>
            )
          })}

          {/* ── Percentage labels at grid intersections on first axis ─────── */}
          {gridLevels.map((level) => {
            const { x, y } = polarPoint(level, 0)
            return (
              <text
                key={level}
                x={(x + 5).toFixed(2)}
                y={y.toFixed(2)}
                dominantBaseline="middle"
                fontSize={8}
                fill={tokens.colors.textMuted}
                opacity={0.7}
              >
                {Math.round(level * 100)}%
              </text>
            )
          })}
        </svg>

        {/* ── Legend ─────────────────────────────────────────────────────── */}
        <div
          style={{
            flex: 1,
            minWidth: 120,
            display: 'flex',
            flexDirection: 'column',
            gap: tokens.spacing.sm2,
          }}
        >
          {stats.map(({ col, average, activeDays }, i) => (
            <div
              key={col.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing.md,
                padding: `${tokens.spacing.sm2} ${tokens.spacing.md}`,
                borderRadius: tokens.radius.md,
                backgroundColor: tokens.colors.surfaceSubtle ?? tokens.colors.surface,
              }}
            >
              {/* Colour dot */}
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: tokens.radius.full,
                  backgroundColor: strokeColor,
                  opacity: 0.5 + ratios[i] * 0.5,
                  flexShrink: 0,
                }}
              />
              {/* Label */}
              <span
                style={{
                  flex: 1,
                  fontSize: 11,
                  color: tokens.colors.textSecondary,
                  fontWeight: 500,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {col.label}
              </span>
              {/* Value */}
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: tokens.colors.textPrimary,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {formatAvg({ col, average, activeDays })}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: tokens.spacing.lg,
          fontSize: 11,
          color: tokens.colors.textMuted,
        }}
      >
        <span>
          {stats.reduce((s, st) => s + st.activeDays, 0)} total active day-column hits
        </span>
        <span style={{ color: strokeColor, fontWeight: 600 }}>
          ◈ radar
        </span>
      </div>
    </div>
  )
}
