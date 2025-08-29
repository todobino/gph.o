
'use client';

import { Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book, GraduationCap, Home, Newspaper, Users } from 'lucide-react';
import Link from 'next/link';

import AuthGate from '@/components/auth-gate';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useIsAdmin, useUser } from '@/hooks/useUser';
import './admin.css';

function AdminAuth({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const isAdmin = useIsAdmin(user);
  const router = useRouter();

  useEffect(() => {
    if (isAdmin === false) {
      router.push('/account');
    }
  }, [isAdmin, router]);

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

  if (isAdmin) {
    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton href="/admin" asChild>
                                    <Link href="/admin">
                                        <Home />
                                        Overview
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton href="/admin/posts" asChild>
                                    <Link href="/admin/posts">
                                        <Newspaper />
                                        Posts
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton href="/admin/courses" asChild>
                                    <Link href="/admin/courses">
                                        <GraduationCap />
                                        Courses
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                             <SidebarMenuItem>
                                <SidebarMenuButton href="/admin/subscribers" asChild>
                                    <Link href="/admin/subscribers">
                                        <Users />
                                        Subscribers
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroup>
                </SidebarContent>
            </Sidebar>
             <SidebarInset>
                <div className="p-4 sm:p-6 lg:p-8">
                  <div className="flex items-center gap-4">
                    <SidebarTrigger className="md:hidden" />
                     <Button variant="outline" size="sm" asChild>
                          <Link href="/account">
                            Back to Account
                          </Link>
                      </Button>
                  </div>
                   <div className="mt-6">
                      {children}
                   </div>
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
  }

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
