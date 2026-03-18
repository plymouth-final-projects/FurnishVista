'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  MoreHorizontal,
  Pencil,
  Copy,
  Trash2,
  Clock,
  Ruler,
  Armchair,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useDesignStore } from '@/lib/stores/useDesignStore';
import { useUIStore } from '@/lib/stores/useUIStore';
import type { Design } from '@/types/design.types';

interface DesignCardProps {
  design: Design;
  index?: number;
}

const SRI_LANKA_TZ = 'Asia/Colombo';

function parseServerDate(dateStr: string): Date {
  const direct = new Date(dateStr);
  if (!Number.isNaN(direct.getTime())) {
    return direct;
  }

  const normalized = dateStr.includes(' ')
    ? `${dateStr.replace(' ', 'T')}+05:30`
    : `${dateStr}+05:30`;
  return new Date(normalized);
}

function tzDayStamp(date: Date): number {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: SRI_LANKA_TZ,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);
  const year = Number(parts.find((p) => p.type === 'year')?.value ?? 0);
  const month = Number(parts.find((p) => p.type === 'month')?.value ?? 1) - 1;
  const day = Number(parts.find((p) => p.type === 'day')?.value ?? 1);
  return Date.UTC(year, month, day);
}

function formatUpdatedAt(dateStr: string): string {
  const date = parseServerDate(dateStr);
  if (Number.isNaN(date.getTime())) {
    return dateStr;
  }

  const now = new Date();
  const diffDays = Math.floor((tzDayStamp(now) - tzDayStamp(date)) / (1000 * 60 * 60 * 24));
  const time = new Intl.DateTimeFormat('en-US', {
    timeZone: SRI_LANKA_TZ,
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);

  if (diffDays === 0) return `Today, ${time}`;
  if (diffDays === 1) return `Yesterday, ${time}`;

  const monthDay = new Intl.DateTimeFormat('en-US', {
    timeZone: SRI_LANKA_TZ,
    month: 'short',
    day: 'numeric',
  }).format(date);

  return `${monthDay}, ${time}`;
}

export function DesignCard({ design, index = 0 }: DesignCardProps) {
  const router = useRouter();
  const { duplicateDesign, removeDesign } = useDesignStore();
  const { openConfirmDialog } = useUIStore();

  function handleEdit() {
    router.push(`/editor/${design.id}`);
  }

  async function handleDuplicate() {
    const newDesign = await duplicateDesign(design.id);
    if (newDesign) {
      toast.success('Design duplicated', {
        description: `"${newDesign.name}" has been created`,
      });
    }
  }

  function handleDelete() {
    openConfirmDialog(
      'Delete design',
      `Are you sure you want to delete "${design.name}"? This action cannot be undone.`,
      async () => {
        await removeDesign(design.id);
        toast.success('Design deleted', {
          description: `"${design.name}" has been removed`,
        });
      }
    );
  }

  const floorTypeLabel = design.room.floorType.charAt(0).toUpperCase() + design.room.floorType.slice(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Card className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg">
        {/* Thumbnail / Color Preview */}
        <div
          className="relative h-40 w-full"
          style={{ backgroundColor: design.room.wallColor }}
          onClick={handleEdit}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleEdit(); }}
          aria-label={`Open ${design.name} in editor`}
        >
          {/* Floor preview strip */}
          <div
            className="absolute bottom-0 left-0 right-0 h-12"
            style={{ backgroundColor: design.room.floorColor }}
          />

          {/* Furniture count badge */}
          <div className="absolute left-3 top-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              <Armchair className="mr-1 h-3 w-3" aria-hidden="true" />
              {design.furniture.length} items
            </Badge>
          </div>

          {/* Room type badge */}
          <div className="absolute right-3 top-3">
            <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
              {floorTypeLabel}
            </Badge>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
            <Button variant="secondary" size="sm" className="shadow-lg" tabIndex={-1}>
              <Pencil className="mr-1.5 h-3.5 w-3.5" />
              Open Editor
            </Button>
          </div>
        </div>

        <CardContent className="pt-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-semibold leading-tight">{design.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{design.room.name}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Actions for ${design.name}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEdit}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Ruler className="h-3 w-3" aria-hidden="true" />
              {design.room.width}m &times; {design.room.length}m
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {formatUpdatedAt(design.updatedAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
