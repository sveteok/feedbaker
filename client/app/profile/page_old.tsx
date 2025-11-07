"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { UserPayload } from "@/types/users";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserPayload | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
          { withCredentials: true }
        );
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
        router.push("/login");
      }
    };
    fetchProfile();
  }, []);

  if (!user) return <p>Loading...</p>;

  const logout = async () => {
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/logout`,
      {},
      { withCredentials: true }
    );
    window.location.href = "/";
  };

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Welcome, {user.name}</h1>
      {user.picture && (
        <Image
          src={user.picture ?? "/"}
          alt={user.name || ""}
          className="rounded-full"
          width={100}
          height={100}
          loading="eager"
        />
      )}
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {user.is_admin && <p>Role: Admin</p>}
      <button onClick={logout} className="mt-4 bg-gray-200 px-4 py-2 rounded">
        Logout
      </button>
    </main>
  );
}
