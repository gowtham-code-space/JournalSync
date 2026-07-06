import { useState } from 'react'
import ModalShell from './ModalShell'

export default function NewTaskModal({ open, onClose }) {
  const [title, setTitle] = useState('')

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="New task"
      subtitle="Create a task card from the same modal shell pattern."
      footer={(
        <>
          <button onClick={onClose} className="rounded-lg px-4 py-2 text-[13px] text-[#6B6B76] hover:bg-[#F1F1F5] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24]">Cancel</button>
          <button onClick={onClose} className="rounded-lg bg-[#2DBFAE] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#25A090]">Create</button>
        </>
      )}
    >
      <label className="space-y-2">
        <span className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9A99A6] dark:text-[#8E8D9B]">Title</span>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-[#E4E4ED] bg-[#FAFAFC] px-3 py-2 text-[13px] text-[#111111] outline-none dark:border-[#2C2C35] dark:bg-[#1C1C22] dark:text-white" placeholder="Untitled task" />
      </label>
    </ModalShell>
  )
}import React, { useState } from "react";
import { X } from "lucide-react";
import { Button, IconButton } from "@/components/primitives";
import { useThemeStore } from "@/hooks/useThemeStore";
import { getUiTokens } from "../uiTokens";

export default function NewTaskModal({ open, onClose }) {
  const theme = useThemeStore((state) => state.theme);
  const tokens = getUiTokens(theme);
  const [taskTitle, setTaskTitle] = useState("");

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
            <h3 style={{ ...tokens.typography.headingSM, color: tokens.colors.textPrimary }}>New Task</h3>
            <IconButton variant="ghost" size="sm" onClick={onClose}>
              <X size={18} />
            </IconButton>
          </div>
          <div className="p-5">
            <input
              autoFocus
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="What needs to be done?"
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
                onClose();
              }}
            >
              Add Task
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
