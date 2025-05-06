
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListPlus, Edit, CalendarDays, Users, LogOut } from "lucide-react";
import Link from "next/link";
import { getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app, db } from '@/lib/firestore'; // Import initialized db and app
import { signOut } from '@/lib/auth'; // Import signOut
import { useRouter } from 'next/navigation'; // Import useRouter
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string | null;
}

export default function AdminDashboardPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const auth = getAuth(app);
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
             // Check for admin status - assuming 'userType' or 'isAdmin' field
             const isAdmin = userData.userType === 'admin' || userData.isAdmin === true;
             if (!isAdmin) {
               // Not an admin, redirect or show error
               setError("Access Denied. You are not an administrator.");
               await signOut(); // Log out non-admin user
               router.push('/login'); // Redirect to login
               return; // Stop further processing
             }
            setUserProfile({
              firstName: userData.firstName || 'User', // Fallback name
              lastName: userData.lastName || '',
              email: user.email,
            });
          } else {
            // User doc doesn't exist, fallback or handle error
             setUserProfile({
               firstName: 'Admin',
               lastName: 'User', // Fallback name if no profile found
               email: user.email,
             });
             console.warn("User profile document not found in Firestore for UID:", user.uid);
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
          setError("Failed to load user profile.");
           setUserProfile({ // Fallback profile on error
               firstName: 'Admin',
               lastName: 'User',
               email: user.email,
             });
        }
      } else {
        // No user is signed in, redirect to login
        router.push('/login');
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, router]); // Added router to dependency array


  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };


  return (
    <div className="space-y-8 p-4 md:p-8">
       <div className="flex justify-between items-start mb-6">
         <div>
           <p className="text-sm text-muted-foreground">Admin Dashboard</p>
           {loading ? (
              <>
                <Skeleton className="h-10 w-72 mt-1 mb-2" />
                <Skeleton className="h-5 w-60" />
              </>
            ) : error ? (
               <h1 className="text-4xl font-bold text-destructive">{error}</h1>
            ) : (
              <>
                <h1 className="text-4xl font-bold">Welcome, {userProfile?.firstName} {userProfile?.lastName}.</h1>
                 <p className="text-sm text-muted-foreground mt-1">Logged in as: {userProfile?.email}</p>
              </>
            )}
         </div>
          <Button variant="outline" size="sm" onClick={handleLogout} disabled={loading}>
             <LogOut className="w-4 h-4 mr-1" /> Logout
          </Button>
       </div>

      {/* Render cards only if not loading and no error */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Manage Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5 text-primary" />
                Manage Posts
              </CardTitle>
              <CardDescription>Create, edit, or delete blog posts.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/posts/new"><ListPlus className="w-4 h-4 mr-1" /> New Post</Link>
                </Button>
                <Button variant="secondary" size="sm" asChild>
                  <Link href="/admin/posts">View All Posts</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Manage Events (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Manage Events
              </CardTitle>
              <CardDescription>Add, update, or remove events.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled>
                  <ListPlus className="w-4 h-4 mr-1" /> New Event
                </Button>
                <Button variant="secondary" size="sm" disabled>
                  View All Events
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Event management coming soon.</p>
            </CardContent>
          </Card>

          {/* Manage Subscribers (Placeholder) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Manage Subscribers
              </CardTitle>
              <CardDescription>View and manage email list subscribers.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="secondary" size="sm" disabled>
                View Subscribers
              </Button>
              <p className="text-xs text-muted-foreground mt-2">Subscriber management coming soon.</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
