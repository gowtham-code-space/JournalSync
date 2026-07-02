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
} from "lucide-react";
import CalendarModal     from "../../Components/Modals/CalendarModal";
import ColumnEditorModal from "../../Components/Modals/ColumnEditorModal";
import CommentModal      from "../../Components/Modals/CommentModal";
import Sidebar           from "../../Components/Sidebar/Sidebar";
import { useJournal }   from "../../Context/JournalContext";
import { useSidebarStore } from "../../store/useSidebarStore";

// ─── cell components ──────────────────────────────────────────────────────────

function BoxCell({ value, onChange, label }) {
  const checked = Boolean(value);
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label={`Toggle ${label}`}
      className={`h-8 w-full transition-colors ${
        checked
          ? "bg-[#2DBFAE]"
          : "bg-[#E7E8F3] hover:bg-[#DADBF0] dark:bg-[#25252E] dark:hover:bg-[#2F2F39]"
      }`}
    />
  );
}

function DataCell({ column, value, onChange, onOpenComment }) {
  if (column.type === "box") {
    return <BoxCell value={value} onChange={onChange} label={column.label} />;
  }
  if (column.type === "number") {
    return (
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className={`w-14 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[12px] font-mono ${
          column.id === "sleep" ? "text-[#2DBFAE]" : "text-[#111111] dark:text-white"
        } outline-none focus:border-[#E4E4ED] focus:bg-[#FAFAFC] focus:dark:border-[#2C2C35] focus:dark:bg-[#1E1E24]`}
      />
    );
  }
  // comment type — clickable preview, opens full modal
  if (column.type === "comment" && onOpenComment) {
    const hasValue = value && String(value).trim() !== "";
    return (
      <button
        onClick={onOpenComment}
        className={`w-32 text-left rounded-md border border-transparent px-1 py-0.5 text-[12px] italic truncate transition-colors hover:border-[#E4E4ED] dark:hover:border-[#2C2C35] hover:bg-[#FAFAFC] dark:hover:bg-[#1E1E24] ${
          hasValue
            ? "text-[#5B5B66] dark:text-[#A1A1AA]"
            : "text-[#C3C3D1] dark:text-[#555]"
        }`}
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
      className="w-28 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[12px] italic text-[#5B5B66] dark:text-[#A1A1AA] placeholder:text-[#C3C3D1] dark:placeholder:text-[#666] outline-none focus:border-[#E4E4ED] focus:bg-[#FAFAFC] focus:dark:border-[#2C2C35] focus:dark:bg-[#1E1E24]"
    />
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Dashboard() {
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

  const [calendarOpen,  setCalendarOpen]  = useState(false);
  const [columnEditor,  setColumnEditor]  = useState({ open: false, column: null });
  const [commentModal,  setCommentModal]  = useState({ open: false, row: null, column: null });
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  // ── Streak ─────────────────────────────────────────────────────────────────
  const streakDays = useMemo(() => {
    let max = 0, curr = 0;
    for (const entry of currentEntries) {
      const hasActivity =
        Object.values(entry.cells).some(Boolean) ||
        (entry.rating   && String(entry.rating).trim()   !== "") ||
        (entry.deepWork && String(entry.deepWork).trim() !== "") ||
        (entry.sleep    && String(entry.sleep).trim()    !== "");
      if (hasActivity) { curr++; if (curr > max) max = curr; }
      else curr = 0;
    }
    return max;
  }, [currentEntries]);

  // ── Column groups ──────────────────────────────────────────────────────────
  const firstBoxIndex = effectiveColumns.findIndex((c) => c.type === "box");

  const leftColumns = useMemo(() =>
    firstBoxIndex === -1 ? effectiveColumns : effectiveColumns.slice(0, firstBoxIndex),
    [effectiveColumns, firstBoxIndex]
  );
  const boxColumns = useMemo(() =>
    effectiveColumns.filter((c) => c.type === "box"),
    [effectiveColumns]
  );
  const rightColumns = useMemo(() =>
    firstBoxIndex === -1 ? [] : effectiveColumns.slice(firstBoxIndex).filter((c) => c.type !== "box"),
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
    <div className="h-screen w-full bg-[#F5F5F7] dark:bg-[#0C0C0E] flex overflow-hidden font-sans text-[#111111] dark:text-[#FAFAFC]">

      {/* ── Sidebar ── */}
      <Sidebar />

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 overflow-y-auto">

        {/* ── Top bar ── */}
        <div className="sticky top-0 z-10 bg-[#F5F5F7]/90 dark:bg-[#0C0C0E]/90 backdrop-blur-md border-b border-[#E7E7EC] dark:border-[#22222A] px-4 sm:px-7 py-3 flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={toggleSidebar}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors shrink-0"
            aria-label="Open sidebar"
          >
            <Menu size={16} />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-sm flex items-center gap-2 rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-[#E8EAF6] dark:bg-[#1E1E24] px-3 py-2">
            <Search size={13} className="text-[#7C7C9A] dark:text-[#8E8D9B] shrink-0" />
            <input
              placeholder="Search..."
              className="flex-1 min-w-0 text-[13px] outline-none placeholder:text-[#9494B3] dark:placeholder:text-[#66667A] bg-transparent text-[#111111] dark:text-[#FAFAFC]"
            />
          </div>

          {/* Icon buttons — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-2">
            <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors">
              <Bell size={15} />
            </button>
            <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors">
              <Settings size={15} />
            </button>
          </div>
        </div>

        {/* ── Page body ── */}
        <div className="px-4 sm:px-7 py-5 space-y-5">

          {/* ── Streak row ── */}
          <div className="flex flex-col sm:flex-row gap-4">

            {/* Streak card */}
            <div className="rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A] px-6 py-5 flex items-center sm:flex-col sm:items-center sm:justify-center gap-4 sm:gap-0 sm:w-40 shrink-0">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                <defs>
                  <linearGradient id="flameGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%"   stopColor="#C13A8A" />
                    <stop offset="55%"  stopColor="#E8924A" />
                    <stop offset="100%" stopColor="#2DBFAE" />
                  </linearGradient>
                </defs>
                <path
                  d="M12 2C12 2 7 7.5 7 12.5C7 16 9.5 18 12 18C14.5 18 17 16 17 12.5C17 11.5 16.7 10.5 16.2 9.6C16.2 11 15.4 12 14.3 12C14.9 9.5 13.7 7 12 5.5C12.4 7 11.8 8.3 10.7 9.2C9.6 10.1 9 11.3 9 12.5C9 14.5 10.3 16 12 16"
                  stroke="url(#flameGradient)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="#F3ECF6"
                  className="dark:fill-[#2B2332]"
                />
              </svg>
              <div className="sm:text-center sm:mt-2">
                <p className="text-[22px] font-bold text-[#111111] dark:text-white leading-none">
                  {streakDays}
                </p>
                <p className="text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B] mt-1 uppercase tracking-wide">
                  Day streak
                </p>
              </div>
            </div>

          </div>

          {/* ── Journal table card ── */}
          <div className="rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A] overflow-hidden">

            {/* Card header */}
            <div className="flex items-center justify-between px-4 sm:px-6 pt-5 pb-4 gap-3">
              <h2
                className="text-[17px] sm:text-[18px] font-semibold text-[#111111] dark:text-white truncate"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {monthLabel}
              </h2>
              <button
                onClick={() => setCalendarOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] px-3 py-1.5 text-[12px] font-medium text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors shrink-0"
                aria-label="Switch month"
              >
                <Calendar size={14} />
                <span className="hidden xs:inline">Switch month</span>
                <span className="xs:hidden">Month</span>
              </button>
            </div>

            {/* Table — horizontally scrollable on mobile */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-[#EEEEF2] dark:border-[#22222A] bg-[#FAFAFC] dark:bg-[#1C1C22]">
                    {/* Date */}
                    <th className="text-left pl-4 sm:pl-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B] whitespace-nowrap">
                      Date
                    </th>

                    {/* Left columns */}
                    {leftColumns.map((col) => (
                      <th
                        key={col.id}
                        className="text-left py-2.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B] whitespace-nowrap"
                      >
                        <button
                          onClick={() => setColumnEditor({ open: true, column: col })}
                          className="flex items-center gap-1 hover:text-[#111111] dark:hover:text-white transition-colors relative"
                        >
                          {col.label}
                          <Pencil size={9} />
                          {col.trackForAnalytics && (
                            <span className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full bg-[#2DBFAE]" />
                          )}
                        </button>
                      </th>
                    ))}

                    {/* Box columns — grouped header */}
                    {boxColumns.length > 0 && (
                      <th
                        colSpan={boxColumns.length}
                        className="py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B]"
                      >
                        <div className="flex items-center">
                          {boxColumns.map((col) => (
                            <button
                              key={col.id}
                              onClick={() => setColumnEditor({ open: true, column: col })}
                              className="flex-1 text-center hover:text-[#111111] dark:hover:text-white transition-colors whitespace-nowrap px-0 relative"
                              style={{ minWidth: "36px" }}
                              title={col.trackForAnalytics ? "Tracked for Analytics" : ""}
                            >
                              {col.label}
                              {col.trackForAnalytics && (
                                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#2DBFAE]" />
                              )}
                            </button>
                          ))}
                          {/* Add column button */}
                          <button
                            onClick={() => setColumnEditor({ open: true, column: null })}
                            className="h-5 w-5 flex items-center justify-center rounded border border-dashed border-[#D4D4DE] dark:border-[#2C2C35] text-[#9A99A6] dark:text-[#8E8D9B] hover:border-[#2DBFAE] hover:text-[#2DBFAE] transition-colors ml-1 shrink-0"
                            aria-label="Add column"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </th>
                    )}

                    {/* Right columns */}
                    {rightColumns.map((col) => (
                      <th
                        key={col.id}
                        className="text-left py-2.5 px-2 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B] whitespace-nowrap"
                      >
                        <button
                          onClick={() => setColumnEditor({ open: true, column: col })}
                          className="flex items-center gap-1 hover:text-[#111111] dark:hover:text-white transition-colors relative"
                        >
                          {col.label}
                          <Pencil size={9} />
                          {col.trackForAnalytics && (
                            <span className="absolute -top-1 -right-2 h-1.5 w-1.5 rounded-full bg-[#2DBFAE]" />
                          )}
                        </button>
                      </th>
                    ))}

                    {/* Fallback add button when no columns */}
                    {boxColumns.length === 0 && leftColumns.length === 0 && rightColumns.length === 0 && (
                      <th className="py-2.5 px-2">
                        <button
                          onClick={() => setColumnEditor({ open: true, column: null })}
                          className="h-6 w-6 flex items-center justify-center rounded-md border border-dashed border-[#D4D4DE] dark:border-[#2C2C35] text-[#9A99A6] dark:text-[#8E8D9B] hover:border-[#2DBFAE] hover:text-[#2DBFAE] transition-colors"
                          aria-label="Add column"
                        >
                          <Plus size={12} />
                        </button>
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F1F1F5] dark:divide-[#22222A]">
                  {currentEntries.map((row) => (
                    <tr key={row.id} className="hover:bg-[#FAFAFC] dark:hover:bg-[#1C1C22] transition-colors">
                      {/* Date */}
                      <td className="pl-4 sm:pl-6 py-2 text-[12px] font-mono text-[#5B5B66] dark:text-[#A1A1AA] whitespace-nowrap">
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
                          />
                        </td>
                      ))}

                      {/* Box columns */}
                      {boxColumns.length > 0 && (
                        <td colSpan={boxColumns.length} className="py-0">
                          <div className="flex" style={{ height: "32px" }}>
                            {boxColumns.map((col, idx) => (
                              <div
                                key={col.id}
                                className={`flex-1 ${
                                  idx === 0 ? "" : "border-l border-[#F1F1F5] dark:border-[#22222A]"
                                }`}
                                style={{ minWidth: "36px" }}
                              >
                                <BoxCell
                                  value={getCellValue(row, col.id)}
                                  onChange={(val) => updateCellValue(row.id, col.id, val)}
                                  label={col.label}
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
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Card footer */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#FAFAFC] dark:bg-[#1C1C22] border-t border-[#EEEEF2] dark:border-[#22222A]">
              <button
                onClick={() => setCalendarOpen(true)}
                className="text-[11.5px] text-[#6B6B76] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white transition-colors underline decoration-dotted"
              >
                {currentEntries.length} days &middot; switch month
              </button>
              <button
                onClick={() => setColumnEditor({ open: true, column: null })}
                className="flex items-center gap-1 text-[11.5px] text-[#6B6B76] dark:text-[#A1A1AA] hover:text-[#2DBFAE] transition-colors"
              >
                <Plus size={12} />
                Add column
              </button>
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
    </div>
  );
}