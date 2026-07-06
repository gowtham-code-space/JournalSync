import { X } from 'lucide-react'

export default function ModalShell({ open, title, subtitle, onClose, children, footer }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#E7E7EC] bg-white shadow-2xl dark:border-[#22222A] dark:bg-[#16161A]">
        <div className="flex items-start justify-between gap-4 border-b border-[#E7E7EC] px-5 py-4 dark:border-[#22222A]">
          <div>
            <h3 className="text-[16px] font-semibold text-[#111111] dark:text-white">{title}</h3>
            {subtitle ? <p className="mt-1 text-[12px] text-[#6B6B76] dark:text-[#A1A1AA]">{subtitle}</p> : null}
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#6B6B76] hover:bg-[#F1F1F5] dark:text-[#A1A1AA] dark:hover:bg-[#1E1E24]"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {footer ? <div className="flex items-center justify-end gap-2 border-t border-[#E7E7EC] px-5 py-4 dark:border-[#22222A]">{footer}</div> : null}
      </div>
    </div>
  )
}