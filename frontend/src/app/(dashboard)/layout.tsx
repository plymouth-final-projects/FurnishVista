'use client';

import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { AuthGuard } from '@/components/shared/AuthGuard';
import { useUIStore } from '@/states/useUIStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
/*     <AuthGuard> */
      <div className="min-h-screen bg-background">
        <Sidebar />
        <Header />
        <main
          className="min-h-[calc(100vh-4rem)] transition-[margin-left] duration-200"
          style={{ marginLeft: sidebarOpen ? 240 : 64 }}
        >
          {children}
        </main>
      </div>
/*     </AuthGuard> */
  );
}
