
import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebaseAdmin';

const FIVE_DAYS = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: Request) {
  const { idToken } = await request.json();

  try {
    // Verify the ID token to ensure it's valid.
    const decodedToken = await authAdmin.verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Check for admin role in custom claims.
    const isAdmin = decodedToken.role === 'admin' || decodedToken.role === 'instructor';
    
    if (!isAdmin) {
      console.log(`Login attempt by non-admin user: ${email}`);
      return NextResponse.json({ error: 'UNAUTHORIZED', message: 'User is not an admin.' }, { status: 403 });
    }

    // Create session cookie for the authorized admin user.
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn: FIVE_DAYS });
    
    const res = NextResponse.json({ status: 'ok' });
    res.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      maxAge: FIVE_DAYS / 1000,
      path: '/',
      sameSite: 'strict',
    });
    return res;

  } catch (error: any) {
    console.error('API Login Error:', error);
    if (error.code === 'auth/id-token-expired') {
       return NextResponse.json({ error: 'TOKEN_EXPIRED' }, { status: 401 });
    }
    return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Invalid token or server error.' }, { status: 401 });
  }
}
