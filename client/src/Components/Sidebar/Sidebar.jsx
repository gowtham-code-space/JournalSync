import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  BarChart3,
  ChevronRight,
  Sun,
  Moon,
} from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
        active
          ? "bg-[#111111] dark:bg-[#FAFAFC] text-white dark:text-[#111111] shadow-sm"
          : "text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24]"
      }`}
    >
      <Icon size={16} strokeWidth={2} />
      {label}
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2DBFAE] shrink-0" />
      )}
    </button>
  );
}

export default function Sidebar() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const isAnalytics = location.pathname === "/analytics";
  const isDashboard = location.pathname === "/dashboard";
  const { theme, toggleTheme } = useThemeStore();

  return (
    <aside className="w-60 shrink-0 border-r border-[#E7E7EC] dark:border-[#22222A] bg-white dark:bg-[#111115] flex flex-col px-4 py-5">
      {/* Brand */}
      <div className="px-1">
        <h1
          className="text-[20px] font-semibold text-[#111111] dark:text-white tracking-tight"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          GrowthOS
        </h1>
        <p className="text-[10.5px] text-[#9A99A6] dark:text-[#8E8D9B] mt-0.5">
          Efficiency infrastructure
        </p>
      </div>

      {/* Navigation */}
      <nav className="mt-7 space-y-1">
        <SidebarItem
          icon={LayoutGrid}
          label="Dashboard"
          active={isDashboard}
          onClick={() => navigate("/dashboard")}
        />
        <SidebarItem
          icon={BarChart3}
          label="Analytics"
          active={isAnalytics}
          onClick={() => navigate("/analytics")}
        />
      </nav>

      {/* Bottom section */}
      <div className="mt-auto space-y-3">

        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#6B6B76] dark:text-[#A1A1AA] hover:bg-[#F1F1F5] dark:hover:bg-[#1E1E24] transition-colors"
        >
          {theme === "light" ? (
            <>
              <Moon size={16} />
              <span>Dark mode</span>
            </>
          ) : (
            <>
              <Sun size={16} />
              <span>Light mode</span>
            </>
          )}
        </button>

        {/* User card */}
        <div className="flex items-center gap-2.5 px-2 pt-3 border-t border-[#E7E7EC] dark:border-[#22222A]">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #C13A8A 0%, #E8924A 55%, #2DBFAE 100%)",
            }}
          >
            AC
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-[#111111] dark:text-white truncate">
              Alex Chan
            </p>
            <p className="text-[10px] text-[#9A99A6] dark:text-[#8E8D9B] uppercase tracking-wide">
              Standard tier
            </p>
          </div>
          <ChevronRight size={14} className="text-[#9A99A6] dark:text-[#8E8D9B] ml-auto shrink-0" />
        </div>
      </div>
    </aside>
  );
}
