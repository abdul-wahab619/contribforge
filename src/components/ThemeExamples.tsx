import { useTheme } from "next-themes";
import { useTheme as useCustomTheme } from "@/hooks/useTheme";
import { useThemeUtils } from "@/lib/theme-utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * Example component showing different ways to use the theme system.
 * Not used in the main application - just for reference.
 */
export function ThemeExamples() {
  const { theme, setTheme } = useTheme();
  const { isDark, mounted } = useCustomTheme();
  const { toggleTheme, setDark, setLight } = useThemeUtils();

  if (!mounted) return null;

  return (
    <div className="space-y-8 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Theme System Examples</CardTitle>
          <CardDescription>Different ways to use the theme system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Theme Display */}
          <div className="space-y-2">
            <h3 className="font-semibold">Current Theme</h3>
            <p className="text-sm text-muted-foreground">
              Theme: <Badge variant="outline">{theme}</Badge>
            </p>
            <p className="text-sm text-muted-foreground">
              Mode: <Badge>{isDark ? "Dark" : "Light"}</Badge>
            </p>
          </div>

          {/* Method 1: Direct useTheme Hook */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Method 1: Direct useTheme</h3>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={theme === "light" ? "default" : "outline"}
                onClick={() => setTheme("light")}
              >
                Light
              </Button>
              <Button
                size="sm"
                variant={theme === "dark" ? "default" : "outline"}
                onClick={() => setTheme("dark")}
              >
                Dark
              </Button>
              <Button
                size="sm"
                variant={theme === "system" ? "default" : "outline"}
                onClick={() => setTheme("system")}
              >
                System
              </Button>
            </div>
          </div>

          {/* Method 2: Custom Hook */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Method 2: Custom Hook</h3>
            <Button size="sm" onClick={toggleTheme}>
              Toggle Theme (using custom hook)
            </Button>
          </div>

          {/* Method 3: Theme Utils */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Method 3: Theme Utils</h3>
            <div className="flex gap-2">
              <Button onClick={setLight} size="sm" variant="outline">
                Set Light
              </Button>
              <Button onClick={setDark} size="sm" variant="outline">
                Set Dark
              </Button>
            </div>
          </div>

          {/* Styling Example */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">Tailwind Dark Mode Class</h3>
            <div className="p-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-md">
              <p className="text-slate-900 dark:text-slate-100">
                This box is white in light mode and dark slate in dark mode
              </p>
            </div>
          </div>

          {/* CSS Variables Example */}
          <div className="space-y-2 border-t pt-4">
            <h3 className="font-semibold">CSS Variables</h3>
            <div className="p-4 rounded-md" style={{
              backgroundColor: `hsl(var(--card))`,
              color: `hsl(var(--card-foreground))`,
              border: `1px solid hsl(var(--border))`,
            }}>
              This box uses CSS variables for theme colors
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Theme Documentation Card */}
      <Card>
        <CardHeader>
          <CardTitle>Theme System Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <strong>Component Location:</strong> <code className="bg-muted px-2 py-1 rounded">src/components/ThemeToggle.tsx</code>
          </p>
          <p>
            <strong>Custom Hook:</strong> <code className="bg-muted px-2 py-1 rounded">src/hooks/useTheme.ts</code>
          </p>
          <p>
            <strong>Utilities:</strong> <code className="bg-muted px-2 py-1 rounded">src/lib/theme-utils.ts</code>
          </p>
          <p>
            <strong>Colors:</strong> <code className="bg-muted px-2 py-1 rounded">src/index.css</code>
          </p>
          <p>
            <strong>Documentation:</strong> See <code className="bg-muted px-2 py-1 rounded">THEME.md</code> for complete guide
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
