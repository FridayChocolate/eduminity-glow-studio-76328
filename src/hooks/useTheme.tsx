import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    const stored = localStorage.getItem("theme");
    return (stored as "light" | "dark") || "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    const stored = localStorage.getItem("theme");
    
    // Set dark mode as default if no theme is stored
    if (!stored) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(stored);
      setTheme(stored as "light" | "dark");
    }
  }, []);

  const toggleTheme = () => {
    const root = window.document.documentElement;
    const newTheme = theme === "light" ? "dark" : "light";
    
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
    localStorage.setItem("theme", newTheme);
    setTheme(newTheme);
  };

  return { theme, toggleTheme };
};
