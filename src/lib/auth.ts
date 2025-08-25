
import {
    getAuth,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    getIdTokenResult,
} from "firebase/auth";
import { getDoc, doc, setDoc, getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Added query, where, getDocs
import { db, auth, app } from "./firestore"; // Ensure db and app are correctly initialized and exported

// const auth = getAuth(app); // No longer needed, imported from firestore.ts
const firestore = getFirestore(app); // Use getFirestore instance from firestore.ts if available, or initialize here

export const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);

        // Do NOT check for admin here. Let anyone log in.
        // The session cookie will be created for any authenticated user.
        const idToken = await user.getIdToken(true); // force refresh
        const resp = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });

        if (!resp.ok) {
            // If API login fails (e.g., server error), sign out the user from client
            await firebaseSignOut(auth);
            return false;
        }

        return true; // Return true on successful authentication and session creation
    } catch (error) {
        console.error("Error signing in:", error);
        return false;
    }
};

export const signOut = async (): Promise<boolean> => {
    try {
        await firebaseSignOut(auth);
        const resp = await fetch("/api/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return resp.ok;
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

// Checks if a user is an admin based on custom claims or Firestore data.
// This is used for UI gating, not for blocking login.
export const checkIfAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;

  // 1. Check custom claims first for efficiency
  const tokenResult = await getIdTokenResult(user, true); // Force refresh
  const role = tokenResult.claims.role;

  if (role === 'admin' || role === 'instructor') {
    return true;
  }

  // 2. Fallback to Firestore check
  const docRef = doc(db, "users", user.uid);
  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      // Check for either a boolean `isAdmin` or a `userType` string
      return userData.isAdmin === true || userData.userType === 'admin';
    }
    return false; // User document doesn't exist
  } catch (error) {
    console.error("Error checking admin status in Firestore:", error);
    return false; // Default to not admin on error
  }
};


export const getUserProfileFromLocalStorage = () => {
  if (typeof window === 'undefined') return null; // Prevent localStorage access on server
  const profile = localStorage.getItem("userProfile");
  return profile ? JSON.parse(profile) : null;
};

// Utility to create/update user profile in Firestore - used internally or by admin tools
export const updateUserProfile = async (userUid: string, profileData: { firstName?: string; lastName?: string; email?: string; isAdmin?: boolean; userType?: string }): Promise<void> => {
  try {
    const userRef = doc(db, "users", userUid);
    await setDoc(userRef, profileData, { merge: true }); // Use merge: true to update fields without overwriting the entire doc
    console.log(`User profile updated for UID: ${userUid}`);
  } catch (error) {
    console.error("Error updating user profile:", error);
  }
};


export const makeUserAdmin = async (userUid: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userUid);
    // Update using { merge: true } to only set the admin field
    await setDoc(userRef, { userType: "admin", isAdmin: true }, { merge: true });
    console.log(`User ${userUid} marked as admin.`);
  } catch (error) {
    console.error("Error making user admin:", error);
  }
};
