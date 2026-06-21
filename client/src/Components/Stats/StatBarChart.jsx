import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { useThemeStore } from "../../store/useThemeStore";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] shadow-lg px-3 py-2 text-[11.5px]">
      <p className="text-[#9A99A6] dark:text-[#8E8D9B] mb-0.5">Day {label}</p>
      <p className="font-semibold text-[#111111] dark:text-white">
        {payload[0].value === 1 ? "✓ Done" : "✗ Missed"}
      </p>
    </div>
  );
};

/**
 * StatBarChart — daily binary completion as vertical bars.
 * data: [{ day: "01", value: 0 | 1 }, ...]
 */
export default function StatBarChart({ data, label }) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const gridColor = isDark ? "#22222A" : "#F1F1F5";
  const tickColor = isDark ? "#8E8D9B" : "#9A99A6";
  const cursorColor = isDark ? "#1E1E24" : "#F5F5F7";
  const missedColor = isDark ? "#25252E" : "#E7E8F3";

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} barCategoryGap="20%" margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
          <defs>
            {data.map((_, i) => (
              <linearGradient key={i} id={`barGrad-${label}-${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#2DBFAE" stopOpacity={1} />
                <stop offset="100%" stopColor="#2DBFAE" stopOpacity={0.55} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 9, fill: tickColor, fontFamily: "monospace" }}
            axisLine={false}
            tickLine={false}
            interval={4}
          />
          <YAxis
            domain={[0, 1]}
            ticks={[0, 1]}
            tickFormatter={(v) => (v === 1 ? "✓" : "✗")}
            tick={{ fontSize: 10, fill: tickColor }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: cursorColor }} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={18}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.value === 1 ? "#2DBFAE" : missedColor}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
