import { useEffect } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import Login from '@/pages/Auth/Login'
import Dashboard from '@/pages/Dashboard/Dashboard'
import Analytics from '@/pages/Analytics/Analytics'
import Notes from '@/pages/Notes/Notes'
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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </JournalProvider>
    </Router>
  )
}

export default AppNavigator