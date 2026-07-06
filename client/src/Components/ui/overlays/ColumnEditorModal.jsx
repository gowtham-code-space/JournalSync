import React, { useState, useEffect } from "react";
import { X, Trash2, SquareCheck, Hash, MessageSquare, BarChart3 } from "lucide-react";
import { Button, IconButton } from "@/components/primitives";
import { useThemeStore } from "@/hooks/useThemeStore";
import { getUiTokens } from "../uiTokens";

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
  const theme = useThemeStore((state) => state.theme);
  const tokens = getUiTokens(theme);
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
      style={{ backgroundColor: `rgba(0, 0, 0, ${tokens.opacity.backdrop})` }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm overflow-hidden max-h-[90vh] overflow-y-auto"
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
          style={{ borderBottom: `1px solid ${tokens.colors.borderMuted}` }}
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: tokens.colors.textMuted }}>
              {isEditing ? "Edit column" : "New column"}
            </p>
            <h2
              className="mt-0.5"
              style={{ ...tokens.typography.headingMD, color: tokens.colors.textPrimary }}
            >
              {isEditing ? column.label : "Add a column"}
            </h2>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close"
          >
            <X size={16} />
          </IconButton>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Label */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: tokens.colors.textMuted }}>
              Column name
            </label>
            <input
              autoFocus
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Vocabulary"
              className="mt-1.5 w-full rounded-lg px-3 py-2 text-[13px] outline-none"
              style={{
                backgroundColor: tokens.colors.surfaceMuted,
                border: `1px solid ${tokens.colors.borderInput}`,
                color: tokens.colors.textPrimary,
              }}
            />
          </div>

          {/* Type */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: tokens.colors.textMuted }}>
              Column type
            </label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
                {TYPE_OPTIONS.map((opt) => {
                  const Icon = opt.icon;
                  const selected = type === opt.id;
                  const btnStyle = selected
                    ? { border: `1px solid ${tokens.colors.status.success}`, backgroundColor: tokens.colors.surfaceSubtle, color: tokens.colors.textPrimary }
                    : { border: `1px solid ${tokens.colors.borderInput}`, backgroundColor: tokens.colors.surface, color: tokens.colors.textSecondary };
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setType(opt.id)}
                      className="flex flex-col items-center gap-1.5 rounded-lg px-2 py-3 text-[11px] font-medium transition-colors"
                      style={btnStyle}
                    >
                      <Icon size={16} style={{ color: selected ? tokens.colors.status.success : tokens.colors.textMuted }} />
                      {opt.label}
                    </button>
                  );
                })}
            </div>
            <p className="mt-1.5 text-[11px]" style={{ color: tokens.colors.textMuted }}>
              {TYPE_OPTIONS.find((o) => o.id === type)?.hint}
            </p>
          </div>

          {/* ── Track for Analytics toggle ── */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: tokens.colors.textMuted }}>
              Analytics tracking
            </label>
            <button
              type="button"
              onClick={() => setTrackForAnalytics((v) => !v)}
              className="mt-1.5 w-full flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-all duration-200"
              style={{ border: `1px solid ${trackForAnalytics ? tokens.colors.status.success : tokens.colors.borderInput}`, backgroundColor: tokens.colors.surface }}
            >
              {/* pill toggle */}
              <div className="relative h-5 w-9 rounded-full transition-colors duration-200 shrink-0" style={{ backgroundColor: trackForAnalytics ? tokens.colors.status.success : tokens.colors.borderSubtle }}>
                <span className="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow" style={{ transform: trackForAnalytics ? 'translateX(16px)' : 'translateX(0)' }} />
              </div>

              <div className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5 text-[12.5px] font-medium" style={{ color: tokens.colors.textPrimary }}>
                  <BarChart3 size={13} style={{ color: trackForAnalytics ? tokens.colors.status.success : tokens.colors.textMuted }} />
                  Track for Analytics
                </span>
                <span className="block text-[10.5px] mt-0.5" style={{ color: tokens.colors.textMuted }}>
                  {trackForAnalytics
                    ? "This column will appear in the Analytics breakdown"
                    : "This column is hidden from the Analytics page"}
                </span>
              </div>
            </button>
          </div>

          {/* Scope */}
          <div>
            <label className="text-[10.5px] font-semibold uppercase tracking-[0.08em]" style={{ color: tokens.colors.textMuted }}>
              Apply this change to
            </label>
            <div className="mt-1.5 space-y-2">
              <button
                type="button"
                onClick={() => setScope("all")}
                className="w-full flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors"
                style={{ border: `1px solid ${scope === 'all' ? tokens.colors.status.success : tokens.colors.borderInput}`, backgroundColor: tokens.colors.surface }}
              >
                <span className="mt-0.5 h-3.5 w-3.5 rounded-full" style={{ border: `2px solid ${scope === 'all' ? tokens.colors.status.success : tokens.colors.borderSubtle}`, backgroundColor: scope === 'all' ? tokens.colors.status.success : tokens.colors.surface }} />
                <span style={{ color: tokens.colors.textPrimary }}>
                  All months
                  <span className="block" style={{ color: tokens.colors.textMuted, fontSize: '10.5px' }}>
                    Updates the default column set everywhere
                  </span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setScope("this-month")}
                className="w-full flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors"
                style={{ border: `1px solid ${scope === 'this-month' ? tokens.colors.status.success : tokens.colors.borderInput}`, backgroundColor: tokens.colors.surface }}
              >
                <span className="mt-0.5 h-3.5 w-3.5 rounded-full" style={{ border: `2px solid ${scope === 'this-month' ? tokens.colors.status.success : tokens.colors.borderSubtle}`, backgroundColor: scope === 'this-month' ? tokens.colors.status.success : tokens.colors.surface }} />
                <span style={{ color: tokens.colors.textPrimary }}>
                  {monthLabel} only
                  <span className="block" style={{ color: tokens.colors.textMuted, fontSize: '10.5px' }}>
                    Leaves every other month unchanged
                  </span>
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center gap-3 px-6 py-4"
          style={{ backgroundColor: tokens.colors.surfaceMuted, borderTop: `1px solid ${tokens.colors.borderMuted}` }}
        >
          {isEditing && (
            <IconButton
              variant="danger"
              size="sm"
              onClick={handleDelete}
              className="shrink-0"
              aria-label="Delete column"
            >
              <Trash2 size={15} />
            </IconButton>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            disabled={!canSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
