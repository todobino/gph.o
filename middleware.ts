
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
// Attempting alias import for firebaseAdmin in middleware
import { authAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs'; // Force Node.js runtime for firebase-admin

export async function middleware(req: NextRequest) {
  const session = req.cookies.get('session')?.value;
   if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!session) return NextResponse.redirect(new URL('/login', req.url));

      try {
         // Verify the session cookie. If invalid or expired, it throws an error.
         await authAdmin.verifySessionCookie(session, true);
         // Session is valid, allow the request to proceed
         return NextResponse.next();
      } catch (error) {
         // Session cookie is invalid or expired. Redirect to login page.
         console.error('Session verification failed:', error);
         // Clear the invalid cookie by setting maxAge to 0
         const response = NextResponse.redirect(new URL('/login', req.url));
         response.cookies.set('session', '', { maxAge: 0, path: '/' });
         return response;
      }
   }
   // For non-admin routes, allow the request to proceed
   return NextResponse.next();
}

// Matcher config remains the same
export const config = { matcher: ['/admin/:path*'] };

