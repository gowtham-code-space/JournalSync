import { useMemo, useState } from 'react'
import {
  Search, Plus, Sparkles, BookOpen, FlaskConical, GitPullRequest,
  Trophy, MessageSquare, Code2, Bug, Rocket, TrendingUp, Target,
  Compass, FileText, Star, LayoutGrid, CheckCircle2,
} from 'lucide-react'

import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'
import { Button } from '@/components/primitives'
import { useNavigate } from 'react-router-dom'
import { useJournal } from '@/contexts/JournalContext'


/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const CATEGORIES = [
  { id: 'personal', label: 'Personal Growth', heading: 'Personal Growth & Self-Mastery', count: 10 },
  { id: 'software', label: 'Software Eng.', heading: 'Software Engineer & Technical Professional', count: 10 },
  { id: 'product', label: 'Product & PM', heading: 'Product Manager & Engineering Manager', count: 10 },
]

const FIELD_TYPES = [
  { id: 'text', label: 'Text / Notes', icon: FileText },
  { id: 'rating', label: 'Rating Scale', icon: Star },
  { id: 'checkbox', label: 'Checkbox', icon: CheckCircle2 },
  { id: 'numeric', label: 'Numeric', icon: LayoutGrid },
]

const SCOPES = [
  { id: 'month', label: 'This Month' },
  { id: 'all-months', label: 'All Months' },
  { id: 'all-time', label: 'All Time' },
]

const TEMPLATES = [
  {
    id: 'core-tech-tracker',
    category: 'personal',
    icon: Sparkles,
    title: 'Core Tech Tracker',
    description: 'Daily log for dev habits, focus blocks, and study time.',
    active: true,
    fields: [
      { label: 'Comment', type: 'text' },
      { label: 'Rating', type: 'rating' },
      { label: 'Deep Work', type: 'checkbox' },
      { label: 'Study Hours', type: 'numeric' },
    ],
  },
  {
    id: 'exam-prep',
    category: 'personal',
    icon: BookOpen,
    title: 'Elite Exam Prep',
    description: 'Track syllabus focus, recall blocks, and study streaks.',
    fields: [
      { label: 'Syllabus Focus', type: 'text' },
      { label: 'Recall Confidence', type: 'rating' },
      { label: 'Active Recall Done', type: 'checkbox' },
      { label: 'Study Time (hrs)', type: 'numeric' },
    ],
  },
  {
    id: 'ml-research-log',
    category: 'personal',
    icon: FlaskConical,
    title: 'ML Research Log',
    description: 'Track papers read, experiments run, and results released.',
    fields: [
      { label: 'Paper / Notes', type: 'text' },
      { label: 'Model Confidence', type: 'rating' },
      { label: 'Experiment Logged', type: 'checkbox' },
      { label: 'Compute Hours', type: 'numeric' },
    ],
  },
  {
    id: 'dev-flow-tracker',
    category: 'software',
    icon: Code2,
    title: 'Daily Dev Flow Tracker',
    description: 'Standups, PRs raised, reviews, and deep work hours.',
    fields: [
      { label: 'Comment', type: 'text' },
      { label: 'Flow State', type: 'rating' },
      { label: 'PR Reviewed', type: 'checkbox' },
      { label: 'Deep Work (hrs)', type: 'numeric' },
    ],
  },
  {
    id: 'bug-squash-matrix',
    category: 'software',
    icon: Bug,
    title: 'Bug-Squash Matrix',
    description: 'Root cause notes, severity, and time to fix.',
    fields: [
      { label: 'Root Cause Summary', type: 'text' },
      { label: 'Severity Impact', type: 'rating' },
      { label: 'Patch Staged', type: 'checkbox' },
      { label: 'Time to Fix (hrs)', type: 'numeric' },
    ],
  },
  {
    id: 'product-launch-tracker',
    category: 'software',
    icon: Rocket,
    title: 'Product Launch Tracker',
    description: 'Deployment targets, system health, and error counts.',
    fields: [
      { label: 'Deployment Target', type: 'text' },
      { label: 'System Health', type: 'rating' },
      { label: 'Analytics Live', type: 'checkbox' },
      { label: 'Errors Observed', type: 'numeric' },
    ],
  },
  {
    id: 'agile-sprint-velocity',
    category: 'product',
    icon: TrendingUp,
    title: 'Agile Sprint Velocity',
    description: 'Sprint milestones, team feasibility, and burn ratios.',
    fields: [
      { label: 'Sprint Milestone', type: 'text' },
      { label: 'Team Feasibility', type: 'rating' },
      { label: 'Board Reviewed', type: 'checkbox' },
      { label: 'Sprint Velocity', type: 'numeric' },
    ],
  },
  {
    id: 'product-kpi-monitor',
    category: 'product',
    icon: Target,
    title: 'Product KPI Monitor',
    description: 'North star deviations, conviction, and funnel checks.',
    fields: [
      { label: 'North Star Deviation', type: 'text' },
      { label: 'Conviction Level', type: 'rating' },
      { label: 'Funnel Verified', type: 'checkbox' },
      { label: 'Users Impacted', type: 'numeric' },
    ],
  },
  {
    id: 'cross-function-okr',
    category: 'product',
    icon: Compass,
    title: 'Cross-Function OKR',
    description: 'Objective risks, attainment, and alignment health.',
    fields: [
      { label: 'Objective Risk', type: 'text' },
      { label: 'Attainment Probability', type: 'rating' },
      { label: 'KR Tracker Aligned', type: 'checkbox' },
      { label: 'Work Aligned Count', type: 'numeric' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/*  Field type badge                                                  */
/* ------------------------------------------------------------------ */

function FieldTypeBadge({ type, tokens }) {
  const map = {
    text: { color: tokens.colors.textMuted, bg: tokens.colors.surfaceMuted ?? tokens.colors.border },
    rating: { color: tokens.colors.brand.teal, bg: `${tokens.colors.brand.teal}1A` },
    checkbox: { color: tokens.colors.brand.orange, bg: `${tokens.colors.brand.orange}1A` },
    numeric: { color: tokens.colors.tags.research, bg: `${tokens.colors.tags.research}1A` },
  }
  const labelMap = { text: 'Text', rating: '1-10', checkbox: 'Checkbox', numeric: 'Numeric' }
  const style = map[type]

  return (
    <span
      style={{
        color: style.color,
        backgroundColor: style.bg,
        borderRadius: tokens.radius.base,
        padding: `1px ${tokens.spacing.sm2}`,
        fontSize: tokens.typography.caption.fontSize,
        fontWeight: tokens.typography.label.fontWeight,
      }}
    >
      {labelMap[type]}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Template card                                                     */
/* ------------------------------------------------------------------ */

function TemplateCard({ template, tokens, onUse }) {
  const Icon = template.icon

  return (
    <div
      onClick={() => onUse(template)}
      className="cursor-pointer hover:shadow-md transition-shadow"
      style={{
        backgroundColor: tokens.colors.surface,
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.xl,
        boxShadow: tokens.shadows.sm,
        padding: tokens.spacing.xl2,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.lg,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md2 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: tokens.radius.md,
              backgroundColor: `${tokens.colors.brand.teal}1A`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={18} color={tokens.colors.brand.teal} strokeWidth={2} />
          </div>
          <h3
            style={{
              color: tokens.colors.textPrimary,
              fontSize: tokens.typography.headingSM.fontSize,
              fontWeight: tokens.typography.headingSM.fontWeight,
            }}
          >
            {template.title}
          </h3>
        </div>

        {template.active && (
          <span
            style={{
              color: tokens.colors.brand.teal,
              backgroundColor: `${tokens.colors.brand.teal}1A`,
              borderRadius: tokens.radius.full,
              padding: `2px ${tokens.spacing.md}`,
              fontSize: tokens.typography.caption.fontSize,
              fontWeight: tokens.typography.label.fontWeight,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}
          >
            Active
          </span>
        )}
      </div>

      <p
        style={{
          color: tokens.colors.textSecondary,
          fontSize: tokens.typography.bodyMD.fontSize,
          lineHeight: 1.5,
        }}
      >
        {template.description}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm2 }}>
        {template.fields.map((field) => (
          <div key={field.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ color: tokens.colors.textPrimary, fontSize: tokens.typography.bodyMD.fontSize }}>
              {field.label}
            </span>
            <FieldTypeBadge type={field.type} tokens={tokens} />
          </div>
        ))}
      </div>

      <div style={{ marginTop: tokens.spacing.sm, display: 'flex', gap: tokens.spacing.md2 }}>
        {template.active ? (
          <>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: tokens.spacing.xs,
                color: tokens.colors.brand.teal,
                fontSize: tokens.typography.bodySM.fontSize,
              }}
            >
              <CheckCircle2 size={14} strokeWidth={2} /> Applied
            </span>
            <Button variant="secondary" size="sm" style={{ marginLeft: 'auto' }}>
              Customize
            </Button>
          </>
        ) : (
          <Button variant="primary" size="sm" style={{ width: '100%' }} onClick={() => onUse(template)}>
            Use Template
          </Button>
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Filter sidebar (page-local, not the app Sidebar)                  */
/* ------------------------------------------------------------------ */

function FilterNavItem({ icon: Icon, label, count, active, onClick, tokens }) {
  return (
    <Button
      variant="nav"
      active={active}
      onClick={onClick}
      style={{ width: '100%', justifyContent: 'space-between', display: 'flex' }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
        {Icon && <Icon size={15} strokeWidth={2} />}
        {label}
      </span>
      {typeof count === 'number' && (
        <span
          style={{
            color: tokens.colors.textMuted,
            fontSize: tokens.typography.caption.fontSize,
          }}
        >
          {count}
        </span>
      )}
    </Button>
  )
}

function FilterSection({ title, children, tokens }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.sm }}>
      <span
        style={{
          color: tokens.colors.textMuted,
          fontSize: tokens.typography.label.fontSize,
          fontWeight: tokens.typography.label.fontWeight,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          padding: `0 ${tokens.spacing.md2}`,
        }}
      >
        {title}
      </span>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{children}</div>
    </div>
  )
}

function FilterSidebar({ tokens, browse, setBrowse, fieldType, setFieldType, scope, setScope, search, setSearch, totalCount }) {
  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.spacing.xxl,
        borderRight: `1px solid ${tokens.colors.border}`,
        padding: tokens.spacing.xl,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.spacing.md,
          border: `1px solid ${tokens.colors.borderInput ?? tokens.colors.border}`,
          borderRadius: tokens.radius.lg,
          padding: `${tokens.spacing.sm2}px ${tokens.spacing.md2}px`,
          backgroundColor: tokens.colors.surface,
        }}
      >
        <Search size={14} color={tokens.colors.textMuted} strokeWidth={2} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates..."
          style={{
            border: 'none',
            outline: 'none',
            background: 'transparent',
            color: tokens.colors.textPrimary,
            fontSize: tokens.typography.bodyMD.fontSize,
            width: '100%',
          }}
        />
      </div>

      <FilterSection title="Browse" tokens={tokens}>
        <FilterNavItem
          icon={LayoutGrid}
          label="All Templates"
          count={totalCount}
          active={browse === 'all'}
          onClick={() => setBrowse('all')}
          tokens={tokens}
        />
        <FilterNavItem
          icon={CheckCircle2}
          label="My Applied"
          count={1}
          active={browse === 'applied'}
          onClick={() => setBrowse('applied')}
          tokens={tokens}
        />
        <FilterNavItem
          icon={Star}
          label="Favorites"
          count={2}
          active={browse === 'favorites'}
          onClick={() => setBrowse('favorites')}
          tokens={tokens}
        />
        <FilterNavItem
          icon={Plus}
          label="Custom Build"
          active={browse === 'custom'}
          onClick={() => setBrowse('custom')}
          tokens={tokens}
        />
      </FilterSection>

      <FilterSection title="Category" tokens={tokens}>
        {CATEGORIES.map((cat) => (
          <FilterNavItem
            key={cat.id}
            label={cat.label}
            count={cat.count}
            active={browse === cat.id}
            onClick={() => setBrowse(cat.id)}
            tokens={tokens}
          />
        ))}
      </FilterSection>
    </aside>
  )
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function Templates() {
  const theme = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)
  const navigate = useNavigate()
  const { setActiveTemplate } = useJournal()

  const [tab, setTab] = useState('all')
  const [browse, setBrowse] = useState('all')
  const [fieldType, setFieldType] = useState(null)
  const [scope, setScope] = useState('all-time')
  const [search, setSearch] = useState('')

  const tabs = [{ id: 'all', label: 'All' }, ...CATEGORIES.map((c) => ({ id: c.id, label: c.label }))]

  const filteredTemplates = useMemo(() => {
    return TEMPLATES.filter((t) => {
      if (tab !== 'all' && t.category !== tab) return false
      if (browse === 'applied' && !t.active) return false
      if (fieldType && !t.fields.some((f) => f.type === fieldType)) return false
      if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
  }, [tab, browse, fieldType, search])

  const grouped = useMemo(
    () => CATEGORIES.map((cat) => ({ ...cat, templates: filteredTemplates.filter((t) => t.category === cat.id) })).filter(
      (cat) => cat.templates.length > 0
    ),
    [filteredTemplates]
  )

  const handleUse = (template) => {
    // Wire up to useJournal() / column-apply flow here.
    console.log('Applying template:', template.id)
    setActiveTemplate(template.id)
    navigate('/dashboard')
  }

  return (
    <>
      <FilterSidebar
        tokens={tokens}
        browse={browse}
        setBrowse={setBrowse}
        fieldType={fieldType}
        setFieldType={setFieldType}
        scope={scope}
        setScope={setScope}
        search={search}
        setSearch={setSearch}
        totalCount={TEMPLATES.length}
      />

      <main
        className="overflow-y-auto"
        style={{ flex: 1, padding: tokens.spacing.xxl3, display: 'flex', flexDirection: 'column', gap: tokens.spacing.xxl2 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: tokens.spacing.lg }}>
          <h1
            style={{
              color: tokens.colors.textPrimary,
              fontSize: tokens.typography.headingXL.fontSize,
              fontWeight: tokens.typography.headingXL.fontWeight,
            }}
          >
            Template Library
          </h1>

          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.xxl2 }}>
            <div
              style={{
                display: 'flex',
                gap: 2,
                backgroundColor: tokens.colors.surfaceMuted ?? tokens.colors.surface,
                borderRadius: tokens.radius.lg,
                padding: 2,
              }}
            >
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  style={{
                    border: 'none',
                    cursor: 'pointer',
                    padding: `${tokens.spacing.sm2}px ${tokens.spacing.lg2}px`,
                    borderRadius: tokens.radius.md,
                    fontSize: tokens.typography.button.fontSize,
                    fontWeight: tokens.typography.button.fontWeight,
                    backgroundColor: tab === t.id ? tokens.colors.surface : 'transparent',
                    color: tab === t.id ? tokens.colors.textPrimary : tokens.colors.textSecondary,
                    boxShadow: tab === t.id ? tokens.shadows.sm : 'none',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <Button variant="primary" size="md" onClick={() => handleUse(null)}>
              <Plus size={16} strokeWidth={2} style={{ marginRight: tokens.spacing.sm }} />
              Build from Scratch
            </Button>
          </div>
        </div>

        {grouped.length === 0 && (
          <p style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.bodyLG.fontSize }}>
            No templates match your filters yet.
          </p>
        )}

        {grouped.map((cat) => (
          <section key={cat.id} style={{ display: 'flex', flexDirection: 'column', gap: tokens.spacing.lg2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
              <span style={{ width: 6, height: 6, borderRadius: tokens.radius.full, backgroundColor: tokens.colors.brand.teal }} />
              <h2
                style={{
                  color: tokens.colors.textPrimary,
                  fontSize: tokens.typography.headingMD.fontSize,
                  fontWeight: tokens.typography.headingMD.fontWeight,
                  letterSpacing: '0.02em',
                }}
              >
                {cat.heading}
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: tokens.spacing.xl }}>
              {cat.templates.map((template) => (
                <TemplateCard key={template.id} template={template} tokens={tokens} onUse={handleUse} />
              ))}
            </div>
          </section>
        ))}
      </main>
    </>
  )
}