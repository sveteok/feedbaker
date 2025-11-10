"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/providers/AuthContext";
import { logout } from "@/lib/fetchers/users";
import { useUserQuery } from "@/features/users/useUserQuery";

export default function ProfilePage() {
  const { user: queryUser } = useUserQuery();
  const router = useRouter();
  const { setUser, user: contextUser } = useAuth();

  const user = queryUser || contextUser;
  if (!user) return <p>Not signed in</p>;

  const userName = user.name;

  const handleLogout = async () => {
    try {
      const isSuccess = await logout();
      if (!isSuccess) {
        toast.error("Logout failed");
        return;
      }
      toast.success(`Goodbye ${userName}!`);
      setUser(null);
      router.replace("/");
    } catch (error) {
      console.error("Google Sign-Out error:", error);
      toast.error("Google Sign-Out failed");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Welcome, {user.name}</h1>
      {user.picture && (
        <Image
          src={user.picture ?? "/"}
          alt={user.name || ""}
          className=""
          width={100}
          height={100}
          loading="eager"
        />
      )}
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {user.is_admin && <p>Role: Admin</p>}
      <button
        onClick={handleLogout}
        className="mt-4 bg-gray-200 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
