
'use client';

import Link from 'next/link';
import { Button, buttonVariants } from '../ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '../ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Dialog, DialogClose as DialogCloseComponent, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "../ui/input";
import { Menu, Cpu, ChevronDown, Search, GraduationCap, CalendarPlus, Video, Mail, Headphones, FileText, BookOpen, Book } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';
import type { Post } from '@/services/posts';
import { getPosts } from '@/services/posts';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '@/lib/utils';
import { getCurrentUser, checkIfAdmin } from '@/lib/auth';
import type { User } from 'firebase/auth';
import { useIsMobile } from '@/hooks/use-mobile';
import { Skeleton } from '../ui/skeleton';
import { HeaderMenuButton } from '../ui/header-menu-button';


interface NavItem {
  href?: string;
  label: string;
  dropdown?: DropdownItem[];
}

interface DropdownItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
}


export function Header() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [postResults, setPostResults] = useState<Post[]>([]);

  const [isMobileSearchDialogOpen, setIsMobileSearchDialogOpen] = useState(false);
  const [isDesktopSearchPopoverOpen, setIsDesktopSearchPopoverOpen] = useState(false);
  const desktopSearchInputRef = useRef<HTMLInputElement>(null);

  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const isMobile = useIsMobile();

  const allCourses = React.useMemo(() => [
      { title: 'Leading Technical Change', slug: '/courses/leading-technical-change' },
      { title: 'Advanced React Patterns', slug: '/courses/advanced-react-patterns' },
      { title: 'Modern Backend Development with Node.js', slug: '/courses/modern-backend-nodejs' },
      { title: 'Full-Stack TypeScript Mastery', slug: '/courses/fullstack-typescript' },
      { title: 'Effective Technical Leadership', slug: '/courses/effective-technical-leadership' },
      { title: 'Agile Project Management for Software Teams', slug: '/courses/agile-project-management' },
      { title: 'Strategic Thinking for Engineering Managers', slug: '/courses/strategic-thinking-engineering' },
  ], []);
  const allPages = React.useMemo(() => [
      { title: 'About', slug: '/about' },
      { title: 'Contact', slug: '/contact' },
      { title: 'Booking', slug: '/booking' },
      { title: 'Subscribe', slug: '/subscribe' },
      { title: 'All Courses', slug: '/courses' },
  ], []);

  const [courseResults, setCourseResults] = useState<{title: string, slug: string}[]>([]);
  const [pageResults, setPageResults] = useState<{title: string, slug: string}[]>([]);

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
    if (!hasMounted) return;

    const lowerCaseQuery = searchQuery.trim().toLowerCase();

    if (lowerCaseQuery === '') {
        if (postResults.length > 0 || courseResults.length > 0 || pageResults.length > 0) {
            setPostResults([]);
            setCourseResults([]);
            setPageResults([]);
        }
        return;
    }
    
    const posts = allPosts.filter(post =>
      post.title.toLowerCase().includes(lowerCaseQuery) ||
      (post.content && post.content.toLowerCase().includes(lowerCaseQuery))
    ).slice(0, 5);
    setPostResults(posts);

    const courses = allCourses.filter(course => 
        course.title.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 5);
    setCourseResults(courses);

    const pages = allPages.filter(page =>
        page.title.toLowerCase().includes(lowerCaseQuery)
    ).slice(0, 5);
    setPageResults(pages);

  }, [searchQuery, allPosts, allCourses, allPages, hasMounted, postResults.length, courseResults.length, pageResults.length]);


  const navItems: NavItem[] = [
    {
      label: 'Posts',
      dropdown: [
        { href: '/posts?tag=video', label: 'Video', icon: <Video className="h-4 w-4" /> },
        { href: '/posts?tag=audio', label: 'Audio', icon: <Headphones className="h-4 w-4" /> },
        { href: '/subscribe', label: 'Subscribe!', icon: <Mail className="h-4 w-4" /> },
      ],
    },
    {
      label: 'Courses',
      dropdown: [
        { href: '/courses/leading-technical-change', label: 'Leading Technical Change', icon: <GraduationCap className="h-4 w-4" /> },
        { href: '/courses/advanced-react-patterns', label: 'Advanced React Patterns', icon: <GraduationCap className="h-4 w-4" /> },
        { href: '/courses/modern-backend-nodejs', label: 'Modern Backend Node.js', icon: <GraduationCap className="h-4 w-4" /> },
        { href: '/courses/fullstack-typescript', label: 'Full-Stack TypeScript', icon: <GraduationCap className="h-4 w-4" /> },
        { href: '/courses/effective-technical-leadership', label: 'Effective Tech Leadership', icon: <GraduationCap className="h-4 w-4" /> },
        { href: '/courses/agile-project-management', label: 'Agile Project Management', icon: <GraduationCap className="h-4 w-4" /> },
        { href: '/courses/strategic-thinking-engineering', label: 'Strategic Thinking for Eng.', icon: <GraduationCap className="h-4 w-4" /> },
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
     setPostResults([]);
     setCourseResults([]);
     setPageResults([]);
     setIsMobileSearchDialogOpen(false);
     setIsDesktopSearchPopoverOpen(false);
   };

   const handleSearchDialogChange = (openState: boolean) => {
    setIsMobileSearchDialogOpen(openState);
    if (!openState) {
        setSearchQuery('');
        setPostResults([]);
        setCourseResults([]);
        setPageResults([]);
    }
   };

   const handleDesktopPopoverOpenChange = (openState: boolean) => {
    if (!openState && document.activeElement !== desktopSearchInputRef.current) {
        setSearchQuery('');
        setPostResults([]);
        setCourseResults([]);
        setPageResults([]);
    }
    setIsDesktopSearchPopoverOpen(openState);
   };

   const getPostIcon = (post: Post) => {
     if (post.tags.includes('video')) return <Video className="h-4 w-4 text-muted-foreground" />;
     if (post.tags.includes('audio')) return <Headphones className="h-4 w-4 text-muted-foreground" />;
     return <FileText className="h-4 w-4 text-muted-foreground" />;
   }

   const searchResultsContent = (
    <ScrollArea className="mt-2 h-fit max-h-[400px] rounded-md border sm:max-h-[500px]">
        {searchQuery.trim() !== '' ? (
             (postResults.length > 0 || courseResults.length > 0 || pageResults.length > 0) ? (
                <div className="space-y-1 p-2">
                  {postResults.length > 0 && (
                    <div>
                      <div className="inline-block text-xs font-semibold text-primary bg-accent rounded-md px-2 py-1">Posts</div>
                      <ul className="space-y-1 mt-1">
                        {postResults.map(post => (
                          <li key={`post-${post.slug}`}>
                            <Link href={`/posts/${post.slug}`} onClick={handleSearchResultClick} className="flex w-full items-center gap-2 p-2 rounded-md hover:bg-accent text-sm transition-colors overflow-hidden">
                              {getPostIcon(post)}
                              <span className="flex-1 min-w-0 truncate">{post.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {courseResults.length > 0 && (
                    <div>
                      <div className="inline-block text-xs font-semibold text-primary bg-accent rounded-md px-2 py-1 mt-1">Courses</div>
                      <ul className="space-y-1 mt-1">
                        {courseResults.map(course => (
                          <li key={`course-${course.slug}`}>
                            <Link href={course.slug} onClick={handleSearchResultClick} className="flex w-full items-center gap-2 p-2 rounded-md hover:bg-accent text-sm transition-colors overflow-hidden">
                                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                                <span className="flex-1 min-w-0 truncate">{course.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {pageResults.length > 0 && (
                    <div>
                      <div className="inline-block text-xs font-semibold text-primary bg-accent rounded-md px-2 py-1 mt-1">Pages</div>
                      <ul className="space-y-1 mt-1">
                        {pageResults.map(page => (
                          <li key={`page-${page.slug}`}>
                            <Link href={page.slug} onClick={handleSearchResultClick} className="flex w-full items-center gap-2 p-2 rounded-md hover:bg-accent text-sm transition-colors overflow-hidden">
                               <Book className="h-4 w-4 text-muted-foreground" />
                               <span className="flex-1 min-w-0 truncate">{page.title}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
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
          <DialogTitle className="text-xl sm:text-2xl font-semibold font-heading">Search</DialogTitle>
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
          <DialogCloseComponent asChild>
            {searchResultsContent}
          </DialogCloseComponent>
        </div>
      </DialogContent>
   );

  if (!hasMounted) {
    return (
       <header className="sticky top-0 z-50 w-full border-b bg-primary-dark">
        <div className="container mx-auto flex h-14 items-center px-4 max-w-6xl">
            <div className="mr-6 flex items-center">
              <Skeleton className="h-6 w-6 mr-2 bg-white/20" />
              <Skeleton className="h-6 w-32 bg-white/20" />
            </div>
            <div className="hidden md:flex items-center space-x-1">
                 <Skeleton className="h-9 w-24 bg-white/20" />
                 <Skeleton className="h-9 w-24 bg-white/20" />
                 <Skeleton className="h-9 w-24 bg-white/20" />
                 <Skeleton className="h-9 w-24 bg-white/20" />
            </div>
            <div className="flex flex-1 items-center justify-center px-4 md:hidden"></div>
             <div className="hidden md:flex flex-1 items-center justify-center px-4">
                 <Skeleton className="h-9 w-full max-w-sm bg-white/20" />
            </div>
            <div className="hidden md:flex items-center space-x-2">
              <Skeleton className="h-9 w-28 rounded-full bg-white/20" />
            </div>
             <div className="md:hidden flex items-center space-x-2">
                <Skeleton className="h-9 w-9 rounded-full bg-white/20" />
                <Skeleton className="h-9 w-9 rounded-full bg-white/20" />
                 <Skeleton className="h-9 w-28 rounded-full bg-white/20" />
            </div>
        </div>
      </header>
    );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary-dark/20 bg-primary-dark text-primary-dark-foreground">
      <div className="container mx-auto flex h-14 items-center px-4 max-w-6xl">
        {/* Desktop View (md and up) */}
        <div className="hidden md:flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Cpu className="h-6 w-6 text-white" />
            <span className="hidden font-bold sm:inline-block">
              GeePawHill.Org
            </span>
          </Link>
          <nav className="flex items-center space-x-1 text-sm font-semibold">
             {navItems.map((navItem) =>
                navItem.dropdown ? (
                  <DropdownMenu key={navItem.label}>
                    <DropdownMenuTrigger asChild>
                      <HeaderMenuButton>
                        {navItem.label} <ChevronDown className="ml-1 h-4 w-4" />
                      </HeaderMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                       {navItem.dropdown.map((item) => (
                            <DropdownMenuItem key={item.href} asChild>
                              <Link href={item.href!} className="flex items-center gap-2 cursor-pointer">
                                {item.icon}
                                <span>{item.label}</span>
                              </Link>
                            </DropdownMenuItem>
                       ))}
                       <DropdownMenuSeparator />
                       <DropdownMenuItem asChild variant="primary">
                         <Link href={navItem.label === 'Posts' ? '/posts' : '/courses'}>
                           All {navItem.label}
                         </Link>
                       </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <HeaderMenuButton asChild>
                    <Link
                      key={navItem.href}
                      href={navItem.href!}
                    >
                      {navItem.label}
                    </Link>
                  </HeaderMenuButton>
                )
              )}
          </nav>
        </div>

        <div className="hidden md:flex flex-1 items-center justify-center px-4">
            <div className="relative w-full">
                <Popover
                    open={isDesktopSearchPopoverOpen}
                    onOpenChange={handleDesktopPopoverOpenChange}
                >
                    <PopoverTrigger asChild>
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 z-10 -translate-y-1/2 h-4 w-4 text-white/50 pointer-events-none" />
                            <Input
                                ref={desktopSearchInputRef}
                                type="search"
                                placeholder="Search posts and pages..."
                                className="h-9 w-full pl-10 pr-3 bg-white/10 placeholder:text-white/50 text-white border-none focus-visible:ring-primary"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </PopoverTrigger>
                    {isDesktopSearchPopoverOpen && (
                         <PopoverContent
                            sideOffset={5}
                            className="w-[var(--radix-popover-trigger-width)] p-0 shadow-md border-0"
                            onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                            {searchResultsContent}
                        </PopoverContent>
                    )}
                </Popover>
            </div>
        </div>
         <div className="flex-1 md:hidden"></div>
         <div className="hidden md:flex items-center space-x-2">
            <Button asChild>
                <Link href="/booking">
                    <CalendarPlus />
                    Book Now
                </Link>
            </Button>
            {isLoadingAuth ? (
              <Skeleton className="h-9 w-20" />
            ) : isAdmin ? (
              <Button asChild variant="secondary">
                <Link href="/admin">
                   Admin
                </Link>
              </Button>
            ) : null}
        </div>

        {/* Mobile View (up to md) */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:hidden">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
               <span
                  role="button"
                  tabIndex={0}
                  className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'cursor-pointer hover:bg-white/10 text-white')}
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
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <nav className="flex flex-col space-y-1 pr-4">
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
                                              className="flex items-center gap-2 w-full text-left text-lg text-foreground transition-colors hover:text-primary px-4 py-2 rounded-md hover:bg-accent"
                                              onClick={handleMobileSheetLinkClick}
                                            >
                                              {item.icon}{item.label}
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
                    {isLoadingAuth ? (
                        <div className="px-4 py-2 mt-4"> <Skeleton className="h-8 w-28" /> </div>
                    ) : isAdmin ? (
                    <SheetClose asChild>
                      <Link
                        href="/admin"
                        className="block w-full text-left text-lg font-bold text-primary transition-colors hover:text-primary/80 px-4 py-2 rounded-md hover:bg-accent mt-4"
                        onClick={handleMobileSheetLinkClick}
                      >
                        Admin
                      </Link>
                    </SheetClose>
                  ) : null }
                </nav>
              </ScrollArea>
            </SheetContent>
          </Sheet>
           <Link href="/" className="flex items-center space-x-2">
             <Cpu className="h-6 w-6 text-white" />
             <span className="font-bold">GeePawHill.Org</span>
           </Link>
             <Dialog open={isMobileSearchDialogOpen} onOpenChange={handleSearchDialogChange}>
                 <DialogTrigger asChild>
                     <span
                       role="button"
                       tabIndex={0}
                       className={cn(
                         buttonVariants({ variant: 'ghost', size: 'icon' }),
                         'cursor-pointer hover:bg-white/10 text-white'
                       )}
                       aria-label="Open search dialog"
                     >
                       <Search className="h-5 w-5" />
                     </span>
                 </DialogTrigger>
                 {mobileSearchDialogContent}
             </Dialog>
             <Button asChild size="sm">
                <Link href="/booking">
                  <CalendarPlus />
                  Book Now
                </Link>
             </Button>
        </div>
      </div>
    </header>
  );
}
