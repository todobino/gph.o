
import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebaseAdmin';

export const runtime = 'nodejs'; // Ensure firebase-admin works

const FIVE_DAYS_MS = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const idToken = body?.idToken;
    if (!idToken) {
      return NextResponse.json({ error: 'MISSING_ID_TOKEN' }, { status: 400 });
    }

    // Verify the ID token to ensure it's valid, but do not gate based on role.
    await authAdmin.verifyIdToken(idToken);

    // Create session cookie for any authenticated user.
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn: FIVE_DAYS_MS });
    
    const res = NextResponse.json({ status: 'ok' });
    res.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development', // Use secure cookies in production
      maxAge: FIVE_DAYS_MS / 1000,
      path: '/',
      sameSite: 'lax', // Use 'lax' for better security with redirects
    });
    return res;

  } catch (error: any) {
    console.error('API /login error:', {
      code: error?.code,
      message: error?.message,
      name: error?.name,
    });
    if (error.code === 'auth/id-token-expired') {
       return NextResponse.json({ error: 'TOKEN_EXPIRED' }, { status: 401 });
    }
     if (error?.code === 'auth/argument-error') {
      return NextResponse.json({ error: 'BAD_ID_TOKEN' }, { status: 400 });
    }
    return NextResponse.json({ error: 'SERVER_ERROR' }, { status: 500 });
  }
}
