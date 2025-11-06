import { useSuspenseQuery } from "@tanstack/react-query";
import { getSites } from "@/lib/fetchers/sites";

import { useCallback, useMemo } from "react";
import { SearchUiQueryProps } from "@/validations/sites";
import { PaginatedSites } from "@/types/sites";
import { queryKeys } from "@/lib/react-query/queryKeys";

export function useSitesQuery(query: SearchUiQueryProps) {
  const queryKey = useMemo(
    () => queryKeys.sites.lists.filtered(query),
    [query]
  );

  const queryFn = useCallback(() => getSites(query), [query]);

  return useSuspenseQuery<PaginatedSites>({
    queryKey,
    queryFn,
    // refetchInterval: 60000,
  });
}
