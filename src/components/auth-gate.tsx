
// src/components/AuthGate.tsx
'use client';

import { ReactNode, Suspense } from 'react';
import { useUser } from '@/hooks/useUser';
import { redirect, usePathname, useSearchParams } from 'next/navigation';
import { Skeleton } from './ui/skeleton';

export default function AuthGate({ children }: { children: ReactNode }) {
  // Using useSearchParams triggers CSR bailout; wrap this component with <Suspense> where used.
  const params = useSearchParams();
  const pathname = usePathname();

  const user = useUser();

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
      const callbackUrl = `${pathname}?${params.toString()}`;
      redirect(`/login?next=${encodeURIComponent(callbackUrl)}`);
  }

  return <>{children}</>;
}
