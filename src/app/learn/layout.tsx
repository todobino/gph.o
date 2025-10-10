
import { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Home, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="container mx-auto px-4 flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
                <Link href="/learn" className="flex items-center gap-2 font-semibold">
                    <div className="bg-primary/10 p-2 rounded-lg">
                      <GraduationCap className="h-5 w-5 text-primary"/>
                    </div>
                    <span>Learn</span>
                </Link>
                <nav className="hidden md:flex items-center gap-1">
                  <Button asChild variant="ghost">
                    <Link href="/learn/catalog">Catalog</Link>
                  </Button>
                  <Button asChild variant="ghost">
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
