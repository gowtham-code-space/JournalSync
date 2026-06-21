import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const metrics = [
  { label: "Avg. Deep Work", value: "6.4h", delta: "+1.4%", trend: "up" },
  { label: "Consistency", value: "88.4%", delta: "+3.1%", trend: "up" },
  { label: "Sleep Quality", value: "Optimal", delta: "0.0%", trend: "flat" },
  { label: "Focus Sessions", value: "142", delta: "-2.0%", trend: "down" },
];

const weeklyFocus = [
  { day: "Mon", hours: 5.2 },
  { day: "Tue", hours: 6.8 },
  { day: "Wed", hours: 4.1 },
  { day: "Thu", hours: 7.3 },
  { day: "Fri", hours: 6.0 },
  { day: "Sat", hours: 3.4 },
  { day: "Sun", hours: 2.9 },
];

const trendIcon = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

const trendColor = {
  up: "text-[#3E7A4C]",
  down: "text-[#B5573A]",
  flat: "text-[#8B8470]",
};

export default function Analytics() {
  const maxHours = Math.max(...weeklyFocus.map((d) => d.hours));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[19px] font-semibold text-[#1F2A1F]">Analytics</h1>
        <p className="text-[12.5px] text-[#8B8470] mt-0.5">
          Efficiency trends across the last 30 days
        </p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metrics.map((m) => {
          const Icon = trendIcon[m.trend];
          return (
            <div
              key={m.label}
              className="rounded-xl border border-[#E9E5D8] bg-white px-4 py-3.5"
            >
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8B8470]">
                {m.label}
              </p>
              <div className="flex items-end justify-between mt-1.5">
                <span className="text-[20px] font-semibold text-[#1F2A1F]">
                  {m.value}
                </span>
                <span
                  className={`flex items-center gap-1 text-[11px] font-mono ${trendColor[m.trend]}`}
                >
                  <Icon size={11} />
                  {m.delta}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Weekly bar chart */}
      <div className="rounded-xl border border-[#E9E5D8] bg-white px-5 py-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8B8470]">
            Focus distribution
          </p>
          <span className="text-[11px] text-[#8B8470] font-mono">Last 7 days</span>
        </div>
        <div className="flex items-end gap-3 h-40">
          {weeklyFocus.map((d) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-end h-32">
                <div
                  className="w-full rounded-md bg-gradient-to-t from-[#5C9A35] to-[#8FC15B]"
                  style={{ height: `${(d.hours / maxHours) * 100}%` }}
                  title={`${d.hours}h`}
                />
              </div>
              <span className="text-[10.5px] text-[#8B8470] font-mono uppercase">
                {d.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown table */}
      <div className="rounded-xl border border-[#E9E5D8] bg-white overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#E9E5D8]">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#8B8470]">
            Category breakdown
          </p>
        </div>
        <div className="divide-y divide-[#EFEBDD]">
          {[
            { label: "English", pct: 74 },
            { label: "Communication", pct: 61 },
            { label: "Technical", pct: 88 },
            { label: "Reading", pct: 45 },
            { label: "Speaking", pct: 58 },
          ].map((row) => (
            <div key={row.label} className="flex items-center gap-4 px-5 py-3">
              <span className="text-[12px] text-[#5C6B57] w-32 shrink-0">
                {row.label}
              </span>
              <div className="flex-1 h-2 rounded-full bg-[#EEEAE0] overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#6FAE3C]"
                  style={{ width: `${row.pct}%` }}
                />
              </div>
              <span className="text-[11.5px] font-mono text-[#8B8470] w-10 text-right">
                {row.pct}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
