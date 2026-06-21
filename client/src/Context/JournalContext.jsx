import React, { createContext, useContext, useState, useMemo } from "react";

// ─── helpers ────────────────────────────────────────────────────────────────
export const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export const MONTH_ABBR = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

export const monthKey = (monthIdx, year) => `${year}-${monthIdx}`;

export const DEFAULT_COLUMNS = [
  { id: "comment",   label: "Comment",   type: "comment", trackForAnalytics: false },
  { id: "english",   label: "English",   type: "box",     trackForAnalytics: true  },
  { id: "comm",      label: "Comm.",      type: "box",     trackForAnalytics: true  },
  { id: "technical", label: "Technical",  type: "box",     trackForAnalytics: true  },
  { id: "reading",   label: "Reading",    type: "box",     trackForAnalytics: false },
  { id: "speak",     label: "Speak",      type: "box",     trackForAnalytics: false },
  { id: "rating",    label: "Rating",    type: "number",  trackForAnalytics: false },
  { id: "deepWork",  label: "Deep work",  type: "number",  trackForAnalytics: false },
  { id: "sleep",     label: "Sleep",     type: "number",  trackForAnalytics: false },
];

export function generateMonthEntries(monthIdx, year) {
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dd = String(day).padStart(2, "0");
    const mm = String(monthIdx + 1).padStart(2, "0");
    const yy = String(year).slice(2);
    return {
      id: day,
      comment: "",
      day: `${dd}/${mm}/${yy}`,
      cells: {},
      rating: "",
      deepWork: "",
      sleep: "",
    };
  });
}

const INITIAL_ENTRIES = {
  [monthKey(9, 2023)]: (() => {
    const entries = generateMonthEntries(9, 2023);
    entries[0] = {
      ...entries[0],
      comment: "Morning routine compl...",
      cells: { english: false, comm: true, technical: true, reading: false, speak: false },
      rating: "6.5",
      deepWork: "4.0h",
      sleep: "92%",
    };
    entries[1] = {
      ...entries[1],
      comment: "Deep work session on...",
      cells: { english: true, comm: true, technical: false, reading: false, speak: false },
      rating: "6.2",
      deepWork: "2.5h",
      sleep: "74%",
    };
    return entries;
  })(),
};

// ─── context ────────────────────────────────────────────────────────────────
const JournalContext = createContext(null);

export function JournalProvider({ children }) {
  // Month / year selection — shared between Dashboard & Analytics
  const [selectedMonth, setSelectedMonth] = useState(9);
  const [selectedYear, setSelectedYear]   = useState(2023);

  // Columns (global defaults + per-month overrides)
  const [globalColumns, setGlobalColumns]     = useState(DEFAULT_COLUMNS);
  const [monthOverrides, setMonthOverrides]   = useState({});

  // Entries keyed by month
  const [entriesByMonth, setEntriesByMonth]   = useState(INITIAL_ENTRIES);

  // ── derived ────────────────────────────────────────────────────────────────
  const activeMonthKey   = monthKey(selectedMonth, selectedYear);
  const monthLabel       = `${MONTH_NAMES[selectedMonth]} ${selectedYear}`;
  const effectiveColumns = monthOverrides[activeMonthKey] ?? globalColumns;

  const currentEntries = useMemo(() => {
    if (entriesByMonth[activeMonthKey]) return entriesByMonth[activeMonthKey];
    return generateMonthEntries(selectedMonth, selectedYear);
  }, [entriesByMonth, activeMonthKey, selectedMonth, selectedYear]);

  // ── column actions ─────────────────────────────────────────────────────────
  const handleSaveColumn = (columnData, scope) => {
    if (scope === "all") {
      setGlobalColumns((prev) => {
        const exists = prev.some((c) => c.id === columnData.id);
        return exists
          ? prev.map((c) => (c.id === columnData.id ? columnData : c))
          : [...prev, columnData];
      });
      setMonthOverrides((prev) => {
        const updated = {};
        for (const key in prev) {
          const exists = prev[key].some((c) => c.id === columnData.id);
          updated[key] = exists
            ? prev[key].map((c) => (c.id === columnData.id ? columnData : c))
            : [...prev[key], columnData];
        }
        return updated;
      });
    } else {
      setMonthOverrides((prev) => {
        const base    = prev[activeMonthKey] ?? globalColumns;
        const exists  = base.some((c) => c.id === columnData.id);
        const nextCols = exists
          ? base.map((c) => (c.id === columnData.id ? columnData : c))
          : [...base, columnData];
        return { ...prev, [activeMonthKey]: nextCols };
      });
    }
  };

  const handleDeleteColumn = (columnId, scope) => {
    if (scope === "all") {
      setGlobalColumns((prev) => prev.filter((c) => c.id !== columnId));
      setMonthOverrides((prev) => {
        const updated = {};
        for (const key in prev) {
          updated[key] = prev[key].filter((c) => c.id !== columnId);
        }
        return updated;
      });
    } else {
      setMonthOverrides((prev) => {
        const base = prev[activeMonthKey] ?? globalColumns;
        return { ...prev, [activeMonthKey]: base.filter((c) => c.id !== columnId) };
      });
    }
  };

  // ── cell / field mutations ─────────────────────────────────────────────────
  const updateCell = (entryId, colId, value) => {
    setEntriesByMonth((prev) => {
      const monthEntries = prev[activeMonthKey] ?? generateMonthEntries(selectedMonth, selectedYear);
      return {
        ...prev,
        [activeMonthKey]: monthEntries.map((entry) =>
          entry.id === entryId
            ? { ...entry, cells: { ...entry.cells, [colId]: value } }
            : entry
        ),
      };
    });
  };

  const updateField = (entryId, field, value) => {
    setEntriesByMonth((prev) => {
      const monthEntries = prev[activeMonthKey] ?? generateMonthEntries(selectedMonth, selectedYear);
      return {
        ...prev,
        [activeMonthKey]: monthEntries.map((entry) =>
          entry.id === entryId ? { ...entry, [field]: value } : entry
        ),
      };
    });
  };

  return (
    <JournalContext.Provider
      value={{
        // month
        selectedMonth,
        selectedYear,
        setSelectedMonth,
        setSelectedYear,
        activeMonthKey,
        monthLabel,
        // columns
        effectiveColumns,
        handleSaveColumn,
        handleDeleteColumn,
        // entries
        currentEntries,
        updateCell,
        updateField,
      }}
    >
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const ctx = useContext(JournalContext);
  if (!ctx) throw new Error("useJournal must be used inside <JournalProvider>");
  return ctx;
}
