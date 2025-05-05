
'use client'; // Add 'use client' directive

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // Added SheetClose
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added Dropdown components
import { Menu, Feather, ChevronDown } from 'lucide-react'; // Using Feather as a placeholder logo, Added ChevronDown
import React from 'react'; // Import React

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // Separate simple nav items and dropdown items
  const simpleNavItems = [
    { href: '/contact', label: 'Contact' },
    { href: '/camerata', label: 'Camerata' }, // Added
    { href: '/about', label: 'About' }, // Added
  ];

  const postsDropdownItems = [
    { href: '/posts/podcasts', label: 'Podcasts' }, // Placeholder URL
    { href: '/posts/videos', label: 'Videos' },     // Placeholder URL
    { href: '/posts', label: 'All Posts' },
    { href: '/contact?subscribe=true', label: 'Subscribe!' }, // Placeholder URL, links to contact for now
  ];

  const coursesDropdownItems = [
    { href: '/courses/leading-technical-change', label: 'Leading Technical Change' }, // Placeholder URL
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
             {/* Posts Dropdown */}
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/60 hover:text-foreground/80 px-3 py-2">
                  Posts <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {/* <DropdownMenuLabel>Blog Categories</DropdownMenuLabel>
                <DropdownMenuSeparator /> */}
                {postsDropdownItems.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link href={item.href}>{item.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

             {/* Simple Nav Items */}
            {simpleNavItems.map((item) => (
              <Button key={item.href} variant="ghost" asChild className="text-foreground/60 hover:text-foreground/80 px-3 py-2">
                 <Link href={item.href}>{item.label}</Link>
              </Button>
            ))}

            {/* Courses Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/60 hover:text-foreground/80 px-3 py-2">
                   Courses <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                {/* <DropdownMenuLabel>Available Courses</DropdownMenuLabel>
                <DropdownMenuSeparator /> */}
                {coursesDropdownItems.map((item) => (
                   <DropdownMenuItem key={item.href} asChild>
                     <Link href={item.href}>{item.label}</Link>
                   </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

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
                {/* Mobile Posts Section */}
                <div className="text-lg font-medium text-muted-foreground px-2 pt-2">Posts</div>
                <div className="flex flex-col space-y-1 pl-4">
                    {postsDropdownItems.map((item) => (
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

                 {/* Mobile Simple Nav Items */}
                 {simpleNavItems.map((item) => (
                    <SheetClose key={item.href} asChild>
                        <Link
                        href={item.href}
                        className="text-lg font-medium text-foreground transition-colors hover:text-primary px-2 py-1"
                        onClick={handleLinkClick}
                        >
                        {item.label}
                        </Link>
                    </SheetClose>
                 ))}

                {/* Mobile Courses Section */}
                 <div className="text-lg font-medium text-muted-foreground px-2 pt-2">Courses</div>
                 <div className="flex flex-col space-y-1 pl-4">
                    {coursesDropdownItems.map((item) => (
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
          <Button variant="ghost" asChild>
             {/* Ensure Link is direct child for asChild */}
             <Link href="/admin">Admin Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

