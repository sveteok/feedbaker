import { useSuspenseQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import { queryKeys } from "@/lib/react-query/queryKeys";
import { getFeedback } from "@/lib/fetchers/feedback";
import { FeedbackSearchUiQueryProps } from "@/validations/feedback";
import { PaginatedFeedback } from "@/types/feedback";

export function useFeedbackQuery(query: FeedbackSearchUiQueryProps) {
  const queryKey = useMemo(
    () => queryKeys.feedback.lists.filtered(query),
    [query]
  );

  const queryFn = useCallback(() => getFeedback(query), [query]);

  return useSuspenseQuery<PaginatedFeedback>({
    queryKey,
    queryFn,
    select: (data) => {
      return {
        feedback: data.feedback,
        totalCount: data.totalCount,
      };
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    // refetchInterval: 60000,
  });
}
