import React, { useState } from "react";
import {
Search,
Bell,
Settings,
LayoutGrid,
BarChart3,
Calendar,
SlidersHorizontal,
Plus,
ChevronRight,
} from "lucide-react";
import MilestoneModal from "../../Components/Modals/MilestoneModal";
import CalendarModal from "../../Components/Modals/CalendarModal";
import Analytics from "../Analytics/Analytics";

const COLUMNS = ["English", "Comm.", "Technical", "Reading", "Speak"];

const entries = [
{
id: 1,
comment: "Morning routine compl...",
day: "Oct 01",
cells: [1, 3, 3, 0, 0],
rating: "6.5",
deepWork: "4.0h",
sleep: "92%",
},
{
id: 2,
comment: "Deep work session on...",
day: "Oct 02",
cells: [2, 3, 0, 0, 0],
rating: "6.2",
deepWork: "2.5h",
sleep: "74%",
},
];

const levelClass = {
0: "bg-[#EDEAE0]",
1: "bg-[#C3DDA6]",
2: "bg-[#8FC15B]",
3: "bg-[#5C9A35]",
};

const weeklyFocus = [5.2, 6.8, 4.1, 7.3, 6.0, 3.4, 2.9];
const dayLabels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

function SidebarItem({ icon: Icon, label, active, onClick }) {
return (
<button
    onClick={onClick}
    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
    active
        ? "bg-[#EAF1E3] text-[#2C4A2C]"
        : "text-[#6B6B5E] hover:bg-[#F3F1E7]"
    }`}
>
    <Icon size={16} strokeWidth={2} />
    {label}
</button>
);
}

export default function Dashboard() {
const [view, setView] = useState("dashboard"); // "dashboard" | "analytics"
const [milestoneOpen, setMilestoneOpen] = useState(false);
const [calendarOpen, setCalendarOpen] = useState(false);

const streakDays = 14;
const maxHours = Math.max(...weeklyFocus);

return (
<div className="min-h-screen w-full bg-[#F6F4EC] flex font-sans text-[#1F2A1F]">
    {/* ───────────────── Sidebar ───────────────── */}
    <aside className="w-60 shrink-0 border-r border-[#E9E5D8] flex flex-col px-4 py-5">
    <div className="px-1">
        <h1 className="text-[19px] font-bold text-[#2C4A2C] tracking-tight">
        GrowthOS
        </h1>
        <p className="text-[10.5px] text-[#9A9482] mt-0.5">
        Efficiency infrastructure
        </p>
    </div>

    <nav className="mt-7 space-y-1">
        <SidebarItem
        icon={LayoutGrid}
        label="Dashboard"
        active={view === "dashboard"}
        onClick={() => setView("dashboard")}
        />
        <SidebarItem
        icon={BarChart3}
        label="Analytics"
        active={view === "analytics"}
        onClick={() => setView("analytics")}
        />
    </nav>

    <div className="mt-auto space-y-3">
        <button className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-[#2E5C2E] text-white text-[12.5px] font-semibold py-2.5 hover:bg-[#254B25] transition-colors">
        <Plus size={14} />
        New entry
        </button>

        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#6B6B5E] hover:bg-[#F3F1E7] transition-colors">
        <Settings size={16} />
        Settings
        </button>

        <div className="flex items-center gap-2.5 px-2 pt-3 border-t border-[#E9E5D8]">
        <div className="h-8 w-8 rounded-full bg-[#D7CFAE] flex items-center justify-center text-[11px] font-semibold text-[#5C5436] shrink-0">
            AC
        </div>
        <div className="min-w-0">
            <p className="text-[12px] font-medium text-[#1F2A1F] truncate">
            Alex Chan
            </p>
            <p className="text-[10px] text-[#9A9482] uppercase tracking-wide">
            Standard tier
            </p>
        </div>
        <ChevronRight size={14} className="text-[#9A9482] ml-auto shrink-0" />
        </div>
    </div>
    </aside>

    {/* ───────────────── Main ───────────────── */}
    <main className="flex-1 px-7 py-5 overflow-y-auto">
    {/* Top bar */}
    <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 max-w-md flex items-center gap-2 rounded-lg border border-[#E4E0D3] bg-white px-3 py-2">
        <Search size={14} className="text-[#9A9482]" />
        <input
            placeholder="Search metrics or logs..."
            className="flex-1 text-[13px] outline-none placeholder:text-[#B3AD99] bg-transparent"
        />
        </div>
        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E0D3] bg-white text-[#6B6B5E] hover:bg-[#F3F1E7] transition-colors">
        <Bell size={15} />
        </button>
        <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E0D3] bg-white text-[#6B6B5E] hover:bg-[#F3F1E7] transition-colors">
        <Settings size={15} />
        </button>
    </div>

    {view === "analytics" ? (
        <Analytics />
    ) : (
        <div className="space-y-5">
        {/* Streak + Milestones row */}
        <div className="flex gap-4">
            {/* Streak flame card */}
            <div className="rounded-xl border border-[#E9E5D8] bg-white px-6 py-5 flex flex-col items-center justify-center w-40 shrink-0">
            <svg
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                className="text-[#3E7A4C]"
            >
                <path
                d="M12 2C12 2 7 7.5 7 12.5C7 16 9.5 18 12 18C14.5 18 17 16 17 12.5C17 11.5 16.7 10.5 16.2 9.6C16.2 11 15.4 12 14.3 12C14.9 9.5 13.7 7 12 5.5C12.4 7 11.8 8.3 10.7 9.2C9.6 10.1 9 11.3 9 12.5C9 14.5 10.3 16 12 16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="#EAF1E3"
                />
            </svg>
            <p className="text-[20px] font-bold text-[#1F2A1F] mt-2 leading-none">
                {streakDays}
            </p>
            <p className="text-[10.5px] text-[#9A9482] mt-1 uppercase tracking-wide">
                Day streak
            </p>
            </div>

            {/* Monthly Milestones button (replaces the 3-task list) */}
            <div className="flex-1 rounded-xl border border-[#E9E5D8] bg-white px-6 py-5 flex items-center justify-between">
            <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#8B8470]">
                This month
                </p>
                <p className="text-[14px] font-semibold text-[#1F2A1F] mt-1">
                3 milestones in progress
                </p>
                <p className="text-[11.5px] text-[#9A9482] mt-0.5">
                Spanish fluency &middot; Project Alpha &middot; Ideas &amp; backlog
                </p>
            </div>
            <button
                onClick={() => setMilestoneOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-[#2E5C2E] text-white text-[12.5px] font-semibold px-4 py-2.5 hover:bg-[#254B25] transition-colors shrink-0"
            >
                Monthly Milestones
                <ChevronRight size={13} />
            </button>
            </div>
        </div>

        {/* Table card */}
        <div className="rounded-xl border border-[#E9E5D8] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <h2 className="text-[16px] font-semibold text-[#1F2A1F]">
                October 2023
            </h2>
            <button
                onClick={() => setCalendarOpen(true)}
                className="flex items-center gap-2 text-[#6B6B5E] hover:text-[#2C4A2C] transition-colors"
                aria-label="Open calendar"
            >
                <Calendar size={16} />
                <SlidersHorizontal size={15} />
            </button>
            </div>

            <table className="w-full">
            <thead>
                <tr className="border-y border-[#EFEBDD] bg-[#FAF9F4]">
                <th className="text-left pl-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A9482]">
                    Comment
                </th>
                <th className="text-left py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A9482]">
                    Day
                </th>
                {COLUMNS.map((c) => (
                    <th
                    key={c}
                    className="text-left py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A9482]"
                    >
                    {c}
                    </th>
                ))}
                <th className="text-left py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A9482]">
                    Rating
                </th>
                <th className="text-left py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A9482]">
                    Deep work
                </th>
                <th className="text-left pr-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9A9482]">
                    Sleep
                </th>
                </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EEE3]">
                {entries.map((row) => (
                <tr key={row.id}>
                    <td className="pl-6 py-3 text-[12px] text-[#9A9482] italic max-w-[160px] truncate">
                    {row.comment}
                    </td>
                    <td className="py-3 text-[12px] font-mono text-[#5C6B57]">
                    {row.day}
                    </td>
                    {row.cells.map((lvl, idx) => (
                    <td key={idx} className="py-3">
                        <div
                        className={`h-[14px] w-[14px] rounded-[3px] ${levelClass[lvl]}`}
                        />
                    </td>
                    ))}
                    <td className="py-3 text-[12px] font-mono text-[#1F2A1F]">
                    {row.rating}
                    </td>
                    <td className="py-3 text-[12px] font-mono text-[#1F2A1F]">
                    {row.deepWork}
                    </td>
                    <td className="pr-6 py-3 text-[12px] font-mono text-[#3E7A4C]">
                    {row.sleep}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>

            <div className="flex items-center justify-between px-6 py-3 bg-[#FAF9F4] border-t border-[#EFEBDD]">
            <button
                onClick={() => setCalendarOpen(true)}
                className="text-[11.5px] text-[#6B6B5E] hover:text-[#2C4A2C] transition-colors underline decoration-dotted"
            >
                Full month view &middot; 31 data points
            </button>
            </div>
        </div>

        {/* Focus distribution (KPI box removed per spec) */}
        <div className="rounded-xl border border-[#E9E5D8] bg-white px-6 py-5">
            <div className="flex items-center justify-between mb-4">
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[#8B8470]">
                Focus distribution
            </p>
            <span className="text-[11px] text-[#8B8470] font-mono">
                Last 7 days
            </span>
            </div>
            <div className="flex items-end gap-4 h-24">
            {weeklyFocus.map((h, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end h-16">
                    <div
                    className="w-full rounded-sm bg-gradient-to-t from-[#5C9A35] to-[#A8D87B]"
                    style={{ height: `${(h / maxHours) * 100}%` }}
                    />
                </div>
                <span className="text-[10px] text-[#9A9482] font-mono">
                    {dayLabels[idx]}
                </span>
                </div>
            ))}
            </div>
        </div>
        </div>
    )}
    </main>

    {/* Modals */}
    <MilestoneModal open={milestoneOpen} onClose={() => setMilestoneOpen(false)} />
    <CalendarModal open={calendarOpen} onClose={() => setCalendarOpen(false)} />
</div>
);
}