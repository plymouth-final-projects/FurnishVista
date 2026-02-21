'use client';

import { AuthGuard } from '@/components/shared/AuthGuard';

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
   /*  <AuthGuard> */
      <div className="h-screen bg-background">{children}</div>
    /*</AuthGuard> */
  );
}
