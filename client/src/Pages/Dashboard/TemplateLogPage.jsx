import React, { useState, useMemo } from "react";
import {
  Search,
  Bell,
  Settings,
  Calendar,
  Plus,
  Pencil,
  ChevronRight,
  Menu,
} from "@/theme/icons";
import CalendarModal from '@/components/ui/overlays/CalendarModal';
import ColumnEditorModal from '@/components/ui/overlays/ColumnEditorModal';
import CommentModal from '@/components/ui/overlays/CommentModal';

import { useJournal } from '@/contexts/JournalContext';
import useSidebarStore from '@/hooks/useSidebarStore';
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'
import { Button, IconButton } from '@/components/primitives'

// ─── cell components ──────────────────────────────────────────────────────────

function BoxCell({ value, onChange, label, tokens }) {
  const checked = Boolean(value);
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label={`Toggle ${label}`}
      style={{
        height: 32,
        width: '100%',
        transition: 'background-color .15s',
        backgroundColor: checked ? tokens.colors.status.success : tokens.colors.surfaceSubtle,
      }}
    />
  );
}

function DataCell({ column, value, onChange, onOpenComment, tokens }) {
  if (column.type === "box") {
    return <BoxCell value={value} onChange={onChange} label={column.label} tokens={tokens} />;
  }
  if (column.type === "number") {
    return (
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className={`w-14 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[12px] font-mono`}
        style={{
          color: column.id === 'sleep' ? tokens.colors.status.success : tokens.colors.textPrimary,
          outline: 'none',
        }}
      />
    );
  }
  // comment type — clickable preview, opens full modal
  if (column.type === "comment" && onOpenComment) {
    const hasValue = value && String(value).trim() !== "";
    return (
      <button
        onClick={onOpenComment}
        style={{
          width: 128,
          textAlign: 'left',
          borderRadius: 6,
          padding: '0.25rem 0.25rem',
          fontSize: 12,
          fontStyle: 'italic',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          border: '1px solid transparent',
          backgroundColor: 'transparent',
          color: hasValue ? tokens.colors.textSecondary : tokens.colors.textMuted,
        }}
        title={hasValue ? value : `Add ${column.label.toLowerCase()}...`}
      >
        {hasValue ? value : `Add ${column.label.toLowerCase()}...`}
      </button>
    );
  }
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Add note..."
      className="w-28 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[12px] italic"
      style={{ color: tokens.colors.textSecondary, placeholderTextColor: tokens.colors.textMuted }}
    />
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Dashboard() {
  const theme = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)
  const {
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    monthLabel,
    effectiveColumns,
    handleSaveColumn,
    handleDeleteColumn,
    currentEntries,
    updateCell,
    updateField,
  } = useJournal();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const [columnEditor, setColumnEditor] = useState({ open: false, column: null });
  const [commentModal, setCommentModal] = useState({ open: false, row: null, column: null });
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  // ── Streak ─────────────────────────────────────────────────────────────────
  const streakDays = useMemo(() => {
    let max = 0,
      curr = 0;
    for (const entry of currentEntries) {
      const hasActivity =
        Object.values(entry.cells).some(Boolean) ||
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

  // ── Column groups ──────────────────────────────────────────────────────────
  const firstBoxIndex = effectiveColumns.findIndex((c) => c.type === "box");

  const leftColumns = useMemo(
    () => (firstBoxIndex === -1 ? effectiveColumns : effectiveColumns.slice(0, firstBoxIndex)),
    [effectiveColumns, firstBoxIndex]
  );
  const boxColumns = useMemo(() => effectiveColumns.filter((c) => c.type === "box"), [effectiveColumns]);
  const rightColumns = useMemo(
    () => (firstBoxIndex === -1 ? [] : effectiveColumns.slice(firstBoxIndex).filter((c) => c.type !== "box")),
    [effectiveColumns, firstBoxIndex]
  );

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getCellValue = (row, colId) => {
    if (colId in row) return row[colId];
    return row.cells?.[colId];
  };

  const updateCellValue = (rowId, colId, value) => {
    if (["comment", "rating", "deepWork", "sleep"].includes(colId)) {
      updateField(rowId, colId, value);
    } else {
      updateCell(rowId, colId, value);
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">

        {/* ── Top bar ── */}
        <div className="sticky top-0 z-10 backdrop-blur-md px-4 sm:px-7 py-3 flex items-center gap-3" style={{ backgroundColor: `${tokens.colors.bg}E6`, borderBottom: `1px solid ${tokens.colors.border}` }}>
          {/* Hamburger — mobile only */}
          <IconButton onClick={toggleSidebar} className="md:hidden" variant="ghost" size="sm" aria-label="Open sidebar">
            <Menu size={16} />
          </IconButton>

          {/* Search */}
          <div className="flex-1 max-w-sm flex items-center gap-2 rounded-lg px-3 py-2" style={{ border: `1px solid ${tokens.colors.borderInput}`, backgroundColor: tokens.colors.surfaceSubtle }}>
            <Search size={13} style={{ color: tokens.colors.textMuted }} />
            <input
              placeholder="Search..."
              className="flex-1 min-w-0 text-[13px] outline-none bg-transparent"
              style={{ color: tokens.colors.textPrimary }}
            />
          </div>

          {/* Icon buttons — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-2">
            <IconButton variant="ghost" size="sm"><Bell size={15} /></IconButton>
            <IconButton variant="ghost" size="sm"><Settings size={15} /></IconButton>
          </div>
        </div>

        {/* ── Page body ── */}
        <div className="px-4 sm:px-7 py-5 space-y-5">

          {/* ── Streak row ── */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* Streak card */}
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

          {/* ── Journal table card ── */}
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.surface }}>

            {/* Card footer */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3" style={{ backgroundColor: tokens.colors.surfaceSubtle, borderTop: `1px solid ${tokens.colors.borderSubtle}` }}>
              <Button onClick={() => setCalendarOpen(true)} variant="link" size="sm" style={{ color: tokens.colors.textMuted, textDecoration: 'underline', textDecorationStyle: 'dotted' }}>
                {currentEntries.length} days &middot; switch month
              </Button>
              <Button onClick={() => setColumnEditor({ open: true, column: null })} variant="ghost" size="sm" style={{ color: tokens.colors.textMuted }}>
                <Plus size={12} />
                <span className="ml-1">Add column</span>
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderTop: `1px solid ${tokens.colors.borderSubtle}`, borderBottom: `1px solid ${tokens.colors.borderSubtle}`, backgroundColor: tokens.colors.surfaceSubtle }}>
                    {/* Date */}
                    <th
                      style={{
                        ...tokens.typography.label,
                        color: tokens.colors.textMuted,
                      }}
                      className="text-left pl-4 sm:pl-6 py-2.5 whitespace-nowrap"
                    >
                      Date
                    </th>

                    {/* Left columns */}
                    {leftColumns.map((col) => (
                      <th
                        key={col.id}
                        style={{
                          ...tokens.typography.label,
                          color: tokens.colors.textMuted,
                        }}
                        className="text-left py-2.5 px-2 whitespace-nowrap"
                      >
                        <button
                          onClick={() => setColumnEditor({ open: true, column: col })}
                          className="flex items-center gap-1 transition-colors relative"
                        >
                          {col.label}
                          <Pencil size={9} />
                          {col.trackForAnalytics && (
                            <span className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tokens.colors.status.success }} />
                          )}
                        </button>
                      </th>
                    ))}

                    {/* Box columns — grouped header */}
                    {boxColumns.length > 0 && (
                      <th
                        colSpan={boxColumns.length}
                        style={{
                          ...tokens.typography.label,
                          color: tokens.colors.textMuted,
                        }}
                        className="py-2.5"
                      >
                        <div className="flex items-center">
                          {boxColumns.map((col) => (
                            <button
                              key={col.id}
                              onClick={() => setColumnEditor({ open: true, column: col })}
                              className="flex-1 text-center transition-colors whitespace-nowrap px-0 relative"
                              style={{ minWidth: "36px" }}
                              title={col.trackForAnalytics ? "Tracked for Analytics" : ""}
                            >
                              {col.label}
                              {col.trackForAnalytics && (
                                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tokens.colors.status.success }} />
                              )}
                            </button>
                          ))}
                          {/* Add column button */}
                          <IconButton
                            onClick={() => setColumnEditor({ open: true, column: null })}
                            variant="ghost"
                            size="sm"
                            aria-label="Add column"
                            className="ml-1 shrink-0"
                            style={{ color: tokens.colors.textMuted, borderStyle: 'dashed', borderColor: tokens.colors.borderSubtle }}
                          >
                            <Plus size={10} />
                          </IconButton>
                        </div>
                      </th>
                    )}

                    {/* Right columns */}
                    {rightColumns.map((col) => (
                      <th
                        key={col.id}
                        style={{
                          ...tokens.typography.label,
                          color: tokens.colors.textMuted,
                        }}
                        className="text-left py-2.5 px-2 whitespace-nowrap"
                      >
                        <button onClick={() => setColumnEditor({ open: true, column: col })} className="flex items-center gap-1 transition-colors relative">
                          {col.label}
                          <Pencil size={9} />
                          {col.trackForAnalytics && <span className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full" style={{ backgroundColor: tokens.colors.status.success }} />}
                        </button>
                      </th>
                    ))}

                    {/* Fallback add button when no columns */}
                    {boxColumns.length === 0 && leftColumns.length === 0 && rightColumns.length === 0 && (
                      <th className="py-2.5 px-2">
                        <IconButton onClick={() => setColumnEditor({ open: true, column: null })} variant="ghost" size="sm" aria-label="Add column" style={{ borderStyle: 'dashed', borderColor: tokens.colors.borderSubtle, color: tokens.colors.textMuted }}>
                          <Plus size={12} />
                        </IconButton>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody style={{ borderColor: tokens.colors.borderSubtle }}>
                  {currentEntries.map((row) => (
                    <tr key={row.id} style={{ transition: 'background-color .15s' }} onMouseEnter={(e)=>e.currentTarget && (e.currentTarget.style.backgroundColor = tokens.colors.surfaceSubtle)} onMouseLeave={(e)=>e.currentTarget && (e.currentTarget.style.backgroundColor = 'transparent')}>
                      {/* Date */}
                      <td
                        style={{
                          fontFamily: tokens.typography.fonts.mono,
                          fontSize: tokens.typography.fontSizes.base,
                          color: tokens.colors.textSecondary,
                        }}
                        className="pl-4 sm:pl-6 py-2 whitespace-nowrap"
                      >
                        {row.day}
                      </td>

                      {/* Left columns */}
                      {leftColumns.map((col) => (
                        <td key={col.id} className="py-2 px-2">
                          <DataCell
                            column={col}
                            value={getCellValue(row, col.id)}
                            onChange={(val) => updateCellValue(row.id, col.id, val)}
                            onOpenComment={
                              col.type === "comment"
                                ? () => setCommentModal({ open: true, row, column: col })
                                : undefined
                            }
                            tokens={tokens}
                          />
                        </td>
                      ))}

                      {/* Box columns */}
                      {boxColumns.length > 0 && (
                        <td colSpan={boxColumns.length} className="py-0">
                          <div className="flex" style={{ height: "32px" }}>
                            {boxColumns.map((col, idx) => (
                              <div key={col.id} className="flex-1" style={{ minWidth: '36px', borderLeft: idx === 0 ? undefined : `1px solid ${tokens.colors.borderSubtle}` }}>
                                <BoxCell
                                  value={getCellValue(row, col.id)}
                                  onChange={(val) => updateCellValue(row.id, col.id, val)}
                                  label={col.label}
                                  tokens={tokens}
                                />
                              </div>
                            ))}
                            <div style={{ width: "24px" }} />
                          </div>
                        </td>
                      )}

                      {/* Right columns */}
                      {rightColumns.map((col) => (
                        <td key={col.id} className="py-2 px-2">
                          <DataCell
                            column={col}
                            value={getCellValue(row, col.id)}
                            onChange={(val) => updateCellValue(row.id, col.id, val)}
                            tokens={tokens}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3" style={{ backgroundColor: tokens.colors.surfaceSubtle, borderTop: `1px solid ${tokens.colors.borderSubtle}` }}>
              <button
                onClick={() => setCalendarOpen(true)}
                style={{
                  fontFamily: tokens.typography.bodySM.fontFamily,
                  fontSize: tokens.typography.bodySM.fontSize,
                }}
                className="text-[#6B6B76] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white transition-colors underline decoration-dotted"
              >
                {currentEntries.length} days &middot; switch month
              </button>
              <Button onClick={() => setColumnEditor({ open: true, column: null })} variant="ghost" size="sm" style={{ color: tokens.colors.textMuted }}>
                <Plus size={12} />
                <span className="ml-1">Add column</span>
              </Button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Modals ── */}
      <CalendarModal
        open={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        month={selectedMonth}
        year={selectedYear}
        onSelect={(m, y) => {
          setSelectedMonth(m);
          setSelectedYear(y);
        }}
      />
      <ColumnEditorModal
        open={columnEditor.open}
        onClose={() => setColumnEditor({ open: false, column: null })}
        column={columnEditor.column}
        monthLabel={monthLabel}
        onSave={handleSaveColumn}
        onDelete={handleDeleteColumn}
      />
      <CommentModal
        open={commentModal.open}
        onClose={() => setCommentModal({ open: false, row: null, column: null })}
        value={commentModal.row ? getCellValue(commentModal.row, commentModal.column?.id) ?? "" : ""}
        columnLabel={commentModal.column?.label}
        dateLabel={commentModal.row?.day}
        onSave={(val) => {
          if (commentModal.row && commentModal.column) {
            updateCellValue(commentModal.row.id, commentModal.column.id, val);
          }
          setCommentModal({ open: false, row: null, column: null });
        }}
      />
    </>
  );
}
