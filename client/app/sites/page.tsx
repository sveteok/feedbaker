import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import SitesMainPage from "@/components/sites/SitesMainPage";
import { SITE_QUERY } from "@/config/constants";
import { prefetchSitesQuery } from "@/features/sites/prefetchQuery";

export default async function SitesPage() {
  const queryClient = new QueryClient();
  await prefetchSitesQuery(queryClient, SITE_QUERY);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SitesMainPage />
    </HydrationBoundary>
  );
}
