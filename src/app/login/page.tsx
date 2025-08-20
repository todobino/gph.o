
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getCurrentUser, checkIfAdmin, signOut } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start as true to handle initial auth check
  const router = useRouter();
  const { toast } = useToast();

  // Check if a user is already logged in and an admin
  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const user = await getCurrentUser();
      if (user) {
        const isAdmin = await checkIfAdmin(user);
        if (isAdmin) {
          console.log("Already logged in as admin, redirecting...");
          router.push('/admin'); // Redirect if already admin
          return; // Skip setting loading to false
        } else {
          console.log("Already logged in but not admin, logging out...");
          await signOut(); // Log out if not admin
          toast({
            title: "Access Denied",
            description: "You are not authorized to access the admin area.",
            variant: "destructive",
          });
        }
      }
      setIsLoading(false); // Only set to false if not redirecting
    };

    checkAuth();
  }, [router, toast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await signIn(email, password);

      if (success) {
        toast({
          title: "Login Successful",
          description: "Redirecting to dashboard...",
        });
        // Use router.replace to avoid the user going back to the login page
        router.replace('/admin');
      } else {
        setError('Login failed. Please check your credentials or admin status.');
        toast({
          title: "Login Failed",
          description: 'Invalid email/password or not an authorized admin.',
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (err) {
        console.error("Login submit error:", err);
        setError('An unexpected error occurred during login.');
        toast({
            title: "Login Error",
            description: 'An unexpected error occurred. Please try again.',
            variant: "destructive",
        });
        setIsLoading(false);
    }
  };

  // Render loading skeleton or login form
  if (isLoading) {
    return (
      <div className="flex justify-center pt-20">
         <Card className="w-full max-w-sm mx-4 h-fit">
            <CardHeader>
               <Skeleton className="h-8 w-3/4" />
               <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <Skeleton className="h-10 w-full" />
            </CardContent>
         </Card>
      </div>
    );
  }

  return (
    <div className="flex justify-center pt-20">
      <Card className="w-full max-w-sm mx-4 h-fit">
        <CardHeader>
          <CardTitle>Admin Login</CardTitle>
          <CardDescription>Enter your email and password to login.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
