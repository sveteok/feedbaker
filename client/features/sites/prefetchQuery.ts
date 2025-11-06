import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { getSiteServer, getSitesServer } from "@/lib/fetchers/sites";
import { SearchUiQueryProps } from "@/validations/sites";

export async function prefetchSiteQuery(client: QueryClient, site_id: string) {
  await client.prefetchQuery({
    queryKey: queryKeys.sites.detail(site_id),
    queryFn: () => getSiteServer(site_id),
  });
}

export async function prefetchSitesQuery(
  client: QueryClient,
  query: SearchUiQueryProps
) {
  await client.prefetchQuery({
    queryKey: queryKeys.sites.lists.filtered(query),
    queryFn: () => getSitesServer(query),
  });
}
