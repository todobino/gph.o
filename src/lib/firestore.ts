// TODO: Configure Firebase
// This file is a placeholder for Firebase initialization.
// You need to set up a Firebase project and add your configuration details.

// import { initializeApp, getApps, getApp } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
// import { getAuth } from 'firebase/auth';

/*
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };


// Placeholder save functions (move to appropriate service files or keep here)
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import type { ContactFormData } from '@/components/contact-form';
import type { EmailSignupFormData } from '@/components/email-signup-form';


export async function saveContactMessage(data: ContactFormData): Promise<{ success: boolean, error?: string }> {
  try {
    // Ensure db is initialized
    if (!db) throw new Error("Firestore not initialized");

    const docRef = await addDoc(collection(db, "contactMessages"), {
      ...data,
      submittedAt: serverTimestamp() // Add a timestamp
    });
    console.log("Contact message saved with ID: ", docRef.id);
    return { success: true };
  } catch (e) {
    console.error("Error adding contact message: ", e);
    return { success: false, error: "An error occurred while saving the message." };
  }
}

export async function saveEmailSubscriber(data: EmailSignupFormData): Promise<{ success: boolean, error?: string }> {
   try {
     // Ensure db is initialized
     if (!db) throw new Error("Firestore not initialized");

     // Check if email already exists if necessary (optional)

     const docRef = await addDoc(collection(db, "subscribers"), {
        name: data.name,
        email: data.email,
        subscribedAt: serverTimestamp() // Add a timestamp
     });
     console.log("Subscriber saved with ID: ", docRef.id);
     return { success: true };
   } catch (e) {
     console.error("Error adding subscriber: ", e);
     // Handle specific errors like duplicates if needed
     return { success: false, error: "An error occurred while subscribing." };
   }
}

*/

// Remove this line once Firebase is configured
export const db = null;
export const auth = null;
