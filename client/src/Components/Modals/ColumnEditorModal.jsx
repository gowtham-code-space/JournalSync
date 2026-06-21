import React, { useState, useEffect } from "react";
import { X, Trash2, SquareCheck, Hash, MessageSquare, BarChart3 } from "lucide-react";

const TYPE_OPTIONS = [
  { id: "box",     label: "Checkbox", icon: SquareCheck,  hint: "Tap to mark done"       },
  { id: "number",  label: "Number",   icon: Hash,          hint: "Free-form numeric value" },
  { id: "comment", label: "Comment",  icon: MessageSquare, hint: "Short text note"         },
];

/**
 * ColumnEditorModal
 * Add or edit a single dashboard table column. Every change (add, rename,
 * retype, delete) must declare a scope:
 *  - "all"         apply to every month (updates the global column set)
 *  - "this-month"  only affects the month currently being viewed
 *
 * Props:
 *  - open: boolean
 *  - onClose: () => void
 *  - column: { id, label, type, trackForAnalytics? } | null
 *  - monthLabel: string, e.g. "October 2023"
 *  - onSave: (columnData, scope) => void
 *  - onDelete: (columnId, scope) => void
 */
export default function ColumnEditorModal({
  open,
  onClose,
  column,
  monthLabel,
  onSave,
  onDelete,
}) {
  const isEditing = Boolean(column);
  const [label,             setLabel]             = useState("");
  const [type,              setType]              = useState("box");
  const [scope,             setScope]             = useState("all");
  const [trackForAnalytics, setTrackForAnalytics] = useState(false);

  useEffect(() => {
    if (open) {
      setLabel(column?.label ?? "");
      setType(column?.type ?? "box");
      setScope("all");
      setTrackForAnalytics(column?.trackForAnalytics ?? false);
    }
  }, [open, column]);

  if (!open) return null;

  const canSave = label.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave(
      {
        id: column?.id ?? label.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        label: label.trim(),
        type,
        trackForAnalytics,
      },
      scope
    );
    onClose();
  };

  const handleDelete = () => {
    if (!column) return;
    onDelete(column.id, scope);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#16161A] shadow-2xl border border-[#E7E7EC] dark:border-[#22222A] overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEEEF2] dark:border-[#22222A]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A99A6] dark:text-[#8E8D9B]">
              {isEditing ? "Edit column" : "New column"}
            </p>
            <h2
              className="text-[19px] font-semibold text-[#111111] dark:text-white mt-0.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {isEditing ? column.label : "Add a column"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-[#9A99A6] dark:text-[#8E8D9B] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Label */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B]">
              Column name
            </label>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Vocabulary"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-[#FAFAFC] dark:bg-[#25252E] px-3 py-2 text-[13px] text-[#111111] dark:text-white outline-none focus:ring-2 focus:ring-[#2DBFAE]/40"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B]">
              Column type
            </label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {TYPE_OPTIONS.map((opt) => {
                const Icon     = opt.icon;
                const selected = type === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setType(opt.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-[11px] font-medium transition-colors ${
                      selected
                        ? "border-[#2DBFAE] bg-[#2DBFAE]/10 dark:bg-[#2DBFAE]/20 text-[#111111] dark:text-white"
                        : "border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F5F5F7] dark:hover:bg-[#1E1E24]"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={selected ? "text-[#2DBFAE]" : "text-[#9A99A6] dark:text-[#8E8D9B]"}
                    />
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-[#9A99A6] dark:text-[#8E8D9B]">
              {TYPE_OPTIONS.find((o) => o.id === type)?.hint}
            </p>
          </div>

          {/* ── Track for Analytics toggle ── */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B]">
              Analytics tracking
            </label>
            <button
              type="button"
              onClick={() => setTrackForAnalytics((v) => !v)}
              className={`mt-1.5 w-full flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-200 ${
                trackForAnalytics
                  ? "border-[#2DBFAE] bg-[#2DBFAE]/8 dark:bg-[#2DBFAE]/12"
                  : "border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] hover:bg-[#F5F5F7] dark:hover:bg-[#1E1E24]"
              }`}
            >
              {/* pill toggle */}
              <div
                className={`relative h-5 w-9 rounded-full transition-colors duration-200 shrink-0 ${
                  trackForAnalytics ? "bg-[#2DBFAE]" : "bg-[#D9D9E3] dark:bg-[#3A3A42]"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    trackForAnalytics ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-[12.5px] font-medium text-[#111111] dark:text-white">
                  <BarChart3
                    size={13}
                    className={trackForAnalytics ? "text-[#2DBFAE]" : "text-[#9A99A6] dark:text-[#8E8D9B]"}
                  />
                  Track for Analytics
                </span>
                <span className="block text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B] mt-0.5">
                  {trackForAnalytics
                    ? "This column will appear in the Analytics breakdown"
                    : "This column is hidden from the Analytics page"}
                </span>
              </div>
            </button>
          </div>

          {/* Scope */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B]">
              Apply this change to
            </label>
            <div className="mt-1.5 space-y-2">
              <button
                type="button"
                onClick={() => setScope("all")}
                className={`w-full flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  scope === "all"
                    ? "border-[#2DBFAE] bg-[#2DBFAE]/5 dark:bg-[#2DBFAE]/10"
                    : "border-[#E4E4ED] dark:border-[#2C2C35] hover:bg-[#F5F5F7] dark:hover:bg-[#1E1E24]"
                }`}
              >
                <span
                  className={`mt-0.5 h-3.5 w-3.5 rounded-full border-2 shrink-0 ${
                    scope === "all"
                      ? "border-[#2DBFAE] bg-[#2DBFAE]"
                      : "border-[#C9C9D6] dark:border-[#3A3A42] bg-white dark:bg-[#16161A]"
                  }`}
                />
                <span className="text-[12.5px] text-[#111111] dark:text-white">
                  All months
                  <span className="block text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B]">
                    Updates the default column set everywhere
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setScope("this-month")}
                className={`w-full flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  scope === "this-month"
                    ? "border-[#2DBFAE] bg-[#2DBFAE]/5 dark:bg-[#2DBFAE]/10"
                    : "border-[#E4E4ED] dark:border-[#2C2C35] hover:bg-[#F5F5F7] dark:hover:bg-[#1E1E24]"
                }`}
              >
                <span
                  className={`mt-0.5 h-3.5 w-3.5 rounded-full border-2 shrink-0 ${
                    scope === "this-month"
                      ? "border-[#2DBFAE] bg-[#2DBFAE]"
                      : "border-[#C9C9D6] dark:border-[#3A3A42] bg-white dark:bg-[#16161A]"
                  }`}
                />
                <span className="text-[12.5px] text-[#111111] dark:text-white">
                  {monthLabel} only
                  <span className="block text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B]">
                    Leaves every other month unchanged
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#EEEEF2] dark:border-[#22222A] bg-[#FAFAFC] dark:bg-[#1C1C22]">
          {isEditing && (
            <button
              onClick={handleDelete}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#F0D0DC] dark:border-[#4B1E2E] text-[#C13A8A] hover:bg-[#C13A8A]/5 dark:hover:bg-[#C13A8A]/10 transition-colors shrink-0"
              aria-label="Delete column"
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] text-[#5B5B66] dark:text-[#A1A1AA] text-[13px] font-medium py-2.5 hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black text-[13px] font-medium py-2.5 hover:bg-[#2A2A2A] dark:hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}