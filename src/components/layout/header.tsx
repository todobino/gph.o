'use client'; // Add 'use client' directive

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Feather } from 'lucide-react'; // Using Feather as a placeholder logo
import React from 'react'; // Import React

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false); // Close menu on link click
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Feather className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              GeePawHill.Org
            </span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {item.label}
              </Link>
            ))}
             {/* Keep Admin link separate or conditionally render based on auth */}
            <Link
                href="/admin"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
                Admin
            </Link>
          </nav>
        </div>

        {/* Mobile Menu */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link
                href="/"
                className="flex items-center space-x-2 mb-6"
                onClick={handleLinkClick} // Use handler
              >
                <Feather className="h-6 w-6 text-primary" />
                <span className="font-bold">GeePawHill.Org</span>
              </Link>
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    onClick={handleLinkClick} // Use handler
                  >
                    {item.label}
                  </Link>
                ))}
                 <Link
                    href="/admin" // Link to admin/CMS login
                    className="text-lg font-medium text-foreground transition-colors hover:text-primary"
                    onClick={handleLinkClick} // Use handler
                  >
                    Admin Login
                  </Link>
              </div>
            </SheetContent>
          </Sheet>
           {/* Mobile Title */}
           <Link href="/" className="flex items-center space-x-2">
             <Feather className="h-6 w-6 text-primary" />
             <span className="font-bold">GeePawHill.Org</span>
           </Link>
        </div>

        {/* Desktop Admin Login Button (Hidden on mobile by parent div) */}
        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
          <Button variant="ghost" asChild>
             {/* Ensure Link is direct child for asChild */}
             <Link href="/admin">Admin Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
