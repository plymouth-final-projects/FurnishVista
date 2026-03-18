'use client';

import { toast } from 'sonner';
import { Sun, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ColorPicker } from './color-picker';
import { useEditorStore } from '@/lib/stores/useEditorStore';

export function ShadingControl() {
  const { furniture, setFurniture, pushHistory } = useEditorStore();

  function applyGlobalShading(shading: number) {
    pushHistory();
    setFurniture(furniture.map((f) => ({ ...f, shading })));
    useEditorStore.setState({ isDirty: true });
    toast.success('Shading applied', {
      description: `Set to ${Math.round(shading * 100)}% for all items`,
    });
  }

  function applyGlobalColor(color: string) {
    pushHistory();
    setFurniture(furniture.map((f) => ({ ...f, color })));
    useEditorStore.setState({ isDirty: true });
    toast.success('Color applied', {
      description: 'Applied to all furniture items',
    });
  }

  return (
    <div className="flex gap-1">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5" disabled={furniture.length === 0}>
            <Sun className="h-4 w-4" />
            Shading
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-3">
            <Label className="text-xs font-medium">Global Shading</Label>
            <p className="text-[10px] text-muted-foreground">
              Apply shading to all furniture in the design
            </p>
            <div className="flex gap-2">
              {[0, 0.25, 0.5, 0.75, 1].map((val) => (
                <Button
                  key={val}
                  variant="outline"
                  size="sm"
                  className="flex-1 text-[10px]"
                  onClick={() => applyGlobalShading(val)}
                >
                  {Math.round(val * 100)}%
                </Button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5" disabled={furniture.length === 0}>
            <Paintbrush className="h-4 w-4" />
            Color All
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64" align="start">
          <div className="space-y-3">
            <Label className="text-xs font-medium">Global Color</Label>
            <p className="text-[10px] text-muted-foreground">
              Apply a color to all furniture in the design
            </p>
            <ColorPicker
              label="Color"
              value={furniture[0]?.color ?? '#8B7355'}
              onChange={applyGlobalColor}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
