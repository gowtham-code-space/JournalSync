import React, { useState } from "react";
import { X, Flame, Target, Lightbulb, Plus, Trash2, ChevronDown } from "lucide-react";

const ICONS = [Flame, Target, Lightbulb];
const ICON_LABELS = ["Flame", "Target", "Lightbulb"];

const GRADIENTS = [
  "linear-gradient(90deg, #C13A8A 0%, #E8924A 100%)",
  "linear-gradient(90deg, #E8924A 0%, #2DBFAE 100%)",
  "linear-gradient(90deg, #2DBFAE 0%, #C13A8A 100%)",
  "linear-gradient(90deg, #C3C4DC 0%, #C3C4DC 100%)",
];

const TYPE_OPTIONS = [
  { value: "progress", label: "Progress bar" },
  { value: "box", label: "Checkbox" },
  { value: "comment", label: "Comment" },
];

const DEFAULT_MILESTONES = [
  {
    id: 1,
    title: "Spanish Fluency",
    iconIdx: 0,
    type: "progress",
    progress: 62,
    detail: "2 of 5 weekly sessions logged this month",
    gradientIdx: 0,
    comment: "",
    checked: false,
  },
  {
    id: 2,
    title: "Project Alpha",
    iconIdx: 1,
    type: "progress",
    progress: 78,
    detail: "78% complete — on track for Oct 28 deadline",
    gradientIdx: 1,
    comment: "",
    checked: false,
  },
  {
    id: 3,
    title: "Ideas & Backlog",
    iconIdx: 2,
    type: "comment",
    progress: 14,
    detail: "Create a subtitle generator — not started",
    gradientIdx: 3,
    comment: "Create a subtitle generator",
    checked: false,
  },
];

function AddMilestoneForm({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("progress");
  const [iconIdx, setIconIdx] = useState(0);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAdd({
      id: Date.now(),
      title: title.trim(),
      iconIdx,
      type,
      progress: 0,
      detail: "",
      gradientIdx: Math.floor(Math.random() * 3),
      comment: "",
      checked: false,
    });
  };

  return (
    <div className="rounded-xl border border-[#2DBFAE]/30 dark:border-[#2DBFAE]/40 bg-[#F0FDFB] dark:bg-[#0D2826] px-4 py-4 space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2DBFAE]">
        New milestone
      </p>

      {/* Title */}
      <div>
        <label className="text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B] block mb-1">Name</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Read 12 books"
          autoFocus
          className="w-full rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] px-3 py-2 text-[13px] text-[#111111] dark:text-white placeholder:text-[#C3C3D1] dark:placeholder:text-[#666] outline-none focus:border-[#2DBFAE] transition-colors"
        />
      </div>

      {/* Type */}
      <div>
        <label className="text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B] block mb-1">Type</label>
        <div className="flex gap-2">
          {TYPE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setType(opt.value)}
              className={`flex-1 rounded-lg border py-1.5 text-[11.5px] font-medium transition-colors ${
                type === opt.value
                  ? "border-[#2DBFAE] bg-[#2DBFAE] text-white"
                  : "border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Icon */}
      <div>
        <label className="text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B] block mb-1">Icon</label>
        <div className="flex gap-2">
          {ICONS.map((Icon, idx) => (
            <button
              key={idx}
              onClick={() => setIconIdx(idx)}
              className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors ${
                iconIdx === idx
                  ? "border-[#2DBFAE] bg-[#2DBFAE]/10 dark:bg-[#2DBFAE]/20"
                  : "border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24]"
              }`}
            >
              <Icon size={14} className={iconIdx === idx ? "text-[#2DBFAE]" : "text-[#9A99A6] dark:text-[#8E8D9B]"} />
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 rounded-lg border border-[#E4E4ED] dark:border-[#2C2C35] bg-white dark:bg-[#16161A] text-[12.5px] font-medium text-[#6B6B76] dark:text-[#A1A1AA] py-2 hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="flex-1 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black text-[12.5px] font-medium py-2 hover:bg-[#2A2A2A] dark:hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
    </div>
  );
}

function MilestoneItem({ m, onDelete, onUpdate }) {
  const Icon = ICONS[m.iconIdx] ?? Flame;

  return (
    <div className="rounded-xl border border-[#EEEEF2] dark:border-[#22222A] bg-white dark:bg-[#1C1C22] px-4 py-3.5">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-[#E8EAF6] dark:bg-[#25252E] flex items-center justify-center shrink-0">
          <Icon size={15} className="text-[#5B5B9A] dark:text-[#8E8D9B]" strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[13.5px] font-semibold text-[#111111] dark:text-white truncate">
              {m.title}
            </p>
            <div className="flex items-center gap-1 shrink-0">
              {m.type === "progress" && (
                <span className="text-[12px] font-mono text-[#5B5B66] dark:text-[#A1A1AA]">
                  {m.progress}%
                </span>
              )}
              <button
                onClick={() => onDelete(m.id)}
                className="h-6 w-6 flex items-center justify-center rounded-md text-[#C3C3D1] dark:text-[#7C7C8A] hover:text-[#C13A8A] hover:bg-[#FFF0F5] dark:hover:bg-[#4B1E2E]/10 transition-colors"
                aria-label={`Delete ${m.title}`}
              >
                <Trash2 size={11} />
              </button>
            </div>
          </div>

          {/* Type-specific content */}
          {m.type === "comment" && (
            <input
              type="text"
              value={m.comment}
              onChange={(e) => onUpdate(m.id, { comment: e.target.value })}
              placeholder="Add a note..."
              className="mt-1 w-full text-[11.5px] italic text-[#9A99A6] dark:text-[#8E8D9B] placeholder:text-[#C3C3D1] dark:placeholder:text-[#666] bg-transparent outline-none border-b border-transparent focus:border-[#E4E4ED] dark:focus:border-[#2C2C35] transition-colors"
            />
          )}

          {m.type === "box" && (
            <div className="flex items-center gap-2 mt-1">
              <button
                onClick={() => onUpdate(m.id, { checked: !m.checked })}
                aria-pressed={m.checked}
                className={`h-4 w-4 rounded-[4px] border transition-colors shrink-0 ${
                  m.checked
                    ? "bg-[#2DBFAE] border-[#2DBFAE]"
                    : "bg-[#E7E8F3] dark:bg-[#25252E] border-[#E7E8F3] dark:border-[#2C2C35] hover:bg-[#DADBF0] dark:hover:bg-[#2F2F39]"
                }`}
              />
              <span className="text-[11.5px] text-[#9A99A6] dark:text-[#8E8D9B]">
                {m.checked ? "Completed" : "Mark complete"}
              </span>
            </div>
          )}

          {m.type !== "comment" && m.type !== "box" && (
            <p className="text-[11.5px] text-[#9A99A6] dark:text-[#8E8D9B] mt-0.5 truncate">
              {m.detail}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar — only for progress type */}
      {m.type === "progress" && (
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full bg-[#EEEEF2] dark:bg-[#25252E] overflow-hidden relative">
            <div
              className="h-full rounded-full"
              style={{
                width: `${m.progress}%`,
                backgroundImage: GRADIENTS[m.gradientIdx] ?? GRADIENTS[0],
              }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={m.progress}
            onChange={(e) => onUpdate(m.id, { progress: Number(e.target.value) })}
            className="w-full mt-1 accent-[#2DBFAE] cursor-pointer"
            style={{ height: "4px" }}
          />
        </div>
      )}
    </div>
  );
}

export default function MilestoneModal({ open, onClose }) {
  const [milestones, setMilestones] = useState(DEFAULT_MILESTONES);
  const [adding, setAdding] = useState(false);

  if (!open) return null;

  const handleAdd = (newMilestone) => {
    setMilestones((prev) => [...prev, newMilestone]);
    setAdding(false);
  };

  const handleDelete = (id) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  const handleUpdate = (id, patch) => {
    setMilestones((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...patch } : m))
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-[#16161A] shadow-2xl border border-[#E7E7EC] dark:border-[#22222A] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#EEEEF2] dark:border-[#22222A]">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#9A99A6] dark:text-[#8E8D9B]">
              October 2023
            </p>
            <h2
              className="text-[19px] font-semibold text-[#111111] dark:text-white mt-0.5"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Monthly Milestones
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-full text-[#9A99A6] dark:text-[#8E8D9B] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors"
            aria-label="Close milestones"
          >
            <X size={16} />
          </button>
        </div>

        {/* List */}
        <div className="px-6 py-5 space-y-3 max-h-[60vh] overflow-y-auto">
          {milestones.map((m) => (
            <MilestoneItem
              key={m.id}
              m={m}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}

          {milestones.length === 0 && !adding && (
            <p className="text-center text-[12.5px] text-[#9A99A6] dark:text-[#8E8D9B] py-6">
              No milestones yet. Add one below.
            </p>
          )}

          {adding && (
            <AddMilestoneForm
              onAdd={handleAdd}
              onCancel={() => setAdding(false)}
            />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#EEEEF2] dark:border-[#22222A] bg-[#FAFAFC] dark:bg-[#1C1C22] flex gap-2">
          {!adding && (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-1.5 rounded-lg border border-dashed border-[#D4D4DE] dark:border-[#2C2C35] text-[#6B6B76] dark:text-[#A1A1AA] text-[12.5px] font-medium px-4 py-2.5 hover:border-[#2DBFAE] hover:text-[#2DBFAE] transition-colors"
            >
              <Plus size={13} />
              Add milestone
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-[#111111] dark:bg-white text-white dark:text-black text-[13px] font-medium py-2.5 hover:bg-[#2A2A2A] dark:hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}