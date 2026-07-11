import { useState } from 'react'
import { ChevronDown, ChevronRight, ChevronLeft, GripVertical } from '@/theme/icons'
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'
import { useJournal } from '@/contexts/JournalContext'

import {
  StatLineChart,
  StatAreaChart,
  StatPieChart,
  StatHeatmap,
  SpiderChart,
} from '@/components/composites'
import { zIndex, transitions } from '@/theme'

// ── Template definition ──────────────────────────────────────────────
// NOTE: `calorie` and `stepCount` are not part of the current
// DEFAULT_COLUMNS constant in JournalContext. Wire these ids up to
// whatever fields your entries actually carry (top-level or under
// `entry.cells`) before shipping.
const TEMPLATE_NAME = 'Daily Journal'

const TEMPLATE_COLUMNS = [
  { id: 'rating', label: 'Rating', type: 'number', defaultChart: 'line' },
  { id: 'calorie', label: 'Calorie', type: 'number', defaultChart: 'area' },
  { id: 'sleepQuality', label: 'Sleep Quality', type: 'number', defaultChart: 'heatmap' },
  { id: 'stepCount', label: 'Step Count', type: 'number', defaultChart: 'area' },
]

const CHART_OPTIONS = [
  { id: 'line', label: 'Line' },
  { id: 'area', label: 'Area' },
  { id: 'heatmap', label: 'Heatmap' },
  { id: 'piechart', label: 'Piechart' },
  { id: 'spider', label: 'Spider' },
]

const CARD_META = {
  rating: { title: 'Daily Journal Trendline', subtitle: 'Selected metrics over time' },
  calorie: { title: 'Daily Calorie Intake', subtitle: 'Calorie counts over time' },
  sleepQuality: { title: 'Sleep Quality', subtitle: 'Sleep quality over time' },
  stepCount: { title: 'Step Count', subtitle: 'Steps over time' },
}

function renderChart({ chartType, column, entries, monthLabel, height, tokens }) {
  switch (chartType) {
    case 'area':
      return (
        <StatAreaChart
          column={column}
          entries={entries}
          monthLabel={monthLabel}
          height={height}
        />
      )
    case 'heatmap':
      return (
        <StatHeatmap
          column={column}
          entries={entries}
          monthLabel={monthLabel}
        />
      )
    case 'piechart':
      return (
        <StatPieChart
          column={column}
          entries={entries}
          monthLabel={monthLabel}
          size={height}
        />
      )
    case 'spider':
      return (
        <SpiderChart
          columns={[column]}
          entries={entries}
          monthLabel={monthLabel}
          size={height}
          color={tokens.colors.brand.teal}
        />
      )
    case 'line':
    default:
      return (
        <StatLineChart
          column={column}
          entries={entries}
          monthLabel={monthLabel}
          height={height}
        />
      )
  }
}

// ── Chart type dropdown ──────────────────────────────────────────────
function ChartTypeDropdown({ value, onChange, tokens }) {
  const [open, setOpen] = useState(false)
  const currentLabel = CHART_OPTIONS.find((o) => o.id === value)?.label ?? 'Line'

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.sm,
          border: `1px solid ${tokens.colors.brand.teal}`,
          borderRadius: tokens.radius.lg,
          padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`,
          background: 'transparent',
          color: tokens.colors.textPrimary,
          fontFamily: tokens.typography.bodySM.fontFamily,
          fontSize: tokens.typography.bodySM.fontSize,
          fontWeight: tokens.typography.bodySM.fontWeight,
          cursor: 'pointer',
          transitionProperty: transitions.property.colors,
          transitionDuration: transitions.duration.normal,
          transitionTimingFunction: transitions.timing.inOut,
        }}
      >
        ({currentLabel})
        <ChevronDown size={14} />
      </button>

      {open && (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: zIndex.dropdown,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '110%',
              right: 0,
              minWidth: 140,
              backgroundColor: tokens.colors.surface,
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radius.md,
              boxShadow: tokens.shadows.md,
              overflow: 'hidden',
              zIndex: zIndex.dropdown + 1,
            }}
          >
            {CHART_OPTIONS.map((opt) => (
              <div
                key={opt.id}
                onClick={() => {
                  onChange(opt.id)
                  setOpen(false)
                }}
                style={{
                  padding: `${tokens.spacing.sm2}px ${tokens.spacing.md}px`,
                  cursor: 'pointer',
                  backgroundColor:
                    opt.id === value ? tokens.colors.surfaceMuted ?? tokens.colors.surface : 'transparent',
                  color: tokens.colors.textPrimary,
                  fontFamily: tokens.typography.bodySM.fontFamily,
                  fontSize: tokens.typography.bodySM.fontSize,
                }}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ── Individual chart card ────────────────────────────────────────────
function ChartCard({ title, subtitle, column, entries, monthLabel, chartType, onChangeType, tokens }) {
  return (
    <div
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.card,
        boxShadow: tokens.shadows.sm,
        padding: tokens.spacing.xl,
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: tokens.spacing.lg,
        }}
      >
        <div>
          <h3
            style={{
              margin: 0,
              color: tokens.colors.textPrimary,
              fontFamily: tokens.typography.headingSM.fontFamily,
              fontSize: tokens.typography.headingSM.fontSize,
              fontWeight: tokens.typography.headingSM.fontWeight,
            }}
          >
            {title}
          </h3>
          <p
            style={{
              margin: 0,
              marginTop: tokens.spacing.xs,
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.bodySM.fontFamily,
              fontSize: tokens.typography.bodySM.fontSize,
            }}
          >
            {subtitle}
          </p>
        </div>
        <ChartTypeDropdown value={chartType} onChange={onChangeType} tokens={tokens} />
      </div>

      {renderChart({ chartType, column, entries, monthLabel, height: 220, tokens })}
    </div>
  )
}

// ── Active metrics sidebar (inner, collapsible) ──────────────────────
function ActiveMetricsSidebar({ collapsed, onToggleCollapse, templateExpanded, onToggleTemplate, tokens }) {
  const panelWidth = 260

  return (
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <div
        style={{
          width: collapsed ? 0 : panelWidth,
          overflow: 'hidden',
          transitionProperty: 'width',
          transitionDuration: transitions.duration.normal,
          transitionTimingFunction: transitions.timing.inOut,
          borderRight: collapsed ? 'none' : `1px solid ${tokens.colors.border}`,
          backgroundColor: tokens.colors.surface,
          height: '100%',
        }}
      >
        <div style={{ width: panelWidth, padding: tokens.spacing.xl }}>
          <h2
            style={{
              margin: 0,
              color: tokens.colors.textPrimary,
              fontFamily: tokens.typography.headingSM.fontFamily,
              fontSize: tokens.typography.headingSM.fontSize,
              fontWeight: tokens.typography.headingSM.fontWeight,
            }}
          >
            Active Metrics
          </h2>
          <p
            style={{
              margin: 0,
              marginTop: tokens.spacing.xs,
              color: tokens.colors.textSecondary,
              fontFamily: tokens.typography.bodySM.fontFamily,
              fontSize: tokens.typography.bodySM.fontSize,
            }}
          >
            Templates and active columns
          </p>

          <div style={{ marginTop: tokens.spacing.xxl }}>
            <div
              onClick={onToggleTemplate}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing.sm,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              {templateExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              <span
                style={{
                  color: tokens.colors.textPrimary,
                  fontFamily: tokens.typography.bodyLG.fontFamily,
                  fontSize: tokens.typography.bodyLG.fontSize,
                  fontWeight: 600,
                }}
              >
                {TEMPLATE_NAME}
              </span>
            </div>

            {templateExpanded && (
              <div
                style={{
                  marginTop: tokens.spacing.md,
                  paddingLeft: tokens.spacing.xxl,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: tokens.spacing.sm2,
                }}
              >
                {TEMPLATE_COLUMNS.map((col) => (
                  <div
                    key={col.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: `${tokens.spacing.sm}px 0`,
                    }}
                  >
                    <span
                      style={{
                        color: tokens.colors.textSecondary,
                        fontFamily: tokens.typography.bodyMD.fontFamily,
                        fontSize: tokens.typography.bodyMD.fontSize,
                      }}
                    >
                      {col.label}
                    </span>
                    <GripVertical size={14} style={{ color: tokens.colors.textMuted }} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapse / expand trigger — points left when open, right when collapsed */}
      <button
        type="button"
        onClick={onToggleCollapse}
        aria-label={collapsed ? 'Expand active metrics panel' : 'Collapse active metrics panel'}
        style={{
          position: 'absolute',
          top: tokens.spacing.xl,
          right: -12,
          width: 24,
          height: 24,
          borderRadius: tokens.radius.full,
          border: `1px solid ${tokens.colors.border}`,
          backgroundColor: tokens.colors.surface,
          color: tokens.colors.textSecondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: tokens.shadows.sm,
          zIndex: zIndex.sticky,
        }}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </div>
  )
}

// ── Overall stats (one spider chart per template) ───────────────────
function OverallStats({ entries, monthLabel, tokens }) {
  return (
    <div style={{ marginTop: tokens.spacing.xxl3 }}>
      <h2
        style={{
          margin: 0,
          color: tokens.colors.textPrimary,
          fontFamily: tokens.typography.headingLG.fontFamily,
          fontSize: tokens.typography.headingLG.fontSize,
          fontWeight: tokens.typography.headingLG.fontWeight,
        }}
      >
        Overall Stats
      </h2>

      <div
        style={{
          marginTop: tokens.spacing.lg,
          maxWidth: 480,
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.card,
          boxShadow: tokens.shadows.sm,
          padding: tokens.spacing.xxl,
        }}
      >
        <h3
          style={{
            margin: 0,
            color: tokens.colors.textPrimary,
            fontFamily: tokens.typography.headingSM.fontFamily,
            fontSize: tokens.typography.headingSM.fontSize,
            fontWeight: tokens.typography.headingSM.fontWeight,
          }}
        >
          {TEMPLATE_NAME} — Performance
        </h3>
        <p
          style={{
            margin: 0,
            marginTop: tokens.spacing.xs,
            color: tokens.colors.textSecondary,
            fontFamily: tokens.typography.bodySM.fontFamily,
            fontSize: tokens.typography.bodySM.fontSize,
          }}
        >
          Average of all columns in this template
        </p>

        <div style={{ marginTop: tokens.spacing.lg }}>
          <SpiderChart
            columns={TEMPLATE_COLUMNS}
            entries={entries}
            monthLabel={monthLabel}
            size={280}
            color={tokens.colors.brand.teal}
          />
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────
export default function Stats() {
  const theme = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)
  const { currentEntries, monthLabel } = useJournal()

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [templateExpanded, setTemplateExpanded] = useState(true)
  const [chartTypes, setChartTypes] = useState(
    TEMPLATE_COLUMNS.reduce((acc, c) => ({ ...acc, [c.id]: c.defaultChart }), {})
  )

  const updateChartType = (id, type) =>
    setChartTypes((prev) => ({ ...prev, [id]: type }))

  return (
    <>

      <ActiveMetricsSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((v) => !v)}
        templateExpanded={templateExpanded}
        onToggleTemplate={() => setTemplateExpanded((v) => !v)}
        tokens={tokens}
      />

      <div style={{ flex: 1, padding: tokens.spacing.xxl, minWidth: 0 }} className="overflow-y-auto">
        <h1
          style={{
            margin: 0,
            color: tokens.colors.textPrimary,
            fontFamily: tokens.typography.headingXL.fontFamily,
            fontSize: tokens.typography.headingXL.fontSize,
            fontWeight: tokens.typography.headingXL.fontWeight,
          }}
        >
          The Analytics Engine
        </h1>
        <p
          style={{
            margin: 0,
            marginTop: tokens.spacing.xs,
            color: tokens.colors.textSecondary,
            fontFamily: tokens.typography.bodyLG.fontFamily,
            fontSize: tokens.typography.bodyLG.fontSize,
          }}
        >
          Split into structural function panels to manage multi-template column variables cleanly.
        </p>

        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{
            marginTop: tokens.spacing.xxl,
            gap: tokens.spacing.xl,
          }}
        >
          {TEMPLATE_COLUMNS.map((col) => (
            <ChartCard
              key={col.id}
              title={CARD_META[col.id].title}
              subtitle={CARD_META[col.id].subtitle}
              column={col}
              entries={currentEntries}
              monthLabel={monthLabel}
              chartType={chartTypes[col.id]}
              onChangeType={(type) => updateChartType(col.id, type)}
              tokens={tokens}
            />
          ))}
        </div>

        <OverallStats entries={currentEntries} monthLabel={monthLabel} tokens={tokens} />
      </div>
    </>
  )
}