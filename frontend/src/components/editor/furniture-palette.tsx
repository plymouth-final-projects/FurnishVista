'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Armchair,
  Table,
  Archive,
  Lamp,
  Flower2,
  Search,
  GripVertical,
  type LucideIcon,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { mockFurniture } from '@/lib/mock-data';
import type { FurnitureItem, FurnitureCategory } from '@/types/furniture.types';

const categoryIcons: Record<FurnitureCategory, LucideIcon> = {
  seating: Armchair,
  tables: Table,
  storage: Archive,
  lighting: Lamp,
  decor: Flower2,
};

const categoryLabels: Record<FurnitureCategory, string> = {
  seating: 'Seating',
  tables: 'Tables',
  storage: 'Storage',
  lighting: 'Lighting',
  decor: 'Decor',
};

const categories: FurnitureCategory[] = ['seating', 'tables', 'storage', 'lighting', 'decor'];

interface FurniturePaletteProps {
  onAddFurniture: (item: FurnitureItem) => void;
}

export function FurniturePalette({ onAddFurniture }: FurniturePaletteProps) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<FurnitureCategory | 'all'>('all');
  const items = useMemo(() => {
    let filtered: FurnitureItem[] = mockFurniture;
    if (activeCategory !== 'all') {
      filtered = filtered.filter((i) => i.category === activeCategory);
    }
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (i) => i.name.toLowerCase().includes(q) || i.category.includes(q)
      );
    }
    return filtered;
  }, [search, activeCategory]);

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      {/* Header */}
      <div className="space-y-3 border-b p-3">
        <h3 className="text-sm font-semibold">Furniture</h3>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search furniture..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
            aria-label="Search furniture"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by category">
          <button
            onClick={() => setActiveCategory('all')}
            className={cn(
              'rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
              activeCategory === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:bg-accent'
            )}
            aria-pressed={activeCategory === 'all'}
          >
            All
          </button>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat];
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  'flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors',
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-accent'
                )}
                aria-pressed={activeCategory === cat}
              >
                <Icon className="h-3 w-3" aria-hidden="true" />
                {categoryLabels[cat]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Items list */}
      <ScrollArea className="flex-1">
        <div className="space-y-1 p-2">
          {items.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">
              No furniture found
            </p>
          ) : (
            items.map((item, i) => (
              <FurniturePaletteItem
                key={item.id}
                item={item}
                index={i}
                onAdd={() => onAddFurniture(item)}
              />
            ))
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-2">
        <p className="text-center text-[10px] text-muted-foreground">
          Click to place &middot; Drag onto canvas to position
        </p>
      </div>
    </div>
  );
}

function FurniturePaletteItem({
  item,
  index,
  onAdd,
}: {
  item: FurnitureItem;
  index: number;
  onAdd: () => void;
}) {
  const Icon = categoryIcons[item.category];

  return (
    <motion.button
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.03 }}
      onClick={onAdd}
      draggable
      onDragStart={(e) => {
        const drag = e as unknown as React.DragEvent;
        drag.dataTransfer.setData('furnitureId', item.id);
        drag.dataTransfer.effectAllowed = 'copy';
      }}
      className="group flex w-full cursor-grab items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent active:cursor-grabbing"
      aria-label={`Add ${item.name} to room`}
    >
      {/* Color swatch / icon */}
      <div
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border"
        style={{ backgroundColor: item.color + '20' }}
      >
        <Icon className="h-5 w-5" style={{ color: item.color }} aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{item.name}</p>
        <p className="text-[10px] text-muted-foreground">
          {item.defaultWidth}m &times; {item.defaultLength}m
        </p>
      </div>
      <GripVertical className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
    </motion.button>
  );
}
