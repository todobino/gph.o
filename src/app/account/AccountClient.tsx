'use client';

import { Suspense } from 'react';
import AuthGate from '@/components/auth-gate';
import { useIsAdmin, useUser } from '@/hooks/useUser';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from '@/components/account/profile-tab';
import { SecurityTab } from '@/components/account/security-tab';
import { AdminTab } from '@/components/account/admin-tab';
import { Shield, User as UserIcon, Settings } from 'lucide-react';
import type { User } from 'firebase/auth';
import { Skeleton } from '@/components/ui/skeleton';

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
    <main className="container mx-auto p-6">
       <h1 className="text-4xl font-bold font-heading mb-4">Your Account</h1>
       <p className="text-muted-foreground mb-8">Manage your profile, security settings, and more.</p>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:w-auto lg:grid-cols-3">
          <TabsTrigger value="profile">
            <UserIcon className="mr-2 h-4 w-4" /> Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="mr-2 h-4 w-4" /> Security
          </TabsTrigger>
          {isAdmin && (
            <TabsTrigger value="admin">
              <Settings className="mr-2 h-4 w-4" /> Admin
            </TabsTrigger>
          )}
        </TabsList>
        
        <TabsContent value="profile" className="mt-6">
          <ProfileTab user={user} />
        </TabsContent>
        
        <TabsContent value="security" className="mt-6">
            <SecurityTab />
        </TabsContent>

        {isAdmin && (
            <TabsContent value="admin" className="mt-6">
                <AdminTab />
            </TabsContent>
        )}
      </Tabs>
    </main>
  );
}
