import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics"
import type { ContactFormData } from '@/components/contact-form';
import type { EmailSignupFormData } from '@/components/email-signup-form';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, app };

export async function saveContactMessage(data: ContactFormData): Promise<{ success: boolean, error?: string }> {
    
   
   
    try {
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
        if (!db) throw new Error("Firestore not initialized");

       await addDoc(collection(db, "subscribers"), {
            name: data.name,
            email: data.email,
            subscribedAt: serverTimestamp() // Add a timestamp
        });
        return { success: true };
    } catch (e) {
        return { success: false, error: "An error occurred while subscribing." };
    }
}
