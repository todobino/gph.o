
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getCurrentUser, checkIfAdmin, signOut } from '@/lib/auth'; // Import signOut
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from 'firebase/auth';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from '@/hooks/use-toast'; // Import useToast

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true); // Start with loading true
  const router = useRouter();
  const { toast } = useToast(); // Initialize toast

  // Initial check if user is already logged in and admin
  useEffect(() => {
    const checkAuth = async () => {
        const user = await getCurrentUser();
        if(user){
            const isAdmin = await checkIfAdmin(user);
            if (isAdmin) {
                console.log("Already logged in as admin, redirecting...");
                router.push('/admin'); // Redirect if already admin
                return; // Exit after redirect
            } else {
                 console.log("Already logged in but not admin, logging out...");
                 await signOut(); // Log out if not admin
                 // Optionally show a message
                 toast({
                     title: "Access Denied",
                     description: "You are not authorized to access the admin area.",
                     variant: "destructive",
                 });
            }
        }
        setIsLoading(false); // Correctly use setIsLoading
    };
    checkAuth();
  }, [router, toast]); // Added toast to dependencies

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    // Use the updated signIn function which now internally checks for admin
    const success = await signIn(email, password);

    if (success) {
        toast({
            title: "Login Successful",
            description: "Redirecting to dashboard...",
        });
      router.push('/admin');
    } else {
      setError('Invalid email/password or not an admin.'); // Updated error message
       toast({
         title: "Login Failed",
         description: 'Invalid email/password or not an authorized admin.',
         variant: "destructive",
       });
       setIsLoading(false);
    }
  };

   // Render loading state or login form
   if (isLoading) {
     return <div className="flex justify-center items-center h-full"><p>Loading...</p></div>;
   }

  return (
    <div className="flex justify-center items-center h-full">
      <Card className="w-full max-w-sm mx-4">
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
                disabled={isLoading} // Disable input while loading
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
                 disabled={isLoading} // Disable input while loading
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
