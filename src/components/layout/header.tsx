
'use client'; // Add 'use client' directive

import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button'; // Imported buttonVariants
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet'; // Added SheetClose
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Added Dropdown components
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; // Added Popover
import { Input } from "@/components/ui/input"; // Added Input
import { Menu, Feather, ChevronDown, Search } from 'lucide-react'; // Using Feather as a placeholder logo, Added ChevronDown, Search
import React from 'react'; // Import React
import type { Post } from '@/services/github'; // Import post fetching logic (Use renamed type)
import { getPosts } from '@/services/github'; // Import post fetching logic (Use renamed function)
import { ScrollArea } from '@/components/ui/scroll-area'; // Added ScrollArea
import { cn } from '@/lib/utils'; // Import cn

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchResults, setSearchResults] = React.useState<Post[]>([]);
  const [allPosts, setAllPosts] = React.useState<Post[]>([]);
  const [isSearchPopoverOpen, setIsSearchPopoverOpen] = React.useState(false);

  // Fetch posts on component mount for client-side search
  React.useEffect(() => {
    async function fetchPosts() {
      // TODO: Debounce or implement more robust search fetching if needed
      try {
        const posts = await getPosts(); // Use renamed function
        setAllPosts(posts);
      } catch (error) {
        console.error("Failed to fetch posts for search:", error);
        // Handle error appropriately, maybe show a toast
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
      post.content.toLowerCase().includes(lowerCaseQuery) // Simple content search
    );
    setSearchResults(results.slice(0, 10)); // Limit results shown
  }, [searchQuery, allPosts]);


  // Define navigation structure - Order changed
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
    setIsMobileMenuOpen(false); // Close menu on link click
  };

   const handleSearchResultClick = () => {
     setIsSearchPopoverOpen(false); // Close popover on result click
     setSearchQuery(''); // Clear search query
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
                onClick={handleLinkClick} // Use handler
              >
                <Feather className="h-6 w-6 text-primary" />
                <span className="font-bold">GeePawHill.Org</span>
              </Link>
              <nav className="flex flex-col space-y-1"> {/* Reduced space-y */}
                {/* Mobile Nav Items */}
                {navItems.map((navItem) => (
                    <React.Fragment key={navItem.label || navItem.href}>
                        {navItem.dropdown ? (
                            <>
                                <div className="text-lg font-medium text-muted-foreground px-4 pt-3 pb-1">{navItem.label}</div> {/* Adjusted padding */}
                                <div className="flex flex-col space-y-0 pl-4"> {/* Removed space-y, rely on SheetClose padding */}
                                    {navItem.dropdown.map((item) => (
                                        <SheetClose key={item.href} asChild>
                                           <Link
                                             href={item.href}
                                             className="block w-full text-left text-lg text-foreground transition-colors hover:text-primary px-4 py-2 rounded-md hover:bg-accent" // Adjusted styling for link within button
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
                                className="block w-full text-left text-lg font-medium text-foreground transition-colors hover:text-primary px-4 py-2 rounded-md hover:bg-accent" // Adjusted styling
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
           {/* Mobile Title */}
           <Link href="/" className="flex items-center space-x-2">
             <Feather className="h-6 w-6 text-primary" />
             <span className="font-bold">GeePawHill.Org</span>
           </Link>
           {/* Mobile Search & Book Now */}
            <div className="flex items-center gap-1"> {/* Reduced gap */}
                <Popover open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5" />
                            <span className="sr-only">Search</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                        <div className="grid gap-4">
                            <div className="space-y-2">
                            <h4 className="font-medium leading-none">Search</h4>
                            <p className="text-sm text-muted-foreground">
                                Find posts and pages.
                            </p>
                            </div>
                            <Input
                            id="search-mobile"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="col-span-2 h-8"
                            />
                             <ScrollArea className="h-[200px] w-full"> {/* Adjust height as needed */}
                                {searchResults.length > 0 ? (
                                    <ul className="space-y-2">
                                    {searchResults.map(post => {
                                        const slug = post.title.toLowerCase().replace(/\s+/g, '-');
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
                    </PopoverContent>
                </Popover>
                <Button size="sm" asChild>
                    <Link href="/booking">Book Now</Link>
                </Button>
            </div>
        </div>

        {/* Desktop Search & Book Now Buttons (Hidden on mobile by parent div) */}
        <div className="hidden flex-1 items-center justify-end space-x-2 md:flex">
           <Popover open={isSearchPopoverOpen} onOpenChange={setIsSearchPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Search className="h-5 w-5" />
                        <span className="sr-only">Search</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                        <h4 className="font-medium leading-none">Search</h4>
                        <p className="text-sm text-muted-foreground">
                            Find posts and pages.
                        </p>
                        </div>
                        <Input
                        id="search-desktop"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="col-span-2 h-8"
                        />
                         <ScrollArea className="h-[200px] w-full"> {/* Adjust height as needed */}
                         {searchResults.length > 0 ? (
                            <ul className="space-y-2">
                             {searchResults.map(post => {
                                const slug = post.title.toLowerCase().replace(/\s+/g, '-');
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
                </PopoverContent>
            </Popover>
           <Button asChild>
               <Link href="/booking">Book Now</Link>
           </Button>
        </div>
      </div>
    </header>
  );
}

