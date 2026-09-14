import { createContext, useContext, useEffect } from "react";

const ThemeContext = createContext({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }) {
  const theme = "dark";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("theme-light");
    root.classList.add("theme-dark");
    try {
      localStorage.setItem("football-theme", "dark");
    } catch {
      // ignore
    }
  }, []);

  // Theme switching removed: lock to dark
  const toggleTheme = () => {};
  const setTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Drop-in replacement for your existing useTheme hook
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}