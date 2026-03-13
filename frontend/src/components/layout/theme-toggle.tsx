'use client';

import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      suppressHydrationWarning
      className="relative flex h-6 w-11 items-center rounded-full border border-border bg-muted transition-colors duration-200 hover:bg-muted/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {/* Track fill when dark */}
      <span
        className={`absolute inset-0 rounded-full transition-colors duration-200 ${isDark ? 'bg-primary' : 'bg-muted'}`}
      />
      {/* Thumb */}
      <span
        className={`relative flex h-5 w-5 items-center justify-center rounded-full bg-background shadow-sm transition-transform duration-200 ${isDark ? 'translate-x-5.5' : 'translate-x-px'}`}
      >
        {isDark ? (
          <Moon className="h-3 w-3 text-primary" />
        ) : (
          <Sun className="h-3 w-3 text-muted-foreground" />
        )}
      </span>
    </button>
  );
}
