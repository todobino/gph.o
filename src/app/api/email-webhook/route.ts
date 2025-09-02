
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import { FieldValue } from 'firebase-admin/firestore';

// This is a simplified webhook handler.
// In production, you should add signature verification to ensure
// the request is coming from SendGrid.
export async function POST(req: NextRequest) {
  try {
    const events = await req.json();

    for (const event of events) {
      const email = event.email;
      if (!email) continue;

      let subscriberStatus: string;
      let subscriptionStatus = "unsubscribed"; // Most events imply this
      let reason: string = event.event;

      switch (event.event) {
        case 'bounce':
        case 'dropped':
          subscriberStatus = 'bounced';
          break;
        case 'spamreport':
          subscriberStatus = 'complained';
          break;
        case 'unsubscribe':
           subscriberStatus = 'unsubscribed';
           break;
        default:
          // Ignore other events like 'processed', 'delivered', 'open', 'click' for now
          continue;
      }
      
      console.log(`Updating status for ${email} to ${subscriberStatus} due to ${event.event} event.`);
      
      const now = new Date();
      const subscriberRef = adminDb.collection('subscribers').doc(email);
      
      // Update subscriber global status in Firestore
      await subscriberRef.set({ status: subscriberStatus, updatedAt: now }, { merge: true });

      // Find all active subscriptions for this email and update them
      const subscriptionsQuery = await adminDb.collection('subscriptions')
        .where('subscriberId', '==', email)
        .where('status', '==', 'subscribed')
        .get();

      if (!subscriptionsQuery.empty) {
        const batch = adminDb.batch();
        subscriptionsQuery.forEach(doc => {
            batch.update(doc.ref, {
                status: subscriptionStatus,
                reason: reason,
                unsubscribedAt: now,
                lastChangedAt: now
            });
        });
        await batch.commit();
        console.log(`Updated ${subscriptionsQuery.size} subscriptions for ${email}.`);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing SendGrid webhook:', error);
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 });
  }
}
