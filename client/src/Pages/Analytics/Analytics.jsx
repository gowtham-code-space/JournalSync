import React, { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart3, Sparkles, Menu } from "lucide-react";
import CalendarModal    from "../../Components/Modals/CalendarModal";
import Sidebar          from "../../Components/Sidebar/Sidebar";
import ColumnStatCard   from "../../Components/Stats/ColumnStatCard";
import { useJournal }  from "../../Context/JournalContext";
import { useSidebarStore } from "../../store/useSidebarStore";

// ─── trend helpers ────────────────────────────────────────────────────────────

const trendIcon  = { up: TrendingUp, down: TrendingDown, flat: Minus };
const trendColor = { up: "text-[#2DBFAE]", down: "text-[#C13A8A]", flat: "text-[#9A99A6]" };

// ─── Analytics ───────────────────────────────────────────────────────────────

export default function Analytics() {
  const {
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
    monthLabel,
    effectiveColumns,
    currentEntries,
  } = useJournal();

  const [calendarOpen, setCalendarOpen] = useState(false);
  const toggleSidebar = useSidebarStore((state) => state.toggle);

  // Only columns flagged for analytics
  const trackedColumns = useMemo(
    () => effectiveColumns.filter((c) => c.trackForAnalytics),
    [effectiveColumns]
  );

  // ── KPI summary ────────────────────────────────────────────────────────────
  const kpiCards = useMemo(() => {
    const ratings = currentEntries
      .map((e) => parseFloat(e.rating))
      .filter((v) => !isNaN(v) && v > 0);

    const avg = (arr) =>
      arr.length ? (arr.reduce((s, v) => s + v, 0) / arr.length).toFixed(1) : "—";

    const daysWithActivity = currentEntries.filter((e) =>
      Object.values(e.cells).some(Boolean) ||
      (e.rating && String(e.rating).trim() !== "") ||
      (e.deepWork && String(e.deepWork).trim() !== "") ||
      (e.sleep && String(e.sleep).trim() !== "")
    ).length;
    const consistency = currentEntries.length
      ? Math.round((daysWithActivity / currentEntries.length) * 100)
      : 0;

    // Dynamic max streak calculation
    let maxStreak = 0;
    let currStreak = 0;
    for (const entry of currentEntries) {
      const hasActivity = Object.values(entry.cells).some(Boolean) ||
        (entry.rating && String(entry.rating).trim() !== "") ||
        (entry.deepWork && String(entry.deepWork).trim() !== "") ||
        (entry.sleep && String(entry.sleep).trim() !== "");
      if (hasActivity) {
        currStreak++;
        if (currStreak > maxStreak) {
          maxStreak = currStreak;
        }
      } else {
        currStreak = 0;
      }
    }

    return [
      {
        label: "Avg. Rating",
        value: ratings.length ? `${avg(ratings)}/10` : "—",
        delta: ratings.length
          ? parseFloat(avg(ratings)) >= 6 ? "↑ good" : "↓ low"
          : "no data",
        trend: ratings.length && parseFloat(avg(ratings)) >= 6 ? "up" : (ratings.length ? "down" : "flat"),
      },
      {
        label: "Consistency",
        value: `${consistency}%`,
        delta: consistency > 70 ? "on track" : "needs focus",
        trend: consistency > 70 ? "up" : "down",
      },
      {
        label: "Streak",
        value: `${maxStreak} day${maxStreak !== 1 ? "s" : ""}`,
        delta: maxStreak > 0 ? "best streak" : "no active streak",
        trend: maxStreak > 0 ? "up" : "flat",
      },
    ];
  }, [currentEntries]);

  return (
    <div className="h-screen w-full bg-[#F5F5F7] dark:bg-[#0C0C0E] flex overflow-hidden font-sans text-[#111111] dark:text-[#FAFAFC]">
      {/* ── Shared Sidebar ── */}
      <Sidebar />

      {/* ── Main ── */}
      <main className="flex-1 px-7 py-5 overflow-y-auto">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors shrink-0"
              aria-label="Toggle sidebar"
            >
              <Menu size={16} />
            </button>
            <div>
              <h1
                className="text-[21px] font-semibold text-[#111111] dark:text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                Analytics
              </h1>
              <p className="text-[12.5px] text-[#9A99A6] dark:text-[#8E8D9B] mt-0.5 flex items-center gap-1.5">
                <Sparkles size={11} className="text-[#E8924A]" />
                {monthLabel} · {trackedColumns.length} column{trackedColumns.length !== 1 ? "s" : ""} tracked
              </p>
            </div>
          </div>

          {/* Month switcher — synced with Dashboard */}
          <button
            onClick={() => setCalendarOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] px-3 py-1.5 text-[12px] font-medium text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors"
            aria-label="Switch month"
          >
            <Calendar size={14} />
            {monthLabel}
          </button>
        </div>

        <div className="space-y-6">

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {kpiCards.map((m) => {
              const Icon = trendIcon[m.trend];
              return (
                <div
                  key={m.label}
                  className="rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A] px-4 py-3.5 hover:shadow-sm transition-shadow"
                >
                  <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B]">
                    {m.label}
                  </p>
                  <div className="flex items-end justify-between mt-1.5">
                    <span className="text-[20px] font-semibold text-[#111111] dark:text-white">
                      {m.value}
                    </span>
                    <span className={`flex items-center gap-1 text-[11px] font-mono ${trendColor[m.trend]}`}>
                      <Icon size={11} />
                      {m.delta}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Per-column stat cards ── */}
          {trackedColumns.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[#D4D4DE] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] px-8 py-12 text-center">
              <BarChart3 size={28} className="text-[#D4D4DE] dark:text-[#66667A] mx-auto mb-3" />
              <p className="text-[13.5px] font-medium text-[#6B6B76] dark:text-[#A1A1AA]">
                No columns are tracked for analytics yet
              </p>
              <p className="text-[11.5px] text-[#C3C3D1] dark:text-[#71717A] mt-1 max-w-xs mx-auto">
                Open any column header in the Dashboard, then toggle{" "}
                <span className="font-semibold text-[#9A99A6] dark:text-[#8E8D9B]">Track for Analytics</span> on.
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <BarChart3 size={13} className="text-[#2DBFAE]" />
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B]">
                  Column breakdown · {monthLabel}
                </p>
                <span className="ml-auto text-[10.5px] text-[#C3C3D1] dark:text-[#71717A] italic">
                  Use the dropdown on each card to switch chart type
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {trackedColumns.map((col) => (
                  <ColumnStatCard
                    key={col.id}
                    column={col}
                    entries={currentEntries}
                    monthLabel={monthLabel}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ── Calendar Modal ── */}
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
    </div>
  );
}