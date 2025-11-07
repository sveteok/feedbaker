"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { useAuth } from "@/lib/providers/AuthContext";
import { fetchProfile } from "@lib/fetchers/users";

export function useUserQuery() {
  const { setUser } = useAuth();

  const { data } = useSuspenseQuery({
    queryKey: queryKeys.users.all,
    queryFn: async () => {
      const user = await fetchProfile();
      setUser(user);
      return user;
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  return { user: data };
}
