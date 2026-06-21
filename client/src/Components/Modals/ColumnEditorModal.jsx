import React, { useState, useEffect } from "react";
import { X, Trash2, SquareCheck, Hash, MessageSquare } from "lucide-react";

const TYPE_OPTIONS = [
  { id: "box", label: "Checkbox", icon: SquareCheck, hint: "Tap to mark done" },
  { id: "number", label: "Number", icon: Hash, hint: "Free-form numeric value" },
  { id: "comment", label: "Comment", icon: MessageSquare, hint: "Short text note" },
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
 *  - column: { id, label, type } | null  (null when adding a new column)
 *  - monthLabel: string, e.g. "October 2023" — used in the scope copy
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
  const [label, setLabel] = useState("");
  const [type, setType] = useState("box");
  const [scope, setScope] = useState("all");

  useEffect(() => {
    if (open) {
      setLabel(column?.label ?? "");
      setType(column?.type ?? "box");
      setScope("all");
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white shadow-2xl border border-[#E7E7EC] overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEEEF2]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A99A6]">
              {isEditing ? "Edit column" : "New column"}
            </p>
            <h2
              className="text-[19px] font-semibold text-[#111111] mt-0.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {isEditing ? column.label : "Add a column"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-[#9A99A6] hover:bg-[#F1F1F5] transition-colors"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Label */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6]">
              Column name
            </label>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Vocabulary"
              className="mt-1.5 w-full rounded-lg border border-[#E4E4ED] bg-[#FAFAFC] px-3 py-2 text-[13px] text-[#111111] outline-none focus:ring-2 focus:ring-[#2DBFAE]/40"
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6]">
              Column type
            </label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {TYPE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const selected = type === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setType(opt.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-[11px] font-medium transition-colors ${
                      selected
                        ? "border-[#2DBFAE] bg-[#2DBFAE]/10 text-[#111111]"
                        : "border-[#E4E4ED] bg-white text-[#6B6B76] hover:bg-[#F5F5F7]"
                    }`}
                  >
                    <Icon
                      size={16}
                      className={selected ? "text-[#2DBFAE]" : "text-[#9A99A6]"}
                    />
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11px] text-[#9A99A6]">
              {TYPE_OPTIONS.find((o) => o.id === type)?.hint}
            </p>
          </div>

          {/* Scope */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6]">
              Apply this change to
            </label>
            <div className="mt-1.5 space-y-2">
              <button
                type="button"
                onClick={() => setScope("all")}
                className={`w-full flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  scope === "all"
                    ? "border-[#2DBFAE] bg-[#2DBFAE]/5"
                    : "border-[#E4E4ED] hover:bg-[#F5F5F7]"
                }`}
              >
                <span
                  className={`mt-0.5 h-3.5 w-3.5 rounded-full border-2 shrink-0 ${
                    scope === "all"
                      ? "border-[#2DBFAE] bg-[#2DBFAE]"
                      : "border-[#C9C9D6] bg-white"
                  }`}
                />
                <span className="text-[12.5px] text-[#111111]">
                  All months
                  <span className="block text-[10.5px] text-[#9A99A6]">
                    Updates the default column set everywhere
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setScope("this-month")}
                className={`w-full flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  scope === "this-month"
                    ? "border-[#2DBFAE] bg-[#2DBFAE]/5"
                    : "border-[#E4E4ED] hover:bg-[#F5F5F7]"
                }`}
              >
                <span
                  className={`mt-0.5 h-3.5 w-3.5 rounded-full border-2 shrink-0 ${
                    scope === "this-month"
                      ? "border-[#2DBFAE] bg-[#2DBFAE]"
                      : "border-[#C9C9D6] bg-white"
                  }`}
                />
                <span className="text-[12.5px] text-[#111111]">
                  {monthLabel} only
                  <span className="block text-[10.5px] text-[#9A99A6]">
                    Leaves every other month unchanged
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4 border-t border-[#EEEEF2] bg-[#FAFAFC]">
          {isEditing && (
            <button
              onClick={handleDelete}
              className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#F0D0DC] text-[#C13A8A] hover:bg-[#C13A8A]/5 transition-colors shrink-0"
              aria-label="Delete column"
            >
              <Trash2 size={15} />
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-[#E4E4ED] bg-white text-[#5B5B66] text-[13px] font-medium py-2.5 hover:bg-[#F1F1F5] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 rounded-lg bg-[#111111] text-white text-[13px] font-medium py-2.5 hover:bg-[#2A2A2A] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}