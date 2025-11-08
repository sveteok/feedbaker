"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { useAuth } from "@/lib/providers/AuthContext";
import { fetchProfile } from "@lib/fetchers/users";
import { UserPayload } from "@/types/users";

export function useUserQuery() {
  const { user: contextUser, setUser } = useAuth();

  const { data } = useSuspenseQuery({
    queryKey: queryKeys.users.all,
    queryFn: async (): Promise<UserPayload | null> => {
      const user = await fetchProfile();

      if (user !== contextUser) setUser(user);
      return user;
    },
    initialData: contextUser ?? undefined,
    staleTime: 1000 * 60 * 5,
    retry: false,
    gcTime: Infinity,
  });

  return { user: data };
}
