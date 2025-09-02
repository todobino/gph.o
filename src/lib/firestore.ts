
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBKg7VLcKQQwybDzBg1QCWVDUd4gHZpSPg",
  authDomain: "gph-o-2ee61.firebaseapp.com",
  projectId: "gph-o-2ee61",
  storageBucket: "gph-o-2ee61.firebasestorage.app",
  messagingSenderId: "739808378249",
  appId: "1:739808378249:web:0bc65f9e41d42010af7558",
  measurementId: "G-9867FX91SW"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = getFirestore(app);
export const auth = getAuth(app);
export { app };

// Initialize Analytics and export it
export const analytics = isSupported().then(yes => yes ? getAnalytics(app) : null);
