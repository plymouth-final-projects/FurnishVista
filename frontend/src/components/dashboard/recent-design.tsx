'use client';

import Link from 'next/link';
import { ArrowRight, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DesignCard } from '@/components/designs/DesignCard';
import { EmptyState } from '@/shared/EmptyState';
import type { Design } from '@/types/design.types';

interface RecentDesignsProps {
  designs: Design[];
}

export function RecentDesigns({ designs }: RecentDesignsProps) {
  if (designs.length === 0) {
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

  const recentDesigns = designs.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Recent Designs</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/designs" className="gap-1.5">
            View all
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recentDesigns.map((design, i) => (
          <DesignCard key={design.id} design={design} index={i} />
        ))}
      </div>
    </div>
  );
}
