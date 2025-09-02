
'use client';

import {
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
} from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db, auth } from "./firestore";


export const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        return !!user;
    } catch (error) {
        console.error("Error signing in:", error);
        return false;
    }
};

export const signOut = async (): Promise<boolean> => {
    try {
        await firebaseSignOut(auth);
        return true;
    } catch (error) {
        console.error("Error signing out:", error);
        return false;
    }
};

export const getCurrentUser = (): Promise<User | null> => {
    return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

export const checkIfAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;

  const docRef = doc(db, "users", user.uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.userType === 'admin';
    }
    return false;
  } catch (error) {
    console.error("Error checking admin status in Firestore:", error);
    return false;
  }
};

export const updateUserProfile = async (userUid: string, profileData: { firstName?: string; lastName?: string; }): Promise<void> => {
  try {
    const userRef = doc(db, "users", userUid);
    await setDoc(userRef, profileData, { merge: true });
    console.log(`User profile updated for UID: ${userUid}`);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
