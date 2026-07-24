import { useEffect } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import Login from '@/pages/Auth/Login'
import Signup from '@/pages/Auth/Signup'
import Dashboard from '@/pages/Dashboard/Dashboard'
import Stats from '@/pages/Stats/Stats'
import Templates from '@/pages/Templates/Templates'
import Notes from '@/pages/Notes/Notes'
import TemplateLogPage from '@/pages/Dashboard/TemplateLogPage'
import MainLayout from '@/components/layout/MainLayout'
import { JournalProvider } from '@/contexts/JournalContext'
import { useThemeStore } from '@/hooks/useThemeStore'

function AppNavigator() {
  useEffect(() => {
    useThemeStore.getState().initTheme()
  }, [])

  return (
    <Router>
      <JournalProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/template-log" element={<TemplateLogPage />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/notes" element={<Notes />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </JournalProvider>
    </Router>
  )
}

export default AppNavigator