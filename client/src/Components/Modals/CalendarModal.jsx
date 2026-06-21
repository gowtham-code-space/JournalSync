import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * CalendarModal
 * Lightweight month + year picker — no day grid. Selecting a month/year
 * here just tells the dashboard which month's table data to display.
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - month: number (0-11) currently shown on the dashboard
 *  - year: number currently shown on the dashboard
 *  - onSelect: (month, year) => void — fired when "View month" is pressed
 */
export default function CalendarModal({ open, onClose, month, year, onSelect }) {
  const today = new Date();
  const [pendingMonth, setPendingMonth] = useState(month ?? today.getMonth());
  const [pendingYear, setPendingYear] = useState(year ?? today.getFullYear());

  // Re-sync local selection every time the modal opens
  useEffect(() => {
    if (open) {
      setPendingMonth(month ?? today.getMonth());
      setPendingYear(year ?? today.getFullYear());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  const apply = () => {
    onSelect(pendingMonth, pendingYear);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-[#E7E7EC] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEEEF2]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A99A6]">
              Switch table view
            </p>
            <h2
              className="text-[19px] font-semibold text-[#111111] mt-0.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Select month &amp; year
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-[#9A99A6] hover:bg-[#F1F1F5] transition-colors"
            aria-label="Close calendar"
          >
            <X size={16} />
          </button>
        </div>

        {/* Year switcher */}
        <div className="flex items-center justify-center gap-4 px-6 py-4 border-b border-[#EEEEF2] bg-[#FAFAFC]">
          <button
            onClick={() => setPendingYear((y) => y - 1)}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#E4E4ED] bg-white text-[#5B5B66] hover:bg-[#F1F1F5] transition-colors"
            aria-label="Previous year"
          >
            <ChevronLeft size={15} />
          </button>
          <span className="text-[15px] font-semibold font-mono text-[#111111] w-14 text-center">
            {pendingYear}
          </span>
          <button
            onClick={() => setPendingYear((y) => y + 1)}
            className="h-8 w-8 flex items-center justify-center rounded-lg border border-[#E4E4ED] bg-white text-[#5B5B66] hover:bg-[#F1F1F5] transition-colors"
            aria-label="Next year"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Month grid */}
        <div className="grid grid-cols-4 gap-2 px-6 py-5">
          {MONTH_ABBR.map((label, idx) => {
            const isSelected = idx === pendingMonth;
            const isCurrent =
              idx === today.getMonth() && pendingYear === today.getFullYear();
            return (
              <button
                key={label}
                onClick={() => setPendingMonth(idx)}
                className={`relative rounded-lg py-2.5 text-[12.5px] font-medium transition-colors ${
                  isSelected
                    ? "text-white"
                    : "text-[#5B5B66] bg-[#F5F5F7] hover:bg-[#EEEEF2]"
                }`}
                style={
                  isSelected
                    ? {
                        backgroundImage:
                          "linear-gradient(135deg, #C13A8A 0%, #E8924A 55%, #2DBFAE 100%)",
                      }
                    : undefined
                }
              >
                {label}
                {isCurrent && !isSelected && (
                  <span className="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full bg-[#2DBFAE]" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#EEEEF2] bg-[#FAFAFC]">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#E4E4ED] bg-white text-[#5B5B66] text-[13px] font-medium py-2.5 hover:bg-[#F1F1F5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={apply}
            className="flex-1 rounded-lg bg-[#111111] text-white text-[13px] font-medium py-2.5 hover:bg-[#2A2A2A] transition-colors"
          >
            View month
          </button>
        </div>
      </div>
    </div>
  );
}