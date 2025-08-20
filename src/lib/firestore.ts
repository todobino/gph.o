
import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { getAnalytics } from "firebase/analytics"
import type { ContactFormData } from '@/components/contact-form';
import type { EmailSignupFormData } from '@/components/email-signup-form';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: "gph-o-2ee61.firebaseapp.com",
    projectId: "gph-o-2ee61",
    storageBucket: "gph-o-2ee61.firebasestorage.app",
    messagingSenderId: "739808378249",
    appId: "1:739808378249:web:0bc65f9e41d42010af7558",
    measurementId: "G-9867FX91SW"
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
