import type { Metadata } from 'next';
import { Inter, Sora, Instrument_Serif, DM_Sans } from 'next/font/google';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ConfirmDialog } from '@/shared/ConfirmDialog';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const sora = Sora({
  variable: '--font-sora',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const instrumentSerif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FurnishVista — Furniture Visualization',
  description:
    'Premium furniture visualization tool for designers. Create stunning 2D and 3D room layouts with drag-and-drop simplicity.',
  keywords: ['furniture', 'visualization', '3D', 'room design', 'interior design'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${sora.variable} ${instrumentSerif.variable} ${dmSans.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange={false}
        >
          <TooltipProvider delayDuration={300}>
            {children}
            <Toaster
              position="bottom-right"
              richColors
              closeButton
              toastOptions={{
                duration: 3000,
              }}
            />
            <ConfirmDialog />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
