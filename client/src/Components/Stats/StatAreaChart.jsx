import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useThemeStore } from "../../store/useThemeStore";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] shadow-lg px-3 py-2 text-[11.5px]">
      <p className="text-[#9A99A6] dark:text-[#8E8D9B] mb-0.5">{label}</p>
      <p className="font-semibold text-[#111111] dark:text-white">
        {payload[0].value === 1 ? "✓ Done" : "✗ Missed"}
      </p>
    </div>
  );
};

/**
 * StatAreaChart — smooth cumulative/running completions as a shaded area.
 * data: [{ day: "01", value: 0 | 1, cumulative: number }, ...]
 */
export default function StatAreaChart({ data, label }) {
  const maxCum = data[data.length - 1]?.cumulative ?? 1;
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const gridColor = isDark ? "#22222A" : "#F1F1F5";
  const tickColor = isDark ? "#8E8D9B" : "#9A99A6";
  const cursorColor = isDark ? "#2C2C35" : "#E4E4ED";
  const activeDotStroke = isDark ? "#16161A" : "#fff";

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id={`areaGrad-${label}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#2DBFAE" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#2DBFAE" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id={`areaStroke-${label}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%"   stopColor="#C13A8A" />
              <stop offset="50%"  stopColor="#E8924A" />
              <stop offset="100%" stopColor="#2DBFAE" />
            </linearGradient>
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
            domain={[0, Math.max(maxCum, 5)]}
            tick={{ fontSize: 9, fill: tickColor }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: cursorColor }} />
          <Area
            type="monotone"
            dataKey="cumulative"
            stroke={`url(#areaStroke-${label})`}
            strokeWidth={2.5}
            fill={`url(#areaGrad-${label})`}
            dot={false}
            activeDot={{ r: 4.5, fill: "#2DBFAE", stroke: activeDotStroke, strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
