'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Save,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Grid3X3,
  Keyboard,
  Magnet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { ViewToggle } from './view-toggle';
import { useEditorStore } from '@/states/useEditorStore';
import { useUIStore } from '@/states/useUIStore';

interface EditorToolbarProps {
  onSave: () => void;
  isSaving: boolean;
}

export function EditorToolbar({ onSave, isSaving }: EditorToolbarProps) {
  const router = useRouter();
  const {
    designName, setDesignName,
    view, setView,
    canUndo, canRedo, undo, redo,
    zoom, setZoom,
    gridVisible, toggleGrid,
    snapToGrid, toggleSnapToGrid,
    isDirty,
  } = useEditorStore();
  const setShortcutsOpen = useUIStore((s) => s.setShortcutsDialogOpen);

  return (
    <div className="flex h-14 shrink-0 items-center gap-2 border-b bg-background px-3">
      {/* Back */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => router.push('/designs')} aria-label="Back to designs">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Back to designs</TooltipContent>
      </Tooltip>

      {/* Design name */}
      <Input
        value={designName}
        onChange={(e) => setDesignName(e.target.value)}
        className="h-8 w-48 border-transparent bg-transparent text-sm font-medium hover:border-input focus:border-input"
        aria-label="Design name"
      />
      {isDirty && (
        <span className="h-2 w-2 rounded-full bg-warning" title="Unsaved changes" aria-label="Unsaved changes" role="status" />
      )}

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Undo/Redo */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} aria-label="Undo (Ctrl+Z)">
            <Undo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo (Ctrl+Z)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} aria-label="Redo (Ctrl+Shift+Z)">
            <Redo2 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo (Ctrl+Shift+Z)</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* View toggle */}
      <ViewToggle view={view} onChange={setView} />

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Grid & Snap */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={gridVisible ? 'secondary' : 'ghost'}
            size="icon"
            onClick={toggleGrid}
            aria-label={`${gridVisible ? 'Hide' : 'Show'} grid (G)`}
            aria-pressed={gridVisible}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{gridVisible ? 'Hide' : 'Show'} grid (G)</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={snapToGrid ? 'secondary' : 'ghost'}
            size="icon"
            onClick={toggleSnapToGrid}
            aria-label={`${snapToGrid ? 'Disable' : 'Enable'} snap to grid`}
            aria-pressed={snapToGrid}
          >
            <Magnet className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{snapToGrid ? 'Disable' : 'Enable'} snap to grid</TooltipContent>
      </Tooltip>

      <Separator orientation="vertical" className="mx-1 h-6" />

      {/* Zoom */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setZoom(zoom - 0.25)} disabled={zoom <= 0.25} aria-label="Zoom out">
            <ZoomOut className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom out</TooltipContent>
      </Tooltip>
      <span className="w-12 text-center text-xs text-muted-foreground tabular-nums">
        {Math.round(zoom * 100)}%
      </span>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" onClick={() => setZoom(zoom + 0.25)} disabled={zoom >= 4} aria-label="Zoom in">
            <ZoomIn className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Zoom in</TooltipContent>
      </Tooltip>

      {/* Right-aligned actions */}
      <div className="ml-auto flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setShortcutsOpen(true)} aria-label="Keyboard shortcuts (?)">
              <Keyboard className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Keyboard shortcuts (?)</TooltipContent>
        </Tooltip>

        <Button onClick={onSave} disabled={isSaving || !isDirty} size="sm">
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
}
