import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import SitesMainPage from "@/components/sites/SitesMainPage";
import { DEFAULT_QUERY } from "@/config/constants";
import { prefetchSitesQuery } from "@/features/sites/prefetchQuery";

export default async function SitesPage() {
  const queryClient = new QueryClient();
  await prefetchSitesQuery(queryClient, DEFAULT_QUERY);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SitesMainPage />
    </HydrationBoundary>
  );
}
