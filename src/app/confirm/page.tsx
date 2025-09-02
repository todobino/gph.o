
import { adminDb } from '@/lib/firebaseAdmin';
import { redirect } from 'next/navigation';
import { FieldValue } from 'firebase-admin/firestore';

export default async function Confirm({ searchParams }: { searchParams: { token?: string, sub?: string }}) {
  const { token, sub: subscriptionId } = searchParams;

  if (!token || !subscriptionId) {
    redirect('/?confirm=missing');
  }

  const subscriptionRef = adminDb.collection('subscriptions').doc(subscriptionId);
  
  try {
    const result = await adminDb.runTransaction(async (tx) => {
      const subSnap = await tx.get(subscriptionRef);
      if (!subSnap.exists) {
        return { success: false, reason: 'invalid' };
      }

      const subscriptionData = subSnap.data()!;
      if (subscriptionData.doubleOptIn?.token !== token) {
        return { success: false, reason: 'invalid' };
      }

      // Token is valid, proceed with confirmation
      const now = new Date();
      const subscriberId = subscriptionData.subscriberId;
      const subscriberRef = adminDb.collection('subscribers').doc(subscriberId);
      
      // Update subscription
      tx.update(subscriptionRef, {
        status: 'subscribed',
        subscribedAt: now,
        lastChangedAt: now,
        'doubleOptIn.confirmedAt': now,
        'doubleOptIn.token': FieldValue.delete(), // Remove token after use
      });

      // Update global subscriber status to 'active'
      tx.set(subscriberRef, { 
        status: 'active',
        confirmedAt: now,
        updatedAt: now,
      }, { merge: true });

      return { success: true };
    });

    if (result.success) {
      redirect('/?confirm=ok');
    } else {
      redirect(`/?confirm=${result.reason}`);
    }
  } catch (error) {
    console.error('Confirmation transaction failed:', error);
    redirect('/?confirm=error');
  }
}
