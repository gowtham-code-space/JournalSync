import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login     from "../Pages/Auth/Login";
import Dashboard from "../Pages/Dashboard/Dashboard";
import Analytics from "../Pages/Analytics/Analytics";
import Todo from "../Pages/Todo/Todo";
import Notes from "../Pages/Notes/Notes";
import { JournalProvider } from "../Context/JournalContext";
import { useThemeStore } from "../store/useThemeStore";

function AppNavigator() {
  useEffect(() => {
    useThemeStore.getState().initTheme();
  }, []);

  return (
    <Router>
      {/*
        JournalProvider wraps all authenticated routes so Dashboard and
        Analytics share the same selectedMonth/year, columns, and entries.
      */}
      <JournalProvider>
        <Routes>
          <Route path="/"          element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/todo"      element={<Todo />} />
          <Route path="/notes"     element={<Notes />} />
          <Route path="*"          element={<Navigate to="/" replace />} />
        </Routes>
      </JournalProvider>
    </Router>
  );
}

export default AppNavigator;