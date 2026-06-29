import React, { useState } from "react";
import { Filter, Plus, Menu, Search, Bell, Settings, Check, Clock, Calendar as CalendarIcon, Circle } from "lucide-react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import NewTaskModal from "../../Components/Modals/NewTaskModal";
import { useSidebarStore } from "../../store/useSidebarStore";

export default function Todo() {
  const toggleSidebar = useSidebarStore((state) => state.toggle);
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false);

  return (
    <div className="h-screen w-full bg-[#F5F5F7] dark:bg-[#0C0C0E] flex overflow-hidden font-sans text-[#111111] dark:text-[#FAFAFC]">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#F5F5F7]/90 dark:bg-[#0C0C0E]/90 backdrop-blur-md border-b border-[#E7E7EC] dark:border-[#22222A] px-4 sm:px-7 py-3 flex items-center gap-3">
          <button
            onClick={toggleSidebar}
            className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors shrink-0"
          >
            <Menu size={16} />
          </button>

          <div className="flex-1 max-w-sm flex items-center gap-2 rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-[#E8EAF6] dark:bg-[#1E1E24] px-3 py-2">
            <Search size={13} className="text-[#7C7C9A] dark:text-[#8E8D9B] shrink-0" />
            <input
              placeholder="Search..."
              className="flex-1 min-w-0 text-[13px] outline-none placeholder:text-[#9494B3] dark:placeholder:text-[#66667A] bg-transparent text-[#111111] dark:text-[#FAFAFC]"
            />
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors">
              <Bell size={15} />
            </button>
            <button className="h-9 w-9 flex items-center justify-center rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-white dark:bg-[#16161A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors">
              <Settings size={15} />
            </button>
          </div>
        </div>

        {/* Page body */}
        <div className="px-4 sm:px-10 py-8 max-w-5xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-[24px] font-bold text-[#111111] dark:text-white">Todo List</h1>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#111111] dark:text-white hover:bg-[#E4E4ED] dark:hover:bg-[#1E1E24] rounded-lg transition-colors">
                <Filter size={15} />
                Filter
              </button>
              <button
                onClick={() => setNewTaskModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold bg-[#2DBFAE] text-white rounded-lg hover:bg-[#25A090] transition-colors shadow-sm"
              >
                <Plus size={16} />
                New Task
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Total */}
            <div className="p-5 rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A]">
              <p className="text-[11px] font-semibold uppercase text-[#9A99A6] dark:text-[#8E8D9B] tracking-wider mb-3">Total Tasks</p>
              <p className="text-[28px] font-bold text-[#111111] dark:text-white leading-none mb-2">24</p>
              <p className="text-[12px] text-[#9A99A6] dark:text-[#8E8D9B]">This week</p>
            </div>
            {/* Completed */}
            <div className="p-5 rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A]">
              <p className="text-[11px] font-semibold uppercase text-[#9A99A6] dark:text-[#8E8D9B] tracking-wider mb-3">Completed</p>
              <p className="text-[28px] font-bold text-[#2DBFAE] leading-none mb-2">16</p>
              <p className="text-[12px] text-[#9A99A6] dark:text-[#8E8D9B]">66% done</p>
            </div>
            {/* In Progress */}
            <div className="p-5 rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A]">
              <p className="text-[11px] font-semibold uppercase text-[#9A99A6] dark:text-[#8E8D9B] tracking-wider mb-3">In Progress</p>
              <p className="text-[28px] font-bold text-[#111111] dark:text-white leading-none mb-2">5</p>
              <p className="text-[12px] text-[#9A99A6] dark:text-[#8E8D9B]">Active now</p>
            </div>
            {/* Overdue */}
            <div className="p-5 rounded-xl border border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#16161A]">
              <p className="text-[11px] font-semibold uppercase text-[#9A99A6] dark:text-[#8E8D9B] tracking-wider mb-3">Overdue</p>
              <p className="text-[28px] font-bold text-[#EF4444] leading-none mb-2">3</p>
              <p className="text-[12px] text-[#9A99A6] dark:text-[#8E8D9B]">Need attention</p>
            </div>
          </div>

          {/* Quick Add */}
          <div className="flex items-center gap-3 border-b border-[#E7E7EC] dark:border-[#22222A] pb-4">
            <Plus size={20} className="text-[#2DBFAE]" />
            <input
              placeholder="Add a new task..."
              className="flex-1 bg-transparent border-none outline-none text-[15px] text-[#111111] dark:text-white placeholder-[#9A99A6] dark:placeholder-[#66667A]"
            />
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium bg-[#E8EAF6] dark:bg-[#1E1E24] text-[#2DBFAE] rounded-md hover:bg-[#DADBF0] dark:hover:bg-[#2C2C35] transition-colors">
              Today <CalendarIcon size={12} />
            </button>
          </div>

          {/* Today section */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#9A99A6] dark:text-[#8E8D9B] mb-4">Today</h3>
            <div className="space-y-1">
              <TaskItem checked text="Review analytics report" tag="Work" time="09:00 AM" />
              <TaskItem checked text="Spanish fluency practice - 30 min" tag="Personal" time="10:00 AM" />
              <TaskItem text="Write Project Alpha milestone notes" tag="Work" time="02:00 PM" indicator="red" />
              <TaskItem text="Deep work session - product roadmap" tag="Work" time="03:30 PM" indicator="yellow" />
              <TaskItem text="Update ideas & backlog document" tag="Work" time="05:00 PM" />
            </div>
          </div>

          {/* Upcoming section */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#9A99A6] dark:text-[#8E8D9B] mb-4 mt-8">Upcoming</h3>
            <div className="space-y-1">
              <TaskItem text="Team sync - Project Alpha kickoff" tag="Work" time="Tomorrow" indicator="red" />
              <TaskItem text='Read 20 pages of "Atomic Habits"' tag="Personal" time="Tomorrow" />
              <TaskItem text="Prepare monthly milestone presentation" tag="Urgent" time="Dec 15" indicator="red" />
            </div>
          </div>

        </div>
      </main>

      <NewTaskModal open={newTaskModalOpen} onClose={() => setNewTaskModalOpen(false)} />
    </div>
  );
}

function TaskItem({ checked = false, text, tag, time, indicator = "green" }) {
  const getTagColor = (t) => {
    switch (t.toLowerCase()) {
      case "work": return "bg-[#4B4453] text-[#A69FC1]";
      case "personal": return "bg-[#5D4037] text-[#D7CCC8]";
      case "urgent": return "bg-[#3E2723] text-[#EF9A9A]";
      default: return "bg-[#1E1E24] text-[#A1A1AA]";
    }
  };

  const indicatorColor = {
    green: "bg-[#2DBFAE]",
    red: "bg-[#EF4444]",
    yellow: "bg-[#F59E0B]",
  }[indicator];

  return (
    <div className="flex items-center group py-3 px-2 rounded-xl hover:bg-[#FAFAFC] dark:hover:bg-[#16161A] transition-colors cursor-pointer">
      <div className="mr-4">
        {checked ? (
          <div className="h-5 w-5 rounded bg-[#2DBFAE] flex items-center justify-center text-white">
            <Check size={14} strokeWidth={3} />
          </div>
        ) : (
          <div className="h-5 w-5 rounded border-2 border-[#D4D4DE] dark:border-[#4B4B53] group-hover:border-[#2DBFAE] transition-colors" />
        )}
      </div>
      
      <p className={`flex-1 text-[14px] ${checked ? "text-[#9A99A6] dark:text-[#66667A] line-through" : "text-[#111111] dark:text-white"}`}>
        {text}
      </p>

      <div className="flex items-center gap-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity mr-4">
         <button className="text-[#9A99A6] hover:text-[#111111] dark:hover:text-white"><Settings size={15} /></button>
      </div>

      <div className="flex items-center gap-3">
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${getTagColor(tag)}`}>
          {tag}
        </span>
        <span className="text-[12px] text-[#9A99A6] dark:text-[#8E8D9B] w-20 text-right">
          {time}
        </span>
        <div className={`h-1.5 w-1.5 rounded-full ${indicatorColor}`} />
      </div>
    </div>
  );
}
