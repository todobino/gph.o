import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

export default function LogoutPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleLogout = async () => {
      await signOut();
      redirect("/login");
    };

    handleLogout();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      {loading && <p>Logging out...</p>}
    </div>
  );
}