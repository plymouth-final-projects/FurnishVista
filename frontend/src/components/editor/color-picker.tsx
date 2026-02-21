'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const PRESET_COLORS = [
  '#8B7355', '#654321', '#D4A574', '#4A6741', '#2C2C2C',
  '#A0522D', '#696969', '#3C3C3C', '#E8D5B7', '#228B22',
  '#B8860B', '#4169E1', '#8B0000', '#F5F5DC', '#FFFFFF',
];

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ label, value, onChange }: ColorPickerProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs">{label}</Label>
      <div className="flex items-center gap-2">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded-md border bg-transparent p-0.5"
            aria-label={`${label} color picker`}
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 flex-1 font-mono text-xs uppercase"
          maxLength={7}
          aria-label={`${label} hex value`}
        />
      </div>
      <div className="flex flex-wrap gap-1">
        {PRESET_COLORS.map((color) => (
          <button
            key={color}
            onClick={() => onChange(color)}
            className="h-5 w-5 rounded-sm border border-border transition-transform hover:scale-110 focus-visible:ring-2 focus-visible:ring-ring"
            style={{ backgroundColor: color }}
            aria-label={`Select color ${color}`}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
