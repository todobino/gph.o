import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut, onAuthStateChanged,
  User,
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const auth = getAuth(app);

export const signIn = async (email: string, password: string): Promise<boolean> => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
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
          unsubscribe(); // Unsubscribe after the first call
          resolve(user);
      });
  });
};
import { app } from "./firestore";
export const checkIfAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser();

  if (!user) {
    return false;
  }
  const db = getFirestore(app);
  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
      const userData = docSnap.data();
      if(userData.userType === "admin"){
        return true;
      } else {
        return false;
      }
  }
  return false;
};

export const makeUserAdmin = async (userUid: string): Promise<void> => {
  const db = getFirestore(app);

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
}