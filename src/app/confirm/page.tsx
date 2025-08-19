import { adminDb } from '@/lib/firebaseAdmin';
import { redirect } from 'next/navigation';

export default async function Confirm({ searchParams }: { searchParams: { token?: string }}) {
  const token = searchParams.token;
  if (!token) redirect('/?confirm=missing');
  const ref = adminDb.collection('confirmTokens').doc(token);
  const snap = await ref.get();
  if (!snap.exists) redirect('/?confirm=invalid');

  const { email, listIds, expiresAt } = snap.data()!;
  if (Date.now() > expiresAt) { await ref.delete(); redirect('/?confirm=expired'); }

  const subRef = adminDb.collection('subscribers').doc(email);
  await adminDb.runTransaction(async (tx) => {
    const s = await tx.get(subRef);
    const setLists = new Set([...(s.data()?.listIds || []), ...(listIds || [])]);
    tx.set(subRef, {
      email, status: 'subscribed', listIds: Array.from(setLists), confirmedAt: new Date(),
    }, { merge: true });
    tx.delete(ref);
  });

  redirect('/?confirm=ok');
}
