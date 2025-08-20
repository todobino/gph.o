'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { getAuth, onAuthStateChanged, type User as FirebaseUser } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app, db } from '@/lib/firestore';
import { signOut } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Skeleton } from "@/components/ui/skeleton";

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string | null;
}

export default function AccountPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(app);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserProfile({
              firstName: userData.firstName || 'User',
              lastName: userData.lastName || '',
              email: user.email,
            });
          } else {
             setUserProfile({
               firstName: 'Valued',
               lastName: 'Member',
               email: user.email,
             });
             console.warn("User profile document not found in Firestore for UID:", user.uid);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Failed to load user profile.");
           setUserProfile({
               firstName: 'Valued',
               lastName: 'Member',
               email: user.email,
             });
        }
      } else {
        router.push('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, router]);


  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-4xl mx-auto">
       <div className="flex justify-between items-start mb-6">
         <div>
           <p className="text-sm text-muted-foreground">Account Dashboard</p>
           {loading ? (
              <>
                <Skeleton className="h-10 w-72 mt-1 mb-2" />
                <Skeleton className="h-5 w-60" />
              </>
            ) : error ? (
               <h1 className="text-4xl font-bold text-destructive font-heading">{error}</h1>
            ) : (
              <>
                <h1 className="text-4xl font-bold font-heading">Welcome, {userProfile?.firstName} {userProfile?.lastName}.</h1>
                 <p className="text-sm text-muted-foreground mt-1">Logged in as: {userProfile?.email}</p>
              </>
            )}
         </div>
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
             <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
       </div>

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Profile
              </CardTitle>
              <CardDescription>Manage your personal information.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="secondary" size="sm" disabled>Edit Profile</Button>
               <p className="text-xs text-muted-foreground mt-2">Coming soon.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <User className="w-5 h-5 text-primary" />
                My Courses & Purchases
              </CardTitle>
              <CardDescription>View your enrolled courses and order history.</CardDescription>
            </CardHeader>
            <CardContent>
               <Button variant="secondary" size="sm" disabled>View My Content</Button>
                <p className="text-xs text-muted-foreground mt-2">Coming soon.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
