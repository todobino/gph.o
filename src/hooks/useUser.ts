
// src/hooks/useUser.ts
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firestore';
import { doc, getDoc } from 'firebase/firestore';

export function useUser() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  useEffect(() => onAuthStateChanged(auth, setUser), []);
  return user; // undefined = loading, null = signed out, User = signed in
}

export function useIsAdmin(user: User | null | undefined) {
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      if (!user) { setIsAdmin(false); return; }
      try {
        const idTokenResult = await user.getIdTokenResult();
        if (idTokenResult.claims.admin === true || idTokenResult.claims.role === 'admin') {
           if (!cancelled) setIsAdmin(true);
           return;
        }
      } catch (error) {
        console.warn("Could not get token result, falling back to Firestore", error);
      }

      const snap = await getDoc(doc(db, 'users', user.uid));
      const data = snap.data();
      if (!cancelled) setIsAdmin(!!data && (data.userType === 'admin' || data.isAdmin === true));
    }
    run();
    return () => { cancelled = true; };
  }, [user]);

  return isAdmin; // undefined = loading, boolean otherwise
}
