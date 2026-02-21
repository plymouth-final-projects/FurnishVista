'use client';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  className?: string;
  size?: number;
  label?: string;
}

export function LoadingSpinner({ className, size = 24, label = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)} role="status">
      <Loader2 className="animate-spin text-primary" style={{ width: size, height: size }} aria-hidden="true" />
      {label && <p className="text-sm text-muted-foreground">{label}</p>}
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function FullPageLoader({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <LoadingSpinner size={32} label={label} />
    </div>
  );
}
