import {
  getAuth,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  User,
} from "firebase/auth";
import { app, db } from "./firestore";
import { doc, getDoc, setDoc } from "firebase/firestore";


import { getFirestore } from "firebase/firestore";
const auth = getAuth(app);

export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  return userCredential.user;
};

export const signOut = async (): Promise<void> => {
  await firebaseSignOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

export const checkIfAdmin = async (): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) {
    return false;
  }
  const token = await user.getIdTokenResult();
  return token.claims.admin === true;
};

export const makeUserAdmin = async (email: string): Promise<void> => {
  const db = getFirestore(app);
  
  try {
      const userCredential = await signInWithEmailAndPassword(auth, email, "password123");
      const user = userCredential.user;
      
      if (!user) {
          throw new Error("User not found");
      }

      const userRef = doc(db, "users", user.uid);
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