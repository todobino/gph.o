import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin'; // init Admin SDK
import sgMail from '@sendgrid/mail';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export async function POST(req: NextRequest) {
  const { email, listId } = await req.json();
  const clean = String(email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return NextResponse.json({ ok: false, error: 'bad_email' }, { status: 400 });
  }

  // rate limit (very light example)
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  // TODO: implement proper IP+email throttle

  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = Date.now() + 1000 * 60 * 60 * 24; // 24h

  const now = new Date();
  await adminDb.runTransaction(async (tx) => {
    const subRef = adminDb.collection('subscribers').doc(clean);
    const subSnap = await tx.get(subRef);
    if (!subSnap.exists) {
      tx.set(subRef, {
        email: clean,
        status: 'pending',
        listIds: listId ? [listId] : [],
        source: 'web_form',
        ipSignup: ip,
        ua: req.headers.get('user-agent') || '',
        createdAt: now,
      });
    } else {
      const d = subSnap.data()!;
      const listIds = new Set([...(d.listIds || []), ...(listId ? [listId] : [])]);
      tx.update(subRef, { listIds: Array.from(listIds), status: d.status === 'subscribed' ? 'subscribed' : 'pending' });
    }
    tx.set(adminDb.collection('confirmTokens').doc(token), {
      email: clean, listIds: listId ? [listId] : [], expiresAt, createdAt: now
    });
  });

  const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/confirm?token=${token}`;
  
  if (sgMail.send) {
    await sgMail.send({
      to: clean,
      from: { email: process.env.SEND_FROM_EMAIL!, name: process.env.SEND_FROM_NAME! },
      subject: 'Confirm your subscription',
      html: `<p>Click to confirm: <a href="${confirmUrl}">${confirmUrl}</a></p>`,
    });
  }


  return NextResponse.json({ ok: true });
}
