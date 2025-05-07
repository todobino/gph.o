
'use client'; // Add 'use client' directive

import Link from 'next/link';
import { Button, buttonVariants } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '../ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "../ui/dialog";
import { Input } from "../ui/input";
import { Menu, Feather, ChevronDown, Search, UserCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import type { Post } from '@/services/posts';
import { getPosts } from '@/services/posts';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { getCurrentUser, checkIfAdmin } from '@/lib/auth';
import type { User } from 'firebase/auth';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
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
    // Re-check on window focus in case of logout/login in another tab
    const handleFocus = () => checkAuthStatus();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);


   useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
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
        ]
    },
    {
       label: 'Courses',
       dropdown: [
           { href: '/courses/leading-technical-change', label: 'Leading Technical Change' },
       ]
    },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];


  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

   const handleSearchResultClick = () => {
     setSearchQuery('');
     setIsSearchDialogOpen(false); // Close dialog on result click
   };

   const handleSearchDialogChange = (open: boolean) => {
     setIsSearchDialogOpen(open);
     if (!open) { // If dialog is closing
        setSearchQuery(''); // Clear search query
     }
   }

   const searchDialogContent = (
     <DialogContent className="sm:max-w-xl bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Search</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4"> {/* Changed from grid to flex flex-col */}
          <Input
            id="search-dialog"
            placeholder="Search posts and pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-base" // Removed col-span-3
          />
           <ScrollArea className="h-[200px] w-full mt-2 border rounded-md">
              {searchResults.length > 0 ? (
                  <ul className="space-y-1">
                  {searchResults.map(post => {
                      const slug = post.slug;
                      return (
                          <li key={post.slug}>
                            <DialogClose asChild>
                              <Link href={`/posts/${slug}`} onClick={handleSearchResultClick} className="block p-3 rounded-md hover:bg-accent text-sm transition-colors">
                                  {post.title}
                              </Link>
                            </DialogClose>
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
        </div>
      </DialogContent>
   );


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Feather className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block">
              GeePawHill.Org
            </span>
          </Link>
          <nav className="flex items-center space-x-1 text-sm font-medium">
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
                    className={cn(buttonVariants({ variant: "ghost", size: "default" }), "text-foreground/60 hover:text-foreground/80 px-3 py-2")}
                  >
                    {navItem.label}
                  </Link>
                )
              )}
              {!isLoadingAuth && isAdmin && (
                  <Link
                    href="/admin"
                    className={cn(buttonVariants({ variant: "ghost", size: "default" }), "font-bold text-primary hover:text-primary/80 px-3 py-2")}
                  >
                     <UserCircle className="mr-1 h-4 w-4" />
                    Admin
                  </Link>
              )}
          </nav>
        </div>

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
                  onClick={handleLinkClick}
                >
                  <Feather className="h-6 w-6 text-primary" />
                  <span className="font-bold">GeePawHill.Org</span>
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
                                className="block w-full text-left text-lg font-medium text-foreground transition-colors hover:text-primary px-4 py-2 rounded-md hover:bg-accent"
                                onClick={handleLinkClick}
                                >
                                {navItem.label}
                                </Link>
                             </SheetClose>
                        )}
                    </React.Fragment>
                ))}
                {!isLoadingAuth && isAdmin && (
                  <SheetClose asChild>
                    <Link
                      href="/admin"
                      className="block w-full text-left text-lg font-bold text-primary transition-colors hover:text-primary/80 px-4 py-2 rounded-md hover:bg-accent mt-4"
                      onClick={handleLinkClick}
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
             <Feather className="h-6 w-6 text-primary" />
             <span className="font-bold">GeePawHill.Org</span>
           </Link>
            <div className="flex items-center gap-1">
                <Dialog open={isSearchDialogOpen} onOpenChange={handleSearchDialogChange}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="Open search dialog">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>
                    </DialogTrigger>
                    {searchDialogContent}
                </Dialog>
                <Link href="/booking" className={cn(buttonVariants({ size: "sm" }))}>
                   Book Now
                </Link>
            </div>
        </div>

        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
           <Dialog open={isSearchDialogOpen} onOpenChange={handleSearchDialogChange}>
                <DialogTrigger asChild>
                     <Button variant="ghost" size="icon" aria-label="Open search dialog">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                </DialogTrigger>
                 {searchDialogContent}
            </Dialog>
           <Link href="/booking" className={cn(buttonVariants())}>
              Book Now
           </Link>
        </div>
      </div>
    </header>
  );
}

