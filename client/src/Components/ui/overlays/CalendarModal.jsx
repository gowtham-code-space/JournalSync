import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "@/theme/icons";
import { Button, IconButton } from "@/components/primitives";
import { useThemeStore } from "@/hooks/useThemeStore";
import { getUiTokens } from "../uiTokens";

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
  const theme = useThemeStore((state) => state.theme);
  const tokens = getUiTokens(theme);
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4"
      style={{ backgroundColor: `rgba(0, 0, 0, ${tokens.opacity.backdrop})` }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden"
        style={{
          backgroundColor: tokens.colors.surface,
          border: `1px solid ${tokens.colors.border}`,
          borderRadius: tokens.radius.xxl,
          boxShadow: tokens.shadows.xxl,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{
            borderBottom: `1px solid ${tokens.colors.borderMuted}`,
          }}
        >
          <div>
            <p
              className="text-[10px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: tokens.colors.textMuted }}
            >
              Switch table view
            </p>
            <h2
              className="mt-0.5"
              style={{
                ...tokens.typography.headingMD,
                color: tokens.colors.textPrimary,
              }}
            >
              Select month &amp; year
            </h2>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close calendar"
          >
            <X size={16} />
          </IconButton>
        </div>

        {/* Year switcher */}
        <div
          className="flex items-center justify-center gap-4 px-6 py-4"
          style={{
            backgroundColor: tokens.colors.surfaceMuted,
            borderBottom: `1px solid ${tokens.colors.borderMuted}`,
          }}
        >
          <IconButton
            variant="secondary"
            size="sm"
            onClick={() => setPendingYear((y) => y - 1)}
            aria-label="Previous year"
          >
            <ChevronLeft size={15} />
          </IconButton>
          <span
            className="w-14 text-center"
            style={{ color: tokens.colors.textPrimary, fontFamily: tokens.typography.fonts.mono, fontSize: tokens.typography.fontSizes.lg, fontWeight: tokens.typography.fontWeights.semibold }}
          >
            {pendingYear}
          </span>
          <IconButton
            variant="secondary"
            size="sm"
            onClick={() => setPendingYear((y) => y + 1)}
            aria-label="Next year"
          >
            <ChevronRight size={15} />
          </IconButton>
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
                    : ""
                }`}
                style={
                  isSelected
                    ? {
                        color: tokens.colors.surface,
                        backgroundImage:
                          `linear-gradient(135deg, ${tokens.colors.brand.pink} 0%, ${tokens.colors.brand.orange} 55%, ${tokens.colors.brand.teal} 100%)`,
                      }
                    : {
                        color: tokens.colors.textSecondary,
                        backgroundColor: tokens.colors.surfaceMuted,
                      }
                }
              >
                {label}
                {isCurrent && !isSelected && (
                  <span
                    className="absolute top-1 right-1.5 h-1.5 w-1.5 rounded-full"
                    style={{ backgroundColor: tokens.colors.brand }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-6 py-4"
          style={{
            backgroundColor: tokens.colors.surfaceMuted,
            borderTop: `1px solid ${tokens.colors.borderMuted}`,
          }}
        >
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="bg-[#111111] dark:bg:white text-white dark:text:black hover:bg-[#2A2A2A] dark:hover:bg-gray-100"
            onClick={apply}
          >
            View month
          </Button>
        </div>
      </div>
    </div>
  );
}