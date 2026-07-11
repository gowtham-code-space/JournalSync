import { useState } from 'react'
import { AlignCenter, AlignLeft, AlignRight, Bold, Briefcase, CheckSquare, Clock, Code, FileText, Folder, Italic, Link, List, ListOrdered, Menu, MoreHorizontal, Plus, Search, Share, Strikethrough, Underline, User, Lightbulb, FlaskConical } from '@/theme/icons'

import NewNoteModal from '@/components/ui/overlays/NewNoteModal'
import { useSidebarStore } from '@/hooks/useSidebarStore'
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'
import { Button, IconButton } from '@/components/primitives'

export default function Notes() {
  const toggleSidebar = useSidebarStore((state) => state.toggle)
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All Notes')
  const [activeNote, setActiveNote] = useState(0)
  const theme = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  return (
    <>
      <aside className="flex w-72 shrink-0 flex-col" style={{ borderRight: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.surface }}>
        <div className="flex items-center justify-between p-4" style={{ borderBottom: `1px solid ${tokens.colors.border}` }}>
          <div className="flex items-center gap-3">
            <IconButton onClick={toggleSidebar} variant="ghost" size="sm" className="md:hidden">
              <Menu size={16} />
            </IconButton>
            <h2 className="text-[18px] font-bold" style={{ color: tokens.colors.textPrimary }}>Notes</h2>
          </div>
          <Button onClick={() => setNewNoteModalOpen(true)} variant="primary" size="sm">
            <Plus size={14} />
            <span className="ml-1">New Note</span>
          </Button>
        </div>

        <div style={{ borderBottom: `1px solid ${tokens.colors.border}` }} className="p-4">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ border: `1px solid ${tokens.colors.borderInput}`, backgroundColor: tokens.colors.surfaceSubtle }}>
            <Search size={14} style={{ color: tokens.colors.textMuted }} />
            <input placeholder="Search notes..." className="flex-1 border-none bg-transparent text-[13px] outline-none" style={{ color: tokens.colors.textPrimary }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="border-b border-[#E7E7EC] p-4 dark:border-[#22222A]">
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9A99A6] dark:text-[#8E8D9B]">Categories</p>
            <div className="space-y-1">
              <CategoryItem tokens={tokens} icon={Folder} label="All Notes" count={14} active={activeCategory === 'All Notes'} onClick={() => setActiveCategory('All Notes')} />
              <CategoryItem tokens={tokens} icon={Briefcase} label="Work" count={6} active={activeCategory === 'Work'} onClick={() => setActiveCategory('Work')} />
              <CategoryItem tokens={tokens} icon={User} label="Personal" count={4} active={activeCategory === 'Personal'} onClick={() => setActiveCategory('Personal')} />
              <CategoryItem tokens={tokens} icon={Lightbulb} label="Ideas" count={3} active={activeCategory === 'Ideas'} onClick={() => setActiveCategory('Ideas')} />
              <CategoryItem tokens={tokens} icon={FlaskConical} label="Research" count={1} active={activeCategory === 'Research'} onClick={() => setActiveCategory('Research')} />
            </div>
          </div>

          <div className="space-y-1 p-3">
            <NoteListItem tokens={tokens} active={activeNote === 0} onClick={() => setActiveNote(0)} title="Project Alpha - Milestone Notes" summary="Key decisions from the kickoff meetin..." tag="Work" time="Today, 2:14 PM" />
            <NoteListItem tokens={tokens} active={activeNote === 1} onClick={() => setActiveNote(1)} title="Product Roadmap Ideas" summary="Feature brainstorm: AI summarize, cu..." tag="Ideas" time="Yesterday" />
            <NoteListItem tokens={tokens} active={activeNote === 2} onClick={() => setActiveNote(2)} title="Spanish Learning Resources" summary="Vocabulary list, conjugation tables an..." tag="Personal" time="Dec 11" />
            <NoteListItem tokens={tokens} active={activeNote === 3} onClick={() => setActiveNote(3)} title="Analytics Dashboard Review" summary="Observations from the weekly data re..." tag="Work" time="Dec 10" />
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 overflow-y-auto" style={{ backgroundColor: tokens.colors.surface, color: tokens.colors.textPrimary }}>
        <div className="flex items-center justify-between px-6 py-3" style={{ borderBottom: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.surfaceSubtle }}>
          <div className="flex items-center gap-1">
            <select className="mr-4 border-none bg-transparent text-[13px] font-medium outline-none" style={{ color: tokens.colors.textPrimary }}><option>Paragraph</option><option>Heading 1</option><option>Heading 2</option></select>
            <div className="mx-2 h-4 w-px" style={{ backgroundColor: tokens.colors.border }} />
            <ToolbarBtn tokens={tokens} icon={Bold} active /><ToolbarBtn tokens={tokens} icon={Italic} /><ToolbarBtn tokens={tokens} icon={Underline} /><ToolbarBtn tokens={tokens} icon={Strikethrough} />
            <div className="mx-2 h-4 w-px" style={{ backgroundColor: tokens.colors.border }} />
            <ToolbarBtn tokens={tokens} icon={List} /><ToolbarBtn tokens={tokens} icon={ListOrdered} /><ToolbarBtn tokens={tokens} icon={CheckSquare} />
            <div className="mx-2 h-4 w-px" style={{ backgroundColor: tokens.colors.border }} />
            <ToolbarBtn tokens={tokens} icon={Link} /><ToolbarBtn tokens={tokens} icon={Code} />
            <div className="mx-2 h-4 w-px" style={{ backgroundColor: tokens.colors.border }} />
            <ToolbarBtn tokens={tokens} icon={AlignLeft} active /><ToolbarBtn tokens={tokens} icon={AlignCenter} /><ToolbarBtn tokens={tokens} icon={AlignRight} />
          </div>
          <div className="flex items-center gap-2"><IconButton variant="ghost" size="sm"><Share size={15} /></IconButton><IconButton variant="ghost" size="sm"><MoreHorizontal size={15} /></IconButton></div>
        </div>

        <div className="mx-auto w-full max-w-4xl overflow-y-auto px-8 py-10">
          <div className="mb-8">
            <h1
              style={{
                ...tokens.typography.headingXL,
                color: tokens.colors.textPrimary,
              }}
              className="mb-4"
            >
              Project Alpha – Milestone Notes
            </h1>
            <div
              style={{
                fontFamily: tokens.typography.bodySM.fontFamily,
                fontSize: tokens.typography.bodySM.fontSize,
                color: tokens.colors.textMuted,
              }}
              className="flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-md bg-[#4B4453] px-2 py-0.5 font-medium text-[#A69FC1]">
                  <Briefcase size={10} /> Work
                </span>
                <button
                  style={{ color: tokens.colors.brand.teal }}
                  className="flex items-center gap-1 hover:underline"
                >
                  <Plus size={12} /> Add tag
                </button>
              </div>
              <div className="flex items-center gap-1.5"><Clock size={13} /> Today, 2:14 PM</div>
              <div className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-[#E4E4ED] dark:bg-[#4B4B53]" /> Last edited 12 min ago</div>
              <div className="flex items-center gap-1.5"><span className="h-1 w-1 rounded-full bg-[#E4E4ED] dark:bg-[#4B4B53]" /> 342 words</div>
            </div>
          </div>

          <div
            style={{
              fontFamily: tokens.typography.bodyLG.fontFamily,
              fontSize: tokens.typography.bodyLG.fontSize,
              lineHeight: 1.6,
              color: tokens.colors.textPrimary,
            }}
            className="space-y-6"
          >
            <p>This note captures the key decisions and action items from the Project Alpha kickoff meeting held today. The team aligned on the overall roadmap direction and agreed on the first set of deliverables for Q1.</p>
            <h3
              style={{
                ...tokens.typography.headingMD,
                color: tokens.colors.textPrimary,
              }}
              className="mt-8 mb-4"
            >
              Phase 1 – Discovery & Planning
            </h3>
            <p>The first phase will run from <strong>December 15 to January 10</strong>. Primary goals include stakeholder interviews, competitive analysis, and technical scoping.</p>
            <ul className="list-disc space-y-2 pl-5" style={{ color: tokens.colors.brand.teal }}>
              <li><span style={{ color: tokens.colors.textPrimary }}>Finalize user research interview guide by Dec 17</span></li>
              <li><span style={{ color: tokens.colors.textPrimary }}>Complete competitive landscape overview – assign to Jordan</span></li>
              <li><span style={{ color: tokens.colors.textPrimary }}>Infrastructure audit and tech stack confirmation by Dec 20</span></li>
              <li><span style={{ color: tokens.colors.textPrimary }}>Draft project brief and share with leadership for sign-off</span></li>
            </ul>
            <h3
              style={{
                ...tokens.typography.headingMD,
                color: tokens.colors.textPrimary,
              }}
              className="mt-8 mb-4"
            >
              Key Decisions Made
            </h3>
            <h4
              style={{
                ...tokens.typography.headingSM,
                color: tokens.colors.textPrimary,
              }}
              className="mt-4 mb-2"
            >
              Product Direction
            </h4>
            <p>We agreed to prioritize the mobile-first experience for the initial launch. The desktop version will follow 6 weeks later with expanded feature parity. Analytics integration will be scoped as a separate workstream.</p>
            <h4
              style={{
                ...tokens.typography.headingSM,
                color: tokens.colors.textPrimary,
              }}
              className="mt-4 mb-2"
            >
              Team Structure
            </h4>
            <p>Core team: Alex (PM), Jordan (Design), Sam (Eng Lead), Maya (Data). Weekly syncs every Monday at 10am. Async standups via Slack daily.</p>
            <div
              style={{
                fontFamily: tokens.typography.bodyMD.fontFamily,
                fontSize: tokens.typography.bodyMD.fontSize,
              }}
              className="my-6 rounded-lg border border-[#B3E5DB] bg-[#E8F6F4] p-4 text-[#1A7364] dark:border-[#1E4D45] dark:bg-[#122A26] dark:text-[#84D4C5]"
            >
              <strong>Reminder:</strong> Share the milestone doc with the full team by EOD Friday. All comments and feedback should be submitted via the shared doc before the next sync.
            </div>
            <h3
              style={{
                ...tokens.typography.headingMD,
                color: tokens.colors.textPrimary,
              }}
              className="mt-8 mb-4"
            >
              Open Questions
            </h3>
            <ul className="list-disc space-y-2 pl-5">
              <li>Budget allocation for user research incentives — confirm with finance</li>
              <li>External contractor scope — do we need a second engineer for Phase 2?</li>
              <li>Data privacy compliance review — schedule with legal before Jan 5</li>
            </ul>
            <div className="mt-8 border-t border-[#E7E7EC] pt-4 text-[#9A99A6] dark:border-[#22222A] dark:text-[#66667A]">Type '/' for commands</div>
          </div>
        </div>
      </main>

      <NewNoteModal open={newNoteModalOpen} onClose={() => setNewNoteModalOpen(false)} />
    </>
  )
}

function CategoryItem({ tokens, icon: Icon, label, count, active, onClick }) {
  const baseStyle = { padding: '0.5rem 0.75rem', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: 500 }
  const activeStyle = { backgroundColor: tokens.colors.textPrimary, color: tokens.colors.surface }
  const inactiveStyle = { color: tokens.colors.textSecondary }
  return (
    <button onClick={onClick} style={{ ...baseStyle, ...(active ? activeStyle : inactiveStyle) }}>
      <div className="flex items-center gap-2.5"><Icon size={15} />{label}</div>
      <span style={{ fontSize: 11, color: active ? tokens.colors.surface : tokens.colors.textMuted }}>{count}</span>
    </button>
  )
}

function NoteListItem({ tokens, active, onClick, title, summary, tag, time }) {
  const baseStyle = { width: '100%', borderRadius: 12, padding: 12, textAlign: 'left', transition: 'all .15s' }
  const activeStyle = { border: `1px solid ${tokens.colors.status.success}`, backgroundColor: tokens.colors.surfaceSubtle }
  const inactiveStyle = { border: '1px solid transparent' }

  const tagColor = (value) => {
    if (!value) return tokens.colors.textMuted
    const key = value.toLowerCase()
    return tokens.colors.tags?.[key] ?? tokens.colors.textSecondary
  }

  return (
    <button onClick={onClick} style={{ ...baseStyle, ...(active ? activeStyle : inactiveStyle) }}>
      <h4 className="mb-1 truncate" style={{ fontSize: 13, fontWeight: 700, color: tokens.colors.textPrimary }}>{title}</h4>
      <p className="mb-2 truncate" style={{ fontSize: 11, color: tokens.colors.textMuted }}>{summary}</p>
      <div className="flex items-center gap-2" style={{ fontSize: 10, fontWeight: 600 }}>
        <span style={{ borderRadius: 6, padding: '0.125rem 0.5rem', backgroundColor: tagColor(tag), color: tokens.colors.textPrimary }}>{tag}</span>
        <span style={{ color: tokens.colors.textMuted }}>{time}</span>
      </div>
    </button>
  )
}

function ToolbarBtn({ tokens, icon: Icon, active }) {
  return (
    <IconButton variant={active ? 'solid' : 'ghost'} size="sm" style={active ? { backgroundColor: tokens.colors.borderInput } : undefined}>
      <Icon size={14} />
    </IconButton>
  )
}
