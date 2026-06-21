import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function CommentModal({ open, onClose, value, columnLabel, dateLabel, onSave }) {
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
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#16161A] shadow-2xl border border-[#E7E7EC] dark:border-[#22222A] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEEEF2] dark:border-[#22222A]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A99A6] dark:text-[#8E8D9B]">
              Entry for {dateLabel}
            </p>
            <h2
              className="text-[19px] font-semibold text-[#111111] dark:text-white mt-0.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {columnLabel || "Comment"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-[#9A99A6] dark:text-[#8E8D9B] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Text Area */}
        <div className="px-6 py-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Type your ${columnLabel?.toLowerCase() || "comment"} here...`}
            autoFocus
            rows={6}
            className="w-full rounded-xl border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#25252E] px-4 py-3 text-[14px] leading-relaxed text-[#111111] dark:text-white placeholder:text-[#C3C3D1] dark:placeholder:text-[#666] outline-none focus:border-[#2DBFAE] focus:ring-2 focus:ring-[#2DBFAE]/20 transition-all resize-none"
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EEEEF2] dark:border-[#22222A] bg-[#FAFAFC] dark:bg-[#1C1C22] flex justify-end gap-2.5">
          <button
            onClick={onClose}
            className="rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] text-[12.5px] font-medium text-[#6B6B76] dark:text-[#A1A1AA] px-4 py-2 hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="rounded-lg bg-[#2DBFAE] hover:bg-[#25a394] text-white text-[12.5px] font-medium px-4 py-2 transition-colors shadow-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
