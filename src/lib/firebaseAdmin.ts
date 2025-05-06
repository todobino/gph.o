import * as admin from 'firebase-admin';

try {
  if (!admin.apps.length) {
    if (!process.env.FIREBASE_PROJECT_ID) {
      throw new Error('Missing FIREBASE_PROJECT_ID environment variable.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
} catch (error) {
  console.error('Error initializing Firebase Admin:', error);
  if (error instanceof Error) {
    throw error
  }
}

export const authAdmin = admin.auth();