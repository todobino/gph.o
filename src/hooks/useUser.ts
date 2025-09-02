
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firestore';
import { doc, getDoc } from 'firebase/firestore';

export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  return user;
}

export function useIsAdmin() {
  const user = useUser();
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    const checkAdminStatus = async () => {
      if (user === undefined) {
        setIsAdmin(undefined); // Still loading
        return;
      }

      if (user === null) {
        setIsAdmin(false); // Not logged in
        return;
      }
      
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userDocRef);
        if (!cancelled) {
            const userType = docSnap.exists() ? docSnap.data()?.userType : null;
            setIsAdmin(userType === 'admin');
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (!cancelled) {
          setIsAdmin(false);
        }
      }
    };

    checkAdminStatus();

    return () => {
      cancelled = true;
    };
  }, [user]);

  return isAdmin;
}
