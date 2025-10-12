
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Newspaper, GraduationCap, Users, List, ClipboardType, LockKeyhole } from 'lucide-react';
import Link from 'next/link';

import AuthGate from '@/components/auth-gate';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsAdmin } from '@/hooks/useUser';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

const navItems = [
    { href: '/admin', label: 'Overview', icon: <Home className="h-4 w-4" /> },
    { href: '/admin/posts', label: 'Posts', icon: <Newspaper className="h-4 w-4" /> },
    { href: '/admin/courses', label: 'Courses', icon: <GraduationCap className="h-4 w-4" /> },
    { href: '/admin/subscribers', label: 'Subscribers', icon: <Users className="h-4 w-4" /> },
    { href: '/admin/lists', label: 'Lists', icon: <List className="h-4 w-4" /> },
    { href: '/admin/forms', label: 'Forms', icon: <ClipboardType className="h-4 w-4" /> },
];

function AdminHeader() {
    const pathname = usePathname();
    
    return (
        <header className="border-b sticky top-14 bg-secondary z-10">
          <div className="container mx-auto px-4 flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
                <Link href="/admin" className="flex items-center gap-2 font-semibold">
                    <LockKeyhole className="h-6 w-6 text-primary" />
                    <span className="font-extrabold">Admin</span>
                </Link>
                <nav className="hidden md:flex items-center gap-1">
                    {navItems.map(item => (
                         <Button asChild size="sm" variant={pathname === item.href ? 'secondary' : 'ghost'} className="transition-none" key={item.href}>
                            <Link href={item.href} className="font-semibold">{item.label}</Link>
                        </Button>
                    ))}
                </nav>
            </div>
          </div>
        </header>
    );
}

function AdminAuth({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();
  const router = useRouter();

  useEffect(() => {
    // We only want to redirect if the isAdmin check is complete and the user is *not* an admin.
    if (isAdmin === false) {
      router.replace('/account'); // use replace to avoid back-button issues
    }
  }, [isAdmin, router]);

  // Show a loading skeleton while the admin status is being determined.
  if (isAdmin === undefined) {
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
        <>
            <AdminHeader />
            <div className="container mx-auto px-4 py-12">
                <main>
                    {children}
                </main>
            </div>
        </>
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
