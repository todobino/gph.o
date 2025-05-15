
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '../ui/button'; // Adjusted path
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '../ui/sheet'; // Adjusted path
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"; // Adjusted path
import { Dialog, DialogClose as DialogCloseComponent, DialogContent, DialogHeader, DialogTitle, DialogTrigger as RadixDialogTrigger } from "../ui/dialog"; // Adjusted path
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Kept alias as it seems to work elsewhere
import { Input } from "../ui/input"; // Adjusted path
import { Menu, Cpu, ChevronDown, Search, UserCircle, GraduationCap, CalendarCheck2 } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import type { Post } from '@/services/posts'; // Kept alias
import { getPosts } from '@/services/posts'; // Kept alias
import { ScrollArea } from '../ui/scroll-area'; // Adjusted path
import { cn } from '@/lib/utils'; // Kept alias
import { getCurrentUser, checkIfAdmin } from '@/lib/auth'; // Kept alias
import type { User } from 'firebase/auth';
import { useIsMobile } from '@/hooks/use-mobile'; // Kept alias
import { Skeleton } from '../ui/skeleton'; // Adjusted path


interface NavItem {
  href?: string;
  label: string;
  dropdown?: NavItem[];
}

export function Header() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);

  const [isMobileSearchDialogOpen, setIsMobileSearchDialogOpen] = useState(false);
  const [isDesktopSearchPopoverOpen, setIsDesktopSearchPopoverOpen] = useState(false);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setHasMounted(true);
  }, []);


  useEffect(() => {
    async function fetchPosts() {
      try {
        const postsData = await getPosts();
        setAllPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch posts for search:", error);
      }
    }
    if (hasMounted) {
        fetchPosts();
    }
  }, [hasMounted]);

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
    if (hasMounted) {
        checkAuthStatus();
        const handleFocus = () => checkAuthStatus();
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }
  }, [hasMounted]);

   useEffect(() => {
    if (!hasMounted || searchQuery.trim() === '') {
      setSearchResults([]);
      if (isDesktopSearchPopoverOpen && searchQuery.trim() === '') {
        setIsDesktopSearchPopoverOpen(false);
      }
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = allPosts.filter(post =>
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      (post.content && post.content.toLowerCase().includes(lowerCaseQuery))
    );
    setSearchResults(results.slice(0, 10));

    // Control popover visibility based on search results and query presence
    if (results.length > 0 && searchQuery.trim() !== '') {
        if (!isDesktopSearchPopoverOpen) setIsDesktopSearchPopoverOpen(true);
    } else if (searchQuery.trim() !== '' && results.length === 0) {
        // Keep open to show "No results" if query is not empty
        if (!isDesktopSearchPopoverOpen) setIsDesktopSearchPopoverOpen(true);
    }
     else {
        // Close if query is empty or if results are empty AND query was just cleared
        if (isDesktopSearchPopoverOpen) setIsDesktopSearchPopoverOpen(false);
    }

  }, [searchQuery, allPosts, isDesktopSearchPopoverOpen, hasMounted ]);


  const navItems: NavItem[] = [
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
        { href: '/courses/advanced-react-patterns', label: 'Advanced React Patterns' },
        { href: '/courses/modern-backend-nodejs', label: 'Modern Backend Node.js' },
        { href: '/courses/fullstack-typescript', label: 'Full-Stack TypeScript' },
        { href: '/courses/effective-technical-leadership', label: 'Effective Tech Leadership' },
        { href: '/courses/agile-project-management', label: 'Agile Project Management' },
        { href: '/courses/strategic-thinking-engineering', label: 'Strategic Thinking for Eng.' },
      ]
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

   const handleSearchDialogChange = (openState: boolean) => {
    setIsMobileSearchDialogOpen(openState);
    if (!openState) {
        setSearchQuery('');
        setSearchResults([]);
    }
   };

   const handleDesktopPopoverOpenChange = (openState: boolean) => {
    if (!openState && document.activeElement !== desktopSearchInputRef.current) {
        // Only clear search if popover is closed by clicking outside AND input is not focused
        setSearchQuery('');
        setSearchResults([]);
    }
    setIsDesktopSearchPopoverOpen(openState);
   };


   const searchResultsContent = (
    <ScrollArea className={cn("h-fit max-h-[200px] sm:max-h-[300px] w-full", (searchResults.length > 0 || searchQuery.trim() !== '') ? "" : "border-0 p-0")}>
        {(searchResults.length > 0 || searchQuery.trim() !== '') ? (
             searchResults.length > 0 ? (
                <ul className="space-y-1">
                {searchResults.map(post => {
                    const slug = post.slug;
                    return (
                        <li key={post.slug}>
                          {isMobileSearchDialogOpen ? (
                            <DialogCloseComponent asChild>
                              <Link href={`/posts/${slug}`} onClick={handleSearchResultClick} className="block p-3 rounded-md hover:bg-accent text-sm transition-colors">
                                  {post.title}
                              </Link>
                            </DialogCloseComponent>
                          ) : (
                            <Link href={`/posts/${slug}`} onClick={handleSearchResultClick} className="block p-2 rounded-md hover:bg-accent text-sm transition-colors">
                                {post.title}
                            </Link>
                          )}
                        </li>
                    )
                })}
                </ul>
            ) : (
                 <p className="text-sm text-muted-foreground text-center py-4 px-2">No results found.</p>
            )
        ) : (
           <p className="text-sm text-muted-foreground text-center py-4 px-2">Start typing to see results.</p>
        )}
      </ScrollArea>
   );

   const mobileSearchDialogContent = (
     <DialogContent
        className="bg-background/80 backdrop-blur-sm p-4 sm:p-6 rounded-lg shadow-lg border border-border sm:max-w-md"
    >
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
          {searchResultsContent}
        </div>
      </DialogContent>
   );

  if (!hasMounted) {
    // Simplified skeleton for SSR and initial client render to minimize hydration mismatches
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center px-4 justify-between">
          {/* Left side: Logo and some nav placeholders */}
          <div className="flex items-center">
            <Skeleton className="h-6 w-6 mr-2" />
            <Skeleton className="h-6 w-32" />
            <div className="hidden md:flex items-center space-x-1 ml-6">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
          {/* Right side: Action placeholders */}
          <div className="flex items-center space-x-2">
            <div className="hidden md:block"> {/* Desktop search placeholder */}
                 <Skeleton className="h-9 w-48" />
            </div>
            <Skeleton className="h-9 w-32" /> {/* Course Login placeholder */}
            <Skeleton className="h-9 w-36" /> {/* Book Now placeholder */}
            <Skeleton className="h-9 w-20 md:w-28" /> {/* Admin / Mobile menu placeholder */}
          </div>
        </div>
      </header>
    );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Desktop View (md and up) */}
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
                           <Link href={item.href!}>{item.label}</Link>
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

        <div className="hidden md:flex flex-1 items-center justify-center px-4">
            <div className="relative w-full">
                <Popover
                    open={isDesktopSearchPopoverOpen && searchQuery.trim() !== ''}
                    onOpenChange={handleDesktopPopoverOpenChange}
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
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </PopoverTrigger>
                    {isDesktopSearchPopoverOpen && searchQuery.trim() !== '' && (
                         <PopoverContent
                            sideOffset={5}
                            className="w-[var(--radix-popover-trigger-width)] shadow-md border-0 p-0"
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            onCloseAutoFocus={() => {
                                // Only refocus if the popover wasn't closed by clicking on the input itself
                                if (document.activeElement !== desktopSearchInputRef.current) {
                                   // desktopSearchInputRef.current?.focus(); // Removed to prevent re-opening on external click
                                }
                            }}
                        >
                            {searchResultsContent}
                        </PopoverContent>
                    )}
                </Popover>
            </div>
        </div>

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
            {isLoadingAuth ? (
              <Skeleton className="h-9 w-28" />
            ) : isAdmin ? (
              <Link
                href="/admin"
                className={cn(buttonVariants({ variant: "ghost", size: "default" }), "font-bold text-primary hover:text-primary/80 px-3 py-2")}
              >
                 <UserCircle className="mr-1 h-4 w-4" />
                Admin
              </Link>
            ) : null}
        </div>

        {/* Mobile View (up to md) */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
               <span
                  role="button"
                  tabIndex={0}
                  className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'cursor-pointer')}
                  aria-label="Toggle Menu"
                  onClick={() => setIsMobileMenuOpen(true)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </span>
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
              <ScrollArea className="h-[calc(100vh-8rem)]"> {/* Adjust height as needed */}
                <nav className="flex flex-col space-y-1 pr-4"> {/* Added pr-4 for scrollbar */}
                  {navItems.map((navItem) => (
                      <React.Fragment key={navItem.label || navItem.href}>
                          {navItem.dropdown ? (
                              <>
                                  <div className="text-lg font-medium text-muted-foreground px-4 pt-3 pb-1">{navItem.label}</div>
                                  <div className="flex flex-col space-y-0 pl-4">
                                      {navItem.dropdown.map((item) => (
                                          <SheetClose key={item.href} asChild>
                                            <Link
                                              href={item.href!}
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
                    {isLoadingAuth ? (
                        <div className="px-4 py-2 mt-4"> <Skeleton className="h-8 w-28" /> </div>
                    ) : isAdmin ? (
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
                  ) : null }
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
           <Link href="/" className="flex items-center space-x-2">
             <Cpu className="h-6 w-6 text-primary" />
             <span className="font-bold text-foreground">GeePawHill.Org</span>
           </Link>
            <div className="flex items-center gap-1">
                 <Dialog open={isMobileSearchDialogOpen} onOpenChange={handleSearchDialogChange}>
                    <RadixDialogTrigger asChild>
                       <span
                        role="button"
                        tabIndex={0}
                        className={cn(
                          buttonVariants({ variant: 'ghost', size: 'icon' }),
                          'cursor-pointer'
                        )}
                        aria-label="Open search dialog"
                      >
                        <Search className="h-5 w-5" />
                      </span>
                    </RadixDialogTrigger>
                    {isMobileSearchDialogOpen && mobileSearchDialogContent}
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


