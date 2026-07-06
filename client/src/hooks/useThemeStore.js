import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === "light" ? "dark" : "light";
          if (newTheme === "dark") {
            document.documentElement.classList.add("dark");
          } else {
            document.documentElement.classList.remove("dark");
          }
          return { theme: newTheme };
        }),
      initTheme: () => {
        const stored = localStorage.getItem("theme-store");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            const isDark = parsed.state?.theme === "dark";
            if (isDark) {
              document.documentElement.classList.add("dark");
              return;
            }
          } catch (e) {
            console.error("Failed to parse theme store", e);
          }
        }
        document.documentElement.classList.remove("dark");
      },
    }),
    {
      name: "theme-store",
    }
  )
);
