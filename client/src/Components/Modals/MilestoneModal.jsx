import React from "react";
import { X, Flame, Target, Lightbulb } from "lucide-react";

/**
 * MilestoneModal
 * Shows the full monthly milestones list with progress for each.
 * Controlled by parent via `open` / `onClose`.
 */
export default function MilestoneModal({ open, onClose }) {
  if (!open) return null;

  const milestones = [
    {
      id: 1,
      title: "Spanish Fluency",
      icon: Flame,
      progress: 62,
      detail: "2 of 5 weekly sessions logged this month",
      tone: "complete",
    },
    {
      id: 2,
      title: "Project Alpha",
      icon: Target,
      progress: 78,
      detail: "78% complete \u2014 on track for Oct 28 deadline",
      tone: "active",
    },
    {
      id: 3,
      title: "Ideas & Backlog",
      icon: Lightbulb,
      progress: 14,
      detail: "Create a subtitle generator \u2014 not started",
      tone: "idle",
    },
  ];

  const toneRing = {
    complete: "bg-[#3E7A4C]",
    active: "bg-[#6FAE3C]",
    idle: "bg-[#D8D3C4]",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-[#FBFAF6] shadow-2xl border border-[#E4E0D3] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E9E5D8]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#8B8470]">
              October 2023
            </p>
            <h2 className="text-[17px] font-semibold text-[#1F2A1F] mt-0.5">
              Monthly Milestones
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-[#8B8470] hover:bg-[#EFEBDD] transition-colors"
            aria-label="Close milestones"
          >
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {milestones.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="rounded-xl border border-[#E9E5D8] bg-white px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-[#EFF4EA] flex items-center justify-center shrink-0">
                    <Icon size={15} className="text-[#3E7A4C]" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[13.5px] font-semibold text-[#1F2A1F] truncate">
                        {m.title}
                      </p>
                      <span className="text-[12px] font-mono text-[#5C6B57] shrink-0">
                        {m.progress}%
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#8B8470] mt-0.5 truncate">
                      {m.detail}
                    </p>
                  </div>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-[#EEEAE0] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${toneRing[m.tone]}`}
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E9E5D8] bg-[#F5F2E9]">
          <button
            onClick={onClose}
            className="w-full rounded-lg bg-[#1F2A1F] text-white text-[13px] font-medium py-2.5 hover:bg-[#16201A] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
