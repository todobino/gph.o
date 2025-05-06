import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebaseAdmin';

const FIVE_DAYS = 60 * 60 * 24 * 5 * 1000;

export async function POST(request: Request) {
  const { idToken } = await request.json();
  try {
    const sessionCookie = await authAdmin.createSessionCookie(idToken, { expiresIn: FIVE_DAYS });
    const res = NextResponse.json({ status: 'ok' });
    res.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: true,
      maxAge: FIVE_DAYS / 1000,
      path: '/',
    });
    return res;
  } catch {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
}