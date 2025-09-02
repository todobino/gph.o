
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminDb } from '@/lib/firebaseAdmin'; // init Admin SDK
import sgMail from '@sendgrid/mail';
import { FieldValue } from 'firebase-admin/firestore';

if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

const NEWSLETTER_LIST_ID = 'newsletter'; // Default list ID

export async function POST(req: NextRequest) {
  const { email, listId = NEWSLETTER_LIST_ID } = await req.json();
  const cleanEmail = String(email || '').trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return NextResponse.json({ ok: false, error: 'bad_email' }, { status: 400 });
  }

  const now = new Date();
  const confirmationToken = crypto.randomBytes(24).toString('hex');
  const subscriptionId = `${cleanEmail}_${listId}`;

  try {
    await adminDb.runTransaction(async (tx) => {
        const subscriberRef = adminDb.collection('subscribers').doc(cleanEmail);
        const subscriptionRef = adminDb.collection('subscriptions').doc(subscriptionId);

        const subscriberSnap = await tx.get(subscriberRef);
        
        // 1. Create or update the global subscriber document
        if (!subscriberSnap.exists) {
            tx.set(subscriberRef, {
                id: cleanEmail,
                email: cleanEmail,
                status: 'unconfirmed',
                source: 'web_form',
                createdAt: now,
                updatedAt: now,
            });
        } else {
            // If user exists and is unsubscribed, let them re-subscribe but keep as unconfirmed
            const currentStatus = subscriberSnap.data()?.status;
            if (currentStatus !== 'active' && currentStatus !== 'unconfirmed') {
                 tx.update(subscriberRef, { status: 'unconfirmed', updatedAt: now });
            } else {
                 tx.update(subscriberRef, { updatedAt: now });
            }
        }
        
        // 2. Create the specific subscription document with 'pending' status
        tx.set(subscriptionRef, {
            id: subscriptionId,
            subscriberId: cleanEmail,
            listId: listId,
            status: 'pending',
            channel: 'email',
            lastChangedAt: now,
            doubleOptIn: {
                required: true,
                token: confirmationToken,
                sentAt: now
            }
        });
    });

    const confirmUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/confirm?token=${confirmationToken}&sub=${subscriptionId}`;
  
    if (process.env.SENDGRID_API_KEY) {
      await sgMail.send({
        to: cleanEmail,
        from: { email: process.env.SEND_FROM_EMAIL!, name: process.env.SEND_FROM_NAME! },
        subject: 'Confirm your subscription',
        html: `<p>Please click the link below to confirm your subscription:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`,
      });
    } else {
       console.log(`CONFIRMATION LINK (no email sent): ${confirmUrl}`);
    }

    return NextResponse.json({ ok: true });

  } catch (error) {
    console.error('Error in /api/subscribe:', error);
    return NextResponse.json({ ok: false, error: 'server_error' }, { status: 500 });
  }
}
