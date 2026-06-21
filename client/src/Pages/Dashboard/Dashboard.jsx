import React, { useMemo, useState } from "react";
import {
  Search,
  Bell,
  Settings,
  LayoutGrid,
  BarChart3,
  Calendar,
  Plus,
  Pencil,
  ChevronRight,
} from "lucide-react";
import MilestoneModal from "../../Components/Modals/MilestoneModal";
import CalendarModal from "../../Components/Modals/CalendarModal";
import ColumnEditorModal from "../../Components/Modals/ColumnEditorModal";
import Analytics from "../Analytics/Analytics";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const monthKey = (monthIdx, year) => `${year}-${monthIdx}`;

// Default global columns — used for any month that doesn't have its own override.
const DEFAULT_COLUMNS = [
  { id: "english", label: "English", type: "box" },
  { id: "comm", label: "Comm.", type: "box" },
  { id: "technical", label: "Technical", type: "box" },
  { id: "reading", label: "Reading", type: "box" },
  { id: "speak", label: "Speak", type: "box" },
];

// Demo entries, keyed by "year-monthIndex". Cell values are keyed by column id;
// their shape depends on the column's type (boolean for box, string for number/comment).
const INITIAL_ENTRIES = {
  [monthKey(9, 2023)]: [
    {
      id: 1,
      comment: "Morning routine compl...",
      day: "Oct 01",
      cells: { english: false, comm: true, technical: true, reading: false, speak: false },
      rating: "6.5",
      deepWork: "4.0h",
      sleep: "92%",
    },
    {
      id: 2,
      comment: "Deep work session on...",
      day: "Oct 02",
      cells: { english: true, comm: true, technical: false, reading: false, speak: false },
      rating: "6.2",
      deepWork: "2.5h",
      sleep: "74%",
    },
  ],
};

const weeklyFocus = [5.2, 6.8, 4.1, 7.3, 6.0, 3.4, 2.9];
const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
        active
          ? "bg-[#111111] text-white"
          : "text-[#6B6B76] hover:bg-[#F1F1F5]"
      }`}
    >
      <Icon size={16} strokeWidth={2} />
      {label}
    </button>
  );
}

// Renders a single data cell based on the column's type.
function DataCell({ column, value, onChange }) {
  if (column.type === "box") {
    const checked = Boolean(value);
    return (
      <button
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        aria-label={`Toggle ${column.label}`}
        className={`h-[16px] w-[16px] rounded-[4px] border transition-colors ${
          checked
            ? "bg-[#2DBFAE] border-[#2DBFAE]"
            : "bg-[#E7E8F3] border-[#E7E8F3] hover:bg-[#DADBF0]"
        }`}
      />
    );
  }

  if (column.type === "number") {
    return (
      <input
        type="number"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="—"
        className="w-14 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[12px] font-mono text-[#111111] outline-none focus:border-[#E4E4ED] focus:bg-[#FAFAFC]"
      />
    );
  }

  // comment
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Add note..."
      className="w-28 rounded-md border border-transparent bg-transparent px-1 py-0.5 text-[12px] italic text-[#5B5B66] placeholder:text-[#C3C3D1] outline-none focus:border-[#E4E4ED] focus:bg-[#FAFAFC]"
    />
  );
}

export default function Dashboard() {
  const [view, setView] = useState("dashboard"); // "dashboard" | "analytics"
  const [milestoneOpen, setMilestoneOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);

  // Which month's table data is currently being shown
  const [selectedMonth, setSelectedMonth] = useState(9); // October
  const [selectedYear, setSelectedYear] = useState(2023);
  const activeMonthKey = monthKey(selectedMonth, selectedYear);
  const monthLabel = `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;

  // Global column set + per-month overrides
  const [globalColumns, setGlobalColumns] = useState(DEFAULT_COLUMNS);
  const [monthOverrides, setMonthOverrides] = useState({});
  const effectiveColumns = monthOverrides[activeMonthKey] ?? globalColumns;

  // Column editor modal state
  const [columnEditor, setColumnEditor] = useState({ open: false, column: null });

  // Entry data, keyed by month
  const [entriesByMonth, setEntriesByMonth] = useState(INITIAL_ENTRIES);
  const currentEntries = entriesByMonth[activeMonthKey] ?? [];

  const streakDays = 14;
  const maxHours = Math.max(...weeklyFocus);

  const updateCell = (entryId, colId, value) => {
    setEntriesByMonth((prev) => {
      const monthEntries = prev[activeMonthKey] ?? [];
      return {
        ...prev,
        [activeMonthKey]: monthEntries.map((entry) =>
          entry.id === entryId
            ? { ...entry, cells: { ...entry.cells, [colId]: value } }
            : entry
        ),
      };
    });
  };

  const handleSaveColumn = (columnData, scope) => {
    if (scope === "all") {
      setGlobalColumns((prev) => {
        const exists = prev.some((c) => c.id === columnData.id);
        return exists
          ? prev.map((c) => (c.id === columnData.id ? columnData : c))
          : [...prev, columnData];
      });
      // Keep already-customized months in sync with the same change
      setMonthOverrides((prev) => {
        const updated = {};
        for (const key in prev) {
          const exists = prev[key].some((c) => c.id === columnData.id);
          updated[key] = exists
            ? prev[key].map((c) => (c.id === columnData.id ? columnData : c))
            : [...prev[key], columnData];
        }
        return updated;
      });
    } else {
      setMonthOverrides((prev) => {
        const base = prev[activeMonthKey] ?? globalColumns;
        const exists = base.some((c) => c.id === columnData.id);
        const nextCols = exists
          ? base.map((c) => (c.id === columnData.id ? columnData : c))
          : [...base, columnData];
        return { ...prev, [activeMonthKey]: nextCols };
      });
    }
  };

  const handleDeleteColumn = (columnId, scope) => {
    if (scope === "all") {
      setGlobalColumns((prev) => prev.filter((c) => c.id !== columnId));
      setMonthOverrides((prev) => {
        const updated = {};
        for (const key in prev) {
          updated[key] = prev[key].filter((c) => c.id !== columnId);
        }
        return updated;
      });
    } else {
      setMonthOverrides((prev) => {
        const base = prev[activeMonthKey] ?? globalColumns;
        return { ...prev, [activeMonthKey]: base.filter((c) => c.id !== columnId) };
      });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F5F7] flex font-sans text-[#111111]">
      {/* ───────────────── Sidebar ───────────────── */}
      <aside className="w-60 shrink-0 border-r border-[#E7E7EC] bg-white flex flex-col px-4 py-5">
        <div className="px-1">
          <h1
            className="text-[20px] font-semibold text-[#111111] tracking-tight"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            GrowthOS
          </h1>
          <p className="text-[10.5px] text-[#9A99A6] mt-0.5">
            Efficiency infrastructure
          </p>
        </div>

        <nav className="mt-7 space-y-1">
          <SidebarItem
            icon={LayoutGrid}
            label="Dashboard"
            active={view === "dashboard"}
            onClick={() => setView("dashboard")}
          />
          <SidebarItem
            icon={BarChart3}
            label="Analytics"
            active={view === "analytics"}
            onClick={() => setView("analytics")}
          />
        </nav>

        <div className="mt-auto space-y-3">
          <button className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#111111] text-white text-[12.5px] font-semibold py-2.5 hover:bg-[#2A2A2A] transition-colors">
            <Plus size={14} />
            New entry
          </button>

          <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#6B6B76] hover:bg-[#F1F1F5] transition-colors">
            <Settings size={16} />
            Settings
          </button>

          <div className="flex items-center gap-2.5 px-2 pt-3 border-t border-[#E7E7EC]">
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, #C13A8A 0%, #E8924A 55%, #2DBFAE 100%)",
              }}
            >
              AC
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium text-[#111111] truncate">
                Alex Chan
              </p>
              <p className="text-[10px] text-[#9A99A6] uppercase tracking-wide">
                Standard tier
              </p>
            </div>
            <ChevronRight size={14} className="text-[#9A99A6] ml-auto shrink-0" />
          </div>
        </div>
      </aside>

      {/* ───────────────── Main ───────────────── */}
      <main className="flex-1 px-7 py-5 overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 max-w-md flex items-center gap-2 rounded-lg border border-[#E4E4ED] bg-[#E8EAF6] px-3 py-2">
            <Search size={14} className="text-[#7C7C9A]" />
            <input
              placeholder="Search metrics or logs..."
              className="flex-1 text-[13px] outline-none placeholder:text-[#9494B3] bg-transparent text-[#111111]"
            />
          </div>
          <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] bg-white text-[#6B6B76] hover:bg-[#F1F1F5] transition-colors">
            <Bell size={15} />
          </button>
          <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] bg-white text-[#6B6B76] hover:bg-[#F1F1F5] transition-colors">
            <Settings size={15} />
          </button>
        </div>

        {view === "analytics" ? (
          <Analytics />
        ) : (
          <div className="space-y-5">
            {/* Streak + Milestones row */}
            <div className="flex gap-4">
              {/* Streak flame card */}
              <div className="rounded-xl border border-[#E7E7EC] bg-white px-6 py-5 flex flex-col items-center justify-center w-40 shrink-0">
                <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="flameGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C13A8A" />
                      <stop offset="55%" stopColor="#E8924A" />
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
                  />
                </svg>
                <p className="text-[20px] font-bold text-[#111111] mt-2 leading-none">
                  {streakDays}
                </p>
                <p className="text-[10.5px] text-[#9A99A6] mt-1 uppercase tracking-wide">
                  Day streak
                </p>
              </div>

              {/* Monthly Milestones button */}
              <div className="flex-1 rounded-xl border border-[#E7E7EC] bg-white px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#9A99A6]">
                    This month
                  </p>
                  <p className="text-[14px] font-semibold text-[#111111] mt-1">
                    3 milestones in progress
                  </p>
                  <p className="text-[11.5px] text-[#9A99A6] mt-0.5">
                    Spanish fluency &middot; Project Alpha &middot; Ideas &amp; backlog
                  </p>
                </div>
                <button
                  onClick={() => setMilestoneOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg bg-[#111111] text-white text-[12.5px] font-semibold px-4 py-2.5 hover:bg-[#2A2A2A] transition-colors shrink-0"
                >
                  Monthly Milestones
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Table card */}
            <div className="rounded-xl border border-[#E7E7EC] bg-white overflow-hidden">
              <div className="flex items-center justify-between px-6 pt-5 pb-4">
                <h2
                  className="text-[18px] font-semibold text-[#111111]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  {monthLabel}
                </h2>
                <button
                  onClick={() => setCalendarOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg border border-[#E4E4ED] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6B6B76] hover:bg-[#F1F1F5] transition-colors"
                  aria-label="Switch month"
                >
                  <Calendar size={14} />
                  Switch month
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-y border-[#EEEEF2] bg-[#FAFAFC]">
                      <th className="text-left pl-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6]">
                        Comment
                      </th>
                      <th className="text-left py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6]">
                        Day
                      </th>
                      {effectiveColumns.map((col) => (
                        <th
                          key={col.id}
                          className="text-left py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] whitespace-nowrap"
                        >
                          <button
                            onClick={() => setColumnEditor({ open: true, column: col })}
                            className="flex items-center gap-1 hover:text-[#111111] transition-colors"
                          >
                            {col.label}
                            <Pencil size={9} className="opacity-0 group-hover:opacity-100" />
                          </button>
                        </th>
                      ))}
                      <th className="py-2.5 px-2">
                        <button
                          onClick={() => setColumnEditor({ open: true, column: null })}
                          className="h-6 w-6 flex items-center justify-center rounded-md border border-dashed border-[#D4D4DE] text-[#9A99A6] hover:border-[#2DBFAE] hover:text-[#2DBFAE] transition-colors"
                          aria-label="Add column"
                        >
                          <Plus size={12} />
                        </button>
                      </th>
                      <th className="text-left py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6]">
                        Rating
                      </th>
                      <th className="text-left py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6]">
                        Deep work
                      </th>
                      <th className="text-left pr-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6]">
                        Sleep
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F1F1F5]">
                    {currentEntries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={effectiveColumns.length + 6}
                          className="px-6 py-8 text-center text-[12.5px] text-[#9A99A6]"
                        >
                          No entries logged for {monthLabel} yet.
                        </td>
                      </tr>
                    ) : (
                      currentEntries.map((row) => (
                        <tr key={row.id}>
                          <td className="pl-6 py-3 text-[12px] text-[#9A99A6] italic max-w-[160px] truncate">
                            {row.comment}
                          </td>
                          <td className="py-3 text-[12px] font-mono text-[#5B5B66] whitespace-nowrap">
                            {row.day}
                          </td>
                          {effectiveColumns.map((col) => (
                            <td key={col.id} className="py-3">
                              <DataCell
                                column={col}
                                value={row.cells[col.id]}
                                onChange={(val) => updateCell(row.id, col.id, val)}
                              />
                            </td>
                          ))}
                          <td />
                          <td className="py-3 text-[12px] font-mono text-[#111111]">
                            {row.rating}
                          </td>
                          <td className="py-3 text-[12px] font-mono text-[#111111]">
                            {row.deepWork}
                          </td>
                          <td className="pr-6 py-3 text-[12px] font-mono text-[#2DBFAE]">
                            {row.sleep}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-6 py-3 bg-[#FAFAFC] border-t border-[#EEEEF2]">
                <button
                  onClick={() => setCalendarOpen(true)}
                  className="text-[11.5px] text-[#6B6B76] hover:text-[#111111] transition-colors underline decoration-dotted"
                >
                  {currentEntries.length} entr{currentEntries.length === 1 ? "y" : "ies"} this month &middot; switch month
                </button>
              </div>
            </div>

            {/* Focus distribution */}
            <div className="rounded-xl border border-[#E7E7EC] bg-white px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#9A99A6]">
                  Focus distribution
                </p>
                <span className="text-[11px] text-[#9A99A6] font-mono">
                  Last 7 days
                </span>
              </div>
              <div className="flex items-end gap-4 h-24">
                {weeklyFocus.map((h, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex items-end h-16">
                      <div
                        className="w-full rounded-sm"
                        style={{
                          height: `${(h / maxHours) * 100}%`,
                          backgroundImage:
                            "linear-gradient(180deg, #2DBFAE 0%, #E8924A 60%, #C13A8A 100%)",
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-[#9A99A6] font-mono">
                      {dayLabels[idx]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
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