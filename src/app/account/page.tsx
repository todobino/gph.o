
'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { getCurrentUser, checkIfAdmin } from '@/lib/auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ProfileTab } from '@/components/account/profile-tab';
import { AdminTab } from '@/components/account/admin-tab';
import { SecurityTab } from '@/components/account/security-tab';
import { Shield, User as UserIcon, Settings } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tab || 'profile');

  useEffect(() => {
    const checkUser = async () => {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        router.push('/login?next=/account');
        return;
      }
      setUser(currentUser);
      const adminStatus = await checkIfAdmin(currentUser);
      setIsAdmin(adminStatus);

      // If the user is trying to access the admin tab but isn't an admin,
      // default them to the profile tab.
      if (tab === 'admin' && !adminStatus) {
        setActiveTab('profile');
      }

      setLoading(false);
    };

    checkUser();
  }, [router, tab]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-4">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-8 w-full" />
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-32" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-24" />
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Should be redirected by the effect
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold font-heading mb-4">Your Account</h1>
      <p className="text-muted-foreground mb-8">Manage your profile, security settings, and more.</p>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
    </div>
  );
}
