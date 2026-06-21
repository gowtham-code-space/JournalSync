import React, { useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const COLUMNS = ["English", "Comm.", "Technical", "Reading", "Speak"];

// Deterministic pseudo-random task completion so the grid feels alive
// without needing a backend. Seeded by day + column + month so it's stable.
function seededLevel(day, monthIndex, colIdx) {
  const seed = (day * 31 + colIdx * 17 + monthIndex * 7) % 10;
  if (seed < 3) return 0; // empty
  if (seed < 6) return 1; // light
  if (seed < 8) return 2; // medium
  return 3; // full
}

const levelClass = {
  0: "bg-[#EDEAE0]",
  1: "bg-[#C3DDA6]",
  2: "bg-[#8FC15B]",
  3: "bg-[#5C9A35]",
};

function daysInMonth(monthIndex, year) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export default function CalendarModal({ open, onClose }) {
  const today = new Date();
  const [monthIndex, setMonthIndex] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  const totalDays = useMemo(() => daysInMonth(monthIndex, year), [monthIndex, year]);
  const days = useMemo(
    () => Array.from({ length: totalDays }, (_, i) => i + 1),
    [totalDays]
  );

  if (!open) return null;

  const shiftMonth = (delta) => {
    let m = monthIndex + delta;
    let y = year;
    if (m < 0) {
      m = 11;
      y -= 1;
    } else if (m > 11) {
      m = 0;
      y += 1;
    }
    setMonthIndex(m);
    setYear(y);
  };

  const years = Array.from({ length: 11 }, (_, i) => today.getFullYear() - 5 + i);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl rounded-2xl bg-[#FBFAF6] shadow-2xl border border-[#E4E0D3] overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E9E5D8] shrink-0">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8B8470]">
              Full month view
            </p>
            <h2 className="text-[17px] font-semibold text-[#1F2A1F] mt-0.5">
              Select month & year
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-[#8B8470] hover:bg-[#EFEBDD] transition-colors"
            aria-label="Close calendar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#E9E5D8] shrink-0 bg-[#F8F6EF]">
          <button
            onClick={() => shiftMonth(-1)}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#E4E0D3] bg-white text-[#5C6B57] hover:bg-[#EFEBDD] transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={15} />
          </button>

          <select
            value={monthIndex}
            onChange={(e) => setMonthIndex(Number(e.target.value))}
            className="rounded-lg border border-[#E4E0D3] bg-white px-3 py-1.5 text-[13px] font-medium text-[#1F2A1F] focus:outline-none focus:ring-2 focus:ring-[#8FC15B]/40"
          >
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx}>
                {name}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="rounded-lg border border-[#E4E0D3] bg-white px-3 py-1.5 text-[13px] font-medium text-[#1F2A1F] focus:outline-none focus:ring-2 focus:ring-[#8FC15B]/40"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button
            onClick={() => shiftMonth(1)}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#E4E0D3] bg-white text-[#5C6B57] hover:bg-[#EFEBDD] transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={15} />
          </button>

          <span className="ml-auto text-[11.5px] text-[#8B8470] font-mono">
            {totalDays} days
          </span>
        </div>

        {/* Grid */}
        <div className="overflow-auto px-6 py-5 flex-1">
          <div className="inline-block min-w-full">
            <table className="border-collapse" style={{ borderSpacing: 0 }}>
              <thead>
                <tr>
                  <th className="sticky left-0 bg-[#FBFAF6] text-left pr-4 pb-2 align-bottom">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#8B8470]">
                      Day
                    </span>
                  </th>
                  {COLUMNS.map((col) => (
                    <th key={col} className="pb-2 align-bottom" style={{ width: 22, padding: 0 }}>
                      <div
                        className="text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[#8B8470] whitespace-nowrap mx-auto"
                        style={{
                          writingMode: "vertical-rl",
                          transform: "rotate(180deg)",
                          height: "62px",
                          width: "18px",
                        }}
                      >
                        {col}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {days.map((day) => {
                  const isToday =
                    day === today.getDate() &&
                    monthIndex === today.getMonth() &&
                    year === today.getFullYear();
                  return (
                    <tr key={day}>
                      <td
                        className={`sticky left-0 bg-[#FBFAF6] pr-4 text-[11.5px] font-mono whitespace-nowrap ${
                          isToday ? "text-[#3E7A4C] font-semibold" : "text-[#5C6B57]"
                        }`}
                        style={{ height: 19, padding: "0 16px 0 0" }}
                      >
                        {MONTH_ABBR[monthIndex]} {String(day).padStart(2, "0")}
                      </td>
                      {COLUMNS.map((col, colIdx) => {
                        const level = seededLevel(day, monthIndex, colIdx);
                        return (
                          <td key={col} style={{ width: 22, padding: "1px 2px" }}>
                            <div
                              title={`${col}: ${["No data", "Light", "Medium", "Full"][level]}`}
                              className={`h-[17px] w-[17px] rounded-[3px] ${levelClass[level]}`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer legend */}
        <div className="flex items-center gap-4 px-6 py-3.5 border-t border-[#E9E5D8] bg-[#F8F6EF] shrink-0">
          <span className="text-[11px] text-[#8B8470]">Legend:</span>
          {[0, 1, 2, 3].map((lvl) => (
            <div key={lvl} className="flex items-center gap-1.5">
              <div className={`h-[12px] w-[12px] rounded-[3px] ${levelClass[lvl]}`} />
              <span className="text-[10.5px] text-[#8B8470]">
                {["None", "Light", "Medium", "Full"][lvl]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
