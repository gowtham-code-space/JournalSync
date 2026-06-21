import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useThemeStore } from "../../store/useThemeStore";

const COLORS = ["#2DBFAE", "#E7E8F3"];
const RADIAN = Math.PI / 180;

const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const r  = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x  = cx + r * Math.cos(-midAngle * RADIAN);
  const y  = cy + r * Math.sin(-midAngle * RADIAN);
  if (percent < 0.08) return null;
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${Math.round(percent * 100)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] shadow-lg px-3 py-2 text-[11.5px]">
      <p className="font-semibold text-[#111111] dark:text-white">{payload[0].name}</p>
      <p className="text-[#9A99A6] dark:text-[#8E8D9B]">{payload[0].value} days</p>
    </div>
  );
};

/**
 * StatPieChart — done vs missed split as a donut pie.
 * checked: number of done days
 * total: total days in the month
 */
export default function StatPieChart({ checked, total }) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const missedColor = isDark ? "#25252E" : "#E7E8F3";
  const legendColor = isDark ? "#8E8D9B" : "#9A99A6";

  const missed = total - checked;
  const pieData = [
    { name: "Done",   value: checked },
    { name: "Missed", value: missed  },
  ];

  return (
    <div className="w-full h-44">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <defs>
            <linearGradient id="pieGradDone" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%"   stopColor="#C13A8A" />
              <stop offset="50%"  stopColor="#E8924A" />
              <stop offset="100%" stopColor="#2DBFAE" />
            </linearGradient>
          </defs>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={42}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            <Cell fill="url(#pieGradDone)" />
            <Cell fill={missedColor} />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: "11px", color: legendColor }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
