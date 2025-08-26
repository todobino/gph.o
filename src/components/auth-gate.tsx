// src/components/AuthGate.tsx
'use client';

import { ReactNode, useEffect } from 'react';
import { useUser } from '@/hooks/useUser';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

export default function AuthGate({ children }: { children: ReactNode }) {
  const user = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (user === null) {
      const callbackUrl = `${pathname}?${searchParams.toString()}`;
      router.replace(`/login?next=${encodeURIComponent(callbackUrl)}`);
    }
  }, [user, router, pathname, searchParams]);

  if (user === undefined) {
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
  };

  if (user === null) {
    return null; // or a loading spinner while redirecting
  }

  return <>{children}</>;
}
