import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  toggleTheme: () => { },
  color: "#3b60ff",
  setColor: () => { }
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  const [color, setColor] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("jettura-color") || "#3b60ff";
    }
    return "#3b60ff";
  });

  // Theme aus System lesen und auf Änderungen hören
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Initial setzen
    setTheme(mediaQuery.matches ? "dark" : "light");

    // Event Listener für System-Änderungen
    const handleChange = (e) => {
      setTheme(e.matches ? "dark" : "light");
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // HTML-Klasse updaten
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  // Brand Color updaten
  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem("jettura-color", color);
    root.style.setProperty("--brand-color", color);
  }, [color]);

  // Dummy-Funktion, falls noch irgendwo aufgerufen
  const toggleTheme = () => {};

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, color, setColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);