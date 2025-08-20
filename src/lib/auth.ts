import {
    getAuth,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User,
    getIdTokenResult,
} from "firebase/auth";
import { getDoc, doc, setDoc, getFirestore, collection, query, where, getDocs } from "firebase/firestore"; // Added query, where, getDocs
import { db, app } from "./firestore"; // Ensure db and app are correctly initialized and exported

const auth = getAuth(app);
const firestore = getFirestore(app); // Use getFirestore instance from firestore.ts if available, or initialize here


// Function to check if the users collection exists, creates it if not (simplistic)
// Note: Collections are implicitly created when the first document is added.
// This function primarily checks if *any* document exists, which implies the collection exists.
async function ensureUsersCollection() {
    try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("email", "!=", "")); // Query for any document with an email
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("Users collection appears empty or doesn't exist. It will be created on first user document write.");
            // You could potentially add a placeholder document here if needed,
            // but Firestore creates collections automatically.
        }
    } catch (error) {
        console.error("Error checking/ensuring users collection:", error);
    }
}

export const signIn = async (email: string, password: string): Promise<User | null> => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await user.getIdToken();
        const resp = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });

        if (!resp.ok) {
            // If API login fails, sign out the user from client
            await firebaseSignOut(auth);
            return null;
        }

        return user; // Return user object on success
    } catch (error) {
        console.error("Error signing in:", error);
        return null;
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

// Checks if a user is an admin based on Firestore data
export const checkIfAdmin = async (user: User | null): Promise<boolean> => {
  if (!user) return false;

  const tokenResult = await getIdTokenResult(user, true); // Force refresh
  const role = tokenResult.claims.role;
  
  if (role && (role === 'admin' || role === 'instructor')) {
    console.log(`User ${user.email} has role '${role}' from custom claims.`);
    return true;
  }

  // Fallback to Firestore check if claims are not set
  const docRef = doc(db, "users", user.uid);
  try {
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      // Check for either 'isAdmin: true' or 'userType: "admin"'
      const isAdmin = userData.isAdmin === true || userData.userType === "admin";
       console.log(`User ${user.email} admin status from Firestore: ${isAdmin}`);
      return isAdmin;
    } else {
      // User document doesn't exist in Firestore.
       console.log(`User ${user.email} document not found in Firestore. Assuming not admin.`);
      return false;
    }
  } catch (error) {
    console.error(`Error checking admin status for ${user.email}:`, error);
    return false; // Default to false on error
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
