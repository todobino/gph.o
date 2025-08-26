
"use client";

import { auth } from "@/lib/firestore";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLogout = async () => {
      await signOut(auth);
      // After signing out of Firebase on the client,
      // the user will be redirected to the login page
      // on the next navigation that requires auth.
      router.push("/");
    };

    handleLogout();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading && <p>Logging out...</p>}
    </div>
  );
}
