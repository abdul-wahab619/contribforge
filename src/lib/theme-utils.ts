import { useTheme } from "next-themes";

/**
 * Utility functions for theme management
 */

export function useThemeUtils() {
  const { theme, setTheme, systemTheme } = useTheme();

  const isDark = theme === "dark" || (theme === "system" && systemTheme === "dark");
  const isLight = theme === "light" || (theme === "system" && systemTheme === "light");

  return {
    // Current theme
    theme,
    isDark,
    isLight,
    
    // Theme setters
    setTheme,
    toggleTheme: () => setTheme(isDark ? "light" : "dark"),
    setLight: () => setTheme("light"),
    setDark: () => setTheme("dark"),
    setSystem: () => setTheme("system"),
  };
}

/**
 * Get CSS variable value for current theme
 */
export function getCSSVariableValue(variableName: string): string {
  if (typeof window === "undefined") return "";
  
  const value = getComputedStyle(document.documentElement).getPropertyValue(variableName);
  return value.trim();
}

/**
 * Example CSS variable names available:
 * --background
 * --foreground
 * --primary
 * --secondary
 * --destructive
 * --border
 * --input
 * --ring
 * --muted
 * --accent
 * --card
 * --popover
 */

/**
 * Convert HSL value to RGB for use outside of Tailwind
 * @param hslValue - HSL value like "142 71% 45%"
 * @returns RGB value like "rgb(107, 214, 110)"
 */
export function hslToRgb(hslValue: string): string {
  const [h, s, l] = hslValue.split(" ");
  
  const hsl = `hsl(${h}, ${s}, ${l})`;
  const ctx = document.createElement("canvas").getContext("2d");
  
  if (!ctx) return hsl;
  
  ctx.fillStyle = hsl;
  return ctx.fillStyle;
}
