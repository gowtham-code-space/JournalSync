import React, { useState, useMemo } from "react";
import {
  Search,
  Bell,
  Settings,
  Calendar,
  Plus,
  Pencil,
  ChevronRight,
} from "lucide-react";
import MilestoneModal    from "../../Components/Modals/MilestoneModal";
import CalendarModal     from "../../Components/Modals/CalendarModal";
import ColumnEditorModal from "../../Components/Modals/ColumnEditorModal";
import Sidebar           from "../../Components/Sidebar/Sidebar";
import { useJournal }   from "../../Context/JournalContext";

// ─── cell components ─────────────────────────────────────────────────────────

function BoxCell({ value, onChange, label }) {
  const checked = Boolean(value);
  return (
    <button
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      aria-label={`Toggle ${label}`}
      className={`h-8 w-full transition-colors ${
        checked ? "bg-[#2DBFAE]" : "bg-[#E7E8F3] hover:bg-[#DADBF0] dark:bg-[#25252E] dark:hover:bg-[#2F2F39]"
      }`}
    />
  );
}

function DataCell({ column, value, onChange }) {
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

  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [calendarOpen,  setCalendarOpen]  = useState(false);
  const [columnEditor,  setColumnEditor]  = useState({ open: false, column: null });

  const streakDays = useMemo(() => {
    let max = 0;
    let curr = 0;
    for (const entry of currentEntries) {
      const hasActivity = Object.values(entry.cells).some(Boolean) ||
        (entry.rating && String(entry.rating).trim() !== "") ||
        (entry.deepWork && String(entry.deepWork).trim() !== "") ||
        (entry.sleep && String(entry.sleep).trim() !== "");
      if (hasActivity) {
        curr++;
        if (curr > max) max = curr;
      } else {
        curr = 0;
      }
    }
    return max;
  }, [currentEntries]);

  const firstBoxIndex = effectiveColumns.findIndex((c) => c.type === "box");
  const leftColumns = useMemo(() => {
    return firstBoxIndex === -1 ? effectiveColumns : effectiveColumns.slice(0, firstBoxIndex);
  }, [effectiveColumns, firstBoxIndex]);

  const boxColumns = useMemo(() => {
    return effectiveColumns.filter((c) => c.type === "box");
  }, [effectiveColumns]);

  const rightColumns = useMemo(() => {
    return firstBoxIndex === -1 ? [] : effectiveColumns.slice(firstBoxIndex).filter((c) => c.type !== "box");
  }, [effectiveColumns, firstBoxIndex]);

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

  return (
    <div className="h-screen w-full bg-[#F5F5F7] dark:bg-[#0C0C0E] flex overflow-hidden font-sans text-[#111111] dark:text-[#FAFAFC]">
      {/* ── Shared Sidebar ── */}
      <Sidebar />

      {/* ── Main content ── */}
      <main className="flex-1 px-7 py-5 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-md flex items-center gap-2 rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-[#E8EAF6] dark:bg-[#1E1E24] px-3 py-2">
            <Search size={14} className="text-[#7C7C9A] dark:text-[#8E8D9B]" />
            <input
              placeholder="Search metrics or logs..."
              className="flex-1 text-[13px] outline-none placeholder:text-[#9494B3] dark:placeholder:text-[#66667A] bg-transparent text-[#111111] dark:text-[#FAFAFC]"
            />
          </div>
          <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors">
            <Bell size={15} />
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors">
            <Settings size={15} />
          </button>
        </div>

        <div className="space-y-5">
          {/* Streak + Milestones row */}
          <div className="flex gap-4">
            <div className="rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A] px-6 py-5 flex flex-col items-center justify-center w-40 shrink-0">
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
              <p className="text-[20px] font-bold text-[#111111] dark:text-white mt-2 leading-none">
                {streakDays}
              </p>
              <p className="text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B] mt-1 uppercase tracking-wide">
                Day streak
              </p>
            </div>

            <div className="flex-1 rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A] px-6 py-5 flex items-center justify-between">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#9A99A6] dark:text-[#8E8D9B]">
                  This month
                </p>
                <p className="text-[14px] font-semibold text-[#111111] dark:text-white mt-1">
                  3 milestones in progress
                </p>
                <p className="text-[11.5px] text-[#9A99A6] dark:text-[#8E8D9B] mt-0.5">
                  Spanish fluency &middot; Project Alpha &middot; Ideas &amp; backlog
                </p>
              </div>
              <button
                onClick={() => setMilestoneOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[#111111] dark:bg-[#FAFAFC] text-white dark:text-[#111111] text-[12.5px] font-semibold px-4 py-2.5 hover:bg-[#2A2A2A] dark:hover:bg-[#E2E2E6] transition-colors shrink-0"
              >
                Monthly Milestones
                <ChevronRight size={13} />
              </button>
            </div>
          </div>

          {/* Table card */}
          <div className="rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A] overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
              <h2
                className="text-[18px] font-semibold text-[#111111] dark:text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {monthLabel}
              </h2>
              <button
                onClick={() => setCalendarOpen(true)}
                className="flex items-center gap-1.5 rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] px-3 py-1.5 text-[12px] font-medium text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors"
                aria-label="Switch month"
              >
                <Calendar size={14} />
                Switch month
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-y border-[#EEEEF2] dark:border-[#22222A] bg-[#FAFAFC] dark:bg-[#1C1C22]">
                    {/* Date */}
                    <th className="text-left pl-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B] whitespace-nowrap">
                      Date
                    </th>

                    {/* Left Columns (e.g. Comment) */}
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

                    {/* Right Columns (e.g. Rating, Deep work, Sleep) */}
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

                    {/* If no box columns, and no left/right columns, show add button */}
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
                      <td className="pl-6 py-2 text-[12px] font-mono text-[#5B5B66] dark:text-[#A1A1AA] whitespace-nowrap">
                        {row.day}
                      </td>

                      {/* Left Columns (e.g. Comment) */}
                      {leftColumns.map((col) => (
                        <td key={col.id} className="py-2 px-2">
                          <DataCell
                            column={col}
                            value={getCellValue(row, col.id)}
                            onChange={(val) => updateCellValue(row.id, col.id, val)}
                          />
                        </td>
                      ))}

                      {/* Box columns — flush grid */}
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

                      {/* Right Columns (e.g. Rating, Deep work, Sleep) */}
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

            <div className="flex items-center justify-between px-6 py-3 bg-[#FAFAFC] dark:bg-[#1C1C22] border-t border-[#EEEEF2] dark:border-[#22222A]">
              <button
                onClick={() => setCalendarOpen(true)}
                className="text-[11.5px] text-[#6B6B76] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white transition-colors underline decoration-dotted"
              >
                {currentEntries.length} days &middot; switch month
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ── Modals ── */}
      <MilestoneModal open={milestoneOpen} onClose={() => setMilestoneOpen(false)} />
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
    </div>
  );
}