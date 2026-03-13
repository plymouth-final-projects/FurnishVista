'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './theme-toggle';
import { UserNav } from './user-nav';
import { useUIStore } from '@/states/useUIStore';

interface HeaderProps {
  title?: string;
}

export function Header({ title }: HeaderProps) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
    <header
      className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b bg-background/80 px-6 backdrop-blur-md transition-[margin-left] duration-200"
      style={{ marginLeft: sidebarOpen ? 240 : 64 }}
    >
      {title && (
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
      )}

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
        <Separator orientation="vertical" className="h-6" />
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}
