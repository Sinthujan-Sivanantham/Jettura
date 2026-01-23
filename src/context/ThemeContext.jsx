import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => { },
  color: "#3b60ff",
  setColor: () => { }
});

export function ThemeProvider({ children }) {
  // 1. Initialer State: Prüfe LocalStorage oder System-Einstellung
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("jettura-theme") || "light";
  });

  const [color, setColor] = useState(() => {
    return localStorage.getItem("jettura-color") || "#3b60ff";
  });

  // 2. useEffect: Wenn sich das Theme ändert, update die HTML-Klasse
  useEffect(() => {
    const root = window.document.documentElement; // Das <html> Element
    localStorage.setItem("jettura-theme", theme);
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // 3. useEffect: Brand Color aktualisieren
  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem("jettura-color", color);
    root.style.setProperty("--brand-color", color);
  }, [color]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);