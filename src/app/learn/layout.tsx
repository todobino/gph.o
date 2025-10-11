
'use client';

import { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Home, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";


export default function LearnLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b sticky top-14 bg-background/95 backdrop-blur-sm z-10">
          <div className="container mx-auto px-4 flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
                <Link href="/learn" className="flex items-center gap-2 font-semibold">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-primary"/>
                    </div>
                    <span className="font-extrabold">Learn</span>
                </Link>
                <nav className="hidden md:flex items-center gap-1">
                  <Button asChild variant={pathname.startsWith('/learn/browse') ? 'secondary' : 'ghost'}>
                    <Link href="/learn/browse">Browse</Link>
                  </Button>
                  <Button asChild variant={pathname.startsWith('/learn/progress') ? 'secondary' : 'ghost'}>
                    <Link href="/learn/progress">My Progress</Link>
                  </Button>
                </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      </div>
  );
}
