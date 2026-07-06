import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutGrid,
  BarChart3,
  ChevronRight,
  Sun,
  Moon,
  X,
  LogOut,
  FileText,
} from "lucide-react";
import { useThemeStore } from "@/hooks/useThemeStore";
import { useSidebarStore } from "@/hooks/useSidebarStore";
import { Button, IconButton } from "@/components/primitives";
import { getUiTokens } from '@/components/ui/uiTokens'

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <Button
      onClick={onClick}
      variant={active ? "navActive" : "navInactive"}
      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200"
    >
      <Icon size={16} strokeWidth={2} />
      {label}
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2DBFAE] shrink-0" />
      )}
    </Button>
  );
}

export default function Sidebar() {
  const navigate    = useNavigate();
  const location    = useLocation();
  const isAnalytics = location.pathname === "/analytics";
  const isDashboard = location.pathname === "/dashboard";
  const isNotes     = location.pathname === "/notes";
  const { theme, toggleTheme } = useThemeStore();
  const { isOpen, setOpen }    = useSidebarStore();
  const tokens = getUiTokens(theme)

  const handleNavigate = (path) => {
    navigate(path);
    setOpen(false);
  };

  const handleLogout = () => {
    setOpen(false);
    navigate("/");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-60 shrink-0 flex flex-col px-4 py-5 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        style={{ borderRight: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.surface }}
      >

        <div className="px-1 flex items-center justify-between mb-7">
          <div>
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
          {/* Close button, mobile only */}
          <IconButton
            variant="ghost"
            size="sm"
            onClick={() => setOpen(false)}
            className="md:hidden"
            aria-label="Close sidebar"
          >
            <X size={16} />
          </IconButton>
        </div>

        <nav className="space-y-1">
          <SidebarItem
            icon={LayoutGrid}
            label="Dashboard"
            active={isDashboard}
            onClick={() => handleNavigate("/dashboard")}
          />
          <SidebarItem
            icon={BarChart3}
            label="Analytics"
            active={isAnalytics}
            onClick={() => handleNavigate("/analytics")}
          />
          <SidebarItem
            icon={FileText}
            label="Notes"
            active={isNotes}
            onClick={() => handleNavigate("/notes")}
          />
        </nav>

        {/* â”€â”€ Bottom section â”€â”€ */}
        <div className="mt-auto space-y-1">

          {/* Theme toggle */}
          <Button
            variant="ghost"
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors"
          >
            {theme === "light" ? (
              <><Moon size={16} /><span>Dark mode</span></>
            ) : (
              <><Sun size={16} /><span>Light mode</span></>
            )}
          </Button>

          {/* Logout */}
          <Button
            variant="danger"
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors"
          >
            <LogOut size={16} strokeWidth={2} />
            <span>Log out</span>
          </Button>

          {/* User card */}
          <div className="flex items-center gap-2.5 px-2 pt-3 mt-1" style={{ borderTop: `1px solid ${tokens.colors.border}` }}>
            <div
              className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold text-white shrink-0"
              style={{
                backgroundImage: `linear-gradient(135deg, ${tokens.colors.brand.pink} 0%, ${tokens.colors.brand.orange} 55%, ${tokens.colors.brand.teal} 100%)`,
              }}
            >
              AC
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium truncate" style={{ color: tokens.colors.textPrimary }}>
                Alex Chan
              </p>
              <p className="text-[10px] uppercase tracking-wide" style={{ color: tokens.colors.textMuted }}>
                Standard tier
              </p>
            </div>
            <ChevronRight size={14} className="ml-auto shrink-0" style={{ color: tokens.colors.textMuted }} />
          </div>
        </div>
      </aside>
    </>
  );
}

