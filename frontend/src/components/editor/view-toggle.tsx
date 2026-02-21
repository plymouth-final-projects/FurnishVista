'use client';

import { motion } from 'framer-motion';
import { Square, Box } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EditorView } from '@/types/editor.types';

interface ViewToggleProps {
  view: EditorView;
  onChange: (view: EditorView) => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="relative flex h-9 items-center rounded-lg bg-muted p-1" role="radiogroup" aria-label="Editor view mode">
      <motion.div
        className="absolute h-7 rounded-md bg-background shadow-sm"
        initial={false}
        animate={{ x: view === '2d' ? 0 : '100%', width: '50%' }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{ left: 4, width: 'calc(50% - 4px)' }}
      />
      <button
        role="radio"
        aria-checked={view === '2d'}
        onClick={() => onChange('2d')}
        className={cn(
          'relative z-10 flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors',
          view === '2d' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Square className="h-3.5 w-3.5" aria-hidden="true" />
        2D
      </button>
      <button
        role="radio"
        aria-checked={view === '3d'}
        onClick={() => onChange('3d')}
        className={cn(
          'relative z-10 flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium transition-colors',
          view === '3d' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        )}
      >
        <Box className="h-3.5 w-3.5" aria-hidden="true" />
        3D
      </button>
    </div>
  );
}
