import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "default" | "cozy";
const ThemeContext = createContext<{ theme: Theme; toggleTheme: () => void } | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "cozy" ? "cozy" : "default",
  );

  useEffect(() => {
    const sync = (event: StorageEvent) => {
      if (event.key !== "bookberries-theme") return;
      const next = event.newValue === "cozy" ? "cozy" : "default";
      document.documentElement.dataset.theme = next;
      setTheme(next);
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const toggleTheme = () => {
    const next = theme === "cozy" ? "default" : "cozy";
    document.documentElement.classList.add("theme-transition");
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem("bookberries-theme", next); } catch { /* Still works for this visit. */ }
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme requires ThemeProvider");
  return context;
}