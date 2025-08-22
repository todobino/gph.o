
import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebaseAdmin';

const FIVE_DAYS = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: Request) {
  const { idToken } = await request.json();

  try {
    // Verify the ID token to ensure it's valid, but do not gate based on role.
    await authAdmin.verifyIdToken(idToken);

    // Create session cookie for any authenticated user.
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn: FIVE_DAYS });
    
    const res = NextResponse.json({ status: 'ok' });
    res.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      maxAge: FIVE_DAYS / 1000,
      path: '/',
      sameSite: 'lax', // Use 'lax' for better security with redirects
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
