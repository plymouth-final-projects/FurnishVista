'use client';

import { motion } from 'framer-motion';
import { Palette, Clock, CalendarDays, TrendingUp, type LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatItem {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  color: string;
}

interface StatsCardsProps {
  totalDesigns: number;
  recentActivity: number;
  thisMonth: number;
}

export function StatsCards({ totalDesigns, recentActivity, thisMonth }: StatsCardsProps) {
  const stats: StatItem[] = [
    {
      label: 'Total Designs',
      value: totalDesigns,
      icon: Palette,
      color: 'bg-primary/10 text-primary',
    },
    {
      label: 'Recent Activity',
      value: recentActivity,
      icon: Clock,
      trend: '+2 this week',
      color: 'bg-chart-2/10 text-chart-2',
    },
    {
      label: 'This Month',
      value: thisMonth,
      icon: CalendarDays,
      color: 'bg-chart-3/10 text-chart-3',
    },
    {
      label: 'Completion Rate',
      value: '87%',
      icon: TrendingUp,
      trend: '+5% from last month',
      color: 'bg-chart-4/10 text-chart-4',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.08 }}
            className="h-full"
          >
            <Card className="relative overflow-hidden h-full">
              <CardContent className="flex items-center gap-4 pt-0 h-full">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                  {stat.trend && (
                    <p className="text-xs text-muted-foreground">{stat.trend}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
