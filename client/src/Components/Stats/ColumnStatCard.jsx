import React, { useState, useMemo } from "react";
import StatLineChart       from "./StatLineChart";
import StatAreaChart       from "./StatAreaChart";
import StatBarChart        from "./StatBarChart";
import StatPieChart        from "./StatPieChart";
import StatPercentageRing  from "./StatPercentageRing";
import StatHeatmap         from "./StatHeatmap";
import { BarChart3, TrendingUp, Activity, PieChart, LayoutGrid, Donut } from "lucide-react";

// ─── chart type options ───────────────────────────────────────────────────────

const CHART_TYPES = [
  { id: "line",    label: "Line",    icon: TrendingUp },
  { id: "area",    label: "Area",    icon: Activity   },
  { id: "bar",     label: "Bar",     icon: BarChart3  },
  { id: "pie",     label: "Pie",     icon: PieChart   },
  { id: "ring",    label: "Ring %",  icon: Donut      },
  { id: "heatmap", label: "Heatmap", icon: LayoutGrid },
];

// ─── helpers ──────────────────────────────────────────────────────────────────

/**
 * Build the daily data array for a given column from entries.
 * Returns: [{ day: "01", value: 0|1, cumulative: number }, ...]
 */
function buildColumnData(entries, colId, colType) {
  let cumulative = 0;
  return entries.map((entry) => {
    const raw = entry.cells[colId];
    let value = 0;
    if (colType === "box") {
      value = Boolean(raw) ? 1 : 0;
    } else {
      // for number/comment columns: filled = 1, empty = 0
      value = raw !== undefined && raw !== "" && raw !== null ? 1 : 0;
    }
    cumulative += value;
    return {
      day: entry.day?.split("/")[0] ?? String(entry.id).padStart(2, "0"),
      value,
      cumulative,
    };
  });
}

// ─── ColumnStatCard ───────────────────────────────────────────────────────────

/**
 * A card for one analytics-tracked column.
 * Shows a chart-type dropdown; renders the selected chart from the Stats folder.
 *
 * Props:
 *  column    — { id, label, type }
 *  entries   — current month's entry array from JournalContext
 *  monthLabel — e.g. "October 2023"
 */
export default function ColumnStatCard({ column, entries, monthLabel }) {
  const [chartType,  setChartType]  = useState("area");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const data = useMemo(
    () => buildColumnData(entries, column.id, column.type),
    [entries, column.id, column.type]
  );

  const checked = data.filter((d) => d.value === 1).length;
  const total   = data.length;
  const pct     = total ? Math.round((checked / total) * 100) : 0;

  const selectedType = CHART_TYPES.find((t) => t.id === chartType) ?? CHART_TYPES[0];
  const SelectedIcon = selectedType.icon;

  const renderChart = () => {
    switch (chartType) {
      case "line":    return <StatLineChart data={data} label={column.id} />;
      case "area":    return <StatAreaChart data={data} label={column.id} />;
      case "bar":     return <StatBarChart  data={data} label={column.id} />;
      case "pie":     return <StatPieChart  checked={checked} total={total} />;
      case "ring":    return <StatPercentageRing pct={pct} checked={checked} total={total} label={column.id} />;
      case "heatmap": return <StatHeatmap   data={data} label={column.id} />;
      default:        return null;
    }
  };

  return (
    <div className="rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A] overflow-visible">
      {/* ── Card header ── */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#EEEEF2] dark:border-[#22222A]">
        <div className="flex items-center gap-2">
          {/* teal dot = tracked indicator */}
          <span className="h-2 w-2 rounded-full bg-[#2DBFAE] shrink-0" />
          <p className="text-[12.5px] font-semibold text-[#111111] dark:text-white">{column.label}</p>
          <span className="text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B] font-mono ml-1">
            {checked}/{total} · {pct}%
          </span>
        </div>

        {/* ── Chart-type dropdown ── */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] px-2.5 py-1.5 text-[11.5px] font-medium text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F5F5F7] dark:hover:bg-[#1E1E24] transition-colors"
            aria-label="Select chart type"
          >
            <SelectedIcon size={13} className="text-[#2DBFAE]" />
            {selectedType.label}
            <svg className="ml-0.5" width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1 3L4 6L7 3" stroke="#9A99A6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {dropdownOpen && (
            <>
              {/* backdrop */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setDropdownOpen(false)}
              />
              {/* menu */}
              <div className="absolute right-0 top-full mt-1 z-20 w-40 rounded-xl border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] shadow-xl overflow-hidden">
                {CHART_TYPES.map((ct) => {
                  const Icon    = ct.icon;
                  const active  = ct.id === chartType;
                  return (
                    <button
                      key={ct.id}
                      onClick={() => { setChartType(ct.id); setDropdownOpen(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-[12px] transition-colors ${
                        active
                          ? "bg-[#2DBFAE]/10 dark:bg-[#2DBFAE]/20 text-[#2DBFAE] font-semibold"
                          : "text-[#5B5B66] dark:text-[#A1A1AA] hover:bg-[#F5F5F7] dark:hover:bg-[#1E1E24]"
                      }`}
                    >
                      <Icon size={13} />
                      {ct.label}
                      {active && (
                        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2DBFAE]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Chart body ── */}
      <div className="px-4 py-3">
        {renderChart()}
      </div>

      {/* ── Footer summary bar ── */}
      <div className="px-5 py-2.5 border-t border-[#F1F1F5] dark:border-[#22222A] bg-[#FAFAFC] dark:bg-[#1C1C22] flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#2DBFAE]" />
          <span className="text-[10.5px] text-[#5B5B66] dark:text-[#A1A1AA]">Done: <b>{checked}</b></span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#E7E8F3] dark:bg-[#25252E] border border-[#C3C3D1] dark:border-[#2C2C35]" />
          <span className="text-[10.5px] text-[#5B5B66] dark:text-[#A1A1AA]">Missed: <b>{total - checked}</b></span>
        </div>
        <div className="ml-auto">
          {/* mini inline progress bar */}
          <div className="h-1.5 w-24 rounded-full bg-[#EEEEF2] dark:bg-[#25252E] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                backgroundImage:
                  "linear-gradient(90deg, #C13A8A 0%, #E8924A 55%, #2DBFAE 100%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
