
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
        <header className="border-b sticky top-14 bg-secondary z-10">
          <div className="container mx-auto px-4 flex items-center justify-between h-12">
            <div className="flex items-center gap-6">
                <Link href="/learn" className="flex items-center gap-2 font-semibold">
                    <GraduationCap className="h-6 w-6 text-primary"/>
                    <span className="font-extrabold">Learn</span>
                </Link>
                <nav className="hidden md:flex items-center gap-1">
                  <Button asChild size="sm" variant={pathname.startsWith('/learn/browse') ? 'secondary' : 'ghost'} className="transition-none">
                    <Link href="/learn/browse" className="font-semibold">Browse</Link>
                  </Button>
                  <Button asChild size="sm" variant={pathname.startsWith('/learn/my-courses') ? 'secondary' : 'ghost'} className="transition-none">
                    <Link href="/learn/my-courses" className="font-semibold">My Courses</Link>
                  </Button>
                </nav>
            </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      </div>
  );
}
