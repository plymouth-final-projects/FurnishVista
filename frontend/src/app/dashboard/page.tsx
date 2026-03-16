'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { StatsCards } from '@/components/dashboard/stat-card';
import { RecentDesigns } from '@/components/dashboard/recent-design';
import { QuickActions } from '@/components/dashboard/quick-action';
import { useAuthStore } from '@/states/useAuthStore';
import { useDesignStore } from '@/states/useDesignStore';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const { designs, loadMockDesigns } = useDesignStore();

  useEffect(() => {
    if (designs.length === 0) {
      loadMockDesigns();
    }
  }, [designs.length, loadMockDesigns]);

  const sortedDesigns = [...designs].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const thisMonth = designs.filter((d) => {
    const created = new Date(d.createdAt);
    const now = new Date();
    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="space-y-8 p-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()}, {user?.name?.split(' ')[0] ?? 'Designer'}
        </h1>
        <p className="mt-1 text-muted-foreground">
          Here&apos;s an overview of your design workspace
        </p>
      </motion.div>

      {/* Stats */}
      <StatsCards
        totalDesigns={designs.length}
        recentActivity={Math.min(designs.length, 5)}
        thisMonth={thisMonth}
      />

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Quick Actions</h2>
        <QuickActions />
      </div>

      {/* Recent Designs */}
      <RecentDesigns designs={sortedDesigns} />
    </div>
  );
}
