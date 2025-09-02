
'use client';

import { Suspense } from 'react';
import AuthGate from '@/components/auth-gate';
import { useIsAdmin, useUser } from '@/hooks/useUser';
import { ProfileTab } from '@/components/account/profile-tab';
import { SecurityTab } from '@/components/account/security-tab';
import type { User } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AccountClient() {
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
      <AuthGate>
        <AccountInner />
      </AuthGate>
    </Suspense>
  );
}

function AccountInner() {
  const user = useUser();
  const isAdmin = useIsAdmin();

  if (!user) {
    // This should technically not be reached due to AuthGate, but as a fallback
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

  return (
    <main className="container mx-auto px-6 py-12">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold font-heading">Your Account</h1>
            {isAdmin && (
            <Button asChild>
                <Link href="/admin">
                Admin Panel
                </Link>
            </Button>
            )}
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 items-start">
            <ProfileTab user={user} />
            <SecurityTab />
        </div>
      </div>
    </main>
  );
}
