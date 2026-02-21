'use client';

import { toast } from 'sonner';
import { Settings2, Ruler, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ColorPicker } from './color-picker';
import { useEditorStore } from '@/states/useEditorStore';
import type { FloorType } from '@/types/room.types';

const floorTypes: { value: FloorType; label: string }[] = [
  { value: 'wood', label: 'Hardwood' },
  { value: 'tile', label: 'Tile' },
  { value: 'carpet', label: 'Carpet' },
  { value: 'marble', label: 'Marble' },
];

export function RoomSettings() {
  const { room, updateRoom } = useEditorStore();

  function handleDimensionChange(field: 'width' | 'length' | 'height', value: string) {
    const num = parseFloat(value);
    if (isNaN(num)) return;

    if (field === 'height' && (num < 2 || num > 5)) return;
    if (field !== 'height' && (num < 1 || num > 20)) return;

    updateRoom({ [field]: num });
    toast.success('Room updated', { description: `${field} set to ${num}m` });
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Settings2 className="h-4 w-4" />
          Room Settings
        </Button>
      </SheetTrigger>
      <SheetContent className="w-80 p-0">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle>Room Settings</SheetTitle>
          <SheetDescription>
            Configure your room dimensions, shape, and colour scheme
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="space-y-6 p-4">
            {/* Room Name */}
            <div className="space-y-2">
              <Label htmlFor="room-name">Room Name</Label>
              <Input
                id="room-name"
                value={room.name}
                onChange={(e) => updateRoom({ name: e.target.value })}
                placeholder="Living Room"
              />
            </div>

            <Separator />

            {/* Dimensions */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Ruler className="h-4 w-4 text-muted-foreground" />
                Dimensions
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Width (m)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    min={1}
                    max={20}
                    value={room.width}
                    onChange={(e) => handleDimensionChange('width', e.target.value)}
                    className="h-8 text-xs"
                    aria-label="Room width in meters"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Length (m)</Label>
                  <Input
                    type="number"
                    step={0.5}
                    min={1}
                    max={20}
                    value={room.length}
                    onChange={(e) => handleDimensionChange('length', e.target.value)}
                    className="h-8 text-xs"
                    aria-label="Room length in meters"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Height (m)</Label>
                  <Input
                    type="number"
                    step={0.1}
                    min={2}
                    max={5}
                    value={room.height}
                    onChange={(e) => handleDimensionChange('height', e.target.value)}
                    className="h-8 text-xs"
                    aria-label="Room height in meters"
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Room area: {(room.width * room.length).toFixed(1)} m²
              </p>
            </div>

            <Separator />

            {/* Floor */}
            <div className="space-y-3">
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <Paintbrush className="h-4 w-4 text-muted-foreground" />
                Floor
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Floor Type</Label>
                <Select
                  value={room.floorType}
                  onValueChange={(value) => {
                    updateRoom({ floorType: value as FloorType });
                    toast.success('Floor updated', { description: `Changed to ${value}` });
                  }}
                >
                  <SelectTrigger aria-label="Floor type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {floorTypes.map((ft) => (
                      <SelectItem key={ft.value} value={ft.value}>
                        {ft.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ColorPicker
                label="Floor Color"
                value={room.floorColor}
                onChange={(color) => {
                  updateRoom({ floorColor: color });
                }}
              />
            </div>

            <Separator />

            {/* Walls */}
            <div className="space-y-3">
              <ColorPicker
                label="Wall Color"
                value={room.wallColor}
                onChange={(color) => updateRoom({ wallColor: color })}
              />
            </div>

            <Separator />

            {/* Ceiling */}
            <div className="space-y-3">
              <ColorPicker
                label="Ceiling Color"
                value={room.ceilingColor}
                onChange={(color) => updateRoom({ ceilingColor: color })}
              />
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
