import Link from 'next/link';
import { Armchair } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel — branding */}
      <div className="relative hidden w-1/2 bg-primary lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center text-primary-foreground">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
            <Armchair className="h-8 w-8" aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">FurnishVista</h1>
          <p className="max-w-sm text-lg text-primary-foreground/80">
            Visualize, design, and bring your furniture layouts to life in stunning 2D and 3D.
          </p>
        </div>
        {/* Decorative gradient circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
          <div className="absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-white/5" />
          <div className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-white/5" />
        </div>
      </div>

      {/* Right panel — auth form */}
      <div className="flex w-full flex-col items-center justify-center px-6 py-12 lg:w-1/2">
        {/* Mobile logo */}
        <Link
          href="/"
          className="mb-8 flex items-center gap-2 lg:hidden"
          aria-label="FurnishVista home"
        >
          <Armchair className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-xl font-bold">FurnishVista</span>
        </Link>
        {children}
      </div>
    </div>
  );
}
