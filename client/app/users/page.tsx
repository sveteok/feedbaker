import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import UsersMainPage from "@/components/users/UsersMainPage";
import { DEFAULT_QUERY } from "@/config/constants";
import { prefetchUsersQuery } from "@/features/users/prefetchQuery";

export default async function UsersPage() {
  const queryClient = new QueryClient();
  await prefetchUsersQuery(queryClient, DEFAULT_QUERY);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UsersMainPage />
    </HydrationBoundary>
  );
}
