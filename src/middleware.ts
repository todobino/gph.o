
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Use alias path again, assuming tsconfig paths are correctly configured
import { authAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs'; // Force Node.js runtime for firebase-admin

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;

   // Protect all routes starting with /admin
   if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!session) {
         console.log('Middleware: No session cookie found, redirecting to login.');
         return NextResponse.redirect(new URL('/login', req.url));
      }

      try {
         // Verify the session cookie. If invalid or expired, it throws an error.
         await authAdmin.verifySessionCookie(session, true);
         console.log('Middleware: Session verified, allowing access to admin.');
         // Session is valid, allow the request to proceed
         return NextResponse.next();
      } catch (error) {
         // Session cookie is invalid or expired. Redirect to login page.
         console.error('Middleware: Session verification failed:', error);
         // Clear the invalid cookie by setting maxAge to 0
         const response = NextResponse.redirect(new URL('/login', req.url));
         response.cookies.set('session', '', { maxAge: 0, path: '/' });
         return response;
      }
   }

    // If accessing /login and already has a valid session, redirect to /admin
    if (req.nextUrl.pathname === '/login' && session) {
      try {
        await authAdmin.verifySessionCookie(session, true);
         console.log('Middleware: Valid session found on /login, redirecting to admin.');
        // Valid session exists, redirect away from login
        return NextResponse.redirect(new URL('/admin', req.url));
      } catch (error) {
        // Invalid session, let them stay on login (or clear cookie and stay)
        console.log('Middleware: Invalid session on /login, allowing access.');
         const response = NextResponse.next(); // Allow access to login page
         response.cookies.set('session', '', { maxAge: 0, path: '/' }); // Clear bad cookie
         return response;
      }
    }


   // For non-admin routes, allow the request to proceed
   return NextResponse.next();
}

// Matcher config: protect /admin and check /login for existing sessions
export const config = { matcher: ['/admin/:path*', '/login'] };
