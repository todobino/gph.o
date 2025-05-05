

'use client'; // Add 'use client' directive

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // Added SheetClose
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added Dropdown components
import { Menu, Feather, ChevronDown } from 'lucide-react'; // Using Feather as a placeholder logo, Added ChevronDown
import React from 'react'; // Import React

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Define navigation structure
  const navItems = [
    {
        label: 'Posts',
        dropdown: [
            { href: '/posts', label: 'All Posts' },
            { href: '/posts?tag=video', label: 'Videos' },
            { href: '/posts?tag=podcast', label: 'Podcasts' },
            { href: '/subscribe', label: 'Subscribe!' },
        ]
    },
     {
        label: 'Courses',
        dropdown: [
            { href: '/courses/leading-technical-change', label: 'Leading Technical Change' }, // Placeholder URL
        ]
     },
     { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    // Removed Camerata
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
          <nav className="flex items-center space-x-1 text-sm font-medium">
             {/* Dynamic Nav Items */}
             {navItems.map((navItem) =>
                navItem.dropdown ? (
                  <DropdownMenu key={navItem.label}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-foreground/60 hover:text-foreground/80 px-3 py-2">
                        {navItem.label} <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {navItem.dropdown.map((item) => (
                        <DropdownMenuItem key={item.href} asChild><Link href={item.href}>{item.label}</Link></DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button key={navItem.href} variant="ghost" asChild className="text-foreground/60 hover:text-foreground/80 px-3 py-2"><Link href={navItem.href!}>{navItem.label}</Link></Button>
                )
              )}
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
              <nav className="flex flex-col space-y-3">
                {/* Mobile Nav Items */}
                {navItems.map((navItem) => (
                    <React.Fragment key={navItem.label || navItem.href}>
                        {navItem.dropdown ? (
                            <>
                                <div className="text-lg font-medium text-muted-foreground px-2 pt-2">{navItem.label}</div>
                                <div className="flex flex-col space-y-1 pl-4">
                                    {navItem.dropdown.map((item) => (
                                        <SheetClose key={item.href} asChild>
                                            <Link
                                            href={item.href}
                                            className="text-lg text-foreground transition-colors hover:text-primary py-1"
                                            onClick={handleLinkClick}
                                            >
                                            {item.label}
                                            </Link>
                                        </SheetClose>
                                    ))}
                                </div>
                            </>
                        ) : (
                             <SheetClose asChild>
                                <Link
                                href={navItem.href!}
                                className="text-lg font-medium text-foreground transition-colors hover:text-primary px-2 py-1"
                                onClick={handleLinkClick}
                                >
                                {navItem.label}
                                </Link>
                             </SheetClose>
                        )}
                    </React.Fragment>
                ))}


                 {/* Keep Admin login link separate at the bottom */}
                 <SheetClose asChild>
                    <Link
                        href="/admin"
                        className="text-lg font-medium text-foreground transition-colors hover:text-primary px-2 pt-4 border-t mt-4" // Added styling for separation
                        onClick={handleLinkClick} // Use handler
                    >
                        Admin Login
                    </Link>
                 </SheetClose>
              </nav>
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
          <Button variant="ghost" asChild><Link href="/admin">Admin Login</Link></Button>
        </div>
      </div>
    </header>
  );
}

