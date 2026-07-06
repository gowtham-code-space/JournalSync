import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, IconButton } from "@/components/primitives";
import { useThemeStore } from "@/hooks/useThemeStore";
import { getUiTokens } from "../uiTokens";

export default function NewNoteModal({ open, onClose }) {
  const theme = useThemeStore((state) => state.theme);
  const tokens = getUiTokens(theme);
  const [noteTitle, setNoteTitle] = useState("");

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="w-full max-w-md pointer-events-auto overflow-hidden"
          style={{
            backgroundColor: tokens.colors.surface,
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.radius.xl,
            boxShadow: tokens.shadows.xxl,
          }}
        >
          <div
            className="flex items-center justify-between px-5 py-4"
            style={{ borderBottom: `1px solid ${tokens.colors.border}` }}
          >
            <h3 style={{ ...tokens.typography.headingSM, color: tokens.colors.textPrimary }}>New Note</h3>
            <IconButton variant="ghost" size="sm" onClick={onClose}>
              <X size={18} />
            </IconButton>
          </div>
          <div className="p-5">
            <input
              autoFocus
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full bg-transparent rounded-lg px-3 py-2 outline-none text-[14px]"
              style={{ border: `1px solid ${tokens.colors.borderInput}`, color: tokens.colors.textPrimary }}
            />
          </div>
          <div
            className="flex items-center justify-end gap-3 px-5 py-4"
            style={{ backgroundColor: tokens.colors.surfaceMuted, borderTop: `1px solid ${tokens.colors.border}` }}
          >
            <Button variant="text" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                // Handle save
                onClose();
              }}
            >
              Create Note
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
