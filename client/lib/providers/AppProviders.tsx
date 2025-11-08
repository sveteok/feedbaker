"use client";

import { ReactQueryProvider } from "@/lib/react-query/ReactQueryProvider";
import { AuthProvider } from "@/lib/providers/AuthContext";
import { Toaster } from "react-hot-toast";
import { UserPayload } from "@/types/users";
import getQueryClient from "../react-query/getQueryClient";
import { queryKeys } from "../react-query/queryKeys";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

export function AppProviders({
  user,
  children,
}: {
  user: UserPayload | null;
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  queryClient.setQueryData(queryKeys.users.all, user);
  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryProvider>
      <AuthProvider user={user}>
        <HydrationBoundary state={dehydratedState}>
          <Toaster position="top-right" />
          {children}
        </HydrationBoundary>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
