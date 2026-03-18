'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Plus, Ruler, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getRoomTemplates } from '@/services/rooms.service';
import { useDesignStore } from '@/states/useDesignStore';
import type { RoomTemplate } from '@/types/room.types';

export default function RoomsPage() {
  const router = useRouter();
  const { designs, loadMockDesigns } = useDesignStore();
  const [templates, setTemplates] = useState<RoomTemplate[]>([]);

  useEffect(() => {
    if (designs.length === 0) loadMockDesigns();
    getRoomTemplates().then(setTemplates);
  }, [designs.length, loadMockDesigns]);

  // Extract unique rooms from designs
  const rooms = designs.map((d) => ({
    designId: d.id,
    designName: d.name,
    room: d.room,
    furnitureCount: d.furniture.length,
    updatedAt: d.updatedAt,
  }));

  function handleNewDesign() {
    router.push('/editor/new');
  }

  function handleUseTemplate(template: RoomTemplate) {
    toast.success(`Starting with "${template.name}" template`);
    router.push('/editor/new');
  }

  return (
    <div className="space-y-8 p-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
          <p className="mt-1 text-muted-foreground">
            Browse room templates and manage your room designs
          </p>
        </div>
        <Button onClick={handleNewDesign} className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Design
        </Button>
      </motion.div>

      {/* Templates */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Room Templates</h2>
        <p className="text-sm text-muted-foreground">
          Start a new design from a pre-configured room layout
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {templates.map((template, i) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.06 }}
            >
              <Card
                className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
                onClick={() => handleUseTemplate(template)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUseTemplate(template);
                }}
              >
                <div
                  className="relative h-32 w-full"
                  style={{ backgroundColor: template.room.wallColor }}
                >
                  <div
                    className="absolute bottom-0 left-0 right-0 h-10"
                    style={{ backgroundColor: template.room.floorColor }}
                  />
                  <div className="absolute right-3 top-3">
                    <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                      {template.room.floorType}
                    </Badge>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                    <Button variant="secondary" size="sm" className="shadow-lg" tabIndex={-1}>
                      Use template
                    </Button>
                  </div>
                </div>
                <CardContent className="pt-3 pb-3">
                  <h3 className="font-semibold text-sm">{template.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{template.description}</p>
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Ruler className="h-3 w-3" aria-hidden="true" />
                    {template.room.width}m &times; {template.room.length}m &times; {template.room.height}m
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Your Rooms */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Your Rooms</h2>
        <p className="text-sm text-muted-foreground">
          Rooms from your existing designs
        </p>
        {rooms.length === 0 ? (
          <Card className="flex flex-col items-center justify-center py-12 text-center">
            <CardContent>
              <p className="text-muted-foreground">No rooms yet. Create a new design to get started.</p>
              <Button variant="outline" className="mt-4 gap-1.5" onClick={handleNewDesign}>
                <Plus className="h-4 w-4" />
                Create design
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((item, i) => (
              <motion.div
                key={item.designId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
                  onClick={() => router.push(`/editor/${item.designId}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') router.push(`/editor/${item.designId}`);
                  }}
                >
                  <div
                    className="relative h-28 w-full"
                    style={{ backgroundColor: item.room.wallColor }}
                  >
                    <div
                      className="absolute bottom-0 left-0 right-0 h-8"
                      style={{ backgroundColor: item.room.floorColor }}
                    />
                    <div className="absolute left-3 top-3">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                        {item.furnitureCount} items
                      </Badge>
                    </div>
                    <div className="absolute right-3 top-3">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs">
                        {item.room.shape}
                      </Badge>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/20 group-hover:opacity-100">
                      <Button variant="secondary" size="sm" className="shadow-lg gap-1" tabIndex={-1}>
                        Open <ArrowUpRight className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="pt-3 pb-3">
                    <h3 className="font-semibold text-sm">{item.room.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      From &ldquo;{item.designName}&rdquo;
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Ruler className="h-3 w-3" aria-hidden="true" />
                        {item.room.width}m &times; {item.room.length}m
                      </span>
                      <span>
                        {item.room.floorType.charAt(0).toUpperCase() + item.room.floorType.slice(1)} floor
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
