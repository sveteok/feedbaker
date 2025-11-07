"use client";

import { logout } from "@/lib/fetchers/users";
import { useUserQuery } from "@/features/users/useUserQuery";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { user } = useUserQuery();
  const router = useRouter();

  //   if (isLoading) return <p>Loading...</p>;
  if (!user) return <p>Not signed in</p>;

  return (
    <div className="p-4">
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
      <button
        onClick={() => {
          logout();
          router.replace(`/`);
        }}
        className="mt-4 bg-gray-200 px-4 py-2 rounded"
      >
        Logout
      </button>
    </div>
  );
}
