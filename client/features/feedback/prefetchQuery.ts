import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/react-query/queryKeys";
import {
  getFeedbackDetailServer,
  getFeedbackServer,
} from "@/lib/fetchers/feedback";
import { FeedbackSearchUiQueryProps } from "@/validations/feedback";

export async function prefetchFeedbackQuery(
  client: QueryClient,
  query: FeedbackSearchUiQueryProps
) {
  try {
    await client.prefetchQuery({
      queryKey: queryKeys.feedback.lists.filtered(query),
      queryFn: async () => await getFeedbackServer(query),
      staleTime: 1000 * 60,
    });
  } catch (error) {
    console.error("Prefetch feedback failed:", error);
  }
}

export async function prefetchFeedbackDetailQuery(
  client: QueryClient,
  feedback_id: string
) {
  try {
    await client.prefetchQuery({
      queryKey: queryKeys.sites.detail(feedback_id),
      queryFn: () => getFeedbackDetailServer(feedback_id),
    });
  } catch (error) {
    console.error("Prefetch feedback datail failed:", error);
  }
}
