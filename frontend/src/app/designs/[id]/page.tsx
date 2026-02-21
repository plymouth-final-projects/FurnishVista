'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Pencil,
  Copy,
  Trash2,
  Clock,
  Ruler,
  Armchair,
  Box,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useDesignStore } from '@/states/useDesignStore';
import { useUIStore } from '@/states/useUIStore';
import { mockFurniture } from '@/lib/mock-data';

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function DesignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { designs, loadMockDesigns, getDesignById, duplicateDesign, deleteDesign } = useDesignStore();
  const { openConfirmDialog } = useUIStore();
  const id = params.id as string;

  useEffect(() => {
    if (designs.length === 0) loadMockDesigns();
  }, [designs.length, loadMockDesigns]);

  const design = getDesignById(id);

  if (!design) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <h2 className="text-xl font-semibold">Design not found</h2>
        <p className="mt-2 text-muted-foreground">
          This design may have been deleted or the link is incorrect.
        </p>
        <Button variant="outline" className="mt-6" onClick={() => router.push('/designs')}>
          Back to designs
        </Button>
      </div>
    );
  }

  const floorTypeLabel = design.room.floorType.charAt(0).toUpperCase() + design.room.floorType.slice(1);
  const area = design.room.width * design.room.length;

  function handleEdit() {
    router.push(`/editor/${design!.id}`);
  }

  function handleDuplicate() {
    const newDesign = duplicateDesign(design!.id);
    if (newDesign) {
      toast.success('Design duplicated', {
        description: `"${newDesign.name}" has been created`,
      });
      router.push(`/designs/${newDesign.id}`);
    }
  }

  function handleDelete() {
    openConfirmDialog(
      'Delete design',
      `Are you sure you want to delete "${design!.name}"? This action cannot be undone.`,
      () => {
        deleteDesign(design!.id);
        toast.success('Design deleted');
        router.push('/designs');
      }
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 gap-1.5"
          onClick={() => router.push('/designs')}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to designs
        </Button>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{design.name}</h1>
            <p className="mt-1 text-muted-foreground">{design.room.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleEdit} className="gap-1.5">
              <Pencil className="h-4 w-4" />
              Open Editor
            </Button>
            <Button variant="outline" size="icon" onClick={handleDuplicate} aria-label="Duplicate design">
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDelete} aria-label="Delete design">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Room Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2"
        >
          <Card className="overflow-hidden">
            <div
              className="relative h-64 w-full"
              style={{ backgroundColor: design.room.wallColor }}
            >
              <div
                className="absolute bottom-0 left-0 right-0 h-20"
                style={{ backgroundColor: design.room.floorColor }}
              />
              {/* Mini furniture indicators */}
              {design.furniture.map((f) => {
                const fur = mockFurniture.find((mf) => mf.id === f.furnitureId);
                if (!fur) return null;
                const leftPercent = (f.position.x / design.room.width) * 100;
                const topPercent = ((design.room.length - f.position.z) / design.room.length) * 100;
                return (
                  <div
                    key={f.id}
                    className="absolute h-4 w-4 rounded-sm border border-white/50"
                    style={{
                      left: `${Math.min(95, Math.max(5, leftPercent))}%`,
                      top: `${Math.min(85, Math.max(10, topPercent))}%`,
                      backgroundColor: f.color,
                    }}
                    title={fur.name}
                  />
                );
              })}
              <div className="absolute bottom-4 left-4">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                  <Box className="mr-1 h-3 w-3" aria-hidden="true" />
                  Room Preview
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Room Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Room Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Dimensions</span>
                <span className="font-medium">
                  {design.room.width}m &times; {design.room.length}m &times; {design.room.height}m
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Area</span>
                <span className="font-medium">{area.toFixed(1)} m&sup2;</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Floor type</span>
                <span className="font-medium">{floorTypeLabel}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Shape</span>
                <span className="font-medium capitalize">{design.room.shape}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Colours</span>
                <div className="flex items-center gap-1.5">
                  <div
                    className="h-5 w-5 rounded-sm border"
                    style={{ backgroundColor: design.room.wallColor }}
                    title="Wall"
                  />
                  <div
                    className="h-5 w-5 rounded-sm border"
                    style={{ backgroundColor: design.room.floorColor }}
                    title="Floor"
                  />
                  <div
                    className="h-5 w-5 rounded-sm border"
                    style={{ backgroundColor: design.room.ceilingColor }}
                    title="Ceiling"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Furniture List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Armchair className="h-5 w-5 text-muted-foreground" />
                <CardTitle className="text-base">
                  Furniture ({design.furniture.length} items)
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {design.furniture.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No furniture placed yet. Open the editor to start designing.
                </p>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {design.furniture.map((placed) => {
                    const fur = mockFurniture.find((mf) => mf.id === placed.furnitureId);
                    if (!fur) return null;
                    return (
                      <div
                        key={placed.id}
                        className="flex items-center gap-3 rounded-lg border p-3"
                      >
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md"
                          style={{ backgroundColor: placed.color + '20' }}
                        >
                          <div
                            className="h-5 w-5 rounded-sm"
                            style={{ backgroundColor: placed.color }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{fur.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {fur.category} &middot; {placed.rotation}&deg; &middot; {Math.round(placed.scale * 100)}%
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Timestamps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3"
        >
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Created {formatDate(design.createdAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <Ruler className="h-4 w-4" aria-hidden="true" />
              Last updated {formatDate(design.updatedAt)}
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
