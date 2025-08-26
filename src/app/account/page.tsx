
'use client';

// Avoid static prerender; we need client auth.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { useIsAdmin, useUser } from '@/hooks/useUser';
import AuthGate from '@/components/auth-gate';
import { Suspense } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from '@/components/account/profile-tab';
import { SecurityTab } from '@/components/account/security-tab';
import { AdminTab } from '@/components/account/admin-tab';
import { Shield, User as UserIcon, Settings } from 'lucide-react';
import { User } from 'firebase/auth';

export default function AccountPage() {
  return (
    // If AuthGate uses useSearchParams, keep Suspense. If you removed it, you can also remove Suspense.
    <Suspense fallback={<div className="container mx-auto px-4 py-12">Loading…</div>}>
      <AuthGate>
        <AccountInner />
      </AuthGate>
    </Suspense>
  );
}

function AccountInner() {
  const user = useUser() as User; // AuthGate ensures user is not null/undefined
  const isAdmin = useIsAdmin(user);

  if (!user) {
    // This should technically not be reached due to AuthGate, but as a fallback
    return <div className="container mx-auto px-4 py-12">Loading user data...</div>
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
