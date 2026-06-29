import React, { useState } from "react";
import { X } from "lucide-react";

export default function NewNoteModal({ open, onClose }) {
  const [noteTitle, setNoteTitle] = useState("");

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div className="bg-white dark:bg-[#16161A] w-full max-w-md rounded-xl shadow-2xl pointer-events-auto border border-[#E7E7EC] dark:border-[#22222A] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E7E7EC] dark:border-[#22222A]">
            <h3 className="font-semibold text-[#111111] dark:text-white">New Note</h3>
            <button onClick={onClose} className="text-[#9A99A6] hover:text-[#111111] dark:hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="p-5">
            <input
              autoFocus
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
              placeholder="Note Title"
              className="w-full bg-transparent border border-[#E4E4ED] dark:border-[#2C2C35] rounded-lg px-3 py-2 outline-none focus:border-[#2DBFAE] dark:focus:border-[#2DBFAE] text-[14px]"
            />
          </div>
          <div className="flex items-center justify-end gap-3 px-5 py-4 bg-[#FAFAFC] dark:bg-[#1C1C22] border-t border-[#E7E7EC] dark:border-[#22222A]">
            <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-[#6B6B76] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white transition-colors">
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle save
                onClose();
              }}
              className="px-4 py-2 text-[13px] font-medium bg-[#2DBFAE] text-white rounded-lg hover:bg-[#25A090] transition-colors"
            >
              Create Note
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
