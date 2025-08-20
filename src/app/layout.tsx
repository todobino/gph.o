
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/app-providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'GeePawHill.Org CMS',
  description: 'Website and CMS for GeePawHill.Org',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={cn(
          // lock the viewport, no bounce on iOS
          'h-full overflow-hidden bg-background font-sans antialiased',
          inter.variable
        )}
      >
        <AppProviders>
            <Header />
            {/* This is the ONLY scroller */}
            <div className="h-dvh overflow-y-auto overscroll-none">
              <main className="flex-grow container mx-auto px-2 py-8 max-w-6xl">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
