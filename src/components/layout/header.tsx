
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '../../components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '../../components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "../../components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "../../components/ui/input";
import { Menu, Cpu, ChevronDown, Search, UserCircle, GraduationCap, CalendarCheck2 } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import type { Post } from '@/services/posts';
import { getPosts } from '@/services/posts';
import { ScrollArea } from '../../components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { getCurrentUser, checkIfAdmin } from '@/lib/auth';
import type { User } from 'firebase/auth';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const [isMobileSearchDialogOpen, setIsMobileSearchDialogOpen] = useState(false);
  const [isDesktopSearchPopoverOpen, setIsDesktopSearchPopoverOpen] = useState(false);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const posts = await getPosts();
        setAllPosts(posts);
      } catch (error) {
        console.error("Failed to fetch posts for search:", error);
      }
    }
    fetchPosts();
  }, []);

   useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoadingAuth(true);
      const user = await getCurrentUser();
      if (user) {
        const isAdminUser = await checkIfAdmin(user);
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(false);
      }
      setIsLoadingAuth(false);
    };
    checkAuthStatus();
    const handleFocus = () => checkAuthStatus();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

   useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      // Keep popover open if input is focused and empty, to show "Start typing..."
      // but close it if query is empty and input is not focused (handled by onOpenChange)
      // setIsDesktopSearchPopoverOpen(document.activeElement === desktopSearchInputRef.current);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = allPosts.filter(post =>
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      (post.content && post.content.toLowerCase().includes(lowerCaseQuery))
    );
    setSearchResults(results.slice(0, 10));
  }, [searchQuery, allPosts]);

  const navItems = [
    {
      label: 'Posts',
      dropdown: [
        { href: '/posts', label: 'All Posts' },
        { href: '/posts?tag=video', label: 'Videos' },
        { href: '/posts?tag=podcast', label: 'Podcasts' },
        { href: '/subscribe', label: 'Subscribe!' },
      ],
    },
    {
      label: 'Courses',
      dropdown: [
        { href: '/courses', label: 'All Courses' },
        { href: '/courses/leading-technical-change', label: 'Leading Technical Change' },
      ],
    },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const handleMobileSheetLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

   const handleSearchResultClick = () => {
     setSearchQuery('');
     setSearchResults([]);
     setIsMobileSearchDialogOpen(false);
     setIsDesktopSearchPopoverOpen(false);
   };

   const searchResultsContent = (
      <ScrollArea className="h-fit max-h-[200px] sm:max-h-[300px] w-full mt-2 border rounded-md">
        {searchResults.length > 0 ? (
            <ul className="space-y-1 p-2">
            {searchResults.map(post => {
                const slug = post.slug;
                return (
                    <li key={post.slug}>
                      {isMobileSearchDialogOpen ? (
                        <DialogClose asChild>
                          <Link href={`/posts/${slug}`} onClick={handleSearchResultClick} className="block p-3 rounded-md hover:bg-accent text-sm transition-colors">
                              {post.title}
                          </Link>
                        </DialogClose>
                      ) : (
                        <Link href={`/posts/${slug}`} onClick={handleSearchResultClick} className="block p-2 rounded-md hover:bg-accent text-sm transition-colors">
                            {post.title}
                        </Link>
                      )}
                    </li>
                )
            })}
            </ul>
        ) : searchQuery.trim() !== '' ? (
            <p className="text-sm text-muted-foreground text-center py-4">No results found.</p>
        ) : (
          <p className="text-sm text-muted-foreground text-center py-4">Start typing to see results.</p>
        )}
      </ScrollArea>
   );

   const mobileSearchDialogContent = (
     <DialogContent className="sm:max-w-md bg-background/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg border border-border">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-semibold">Search</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 sm:gap-4 py-2 sm:py-4">
          <Input
            id="search-dialog-mobile"
            placeholder="Search posts and pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-base w-full"
            autoFocus
          />
          {searchQuery.trim() !== '' && searchResultsContent}
        </div>
      </DialogContent>
   );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Desktop Left: Logo + Nav */}
        <div className="hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Cpu className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block text-foreground">
              GeePawHill.Org
            </span>
          </Link>
          <nav className="flex items-center space-x-1 text-sm font-medium">
             {navItems.map((navItem) =>
                navItem.dropdown ? (
                  <DropdownMenu key={navItem.label}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="text-foreground hover:text-foreground/80 px-3 py-2">
                        {navItem.label} <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      {navItem.dropdown.map((item) => (
                        <DropdownMenuItem key={item.href} asChild>
                           <Link href={item.href}>{item.label}</Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={navItem.href}
                    href={navItem.href!}
                    className={cn(buttonVariants({ variant: "ghost", size: "default" }), "text-foreground hover:text-foreground/80 px-3 py-2")}
                  >
                    {navItem.label}
                  </Link>
                )
              )}
          </nav>
        </div>

        {/* Desktop Search - Occupies flexible space */}
        <div className="hidden md:flex flex-1 items-center justify-center px-4">
            <div className="relative w-full">
                <Popover
                    open={isDesktopSearchPopoverOpen}
                    onOpenChange={(openState) => {
                        setIsDesktopSearchPopoverOpen(openState);
                        if (!openState) { // If the popover is closing (e.g. by clicking outside)
                            setSearchQuery(''); // Clear the search query
                        }
                    }}
                >
                    <PopoverTrigger asChild>
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 z-10 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                            <Input
                                ref={desktopSearchInputRef}
                                type="search"
                                placeholder="Search posts and pages..."
                                className="h-9 w-full pl-10 pr-3 focus-visible:ring-primary"
                                value={searchQuery}
                                onChange={(e) => {
                                    const newQuery = e.target.value;
                                    setSearchQuery(newQuery);
                                    setIsDesktopSearchPopoverOpen(newQuery.trim() !== ''); // Open if query is not empty, close if empty
                                }}
                                // onFocus removed to prevent opening popover without text
                                // onBlur removed, Radix onOpenChange handles outside clicks
                            />
                        </div>
                    </PopoverTrigger>
                    {isDesktopSearchPopoverOpen && ( // Only render content if popover is meant to be open
                        <PopoverContent
                            sideOffset={5}
                            className="w-[var(--radix-popover-trigger-width)] p-0"
                            onOpenAutoFocus={(e) => e.preventDefault()} // Prevent focus shift to popover content
                        >
                            {searchResultsContent}
                        </PopoverContent>
                    )}
                </Popover>
            </div>
        </div>

        {/* Desktop Right Buttons */}
        <div className="hidden md:flex items-center space-x-2">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/80" asChild>
                <Link href="/course-login">
                    <GraduationCap className="mr-2 h-4 w-4" /> Course Login
                </Link>
            </Button>
            <Button asChild>
                <Link href="/booking">
                    <CalendarCheck2 className="mr-2 h-4 w-4" /> Book Now
                </Link>
            </Button>
            {!isLoadingAuth && isAdmin && (
              <Link
                href="/admin"
                className={cn(buttonVariants({ variant: "ghost", size: "default" }), "font-bold text-primary hover:text-primary/80 px-3 py-2")}
              >
                 <UserCircle className="mr-1 h-4 w-4" />
                Admin
              </Link>
            )}
        </div>

        {/* Mobile Header */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <SheetClose asChild>
                <Link
                  href="/"
                  className="flex items-center space-x-2 mb-6"
                  onClick={handleMobileSheetLinkClick}
                >
                  <Cpu className="h-6 w-6 text-primary" />
                  <span className="font-bold text-foreground">GeePawHill.Org</span>
                </Link>
              </SheetClose>
              <nav className="flex flex-col space-y-1">
                {navItems.map((navItem) => (
                    <React.Fragment key={navItem.label || navItem.href}>
                        {navItem.dropdown ? (
                            <>
                                <div className="text-lg font-medium text-muted-foreground px-4 pt-3 pb-1">{navItem.label}</div>
                                <div className="flex flex-col space-y-0 pl-4">
                                    {navItem.dropdown.map((item) => (
                                        <SheetClose key={item.href} asChild>
                                           <Link
                                             href={item.href}
                                             className="block w-full text-left text-lg text-foreground transition-colors hover:text-primary px-4 py-2 rounded-md hover:bg-accent"
                                             onClick={handleMobileSheetLinkClick}
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
                                className="block w-full text-left text-lg font-medium text-foreground transition-colors hover:text-primary px-4 py-2 rounded-md hover:bg-accent"
                                onClick={handleMobileSheetLinkClick}
                                >
                                {navItem.label}
                                </Link>
                             </SheetClose>
                        )}
                    </React.Fragment>
                ))}
                 <SheetClose asChild>
                    <Link
                      href="/course-login"
                      className="block w-full text-left text-lg font-medium text-primary transition-colors hover:text-primary/80 px-4 py-2 rounded-md hover:bg-accent mt-2"
                      onClick={handleMobileSheetLinkClick}
                    >
                      <GraduationCap className="mr-2 h-5 w-5 inline-block align-text-bottom" />
                      Course Login
                    </Link>
                  </SheetClose>
                {!isLoadingAuth && isAdmin && (
                  <SheetClose asChild>
                    <Link
                      href="/admin"
                      className="block w-full text-left text-lg font-bold text-primary transition-colors hover:text-primary/80 px-4 py-2 rounded-md hover:bg-accent mt-4"
                      onClick={handleMobileSheetLinkClick}
                    >
                      <UserCircle className="mr-1 h-5 w-5 inline-block align-text-bottom" />
                      Admin
                    </Link>
                  </SheetClose>
                )}
              </nav>
            </SheetContent>
          </Sheet>
           <Link href="/" className="flex items-center space-x-2">
             <Cpu className="h-6 w-6 text-primary" />
             <span className="font-bold text-foreground">GeePawHill.Org</span>
           </Link>
            <div className="flex items-center gap-1">
                <Dialog open={isMobileSearchDialogOpen} onOpenChange={(openState) => { setIsMobileSearchDialogOpen(openState); if(!openState) setSearchQuery(''); }}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Open search dialog">
                            <Search className="h-5 w-5" />
                        </Button>
                    </DialogTrigger>
                    {mobileSearchDialogContent}
                </Dialog>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/80" size="sm" asChild>
                  <Link href="/course-login">
                      <GraduationCap className="mr-1 h-4 w-4" /> Course Login
                  </Link>
                </Button>
                <Button asChild size="sm">
                   <Link href="/booking">
                     <CalendarCheck2 className="mr-1 h-4 w-4" /> Book Now
                   </Link>
                </Button>
            </div>
        </div>
      </div>
    </header>
  );
}

