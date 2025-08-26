
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    getIdTokenResult,
} from "firebase/auth";
import { getDoc, doc, setDoc, getFirestore } from "firebase/firestore";
import { db, auth, app } from "./firestore";

// This file is now mostly deprecated in favor of the /api/login and /api/logout routes
// and the useUser hook. Keeping for any potential legacy calls.

export const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        // The new flow handles session creation via API route.
        // This function is now mostly for compatibility.
        // In the new flow, the login page calls Firebase client SDK directly.
        return !!user;
    } catch (error) {
        console.error("Error signing in:", error);
        return false;
    }
};

export const signOut = async (): Promise<boolean> => {
    try {
        await firebaseSignOut(auth);
        // The new flow handles session destruction via API route.
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

  try {
    const idTokenResult = await user.getIdTokenResult(true); // Force refresh
    if (idTokenResult.claims.admin === true || idTokenResult.claims.role === 'admin') {
      return true;
    }
  } catch (e) {
      console.warn("Could not get custom claims, falling back to Firestore check.", e)
  }

  const docRef = doc(db, "users", user.uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      return userData.isAdmin === true || userData.userType === 'admin';
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
  }
};
