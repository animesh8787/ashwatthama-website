"use client";

import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors duration-200 hover:bg-bone/[0.06] hover:text-bone md:h-9 md:w-9 ${className}`}
    >
      {isLight ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
