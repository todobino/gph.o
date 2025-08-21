
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AppProviders } from "@/components/app-providers";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "GeePawHill.Org",
  description: "Software Development Tidbits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-background text-foreground">
        <AppProviders>
          <Header />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
