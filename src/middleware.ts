
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { authAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs'; // Force Node.js runtime for firebase-admin

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
  const url = req.nextUrl.clone();

   // Protect all routes starting with /admin
   if (url.pathname.startsWith('/admin')) {
      if (!session) {
         console.log('Middleware: No session cookie found, redirecting to login.');
         url.pathname = '/login';
         return NextResponse.redirect(url);
      }

      try {
         // Verify the session cookie.
         const decodedClaims = await authAdmin.verifySessionCookie(session, true);
         // Check for admin role from custom claims
         const isAdmin = decodedClaims.role === 'admin' || decodedClaims.role === 'instructor';
         
         if (!isAdmin) {
            console.warn('Middleware: User is not an admin, redirecting.');
            const response = NextResponse.redirect(new URL('/account', req.url));
            // Don't clear the cookie, they are still a valid user
            return response;
         }

         console.log('Middleware: Session verified, allowing access to admin.');
         return NextResponse.next();
      } catch (error) {
         console.error('Middleware: Session verification failed:', error);
         const response = NextResponse.redirect(new URL('/login', req.url));
         response.cookies.set('session', '', { maxAge: 0, path: '/' });
         return response;
      }
   }

    // If accessing /login and already has a valid session, redirect
    if (url.pathname === '/login' && session) {
      try {
        const decodedClaims = await authAdmin.verifySessionCookie(session, true);
        const isAdmin = decodedClaims.role === 'admin' || decodedClaims.role === 'instructor';

        console.log('Middleware: Valid session found on /login, redirecting.');
        url.pathname = isAdmin ? '/admin' : '/account';
        return NextResponse.redirect(url);
      } catch (error) {
        console.log('Middleware: Invalid session on /login, allowing access.');
         const response = NextResponse.next();
         response.cookies.set('session', '', { maxAge: 0, path: '/' }); // Clear bad cookie
         return response;
      }
    }


   return NextResponse.next();
}

// Matcher config: protect /admin and check /login
export const config = { matcher: ['/admin/:path*', '/login'] };
