
'use client';

import { auth } from '@/lib/firestore';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const { toast } = useToast();

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    try {
      setBusy(true);
      setErr(null);
      await signInWithEmailAndPassword(auth, email, password);
      const nextUrl = searchParams.get('next') || '/account';
      router.push(nextUrl);
    } catch (e: any) {
      const errorMessage = e?.code === 'auth/invalid-credential' 
        ? 'Invalid email or password.'
        : e?.message ?? 'Login failed';
      setErr(errorMessage);
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    try {
      setBusy(true); setErr(null);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      const nextUrl = searchParams.get('next') || '/account';
      router.push(nextUrl);
    } catch (e: any) {
      setErr(e?.message ?? 'Login failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-12 flex justify-center items-center h-full">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Enter your credentials to access your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={busy}
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
                disabled={busy}
              />
            </div>
            {err && <p className="text-sm text-destructive">{err}</p>}
            <Button type="submit" disabled={busy} className="w-full">
              {busy ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
            <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                    </span>
                </div>
            </div>
            <Button onClick={handleGoogle} disabled={busy} variant="outline" className="w-full">
                {busy ? 'Signing in…' : 'Continue with Google'}
            </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
