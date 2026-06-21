import React from "react";
import { useThemeStore } from "../../store/useThemeStore";

/**
 * StatPercentageRing — animated SVG radial ring showing completion %.
 * pct: 0-100
 * checked: number
 * total: number
 * label: column name
 */
export default function StatPercentageRing({ pct, checked, total, label }) {
  const theme = useThemeStore((state) => state.theme);
  const isDark = theme === "dark";
  const trackStrokeColor = isDark ? "#22222A" : "#EEEEF2";

  const radius      = 54;
  const stroke      = 9;
  const normalised  = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalised;
  const progress    = circumference - (pct / 100) * circumference;

  // gradient id must be unique per label to avoid SVG conflicts
  const gradId = `ringGrad-${label?.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <div className="w-full h-44 flex items-center justify-center gap-8">
      {/* SVG ring */}
      <div className="relative flex items-center justify-center">
        <svg width={radius * 2 + stroke} height={radius * 2 + stroke} className="-rotate-90">
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#C13A8A" />
              <stop offset="50%"  stopColor="#E8924A" />
              <stop offset="100%" stopColor="#2DBFAE" />
            </linearGradient>
          </defs>
          {/* track */}
          <circle
            cx={radius + stroke / 2}
            cy={radius + stroke / 2}
            r={normalised}
            fill="none"
            stroke={trackStrokeColor}
            strokeWidth={stroke}
          />
          {/* progress */}
          <circle
            cx={radius + stroke / 2}
            cy={radius + stroke / 2}
            r={normalised}
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            style={{ transition: "stroke-dashoffset 0.8s cubic-bezier(.4,0,.2,1)" }}
          />
        </svg>
        {/* centre label */}
        <div className="absolute flex flex-col items-center pointer-events-none">
          <span className="text-[22px] font-bold text-[#111111] dark:text-white leading-none">
            {pct}%
          </span>
          <span className="text-[9.5px] text-[#9A99A6] dark:text-[#8E8D9B] uppercase tracking-wide mt-0.5">
            done
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        <div>
          <p className="text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B] uppercase tracking-wide">Completed</p>
          <p className="text-[22px] font-bold text-[#2DBFAE] leading-none">{checked}</p>
          <p className="text-[10px] text-[#9A99A6] dark:text-[#8E8D9B]">of {total} days</p>
        </div>
        <div>
          <p className="text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B] uppercase tracking-wide">Missed</p>
          <p className="text-[18px] font-bold text-[#C13A8A] leading-none">{total - checked}</p>
        </div>
      </div>
    </div>
  );
}
