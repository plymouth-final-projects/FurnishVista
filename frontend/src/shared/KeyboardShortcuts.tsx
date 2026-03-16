'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUIStore } from '@/states/useUIStore';
import { KEYBOARD_SHORTCUTS } from '@/lib/constants';
import { Keyboard } from 'lucide-react';

export function KeyboardShortcutsDialog() {
  const { shortcutsDialogOpen, setShortcutsDialogOpen } = useUIStore();

  return (
    <Dialog open={shortcutsDialogOpen} onOpenChange={setShortcutsDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Keyboard className="h-5 w-5 text-primary" aria-hidden="true" />
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </div>
          <DialogDescription>
            Speed up your workflow with these shortcuts
          </DialogDescription>
        </DialogHeader>
        <dl className="space-y-1">
          {KEYBOARD_SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.key}
              className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-muted/50"
            >
              <dt className="text-muted-foreground">{shortcut.action}</dt>
              <dd>
                <kbd className="rounded-md border bg-muted px-2 py-0.5 font-mono text-xs">
                  {shortcut.key}
                </kbd>
              </dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
