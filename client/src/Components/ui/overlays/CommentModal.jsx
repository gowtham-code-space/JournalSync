import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button, IconButton } from "@/components/primitives";
import { useThemeStore } from "@/hooks/useThemeStore";
import { getUiTokens } from "../uiTokens";

export default function CommentModal({ open, onClose, value, columnLabel, dateLabel, onSave }) {
  const theme = useThemeStore((state) => state.theme);
  const tokens = getUiTokens(theme);
  const [text, setText] = useState(value);

  // Sync text when modal opens/changes value
  useEffect(() => {
    if (open) {
      setText(value);
    }
  }, [open, value]);

  if (!open) return null;

  const handleSave = () => {
    onSave(text);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      style={{ backgroundColor: `rgba(0, 0, 0, ${tokens.opacity.backdrop})` }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden"
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
              Entry for {dateLabel}
            </p>
            <h2
              className="mt-0.5"
              style={{ ...tokens.typography.headingMD, color: tokens.colors.textPrimary }}
            >
              {columnLabel || "Comment"}
            </h2>
          </div>
          <IconButton
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="rounded-full"
            aria-label="Close modal"
          >
            <X size={16} />
          </IconButton>
        </div>

        {/* Text Area */}
        <div className="px-6 py-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Type your ${columnLabel?.toLowerCase() || "comment"} here...`}
            autoFocus
            rows={6}
            className="w-full rounded-xl px-4 py-3 text-[14px] leading-relaxed outline-none transition-all resize-none"
            style={{
              backgroundColor: tokens.colors.surface,
              border: `1px solid ${tokens.colors.borderInput}`,
              color: tokens.colors.textPrimary,
            }}
          />
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 flex justify-end gap-2.5"
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
            variant="primary"
            size="sm"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
