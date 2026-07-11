import { useState } from 'react'
import ModalShell from './ModalShell'
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

export default function NewTaskModal({ open, onClose }) {
  const [title, setTitle] = useState('')
  const theme = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      title="New task"
      subtitle="Create a task card from the same modal shell pattern."
      footer={(
        <>
          <button
            onClick={onClose}
            style={{
              fontFamily: tokens.typography.button.fontFamily,
              fontSize: tokens.typography.button.fontSize,
              color: tokens.colors.textSecondary,
            }}
            className="rounded-lg px-4 py-2 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            style={{
              fontFamily: tokens.typography.button.fontFamily,
              fontSize: tokens.typography.button.fontSize,
              backgroundColor: tokens.colors.brand.teal,
            }}
            className="rounded-lg px-4 py-2 font-medium text-white hover:opacity-90 transition-opacity"
          >
            Create
          </button>
        </>
      )}
    >
      <label className="space-y-2">
        <span
          style={{
            ...tokens.typography.label,
            color: tokens.colors.textMuted,
          }}
          className="block"
        >
          Title
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            fontFamily: tokens.typography.bodyMD.fontFamily,
            fontSize: tokens.typography.bodyMD.fontSize,
            backgroundColor: tokens.colors.surfaceSubtle,
            borderColor: tokens.colors.borderInput ?? tokens.colors.border,
            color: tokens.colors.textPrimary,
          }}
          className="w-full rounded-xl border px-3 py-2 outline-none"
          placeholder="Untitled task"
        />
      </label>
    </ModalShell>
  )
}
