import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useTheme() {
  const { theme, setTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted ? theme === "dark" || (theme === "system" && systemTheme === "dark") : false;

  return {
    theme: mounted ? theme : "dark",
    setTheme,
    isDark,
    mounted,
  };
}
