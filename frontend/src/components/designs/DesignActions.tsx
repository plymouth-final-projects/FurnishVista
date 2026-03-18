'use client';

import Link from 'next/link';
import { Search, Plus, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDesignStore } from '@/lib/stores/useDesignStore';
import type { DesignSortBy } from '@/types/design.types';

export function DesignActions() {
  const { filters, setFilters } = useDesignStore();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder="Search designs..."
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            className="pl-10"
            aria-label="Search designs"
          />
        </div>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => setFilters({ sortBy: value as DesignSortBy })}
        >
          <SelectTrigger className="w-44" aria-label="Sort by">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="updatedAt">Last modified</SelectItem>
            <SelectItem value="createdAt">Date created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setFilters({
              sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc',
            })
          }
          aria-label={`Sort ${filters.sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          <ArrowUpDown className={`h-4 w-4 transition-transform ${filters.sortOrder === 'asc' ? 'rotate-180' : ''}`} />
        </Button>
      </div>
      <Button asChild>
        <Link href="/editor/new">
          <Plus className="h-4 w-4" />
          New Design
        </Link>
      </Button>
    </div>
  );
}
