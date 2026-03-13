'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Armchair,
  LayoutDashboard,
  Palette,
  Home,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useUIStore } from '@/states/useUIStore';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/designs', label: 'My Designs', icon: Palette },
  { href: '/rooms', label: 'Rooms', icon: Home },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 240 : 64 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-30 flex h-screen flex-col border-r bg-sidebar"
    >
      {/* Logo */}
      <Link href="/" className="flex h-16 items-center gap-2.5 px-4 hover:opacity-80 transition-opacity">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Armchair className="h-5 w-5" aria-hidden="true" />
        </div>
        <AnimatePresence>
          {sidebarOpen && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden whitespace-nowrap text-lg font-bold tracking-tight"
            >
              FurnishVista
            </motion.span>
          )}
        </AnimatePresence>
      </Link>

      <Separator />

      {/* New Design button */}
      <div className="px-3 pt-4 pb-2">
        {sidebarOpen ? (
          <Button asChild className="w-full justify-start gap-2" size="lg">
            <Link href="/editor/new">
              <Plus className="h-4 w-4" />
              New Design
            </Link>
          </Button>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button asChild size="icon" className="h-10 w-full">
                <Link href="/editor/new" aria-label="New Design">
                  <Plus className="h-4 w-4" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">New Design</TooltipContent>
          </Tooltip>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-2" aria-label="Main navigation">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          if (!sidebarOpen) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex h-10 w-full items-center justify-center rounded-lg transition-colors',
                      isActive
                        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="truncate"
              >
                {item.label}
              </motion.span>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t p-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size={sidebarOpen ? 'sm' : 'icon'}
              onClick={toggleSidebar}
              className={cn('w-full', sidebarOpen && 'justify-start gap-2')}
              aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              {sidebarOpen ? (
                <>
                  <PanelLeftClose className="h-4 w-4" />
                  <span className="text-sm">Collapse</span>
                </>
              ) : (
                <PanelLeft className="h-4 w-4" />
              )}
            </Button>
          </TooltipTrigger>
          {!sidebarOpen && <TooltipContent side="right">Expand sidebar</TooltipContent>}
        </Tooltip>
      </div>
    </motion.aside>
  );
}
