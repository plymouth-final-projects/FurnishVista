'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  RotateCw,
  Trash2,
  Copy,
  Move,
  Maximize,
  Sun,
  MousePointerClick,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from './color-picker';
import { useEditorStore } from '@/states/useEditorStore';
import { mockFurniture } from '@/lib/mock-data';
import { ROTATION_STEP } from '@/lib/constants';

export function PropertiesPanel() {
  const {
    furniture,
    selectedItemId,
    updateFurniture,
    removeFurniture,
    addFurniture,
    selectItem,
  } = useEditorStore();

  const selectedPlaced = furniture.find((f) => f.id === selectedItemId);
  const selectedFurniture = selectedPlaced
    ? mockFurniture.find((f) => f.id === selectedPlaced.furnitureId)
    : null;

  function handleRotate() {
    if (!selectedPlaced) return;
    updateFurniture(selectedPlaced.id, {
      rotation: (selectedPlaced.rotation + ROTATION_STEP) % 360,
    });
    toast.success('Rotated', { description: `${ROTATION_STEP}° clockwise` });
  }

  function handleDuplicate() {
    if (!selectedPlaced) return;
    const newItem = {
      ...selectedPlaced,
      id: `placed-${Date.now()}`,
      position: {
        ...selectedPlaced.position,
        x: selectedPlaced.position.x + 0.5,
        z: selectedPlaced.position.z + 0.5,
      },
    };
    addFurniture(newItem);
    selectItem(newItem.id);
    toast.success('Duplicated', { description: selectedFurniture?.name ?? 'Item' });
  }

  function handleDelete() {
    if (!selectedPlaced) return;
    const name = selectedFurniture?.name ?? 'Item';
    removeFurniture(selectedPlaced.id);
    toast.success('Removed', { description: `${name} removed from room` });
  }

  return (
    <div className="flex h-full w-72 flex-col border-l bg-background">
      <div className="border-b p-3">
        <h3 className="text-sm font-semibold">Properties</h3>
      </div>

      <ScrollArea className="flex-1">
        <AnimatePresence mode="wait">
          {!selectedPlaced ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center"
            >
              <MousePointerClick className="h-10 w-10 text-muted-foreground/40" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                Select a furniture item to edit its properties
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={selectedPlaced.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="space-y-4 p-3"
            >
              {/* Item Info */}
              <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                  style={{ backgroundColor: selectedPlaced.color + '30' }}
                >
                  <div
                    className="h-5 w-5 rounded"
                    style={{ backgroundColor: selectedPlaced.color }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    {selectedFurniture?.name ?? 'Unknown'}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {selectedFurniture?.category ?? ''}
                  </p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="flex gap-1.5">
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleRotate}>
                  <RotateCw className="h-3.5 w-3.5" />
                  Rotate
                </Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={handleDuplicate}>
                  <Copy className="h-3.5 w-3.5" />
                  Duplicate
                </Button>
                <Button variant="outline" size="sm" className="text-xs text-destructive hover:text-destructive" onClick={handleDelete} aria-label="Delete item">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Separator />

              {/* Position */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <Move className="h-3.5 w-3.5" />
                  Position
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">X (m)</Label>
                    <Input
                      type="number"
                      step={0.1}
                      min={0}
                      value={selectedPlaced.position.x.toFixed(1)}
                      onChange={(e) =>
                        updateFurniture(selectedPlaced.id, {
                          position: { ...selectedPlaced.position, x: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="h-7 text-xs"
                      aria-label="X position in meters"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] text-muted-foreground">Y (m)</Label>
                    <Input
                      type="number"
                      step={0.1}
                      min={0}
                      value={selectedPlaced.position.z.toFixed(1)}
                      onChange={(e) =>
                        updateFurniture(selectedPlaced.id, {
                          position: { ...selectedPlaced.position, z: parseFloat(e.target.value) || 0 },
                        })
                      }
                      className="h-7 text-xs"
                      aria-label="Y position in meters"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Rotation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <RotateCw className="h-3.5 w-3.5" />
                    Rotation
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">{selectedPlaced.rotation}°</span>
                </div>
                <Slider
                  value={[selectedPlaced.rotation]}
                  min={0}
                  max={359}
                  step={15}
                  onValueChange={([val]) =>
                    updateFurniture(selectedPlaced.id, { rotation: val ?? 0 })
                  }
                  aria-label="Rotation in degrees"
                />
              </div>

              <Separator />

              {/* Scale */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Maximize className="h-3.5 w-3.5" />
                    Scale
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">{(selectedPlaced.scale * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[selectedPlaced.scale * 100]}
                  min={25}
                  max={300}
                  step={5}
                  onValueChange={([val]) =>
                    updateFurniture(selectedPlaced.id, { scale: (val ?? 100) / 100 })
                  }
                  aria-label="Scale percentage"
                />
              </div>

              <Separator />

              {/* Shading */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Sun className="h-3.5 w-3.5" />
                    Shading
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">{(selectedPlaced.shading * 100).toFixed(0)}%</span>
                </div>
                <Slider
                  value={[selectedPlaced.shading * 100]}
                  min={0}
                  max={100}
                  step={5}
                  onValueChange={([val]) =>
                    updateFurniture(selectedPlaced.id, { shading: (val ?? 0) / 100 })
                  }
                  aria-label="Shading intensity"
                />
              </div>

              <Separator />

              {/* Color */}
              <ColorPicker
                label="Color"
                value={selectedPlaced.color}
                onChange={(color) => updateFurniture(selectedPlaced.id, { color })}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </div>
  );
}
