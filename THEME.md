# Theme System Documentation

## Overview

The application uses `next-themes` for seamless dark/light theme switching with the following features:

- **Automatic system preference detection** - Respects OS-level dark/light mode settings
- **Persistent theme preference** - Stores user's theme choice in localStorage
- **No hydration issues** - Properly handles server-side rendering and client-side hydration
- **Tailwind CSS integration** - Built-in support for Tailwind's dark mode class strategy

## How It Works

### CSS Variables

The theme system uses CSS custom properties (variables) defined in `src/index.css`:

**Light Theme:**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --primary: 142 71% 45%;
  /* ... more variables */
}
```

**Dark Theme:**
```css
.dark {
  --background: 222 47% 5%;
  --foreground: 210 40% 98%;
  --primary: 142 71% 45%;
  /* ... more variables */
}
```

All colors are in HSL format for easy modifications.

### Theme Provider

The `ThemeProvider` component in `App.tsx` wraps the entire application:

```tsx
<ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
  {/* Your app content */}
</ThemeProvider>
```

- `attribute="class"` - Theme is applied via the `.dark` class on the HTML element
- `defaultTheme="dark"` - Default to dark theme
- `enableSystem` - Enable system preference detection

## Usage

### Theme Toggle Component

Use the pre-built `ThemeToggle` component:

```tsx
import { ThemeToggle } from "@/components/ThemeToggle";

export function Header() {
  return (
    <header>
      <ThemeToggle />
    </header>
  );
}
```

### Using the useTheme Hook

Access the `useTheme` hook from `next-themes`:

```tsx
import { useTheme } from "next-themes";

export function MyComponent() {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      Current theme: {theme}
      <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
        Toggle
      </button>
    </div>
  );
}
```

### Using the Custom useTheme Hook

Or use the custom hook from `src/hooks/useTheme.ts`:

```tsx
import { useTheme } from "@/hooks/useTheme";

export function MyComponent() {
  const { theme, setTheme, isDark, mounted } = useTheme();

  if (!mounted) return null; // Prevent hydration mismatch

  return (
    <div>
      {isDark ? "Dark mode" : "Light mode"}
    </div>
  );
}
```

### Using Theme Utilities

The `src/lib/theme-utils.ts` file provides helpful utilities:

```tsx
import { useThemeUtils, getCSSVariableValue } from "@/lib/theme-utils";

export function MyComponent() {
  const { isDark, toggleTheme, setDark, setLight } = useThemeUtils();

  // Get a CSS variable value
  const bgColor = getCSSVariableValue("--background");

  return (
    <button onClick={toggleTheme}>
      {isDark ? "Switch to Light" : "Switch to Dark"}
    </button>
  );
}
```

## Styling with Themes

### Using Tailwind Dark Mode

Tailwind automatically handles the `.dark` class:

```tsx
<div className="bg-white dark:bg-slate-950">
  This div is white in light mode and dark gray in dark mode
</div>
```

### Using CSS Variables

Use the CSS variables in your styles:

```css
.my-component {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  border-color: hsl(var(--border));
}
```

## Available CSS Variables

### Colors
- `--background` - Page background
- `--foreground` - Text color
- `--primary` - Primary accent color (green)
- `--primary-foreground` - Text on primary
- `--secondary` - Secondary color
- `--secondary-foreground` - Text on secondary
- `--destructive` - Error/delete color (red)
- `--destructive-foreground` - Text on destructive
- `--border` - Border color
- `--input` - Input field background
- `--ring` - Focus ring color
- `--muted` - Muted color
- `--muted-foreground` - Muted text
- `--accent` - Accent color
- `--accent-foreground` - Text on accent
- `--card` - Card background
- `--card-foreground` - Card text

### Custom Variables
- `--glow-primary` - Primary glow effect
- `--gradient-start` - Gradient start color
- `--gradient-end` - Gradient end color
- `--surface-elevated` - Elevated surface color

### Sidebar Variables
- `--sidebar-background`
- `--sidebar-foreground`
- `--sidebar-primary`
- `--sidebar-accent`
- `--sidebar-border`

## Customizing the Theme

To customize colors, edit `src/index.css`:

1. Find the `:root` section (light theme)
2. Find the `.dark` section (dark theme)
3. Modify the HSL values

Example - Change primary color to blue:
```css
:root {
  --primary: 217 91% 60%; /* Changed from green */
}

.dark {
  --primary: 217 91% 60%; /* Same blue in dark mode */
}
```

## Hydration Safety

The components handle React hydration properly:

```tsx
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) return null; // Don't render until mounted
```

This prevents "hydration mismatch" errors when the server-rendered HTML doesn't match the client-rendered HTML.

## Browser Storage

Theme preference is automatically saved to localStorage under the key:
- `theme` (default) - Can be customized via ThemeProvider `storageKey` prop

To clear stored preference:
```javascript
localStorage.removeItem("theme");
```

## System Preference Detection

When `enableSystem={true}`, the app respects the OS dark mode setting:

```javascript
// Check user's system preference
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
```

## Troubleshooting

### Theme not changing
- Make sure `ThemeProvider` wraps all theme consumers
- Check that the `.dark` class is applied to the HTML element in DevTools
- Ensure `mounted` state is true before rendering theme-dependent content

### Hydration mismatch errors
- Always use the `mounted` check in components that read theme
- See example in `ThemeToggle.tsx`

### CSS variables not applied
- Verify `:root` and `.dark` selectors in `src/index.css`
- Check that variable names match those in `tailwind.config.ts`
- Ensure Tailwind is processing the CSS file

## Files Related to Theme

- `src/components/ThemeToggle.tsx` - Theme toggle button component
- `src/hooks/useTheme.ts` - Custom useTheme hook
- `src/lib/theme-utils.ts` - Theme utility functions
- `src/index.css` - CSS variables and dark mode styles
- `src/App.tsx` - ThemeProvider setup
- `tailwind.config.ts` - Tailwind dark mode configuration
