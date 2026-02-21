'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Armchair, LayoutTemplate } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const actions = [
  {
    label: 'New Design',
    description: 'Start a new room design from scratch',
    href: '/editor/new',
    icon: Plus,
    color: 'bg-primary/10 text-primary hover:bg-primary/20',
  },
  {
    label: 'Browse Furniture',
    description: 'Explore our furniture catalog',
    href: '/editor/new',
    icon: Armchair,
    color: 'bg-chart-2/10 text-chart-2 hover:bg-chart-2/20',
  },
  {
    label: 'Room Templates',
    description: 'Start with a pre-made room layout',
    href: '/editor/new',
    icon: LayoutTemplate,
    color: 'bg-chart-3/10 text-chart-3 hover:bg-chart-3/20',
  },
];

export function QuickActions() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {actions.map((action, i) => {
        const Icon = action.icon;
        return (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 + i * 0.08 }}
          >
            <Link href={action.href}>
              <Card className="group cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="flex items-center gap-4 pt-0">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${action.color}`}>
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium group-hover:text-primary transition-colors">{action.label}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}
