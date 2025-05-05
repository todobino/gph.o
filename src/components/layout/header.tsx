
'use client'; // Add 'use client' directive

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Use Dialog instead of Popover
import { Input } from "@/components/ui/input";
import { Menu, Feather, ChevronDown, Search } from 'lucide-react';
import React from 'react';
import type { Post } from '@/services/github';
import { getPosts } from '@/services/github';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Post[]>([]);
  const [allPosts, setAllPosts] = React.useState<Post[]>([]);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = React.useState(false); // State for dialog

  // Fetch posts on component mount for client-side search
  React.useEffect(() => {
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

  // Basic client-side search filtering
   React.useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const lowerCaseQuery = searchQuery.toLowerCase();
    const results = allPosts.filter(post =>
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      post.content.toLowerCase().includes(lowerCaseQuery)
    );
    setSearchResults(results.slice(0, 10));
  }, [searchQuery, allPosts]);


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
     if (!open) {
        setSearchQuery(''); // Clear search when dialog closes
     }
   }

   // Shared Dialog Content
   const searchDialogContent = (
     <DialogContent className="sm:max-w-[425px] bg-background/90 backdrop-blur-sm"> {/* Added background/blur */}
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            id="search-dialog"
            placeholder="Search posts and pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="col-span-3"
          />
           <ScrollArea className="h-[200px] w-full">
              {searchResults.length > 0 ? (
                  <ul className="space-y-2">
                  {searchResults.map(post => {
                      const slug = post.slug || post.title.toLowerCase().replace(/\s+/g, '-'); // Use pre-generated slug if available
                      return (
                          <li key={post.title}>
                              <Link href={`/posts/${slug}`} onClick={handleSearchResultClick} className="block p-2 rounded-md hover:bg-accent text-sm">
                                  {post.title}
                              </Link>
                          </li>
                      )
                  })}
                  </ul>
              ) : searchQuery.trim() !== '' ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No results found.</p>
              ) : null}
            </ScrollArea>
        </div>
      </DialogContent>
   );


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
          </nav>
        </div>

        {/* Mobile Menu & Title */}
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
                onClick={handleLinkClick}
              >
                <Feather className="h-6 w-6 text-primary" />
                <span className="font-bold">GeePawHill.Org</span>
              </Link>
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
              </nav>
            </SheetContent>
          </Sheet>
           <Link href="/" className="flex items-center space-x-2">
             <Feather className="h-6 w-6 text-primary" />
             <span className="font-bold">GeePawHill.Org</span>
           </Link>
           {/* Mobile Search & Book Now */}
            <div className="flex items-center gap-1">
                <Dialog open={isSearchDialogOpen} onOpenChange={handleSearchDialogChange}>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>
                    </DialogTrigger>
                    {searchDialogContent}
                </Dialog>
                 {/* Use Link styled as button */}
                <Link href="/booking" className={cn(buttonVariants({ size: "sm" }))}>
                   Book Now
                </Link>
            </div>
        </div>

        {/* Desktop Search & Book Now Buttons */}
        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
           <Dialog open={isSearchDialogOpen} onOpenChange={handleSearchDialogChange}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                </DialogTrigger>
                 {searchDialogContent}
            </Dialog>
             {/* Use Link styled as button */}
           <Link href="/booking" className={cn(buttonVariants())}>
              Book Now
           </Link>
        </div>
      </div>
    </header>
  );
}

