'use client';

import { Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DesignCard } from './DesignCard';
import { EmptyState } from '@/components/shared/EmptyState';
import type { Design } from '@/types/design.types';
import Link from 'next/link';

interface DesignGridProps {
  designs: Design[];
  isSearching?: boolean;
}

export function DesignGrid({ designs, isSearching = false }: DesignGridProps) {
  if (designs.length === 0) {
    if (isSearching) {
      return (
        <EmptyState
          icon={Palette}
          title="No designs found"
          description="Try adjusting your search or filters to find what you're looking for."
        />
      );
    }

    return (
      <EmptyState
        icon={Palette}
        title="No designs yet"
        description="Create your first room design and start visualizing beautiful spaces."
        action={
          <Button asChild>
            <Link href="/editor/new">Create your first design</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {designs.map((design, i) => (
        <DesignCard key={design.id} design={design} index={i} />
      ))}
    </div>
  );
}
