'use client';

import { Sidebar } from '@/components/dashboard/layout/sidebar';
import { Header } from '@/components/dashboard/layout/header';
import { useUIStore } from '@/./lib/stores/useUIStore';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebarOpen = useUIStore((s) => s.sidebarOpen);

  return (
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
  );
}