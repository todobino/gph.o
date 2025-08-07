import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { AppProviders } from '@/components/app-providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
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
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased flex flex-col',
          inter.variable,
          spaceGrotesk.variable
        )}
      >
        <AppProviders>
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
              {children}
            </main>
            <Footer />
            <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
