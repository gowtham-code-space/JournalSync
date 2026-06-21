import React from "react";
import { useThemeStore } from "../../store/useThemeStore";

/**
 * StatHeatmap — monthly activity heatmap grid (like GitHub contributions).
 * data: [{ day: "01", value: 0 | 1 }, ...]  (31 entries max)
 * label: column name
 */
export default function StatHeatmap({ data, label }) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const missedColor = isDark ? "#25252E" : "#E7E8F3";

  // Build a 7-col grid. We'll show all days in row-by-row grid.
  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push(data.slice(i, i + 7));
  }

  return (
    <div className="w-full h-44 flex flex-col justify-center px-2">
      <div className="flex gap-1.5 justify-center flex-wrap">
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1.5">
            {week.map((d, di) => (
              <div
                key={di}
                title={`Day ${d.day}: ${d.value ? "Done ✓" : "Missed ✗"}`}
                className="h-5 w-5 rounded-[4px] transition-colors duration-200"
                style={{
                  background: d.value
                    ? "linear-gradient(135deg, #C13A8A 0%, #E8924A 55%, #2DBFAE 100%)"
                    : missedColor,
                  opacity: d.value ? 1 : 0.6,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {/* legend */}
      <div className="flex items-center justify-center gap-3 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm opacity-60" style={{ backgroundColor: missedColor }} />
          <span className="text-[10px] text-[#9A99A6] dark:text-[#8E8D9B]">Missed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 rounded-sm"
            style={{
              background:
                "linear-gradient(135deg, #C13A8A 0%, #E8924A 55%, #2DBFAE 100%)",
            }}
          />
          <span className="text-[10px] text-[#9A99A6] dark:text-[#8E8D9B]">Done</span>
        </div>
      </div>
    </div>
  );
}
