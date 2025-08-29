// src/hooks/useUser.ts
'use client';

import { useEffect, useState } from 'react';
import { onAuthStateChanged, onIdTokenChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firestore';
import { doc, getDoc } from 'firebase/firestore';

export function useUser() {
  // undefined = loading, null = signed out, User = signed in
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => onAuthStateChanged(auth, setUser), []);

  // Keep token fresh so claims updates are seen without a hard reload
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, () => {});
    return unsub;
  }, []);

  return user;
}

export function useIsAdmin(user: User | null | undefined) {
  // undefined = loading (don’t redirect yet), boolean once known
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      // 1) Still loading the user
      if (user === undefined) { 
        setIsAdmin(undefined);
        return;
      }

      // 2) Definitely no user
      if (user === null) {
        setIsAdmin(false);
        return;
      }

      // 3) Signed in: check custom claims first (canonical)
      try {
        const token = await user.getIdTokenResult(true); // force refresh
        const claims = token.claims as Record<string, unknown>;
        if (claims?.admin === true || claims?.role === 'admin') {
          if (!cancelled) setIsAdmin(true);
          return;
        }
      } catch (e) {
        console.warn('Could not get token claims, will try Firestore.', e);
      }

      // 4) Fallback: Firestore mirror fields
      try {
        const snap = await getDoc(doc(db, 'users', user.uid));
        const data = snap.data();
        if (!cancelled) {
          const fromDoc =
            !!data && (data.isAdmin === true || data.userType === 'admin');
          setIsAdmin(!!fromDoc);
        }
      } catch (e) {
        console.error('Error reading user document for admin fallback:', e);
        if (!cancelled) setIsAdmin(false);
      }
    })();

    return () => { cancelled = true; };
  }, [user]);

  return isAdmin;
}
