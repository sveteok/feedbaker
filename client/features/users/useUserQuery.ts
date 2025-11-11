"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { useAuth } from "@/lib/providers/AuthContext";
import { fetchProfile, getSiteUsers } from "@lib/fetchers/users";
import { PaginatedUsers, UserPayload } from "@/types/users";
import { SearchUiQueryProps } from "@/validations/feedback";
import { useCallback, useMemo } from "react";

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

export function useSiteUsersQuery(query: SearchUiQueryProps) {
  const queryKey = useMemo(
    () => queryKeys.users.lists.filtered(query),
    [query]
  );

  const queryFn = useCallback(() => getSiteUsers(query), [query]);

  return useSuspenseQuery<PaginatedUsers>({
    queryKey,
    queryFn,
    // refetchInterval: 60000,
  });
}
