import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
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
 * StatLineChart — daily 0/1 completion over the month as a smooth step line.
 * data: [{ day: "01", value: 0 | 1 }, ...]
 */
export default function StatLineChart({ data, color = "#2DBFAE", label }) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";

  const gridColor = isDark ? "#22222A" : "#F1F1F5";
  const tickColor = isDark ? "#8E8D9B" : "#9A99A6";
  const cursorColor = isDark ? "#2C2C35" : "#E4E4ED";
  const referenceColor = isDark ? "#22222A" : "#EEEEF2";
  const strokeColor = isDark ? "#16161A" : "#fff";
  const missedDotFill = isDark ? "#25252E" : "#E7E8F3";
  const missedDotStroke = isDark ? "#2C2C35" : "#C3C3D1";

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
          <defs>
            <linearGradient id={`lineGrad-${label}`} x1="0" y1="0" x2="1" y2="0">
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
            domain={[-0.1, 1.1]}
            ticks={[0, 1]}
            tickFormatter={(v) => (v === 1 ? "✓" : "✗")}
            tick={{ fontSize: 10, fill: tickColor }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine y={0.5} stroke={referenceColor} strokeDasharray="4 4" />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: cursorColor }} />
          <Line
            type="monotone"
            dataKey="value"
            stroke={`url(#lineGrad-${label})`}
            strokeWidth={2.5}
            dot={(props) => {
              const { cx, cy, payload } = props;
              if (payload.value === 1)
                return <circle key={cx} cx={cx} cy={cy} r={3.5} fill="#2DBFAE" stroke={strokeColor} strokeWidth={1.5} />;
              return <circle key={cx} cx={cx} cy={cy} r={2} fill={missedDotFill} stroke={missedDotStroke} strokeWidth={1} />;
            }}
            activeDot={{ r: 5, fill: "#2DBFAE", stroke: strokeColor, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
