import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar/Sidebar'
import { useThemeStore } from '@/hooks/useThemeStore'
import { getUiTokens } from '@/components/ui/uiTokens'

export default function MainLayout() {
  const theme = useThemeStore((s) => s.theme)
  const tokens = getUiTokens(theme)

  return (
    <div
      className="flex h-screen w-full overflow-hidden font-sans"
      style={{ backgroundColor: tokens.colors.bg, color: tokens.colors.textPrimary }}
    >
      <Sidebar />
      <Outlet />
    </div>
  )
}
