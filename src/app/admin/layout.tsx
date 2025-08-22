
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, checkIfAdmin } from '@/lib/auth';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyAdmin = async () => {
      const user = await getCurrentUser();
      if (!user) {
        // If not logged in, redirect to login page with a 'next' parameter
        // so they can be redirected back here after logging in.
        const currentPath = window.location.pathname;
        router.push(`/login?next=${encodeURIComponent(currentPath)}`);
        return;
      }
      const isAdmin = await checkIfAdmin(user);
      if (!isAdmin) {
        // If logged in but not an admin, redirect to the main account page.
        router.push('/account'); 
      } else {
        setIsVerified(true);
      }
    };
    verifyAdmin();
  }, [router]);

  if (!isVerified) {
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

  return <>{children}</>;
}
