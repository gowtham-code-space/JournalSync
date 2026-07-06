import React, { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, Calendar, BarChart3, Sparkles, Menu } from "lucide-react";
import CalendarModal from "@/components/ui/overlays/CalendarModal";
import Sidebar from "@/components/layout/Sidebar/Sidebar";
import ColumnStatCard from "@/components/ui/composites/ColumnStatCard";
import { useJournal } from "@/contexts/JournalContext";
import useSidebarStore from "@/hooks/useSidebarStore";
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'
import { Button, IconButton } from '@/components/primitives'

// ─── trend helpers ────────────────────────────────────────────────────────────

const trendIcon = { up: TrendingUp, down: TrendingDown, flat: Minus };
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
  const theme = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

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
    <div className="h-screen w-full flex overflow-hidden font-sans" style={{ backgroundColor: tokens.colors.bg, color: tokens.colors.textPrimary }}>
      {/* ── Shared Sidebar ── */}
      <Sidebar />

      {/* ── Main ── */}
      <main className="flex-1 px-7 py-5 overflow-y-auto">

        {/* ── Page header ── */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <IconButton onClick={toggleSidebar} className="md:hidden" variant="ghost" size="sm" aria-label="Toggle sidebar">
              <Menu size={16} />
            </IconButton>
            <div>
              <h1
                className="text-[21px] font-semibold"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", color: tokens.colors.textPrimary }}
              >
                Analytics
              </h1>
              <p className="text-[12.5px] mt-0.5 flex items-center gap-1.5" style={{ color: tokens.colors.textMuted }}>
                <Sparkles size={11} style={{ color: tokens.colors.brand.orange }} />
                {monthLabel} · {trackedColumns.length} column{trackedColumns.length !== 1 ? "s" : ""} tracked
              </p>
            </div>
          </div>

          {/* Month switcher — synced with Dashboard */}
          <Button onClick={() => setCalendarOpen(true)} variant="ghost" size="sm" aria-label="Switch month">
            <Calendar size={14} />
            <span className="ml-1">{monthLabel}</span>
          </Button>
        </div>

        <div className="space-y-6">

          {/* ── KPI cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {kpiCards.map((m) => {
              const Icon = trendIcon[m.trend];
              const trendColorValue = m.trend === 'up' ? tokens.colors.status.success : (m.trend === 'down' ? tokens.colors.status.error : tokens.colors.textMuted)
              return (
                <div key={m.label} className="rounded-xl px-4 py-3.5 hover:shadow-sm transition-shadow" style={{ border: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.surface }}>
                  <p style={{ fontSize: '10.5px', fontWeight: 600, letterSpacing: '0.08em', color: tokens.colors.textMuted, textTransform: 'uppercase' }}>{m.label}</p>
                  <div className="flex items-end justify-between mt-1.5">
                    <span style={{ fontSize: 20, fontWeight: 600, color: tokens.colors.textPrimary }}>{m.value}</span>
                    <span className="flex items-center gap-1" style={{ fontSize: 11, fontFamily: 'monospace', color: trendColorValue }}>
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
            <div className="rounded-xl px-8 py-12 text-center" style={{ border: `1px dashed ${tokens.colors.borderSubtle}`, backgroundColor: tokens.colors.surface }}>
              <BarChart3 size={28} style={{ color: tokens.colors.borderSubtle }} className="mx-auto mb-3" />
              <p style={{ fontSize: '13.5px', fontWeight: 500, color: tokens.colors.textMuted }}>
                No columns are tracked for analytics yet
              </p>
              <p style={{ fontSize: '11.5px', color: tokens.colors.textSecondary, marginTop: 4, maxWidth: '22rem', margin: '0.25rem auto 0' }}>
                Open any column header in the Dashboard, then toggle {" "}
                <span style={{ fontWeight: 700, color: tokens.colors.textMuted }}>Track for Analytics</span> on.
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
