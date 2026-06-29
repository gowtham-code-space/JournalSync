import React, { useState } from "react";
import { 
  Menu, Search, Plus, User, Briefcase, Lightbulb, FlaskConical, Folder,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, CheckSquare,
  Link, Code, AlignLeft, AlignCenter, AlignRight, Share, MoreHorizontal, Clock
} from "lucide-react";
import Sidebar from "../../Components/Sidebar/Sidebar";
import NewNoteModal from "../../Components/Modals/NewNoteModal";
import { useSidebarStore } from "../../store/useSidebarStore";

export default function Notes() {
  const toggleSidebar = useSidebarStore((state) => state.toggle);
  const [newNoteModalOpen, setNewNoteModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Notes");
  const [activeNote, setActiveNote] = useState(0);

  return (
    <div className="h-screen w-full bg-[#F5F5F7] dark:bg-[#0C0C0E] flex overflow-hidden font-sans text-[#111111] dark:text-[#FAFAFC]">
      <Sidebar />

      {/* Notes Inner Sidebar */}
      <aside className="w-72 border-r border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#111115] flex flex-col shrink-0">
        
        <div className="p-4 flex items-center justify-between border-b border-[#E7E7EC] dark:border-[#22222A]">
           <div className="flex items-center gap-3">
             <button
               onClick={toggleSidebar}
               className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg border border-[#E4E4ED] dark:border-[#22222A] text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24]"
             >
               <Menu size={16} />
             </button>
             <h2 className="text-[18px] font-bold text-[#111111] dark:text-white">Notes</h2>
           </div>
           <button
             onClick={() => setNewNoteModalOpen(true)}
             className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-semibold bg-[#2DBFAE] text-white rounded-lg hover:bg-[#25A090] transition-colors"
           >
             <Plus size={14} />
             New Note
           </button>
        </div>

        <div className="p-4 border-b border-[#E7E7EC] dark:border-[#22222A]">
          <div className="flex items-center gap-2 rounded-lg border border-[#E4E4ED] dark:border-[#22222A] bg-[#FAFAFC] dark:bg-[#1C1C22] px-3 py-2">
            <Search size={14} className="text-[#7C7C9A] dark:text-[#8E8D9B]" />
            <input
              placeholder="Search notes..."
              className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#111111] dark:text-white placeholder-[#9A99A6]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Categories */}
          <div className="p-4 border-b border-[#E7E7EC] dark:border-[#22222A]">
            <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[#9A99A6] dark:text-[#8E8D9B] mb-3">Categories</p>
            <div className="space-y-1">
              <CategoryItem icon={Folder} label="All Notes" count={14} active={activeCategory === "All Notes"} onClick={() => setActiveCategory("All Notes")} />
              <CategoryItem icon={Briefcase} label="Work" count={6} active={activeCategory === "Work"} onClick={() => setActiveCategory("Work")} />
              <CategoryItem icon={User} label="Personal" count={4} active={activeCategory === "Personal"} onClick={() => setActiveCategory("Personal")} />
              <CategoryItem icon={Lightbulb} label="Ideas" count={3} active={activeCategory === "Ideas"} onClick={() => setActiveCategory("Ideas")} />
              <CategoryItem icon={FlaskConical} label="Research" count={1} active={activeCategory === "Research"} onClick={() => setActiveCategory("Research")} />
            </div>
          </div>

          {/* Note List */}
          <div className="p-3 space-y-1">
            <NoteListItem 
              active={activeNote === 0} 
              onClick={() => setActiveNote(0)}
              title="Project Alpha - Milestone Notes"
              summary="Key decisions from the kickoff meetin..."
              tag="Work"
              time="Today, 2:14 PM"
            />
            <NoteListItem 
              active={activeNote === 1} 
              onClick={() => setActiveNote(1)}
              title="Product Roadmap Ideas"
              summary="Feature brainstorm: AI summarize, cu..."
              tag="Ideas"
              time="Yesterday"
            />
            <NoteListItem 
              active={activeNote === 2} 
              onClick={() => setActiveNote(2)}
              title="Spanish Learning Resources"
              summary="Vocabulary list, conjugation tables an..."
              tag="Personal"
              time="Dec 11"
            />
             <NoteListItem 
              active={activeNote === 3} 
              onClick={() => setActiveNote(3)}
              title="Analytics Dashboard Review"
              summary="Observations from the weekly data re..."
              tag="Work"
              time="Dec 10"
            />
          </div>
        </div>
      </aside>

      {/* Main Editor Area */}
      <main className="flex-1 min-w-0 flex flex-col bg-white dark:bg-[#16161A]">
        {/* Editor Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-[#E7E7EC] dark:border-[#22222A] bg-[#FAFAFC] dark:bg-[#1C1C22]">
          <div className="flex items-center gap-1">
            <select className="bg-transparent text-[13px] font-medium text-[#111111] dark:text-white border-none outline-none mr-4">
              <option>Paragraph</option>
              <option>Heading 1</option>
              <option>Heading 2</option>
            </select>
            <div className="w-px h-4 bg-[#E4E4ED] dark:bg-[#2C2C35] mx-2" />
            <ToolbarBtn icon={Bold} active />
            <ToolbarBtn icon={Italic} />
            <ToolbarBtn icon={Underline} />
            <ToolbarBtn icon={Strikethrough} />
            <div className="w-px h-4 bg-[#E4E4ED] dark:bg-[#2C2C35] mx-2" />
            <ToolbarBtn icon={List} />
            <ToolbarBtn icon={ListOrdered} />
            <ToolbarBtn icon={CheckSquare} />
            <div className="w-px h-4 bg-[#E4E4ED] dark:bg-[#2C2C35] mx-2" />
            <ToolbarBtn icon={Link} />
            <ToolbarBtn icon={Code} />
            <div className="w-px h-4 bg-[#E4E4ED] dark:bg-[#2C2C35] mx-2" />
            <ToolbarBtn icon={AlignLeft} active />
            <ToolbarBtn icon={AlignCenter} />
            <ToolbarBtn icon={AlignRight} />
          </div>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 flex items-center justify-center rounded-lg text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#E4E4ED] dark:hover:bg-[#2C2C35]">
              <Share size={15} />
            </button>
            <button className="h-8 w-8 flex items-center justify-center rounded-lg text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#E4E4ED] dark:hover:bg-[#2C2C35]">
              <MoreHorizontal size={15} />
            </button>
          </div>
        </div>

        {/* Editor Content */}
        <div className="flex-1 overflow-y-auto px-8 py-10 max-w-4xl mx-auto w-full">
          {/* Title Area */}
          <div className="mb-8">
            <h1 className="text-[32px] font-bold text-[#111111] dark:text-white mb-4">
              Project Alpha – Milestone Notes
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-[12px] text-[#9A99A6] dark:text-[#8E8D9B]">
              <div className="flex items-center gap-2">
                <span className="bg-[#4B4453] text-[#A69FC1] px-2 py-0.5 rounded-md font-medium flex items-center gap-1">
                  <Briefcase size={10} /> Work
                </span>
                <button className="flex items-center gap-1 text-[#2DBFAE] hover:underline">
                  <Plus size={12} /> Add tag
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} /> Today, 2:14 PM
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-[#E4E4ED] dark:bg-[#4B4B53]" /> Last edited 12 min ago
              </div>
              <div className="flex items-center gap-1.5">
                 <span className="w-1 h-1 rounded-full bg-[#E4E4ED] dark:bg-[#4B4B53]" /> 342 words
              </div>
            </div>
          </div>

          {/* Dummy Rich Text Content */}
          <div className="prose prose-sm dark:prose-invert max-w-none text-[#111111] dark:text-[#E2E2E6] leading-relaxed space-y-6">
            <p>
              This note captures the key decisions and action items from the Project Alpha kickoff meeting held today. The team aligned on the overall roadmap direction and agreed on the first set of deliverables for Q1.
            </p>
            
            <h3 className="text-[18px] font-bold mt-8 mb-4">Phase 1 – Discovery & Planning</h3>
            <p>
              The first phase will run from <strong>December 15 to January 10</strong>. Primary goals include stakeholder interviews, competitive analysis, and technical scoping.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-[#2DBFAE]">
              <li><span className="text-[#111111] dark:text-[#E2E2E6]">Finalize user research interview guide by Dec 17</span></li>
              <li><span className="text-[#111111] dark:text-[#E2E2E6]">Complete competitive landscape overview – assign to Jordan</span></li>
              <li><span className="text-[#111111] dark:text-[#E2E2E6]">Infrastructure audit and tech stack confirmation by Dec 20</span></li>
              <li><span className="text-[#111111] dark:text-[#E2E2E6]">Draft project brief and share with leadership for sign-off</span></li>
            </ul>

            <h3 className="text-[18px] font-bold mt-8 mb-4">Key Decisions Made</h3>
            <h4 className="text-[15px] font-semibold mt-4 mb-2">Product Direction</h4>
            <p>
              We agreed to prioritize the mobile-first experience for the initial launch. The desktop version will follow 6 weeks later with expanded feature parity. Analytics integration will be scoped as a separate workstream.
            </p>

            <h4 className="text-[15px] font-semibold mt-4 mb-2">Team Structure</h4>
            <p>
              Core team: Alex (PM), Jordan (Design), Sam (Eng Lead), Maya (Data). Weekly syncs every Monday at 10am. Async standups via Slack daily.
            </p>

            <div className="bg-[#E8F6F4] dark:bg-[#122A26] border border-[#B3E5DB] dark:border-[#1E4D45] p-4 rounded-lg my-6 text-[#1A7364] dark:text-[#84D4C5]">
              <strong>Reminder:</strong> Share the milestone doc with the full team by EOD Friday. All comments and feedback should be submitted via the shared doc before the next sync.
            </div>

            <h3 className="text-[18px] font-bold mt-8 mb-4">Open Questions</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Budget allocation for user research incentives — confirm with finance</li>
              <li>External contractor scope — do we need a second engineer for Phase 2?</li>
              <li>Data privacy compliance review — schedule with legal before Jan 5</li>
            </ul>
            
            <div className="mt-8 pt-4 border-t border-[#E7E7EC] dark:border-[#22222A] text-[#9A99A6] dark:text-[#66667A]">
              Type '/' for commands
            </div>
          </div>
        </div>
      </main>

      <NewNoteModal open={newNoteModalOpen} onClose={() => setNewNoteModalOpen(false)} />
    </div>
  );
}

function CategoryItem({ icon: Icon, label, count, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors ${
        active 
          ? "bg-[#111111] dark:bg-[#FAFAFC] text-white dark:text-[#111111]" 
          : "text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24]"
      }`}
    >
      <div className="flex items-center gap-2.5">
        <Icon size={15} />
        {label}
      </div>
      <span className={`text-[11px] ${active ? "text-[#E4E4ED] dark:text-[#66667A]" : "text-[#9A99A6] dark:text-[#66667A]"}`}>
        {count}
      </span>
    </button>
  );
}

function NoteListItem({ active, onClick, title, summary, tag, time }) {
  const getTagColor = (t) => {
    switch (t.toLowerCase()) {
      case "work": return "text-[#A69FC1]";
      case "personal": return "text-[#D7CCC8]";
      case "ideas": return "text-[#A5D6A7]";
      case "research": return "text-[#CE93D8]";
      default: return "text-[#A1A1AA]";
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all ${
        active
          ? "border-[#2DBFAE] bg-[#FAFAFC] dark:bg-[#1C1C22]"
          : "border-transparent hover:bg-[#FAFAFC] dark:hover:bg-[#1C1C22]"
      }`}
    >
      <h4 className="text-[13px] font-bold text-[#111111] dark:text-white truncate mb-1">{title}</h4>
      <p className="text-[11px] text-[#9A99A6] dark:text-[#8E8D9B] truncate mb-2">{summary}</p>
      <div className="flex items-center gap-2 text-[10px] font-medium">
        <span className={`bg-[#1E1E24] px-2 py-0.5 rounded-md ${getTagColor(tag)}`}>{tag}</span>
        <span className="text-[#9A99A6] dark:text-[#66667A]">{time}</span>
      </div>
    </button>
  );
}

function ToolbarBtn({ icon: Icon, active }) {
  return (
    <button className={`h-7 w-7 flex items-center justify-center rounded mx-0.5 transition-colors ${
      active
        ? "bg-[#E4E4ED] dark:bg-[#2C2C35] text-[#111111] dark:text-white"
        : "text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#E4E4ED] dark:hover:bg-[#2C2C35]"
    }`}>
      <Icon size={14} />
    </button>
  );
}
