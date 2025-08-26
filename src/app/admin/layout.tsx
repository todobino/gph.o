
'use client';

import AuthGate from '@/components/auth-gate';
import { useIsAdmin, useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

function AdminAuth({ children }: { children: React.ReactNode }) {
    const user = useUser();
    const isAdmin = useIsAdmin(user);
    const router = useRouter();

    useEffect(() => {
        // user is loaded and is not admin
        if (isAdmin === false) {
            router.push('/account');
        }
    }, [isAdmin, router]);
    
    // waiting for user/admin state to load
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
        )
    }

    if (isAdmin) {
        return <>{children}</>;
    }
    
    // Fallback while redirecting
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
  )
}
