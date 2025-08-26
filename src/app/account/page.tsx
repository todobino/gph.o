// NO 'use client' here — this stays a SERVER file
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import AccountClient from './AccountClient';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function Page() {
  // Just render the client UI
  return (
      <Suspense fallback={
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
      }>
        <AccountClient />
      </Suspense>
  );
}
