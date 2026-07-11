import { useState, useMemo } from 'react'
import { Flame, ChevronDown, Sparkles, Layout, Check } from '@/theme/icons'
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'
import { useJournal } from '@/contexts/JournalContext'
import { Button, IconButton } from '@/components/primitives'
import { useNavigate } from 'react-router-dom'
import NoTemplatesFoundBanner from '@/components/ui/overlays/NoTemplatesFoundBanner'

// ── Mock timeline data ──────────────────────────────────────────────
// No existing context/apiMethods covers a "template timeline" data shape.
// Wire this up to a real service once a templates/timeline endpoint exists.
const TASKS = [
  { id: 't1', label: '10-Day Hackathon Sprint',  segments: [{ start: 4,  end: 12 }] },
  { id: 't2', label: 'DSA Coding Grind',         segments: [{ start: 1,  end: 20 }] },
  { id: 't3', label: 'Web Dev Portfolio',         segments: [{ start: 1,  end: 15 }] },
  { id: 't4', label: 'AI Model Training',         segments: [{ start: 10, end: 31 }] },
  { id: 't5', label: 'Open Source Contrib',       segments: [{ start: 9,  end: 25 }] },
  { id: 't6', label: 'UI/UX Design System',       segments: [{ start: 3,  end: 22 }] },
  { id: 't7', label: 'Exam Preparation',          segments: [{ start: 1,  end: 8  }, { start: 20, end: 31 }] },
  { id: 't8', label: 'Fitness Challenge',         segments: [{ start: 1,  end: 8  }, { start: 15, end: 31 }] },
]

// ── Per-ribbon colour palette ────────────────────────────────────────
// Each ribbon gets its own solid colour, cycling through the list.
// No gradient — a clean solid fill per task row.
const RIBBON_COLORS = [
  '#2DBFAE', // teal
  '#C13A8A', // pink
  '#E8924A', // orange
  '#7C6FD4', // indigo-violet
  '#4A9EE8', // sky blue
  '#D4A44C', // amber-gold
  '#5DC688', // emerald
  '#E85A8A', // rose
]

const LABEL_COL_WIDTH = 200
const DAY_COL_WIDTH   = 34
const VIEW_MODES      = ['Month', 'Week', 'Custom']

function hexToRgba(hex, alpha) {
  const clean  = hex.replace('#', '')
  const bigint = parseInt(clean, 16)
  const r      = (bigint >> 16) & 255
  const g      = (bigint >> 8)  & 255
  const b      = bigint & 255
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function Dashboard() {
  const theme  = useThemeStore((state) => state.theme)
  const tokens = getUiTokens(theme)
  const navigate = useNavigate()
  const { monthLabel, selectedMonth, selectedYear, currentEntries = [], activeTemplate } = useJournal()

  const [viewMode, setViewMode]           = useState('Month')
  const [activeTab, setActiveTab]         = useState('select') // 'select' | 'active'

  const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate()
  const dayNumbers  = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const streakDays = useMemo(() => {
    let max = 0,
      curr = 0;
    for (const entry of currentEntries) {
      const hasActivity =
        Object.values(entry.cells || {}).some(Boolean) ||
        (entry.rating && String(entry.rating).trim() !== "") ||
        (entry.deepWork && String(entry.deepWork).trim() !== "") ||
        (entry.sleep && String(entry.sleep).trim() !== "");
      if (hasActivity) {
        curr++;
        if (curr > max) max = curr;
      } else curr = 0;
    }
    return max;
  }, [currentEntries]);

  const weeks = []
  for (let d = 1; d <= daysInMonth; d += 7) {
    const end = Math.min(d + 6, daysInMonth)
    weeks.push({ label: `Week ${weeks.length + 1}`, start: d, end })
  }

  const gridTemplateColumns = `${LABEL_COL_WIDTH}px repeat(${daysInMonth}, ${DAY_COL_WIDTH}px)`
  const gridLine            = hexToRgba(tokens.colors.border, 0.6)

  return (
    <div className="flex-1 overflow-y-auto" style={{ padding: tokens.spacing.xxl }}>

        {/* ── Top bar ─────────────────────────────────────────────── */}
        <div
          className="flex items-center justify-between flex-wrap"
          style={{ gap: tokens.spacing.lg, marginBottom: tokens.spacing.xxl }}
        >

          {/* Right: view mode switcher */}
          <div
            className="flex items-center"
            style={{
              borderRadius: tokens.radius.lg,
              border: `1px solid ${tokens.colors.border}`,
              backgroundColor: tokens.colors.surface,
              overflow: 'hidden',
              boxShadow: tokens.shadows.sm,
            }}
          >
            {VIEW_MODES.map((mode, i) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  padding: `${tokens.spacing.sm2} ${tokens.spacing.lg}`,
                  fontSize: 13,
                  fontWeight: viewMode === mode ? 600 : 400,
                  cursor: 'pointer',
                  border: 'none',
                  borderRight: i < VIEW_MODES.length - 1 ? `1px solid ${tokens.colors.border}` : 'none',
                  backgroundColor: viewMode === mode
                    ? tokens.colors.surfaceSubtle
                    : 'transparent',
                  color: viewMode === mode
                    ? tokens.colors.textPrimary
                    : tokens.colors.textMuted,
                  transition: 'background-color 150ms ease, color 150ms ease',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {!activeTemplate ? (
          <div className="mt-8 flex justify-center">
            <NoTemplatesFoundBanner
              title="No Active Templates"
              description="Select a template from the Templates menu to view the ribbon graph."
              actionLabel="Choose a Template"
              onAction={() => navigate('/templates')}
              className="w-full max-w-2xl"
            />
          </div>
        ) : (
          <>
            {/* ── Streak Card Row ─────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row gap-4" style={{ marginBottom: tokens.spacing.xl }}>
              <div className="rounded-xl px-6 py-5 flex items-center sm:flex-col sm:items-center sm:justify-center gap-4 sm:gap-0 sm:w-40 shrink-0" style={{ border: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.surface }}>
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
              <defs>
                <linearGradient id="flameGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={tokens.colors.brand.pink} />
                  <stop offset="55%" stopColor={tokens.colors.brand.orange} />
                  <stop offset="100%" stopColor={tokens.colors.brand.teal} />
                </linearGradient>
              </defs>
              <path
                d="M12 2C12 2 7 7.5 7 12.5C7 16 9.5 18 12 18C14.5 18 17 16 17 12.5C17 11.5 16.7 10.5 16.2 9.6C16.2 11 15.4 12 14.3 12C14.9 9.5 13.7 7 12 5.5C12.4 7 11.8 8.3 10.7 9.2C9.6 10.1 9 11.3 9 12.5C9 14.5 10.3 16 12 16"
                stroke="url(#flameGradient)"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={tokens.colors.surface}
              />
            </svg>
            <div className="sm:text-center sm:mt-2">
              <p
                style={{
                  fontFamily: tokens.typography.fonts.sans,
                  fontSize: tokens.typography.fontSizes.xxl3,
                  fontWeight: tokens.typography.fontWeights.bold,
                  color: tokens.colors.textPrimary,
                }}
                className="leading-none"
              >
                {streakDays}
              </p>
              <p
                style={tokens.typography.label}
                className="mt-1"
              >
                Day streak
              </p>
            </div>
          </div>
        </div>

        {/* ── Gantt card ───────────────────────────────────────────── */}
        <div
          style={{
            backgroundColor: tokens.colors.surface,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.radius.card,
            boxShadow: tokens.shadows.sm,
            overflowX: 'auto',
          }}
        >
          <div style={{ minWidth: LABEL_COL_WIDTH + daysInMonth * DAY_COL_WIDTH }}>

            {/* Week labels row */}
            <div style={{ display: 'grid', gridTemplateColumns, borderBottom: `1px solid ${tokens.colors.border}` }}>
              <div
                className="flex items-center"
                style={{
                  padding: tokens.spacing.md,
                  ...tokens.typography.label,
                  fontWeight: 600,
                  color: tokens.colors.textMuted,
                  borderRight: `1px solid ${tokens.colors.border}`,
                }}
              >
                Template
              </div>
              {weeks.map((week) => (
                <div
                  key={week.label}
                  className="flex items-center justify-center"
                  style={{
                    gridColumn: `span ${week.end - week.start + 1}`,
                    padding: tokens.spacing.md,
                    fontFamily: tokens.typography.bodySM.fontFamily,
                    fontSize: tokens.typography.bodySM.fontSize,
                    color: tokens.colors.textSecondary,
                    borderRight: `1px solid ${tokens.colors.border}`,
                  }}
                >
                  {week.label}
                </div>
              ))}
            </div>

            {/* Month label row */}
            <div style={{ display: 'grid', gridTemplateColumns, borderBottom: `1px solid ${tokens.colors.border}` }}>
              <div style={{ borderRight: `1px solid ${tokens.colors.border}` }} />
              <div
                className="flex items-center justify-center"
                style={{
                  gridColumn: `span ${daysInMonth}`,
                  padding: tokens.spacing.sm2,
                  fontFamily: tokens.typography.bodyLG.fontFamily,
                  fontSize: tokens.typography.bodyLG.fontSize,
                  fontWeight: tokens.typography.fontWeights.semibold,
                  color: tokens.colors.textPrimary,
                }}
              >
                {monthLabel}
              </div>
            </div>

            {/* Day numbers row */}
            <div style={{ display: 'grid', gridTemplateColumns, borderBottom: `1px solid ${tokens.colors.border}` }}>
              <div style={{ borderRight: `1px solid ${tokens.colors.border}` }} />
              {dayNumbers.map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-center"
                  style={{
                    padding: tokens.spacing.sm,
                    fontFamily: tokens.typography.caption.fontFamily,
                    fontSize: tokens.typography.caption.fontSize,
                    color: tokens.colors.textMuted,
                    borderRight: `1px solid ${gridLine}`,
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Task rows — each ribbon has its own colour from the palette */}
            {TASKS.map((task, taskIdx) => {
              const ribbonColor = RIBBON_COLORS[taskIdx % RIBBON_COLORS.length]
              return (
                <div
                  key={task.id}
                  onClick={() => navigate('/template-log')}
                  className="cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                  style={{
                    display: 'grid',
                    gridTemplateColumns,
                    borderBottom: `1px solid ${gridLine}`,
                  }}
                >
                  {/* Label cell */}
                  <div
                    className="flex items-center"
                    style={{
                      padding: tokens.spacing.md,
                      fontFamily: tokens.typography.bodyMD.fontFamily,
                      fontSize: tokens.typography.bodyMD.fontSize,
                      color: tokens.colors.textPrimary,
                      borderRight: `1px solid ${tokens.colors.border}`,
                    }}
                  >
                    {/* Colour dot */}
                    <span
                      style={{
                        display: 'inline-block',
                        width: 8,
                        height: 8,
                        borderRadius: tokens.radius.full,
                        backgroundColor: ribbonColor,
                        marginRight: tokens.spacing.sm2,
                        flexShrink: 0,
                      }}
                    />
                    {task.label}
                  </div>

                  {/* Day grid cells */}
                  {dayNumbers.map((day) => (
                    <div
                      key={day}
                      style={{ borderRight: `1px solid ${gridLine}`, minHeight: 52 }}
                    />
                  ))}

                  {/* Ribbon segments — solid colour, no gradient */}
                  {task.segments.map((seg, idx) => (
                    <div
                      key={idx}
                      style={{
                        gridRow: 1,
                        gridColumn: `${seg.start + 1} / ${seg.end + 2}`,
                        alignSelf: 'center',
                        height: 28,
                        margin: `0 ${tokens.spacing.xs}`,
                        borderRadius: tokens.radius.full,
                        backgroundColor: ribbonColor,
                        opacity: 0.85,
                      }}
                    />
                  ))}
                </div>
              )
            })}
          </div>
        </div>
        </>
        )}

        {/* ── Floating AI button ────────────────────────────────────── */}
        <IconButton
          variant="ghost"
          size="lg"
          aria-label="AI assistant"
          style={{ position: 'fixed', right: tokens.spacing.xxl, bottom: tokens.spacing.xxl }}
        >
          <Sparkles size={20} color={tokens.colors.brand.teal} />
        </IconButton>
      </div>
  )
}