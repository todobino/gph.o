
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Book, GraduationCap, Home, List, Newspaper, Users } from 'lucide-react';
import Link from 'next/link';

import AuthGate from '@/components/auth-gate';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsAdmin, useUser } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

function AdminNav() {
    const pathname = usePathname();
    const navItems = [
        { href: '/admin', label: 'Overview', icon: <Home className="h-4 w-4" /> },
        { href: '/admin/posts', label: 'Posts', icon: <Newspaper className="h-4 w-4" /> },
        { href: '/admin/courses', label: 'Courses', icon: <GraduationCap className="h-4 w-4" /> },
        { href: '/admin/subscribers', label: 'Subscribers', icon: <Users className="h-4 w-4" /> },
        { href: '/admin/lists', label: 'Lists', icon: <List className="h-4 w-4" /> },
    ];
    return (
         <aside className="w-full md:w-1/4 lg:w-1/5">
            <div className="sticky top-24">
                <nav className="flex flex-col space-y-2">
                    <Button variant="secondary" size="sm" asChild className="mb-4 justify-start">
                        <Link href="/account">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Account
                        </Link>
                    </Button>
                    {navItems.map((item) => (
                        <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            'flex items-center gap-2 rounded-md p-2 text-sm font-medium transition-colors',
                            pathname === item.href
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        )}
                        >
                        {item.icon}
                        <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </aside>
    );
}


function AdminAuth({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const isAdmin = useIsAdmin(user);
  const router = useRouter();

  useEffect(() => {
    // We only want to redirect if the isAdmin check is complete and the user is *not* an admin.
    if (isAdmin === false) {
      router.replace('/account'); // use replace to avoid back-button issues
    }
  }, [isAdmin, router]);

  // Show a loading skeleton while the admin status is being determined.
  if (isAdmin === undefined || user === undefined) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-8 w-1/2" />
          <div className="border rounded-lg p-6 space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
      </div>
    );
  }

  // If the user is an admin, render the admin layout.
  if (isAdmin) {
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row gap-8">
                <AdminNav />
                <main className="w-full md:w-3/4 lg:w-4/5">
                    {children}
                </main>
            </div>
        </div>
    );
  }

  // In the case where isAdmin is false, the useEffect will handle the redirect.
  // Returning null here prevents a flash of unstyled content.
  return null;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <AuthGate>
        <AdminAuth>{children}</AdminAuth>
      </AuthGate>
    </Suspense>
  );
}
