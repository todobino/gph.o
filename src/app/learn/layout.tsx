import { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, GraduationCap, Home, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LearnLayout({ children }: { children: ReactNode }) {
  return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <div className="container mx-auto px-4 flex items-center justify-between h-16">
            <div className="flex items-center gap-6">
                <Link href="/learn" className="flex items-center gap-2 font-semibold">
                    <GraduationCap className="h-6 w-6 text-primary"/>
                    <span>Learn</span>
                </Link>
                <nav className="hidden md:flex text-sm items-center gap-4">
                  <Link href="/learn/catalog" className="text-muted-foreground hover:text-foreground">Catalog</Link>
                  <Link href="/learn/progress" className="text-muted-foreground hover:text-foreground">My Progress</Link>
                </nav>
            </div>
             <div className="flex items-center gap-2">
                 <Button variant="ghost" size="icon" asChild>
                    <Link href="/account"><User className="h-5 w-5" /></Link>
                 </Button>
                 <Button asChild>
                    <Link href="/">Back to Main Site</Link>
                 </Button>
             </div>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 flex-1">{children}</main>
      </div>
  );
}
