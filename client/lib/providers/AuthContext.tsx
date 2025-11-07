"use client";

import {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useState,
} from "react";

import type { UserPayload } from "@/types/users";
import { useUserQuery } from "@/features/users/useUserQuery";

type AuthContextValue = {
  user: UserPayload | null;
  setUser: (user: UserPayload | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  user: initialUser,
  children,
}: {
  user: UserPayload | null;
  children: React.ReactNode;
}) {
  const [user, setUser] = useState(initialUser);

  return (
    <Suspense fallback={<div>Loading auth...</div>}>
      <AuthContext.Provider value={{ user, setUser }}>
        <UserRefresher />
        {children}
      </AuthContext.Provider>
    </Suspense>
  );
}

function UserRefresher() {
  const { setUser } = useAuth();
  const { user } = useUserQuery();

  useEffect(() => {
    if (user) setUser(user);
  }, [user, setUser]);

  return null;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
