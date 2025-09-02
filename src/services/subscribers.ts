
'use server';

import { adminDb } from '@/lib/firebaseAdmin';
import type { Subscriber, List } from '@/types/subscriber';
import { Timestamp } from 'firebase-admin/firestore';

function convertTimestamps(docData: any) {
    const data = { ...docData };
    for (const key in data) {
        if (data[key] instanceof Timestamp) {
            data[key] = data[key].toDate().toISOString();
        } else if (typeof data[key] === 'object' && data[key] !== null) {
            // Recursively convert nested timestamps, e.g., in gdprConsent
            for (const nestedKey in data[key]) {
                if (data[key][nestedKey] instanceof Timestamp) {
                     data[key][nestedKey] = data[key][nestedKey].toDate().toISOString();
                }
            }
        }
    }
    return data;
}

/**
 * Asynchronously retrieves all subscribers from Firestore.
 * @returns A promise that resolves to an array of Subscriber objects.
 */
export async function getSubscribers(): Promise<Subscriber[]> {
  try {
    const subscribersSnapshot = await adminDb.collection('subscribers').orderBy('createdAt', 'desc').get();
    if (subscribersSnapshot.empty) {
      return [];
    }
    return subscribersSnapshot.docs.map(doc => convertTimestamps(doc.data()) as Subscriber);
  } catch (error) {
    console.error("Error reading subscribers collection:", error);
    return [];
  }
}

/**
 * Asynchronously retrieves all lists from Firestore.
 * @returns A promise that resolves to an array of List objects.
 */
export async function getLists(): Promise<List[]> {
  try {
    const listsSnapshot = await adminDb.collection('lists').orderBy('createdAt', 'desc').get();
    if (listsSnapshot.empty) {
      return [
        // Return a placeholder if no lists exist
        { id: 'newsletter', slug: 'newsletter', name: 'Newsletter', description: 'General updates and news.', isPublic: true, createdAt: new Date(), updatedAt: new Date(), subscriberCount: 0 },
      ];
    }
     return listsSnapshot.docs.map(doc => convertTimestamps(doc.data()) as List);
  } catch (error) {
    console.error("Error reading lists collection:", error);
     return [
        { id: 'newsletter', slug: 'newsletter', name: 'Newsletter', description: 'General updates and news.', isPublic: true, createdAt: new Date(), updatedAt: new Date(), subscriberCount: 0 },
      ];
  }
}
