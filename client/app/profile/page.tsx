"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import { useAuth } from "@/lib/providers/AuthContext";
import { logout } from "@/lib/fetchers/users";
import { useUserQuery } from "@/features/users/useUserQuery";
import { useUserMutation } from "@/features/users/mutations";
import {
  Section,
  SectionContent,
  TableHolder,
  Title,
  TitleButton,
} from "@/components/Ui";
import UserDeleteContent from "@/components/users/UserDeleteContent";

export default function ProfilePage() {
  const { user: queryUser } = useUserQuery();
  const router = useRouter();
  const { setUser, user: contextUser } = useAuth();
  const deleteUserMutation = useUserMutation("onDelete");

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
    <Section>
      <Title>
        Welcome, {user.name}
        <TitleButton onClick={handleLogout}>Log out</TitleButton>
      </Title>
      <SectionContent>
        <TableHolder className="bg-gray-50 flex flex-row justify-between p-6 gap-4 items-start">
          <div className="bg-whitex flex-1 p-2">
            Name: <b>{user.name}</b>
            <br />
            Email: <b>{user.email}</b>
            <br />
            {user.is_admin && (
              <>
                Role: <b>Admin</b>
              </>
            )}
          </div>

          <div className="bg-white p-2 x-m-2 aspect-square ring-1 ring-gray-200">
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
          </div>
        </TableHolder>
        <TableHolder className="bg-sky-100 p-4 gap-4">
          <button
            className="p-2 text-white bg-amber-600 rounded-xs w-2/3 mx-auto 
        outline-none focus:ring-amber-800 focus:ring-2
        cursor-pointer active:opacity-80"
            type="button"
            onClick={() => router.push("/sites/new")}
          >
            Register New Site
          </button>

          <button
            className="p-2 text-white bg-amber-600 rounded-xs w-2/3 mx-auto 
        outline-none focus:ring-amber-800 focus:ring-2
        cursor-pointer active:opacity-80"
            type="button"
            onClick={() => {}}
          >
            Own Sites List
          </button>

          <button
            className="p-2 text-white bg-amber-600 rounded-xs w-2/3 mx-auto 
        outline-none focus:ring-amber-800 focus:ring-2
        cursor-pointer active:opacity-80"
            type="button"
            onClick={() => {}}
          >
            User List
          </button>
        </TableHolder>
      </SectionContent>
      <Title>Danger Zone</Title>
      <UserDeleteContent
        user={user}
        onDelete={() => {
          deleteUserMutation.mutate(user.user_id);
          setUser(null);
        }}
      />
    </Section>
  );
}
