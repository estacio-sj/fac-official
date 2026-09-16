"use client";

import type { Theme } from "@/hooks/useTheme";

interface Props {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: Props) {
  const isDark = theme === "dark";
  return (
    <button className="theme-toggle" onClick={onToggle}>
      <span>{isDark ? "Escuro" : "Claro"}</span>
    </button>
  );
}
