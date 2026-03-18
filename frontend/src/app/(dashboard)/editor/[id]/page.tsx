'use client';

import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { EditorToolbar } from '@/components/editor/editor-toolbar';
import { FurniturePalette } from '@/components/editor/furniture-palette';
import { Canvas2D } from '@/components/editor/canvas-2D';
import { Viewport3D } from '@/components/editor/viewport-3D';
import { PropertiesPanel } from '@/components/editor/properties-panel';
import { RoomSettings } from '@/components/editor/room-settings';
import { ShadingControl } from '@/components/editor/shading-control';
import { KeyboardShortcutsDialog } from '@/shared/KeyboardShortcuts';
import { OnboardingOverlay } from '@/shared/OnboardingTooltip';
import { useEditorStore } from '@/lib/stores/useEditorStore';
import { useDesignStore } from '@/lib/stores/useDesignStore';
import { useUIStore } from '@/lib/stores/useUIStore';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useFurnitureStore } from '@/lib/stores/useFurnitureStore';
import { ROTATION_STEP } from '@/lib/constants';
import { fetchRoomTemplates } from '@/services/rooms.service';
import type { FurnitureItem } from '@/types/furniture.types';
import type { PlacedFurniture } from '@/types/editor.types';

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const designId = params.id as string;
  const templateId = searchParams.get('template');
  const [isSaving, setIsSaving] = useState(false);

  const {
    setRoom,
    setFurniture,
    setDesignId,
    setDesignName,
    setDirty,
    resetEditor,
    addFurniture,
    removeFurniture,
    updateFurniture,
    selectedItemId,
    selectItem,
    furniture,
    undo,
    redo,
    canUndo,
    canRedo,
    view,
    setView,
    toggleGrid,
    room,
    designName,
    designId: storedDesignId,
  } = useEditorStore();

  const { designs, loadDesigns, saveDesign, createDesign } = useDesignStore();
  const { items: furnitureItems, loadFurniture } = useFurnitureStore();
  const setShortcutsOpen = useUIStore((s) => s.setShortcutsDialogOpen);

  // Load design or create new
  const loadedDesignRef = useRef<string | null>(null);
  const loadedTemplateRef = useRef<string | null>(null);

  useEffect(() => {
    if (designs.length === 0) {
      loadDesigns();
    }
  }, [designs.length, loadDesigns]);

  useEffect(() => {
    if (furnitureItems.length === 0) {
      loadFurniture();
    }
  }, [furnitureItems.length, loadFurniture]);

  useEffect(() => {
    // Skip if this design was already loaded into the editor
    if (loadedDesignRef.current === designId) return;

    if (designId === 'new') {
      resetEditor();
      setDesignId(null);
      setDesignName('Untitled Design');
      loadedDesignRef.current = designId;
    } else {
      const design = designs.find((d) => d.id === designId);
      if (design) {
        setDesignId(design.id);
        setDesignName(design.name);
        setRoom(design.room);
        setFurniture(design.furniture);
        setDirty(false);
        loadedDesignRef.current = designId;
      }
    }
  }, [designId, designs, resetEditor, setDesignId, setDesignName, setRoom, setFurniture, setDirty]);

  useEffect(() => {
    if (designId !== 'new' || !templateId) return;
    if (loadedTemplateRef.current === templateId) return;

    let isActive = true;
    fetchRoomTemplates()
      .then((templates) => {
        if (!isActive) return;
        const template = templates.find((t) => t.id === templateId);
        if (!template) return;
        setRoom({
          id: 'new-room',
          name: template.name,
          ...template.room,
        });
        setDesignName(template.name);
        setDirty(false);
        loadedTemplateRef.current = templateId;
      })
      .catch(() => {
        // Ignore template loading errors; default room stays in place.
      });

    return () => {
      isActive = false;
    };
  }, [designId, templateId, setRoom, setDesignName, setDirty]);

  // Save handler
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // Simulate save delay
      await new Promise((r) => setTimeout(r, 600));

      const targetId = storedDesignId ?? (designId === 'new' ? null : designId);

      if (!targetId || !designs.find((d) => d.id === targetId)) {
        const created = await createDesign({
          name: designName,
          room,
          furniture,
          designerId: 'user-1',
        });
        setDesignId(created.id);
        router.replace(`/editor/${created.id}`);
      } else {
        await saveDesign(targetId, { name: designName, room, furniture });
      }

      setDirty(false);
      toast.success('Design saved', { description: `"${designName}" saved successfully` });
    } catch {
      toast.error('Save failed', { description: 'Please try again' });
    } finally {
      setIsSaving(false);
    }
  }, [designId, storedDesignId, designs, designName, room, furniture, createDesign, saveDesign, setDesignId, setDirty, router]);

  // Add furniture to canvas
  const handleAddFurniture = useCallback(
    (item: FurnitureItem) => {
      const newPlaced: PlacedFurniture = {
        id: `placed-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        furnitureId: item.id,
        position: {
          x: room.width / 2 - item.defaultWidth / 2,
          y: 0,
          z: room.length / 2 - item.defaultLength / 2,
        },
        rotation: 0,
        scale: 1,
        color: item.color,
        shading: 0.5,
      };
      addFurniture(newPlaced);
      selectItem(newPlaced.id);
      toast.success('Added', { description: `${item.name} placed in room` });
    },
    [addFurniture, selectItem, room.width, room.length]
  );

  // Keyboard shortcuts
  const shortcuts = useMemo(
    () => [
      { key: 'z', ctrl: true, handler: () => { if (canUndo) undo(); } },
      { key: 'z', ctrl: true, shift: true, handler: () => { if (canRedo) redo(); } },
      { key: 's', ctrl: true, handler: handleSave },
      {
        key: 'Delete',
        handler: () => {
          if (selectedItemId) {
            const itemData = furnitureItems.find(
              (f) => f.id === furniture.find((p) => p.id === selectedItemId)?.furnitureId
            );
            removeFurniture(selectedItemId);
            toast.success('Removed', { description: `${itemData?.name ?? 'Item'} removed` });
          }
        },
        disableInInput: true,
      },
      {
        key: 'Backspace',
        handler: () => {
          if (selectedItemId) {
            removeFurniture(selectedItemId);
            toast.success('Removed', { description: 'Item removed from room' });
          }
        },
        disableInInput: true,
      },
      {
        key: 'r',
        handler: () => {
          if (selectedItemId) {
            const item = furniture.find((f) => f.id === selectedItemId);
            if (item) {
              updateFurniture(selectedItemId, {
                rotation: (item.rotation + ROTATION_STEP) % 360,
              });
              toast.success('Rotated', { description: `${ROTATION_STEP}° clockwise` });
            }
          }
        },
        disableInInput: true,
      },
      {
        key: 'd',
        ctrl: true,
        handler: () => {
          if (selectedItemId) {
            const item = furniture.find((f) => f.id === selectedItemId);
            if (item) {
              const dup: PlacedFurniture = {
                ...item,
                id: `placed-${Date.now()}`,
                position: { ...item.position, x: item.position.x + 0.5, z: item.position.z + 0.5 },
              };
              addFurniture(dup);
              selectItem(dup.id);
              toast.success('Duplicated');
            }
          }
        },
      },
      { key: '2', handler: () => setView('2d'), disableInInput: true },
      { key: '3', handler: () => setView('3d'), disableInInput: true },
      { key: 'g', handler: toggleGrid, disableInInput: true },
      { key: 'Escape', handler: () => selectItem(null) },
      { key: '?', handler: () => setShortcutsOpen(true), disableInInput: true },
    ],
    [
      canUndo, canRedo, undo, redo, handleSave,
      selectedItemId, furniture, removeFurniture, updateFurniture,
      addFurniture, selectItem, setView, toggleGrid, setShortcutsOpen,
    ]
  );

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Toolbar */}
      <EditorToolbar onSave={handleSave} isSaving={isSaving} />

      {/* Secondary toolbar: room settings + shading */}
      <div className="flex items-center gap-2 border-b px-3 py-2">
        <RoomSettings />
        <ShadingControl />
      </div>

      {/* Editor body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Furniture palette */}
        <FurniturePalette onAddFurniture={handleAddFurniture} />

        {/* Center: Canvas */}
        <div className="relative flex-1 overflow-hidden">
          <div className={`absolute inset-0 ${view === '2d' ? 'block' : 'hidden'}`}>
            <Canvas2D />
          </div>
          <div className={`absolute inset-0 ${view === '3d' ? 'block' : 'hidden'}`}>
            <Viewport3D />
          </div>
        </div>

        {/* Right: Properties panel */}
        <PropertiesPanel />
      </div>

      {/* Keyboard shortcuts dialog */}
      <KeyboardShortcutsDialog />

      {/* Onboarding for first-time users */}
      <OnboardingOverlay />
    </div>
  );
}
