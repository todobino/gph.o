"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getCurrentUser, checkIfAdmin } from '@/lib/auth';
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
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      setIsLoading(true);
      const user = await getCurrentUser();
      if (user) {
        const isAdmin = await checkIfAdmin(user);
        if (isAdmin) {
          router.push('/admin');
          return; // component will unmount on navigation
        } else {
          // If a non-admin user somehow gets here with a session,
          // redirect them to their account page instead of logging them out.
          router.push('/account');
          return;
        }
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [router, toast]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const user = await signIn(email, password);
      if (user) {
        toast({ title: "Login Successful", description: "Redirecting..." });
        // Instead of relying on a boolean, we re-check admin status after login
        const isAdmin = await checkIfAdmin(user);
        if (isAdmin) {
            router.replace('/admin');
        } else {
            router.replace('/account');
        }
      } else {
        // signIn function now returns null on failure
        setError('Login failed. Please check your credentials.');
        toast({
          title: "Login Failed",
          description: 'Invalid email or password.',
          variant: "destructive",
        });
        setIsLoading(false);
      }
    } catch (err) {
      console.error("Login submit error:", err);
      const errorMessage = (err instanceof Error) ? err.message : 'An unexpected error occurred.';
      setError(errorMessage);
      toast({
        title: "Login Error",
        description: errorMessage,
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center pt-20 pb-20">
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
    <div className="flex justify-center pt-20 pb-20">
      <Card className="w-full max-w-sm mx-4 h-fit">
        <CardHeader>
          <CardTitle>Login</CardTitle>
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
