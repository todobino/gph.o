import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/app-providers';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Admin - GeePawHill.Org CMS',
  description: 'Admin dashboard for GeePawHill.Org',
};

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className={cn(
          'h-full overflow-hidden bg-muted/40 font-sans antialiased',
          inter.variable
        )}
      >
        <AppProviders>
            {/* A more complex layout with a sidebar could go here */}
            <div className="h-dvh overflow-y-auto overscroll-none">
              <main className="flex-grow p-4 md:p-8">
                {children}
              </main>
            </div>
            <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
