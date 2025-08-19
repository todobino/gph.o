import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// This is a simplified webhook handler.
// In production, you should add signature verification to ensure
// the request is coming from SendGrid.
export async function POST(req: NextRequest) {
  try {
    const events = await req.json();

    // SendGrid sends events in an array
    for (const event of events) {
      const email = event.email;
      if (!email) continue;

      const subRef = adminDb.collection('subscribers').doc(email);
      let status;

      switch (event.event) {
        case 'bounce':
        case 'dropped':
          status = 'bounced';
          break;
        case 'spamreport':
          status = 'complained';
          break;
        case 'unsubscribe':
           status = 'unsubscribed';
           break;
        default:
          // Ignore other events like 'processed', 'delivered', 'open', 'click' for now
          continue;
      }
      
      console.log(`Updating status for ${email} to ${status} due to ${event.event} event.`);
      
      // Update subscriber status in Firestore
      await subRef.set({ status: status, lastEventType: event.event, lastEventTimestamp: new Date(event.timestamp * 1000) }, { merge: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error processing SendGrid webhook:', error);
    return NextResponse.json({ ok: false, error: 'internal_error' }, { status: 500 });
  }
}
