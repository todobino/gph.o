import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { db, app } from "./firestore";

const auth = getAuth(app);

export const signIn = async (
  email: string,
  password: string
): Promise<boolean> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      throw new Error("No user profile found in Firestore.");
    }

    const userData = userDoc.data();
    localStorage.setItem("userProfile", JSON.stringify(userData));
    return true;
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
};

export const checkIfAdmin = async (user: User): Promise<boolean> => {
  if (!user) return false;

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const userData = docSnap.data();
    return userData.userType === "admin";
  }

  return false;
};

export const getUserProfileFromLocalStorage = () => {
  const profile = localStorage.getItem("userProfile");
  return profile ? JSON.parse(profile) : null;
};

export const makeUserAdmin = async (userUid: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userUid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      await setDoc(userRef, { is_admin: true }, { merge: true });
    } else {
      await setDoc(userRef, { is_admin: true });
    }
  } catch (error) {
    console.error("Error making user admin:", error);
  }
};
