'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { DesignActions } from '@/components/designs/DesignActions';
import { DesignGrid } from '@/components/designs/DesignGrid';
import { useDesignStore } from '@/lib/stores/useDesignStore';

export default function DesignsPage() {
  const { designs, loadDesigns, filteredDesigns, filters } = useDesignStore();

  useEffect(() => {
    if (designs.length === 0) {
      loadDesigns();
    }
  }, [designs.length, loadDesigns]);

  const displayDesigns = filteredDesigns();

  return (
    <div className="space-y-6 p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">My Designs</h1>
        <p className="mt-1 text-muted-foreground">
          Manage and organize all your room designs
        </p>
      </motion.div>

      <DesignActions />

      <DesignGrid designs={displayDesigns} isSearching={!!filters.search} />

      {displayDesigns.length > 0 && (
        <p className="text-center text-sm text-muted-foreground">
          Showing {displayDesigns.length} of {designs.length} designs
        </p>
      )}
    </div>
  );
}
