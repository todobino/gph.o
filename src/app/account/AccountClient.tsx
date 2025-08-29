
'use client';

import { Suspense } from 'react';
import AuthGate from '@/components/auth-gate';
import { useIsAdmin, useUser } from '@/hooks/useUser';
import { ProfileTab } from '@/components/account/profile-tab';
import { SecurityTab } from '@/components/account/security-tab';
import { Cog, UserCircle } from 'lucide-react';
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
  const user = useUser() as User | null;
  const isAdmin = useIsAdmin(user);

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
      <div className="space-y-8 max-w-3xl mx-auto">
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
                 <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-800/50 p-3 rounded-full">
                    <UserCircle className="h-8 w-8 text-blue-600 dark:text-blue-300" />
                </div>
                <h1 className="text-4xl font-bold font-heading">Your Account</h1>
            </div>
            {isAdmin && (
            <Button asChild>
                <Link href="/admin">
                <Cog className="mr-2 h-4 w-4" />
                Admin Panel
                </Link>
            </Button>
            )}
        </div>
        
        <div className="space-y-12">
            <ProfileTab user={user} />
            <SecurityTab />
        </div>
      </div>
    </main>
  );
}
