"use client";

import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Search from "@/components/Search";
import FeedbackList from "@/components/feedback/FeedbackList";
import PageNavigator, {
  Ago,
  cn,
  SectionContent,
  TableHolder,
  Title,
  TitleButton,
  TitleLinkButton,
} from "../Ui";
import { DEFAULT_QUERY, FEEDBACK_PAGE_SIZE } from "@/config/constants";
import { useFeedbackQuery } from "@/features/feedback/useFeedbackQuery";
import { useAuth } from "@/lib/providers/AuthContext";
import { SvgRobot } from "../Svg";
import { Site } from "@/types/sites";
import { useSiteMutation } from "@/features/sites/mutations";

export default function FeedbackMainPage({
  site,
  initialPage,
  initialSearch,
}: {
  site: Site;
  initialPage: number;
  initialSearch: string;
}) {
  const summarizeFeedbackMutation = useSiteMutation("onSummarizeFeedback");
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") ?? initialSearch;
  const page = Number(searchParams.get("page") ?? initialPage);

  const query = useMemo(
    () => ({
      ...DEFAULT_QUERY,
      page,
      search,
      site_id: site.site_id,
    }),
    [page, search, site.site_id]
  );

  const handleNext = () => updateParams({ page: page + 1 });
  const handlePrev = () => updateParams({ page: Math.max(1, page - 1) });

  const updateParams = (updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      const current = params.get(key);
      const newVal = value === null ? null : String(value);

      if (newVal === null || newVal === "") {
        if (current !== null) {
          params.delete(key);
        }
      } else if (current !== newVal) {
        params.set(key, newVal);
      }
    }

    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (value: string) => {
    updateParams({ page: 0, search: value });
  };

  const canUpdate = user && (user.user_id === site.owner_id || user?.is_admin);

  const now = new Date().getTime();
  const summStart = site.summary_started_on?.getTime() || 0;
  const summEnd = site.summary_updated_on?.getTime() || 0;
  const summarizing = summEnd < summStart;

  const summarizable =
    canUpdate &&
    !summarizing &&
    now - Math.max(summEnd, summStart) > 5 * 60 * 1000;

  const { data: feedback } = useFeedbackQuery(query);
  return (
    <>
      <Title>
        <div className="flex-1">Feedback</div>
        {summarizable && (
          <TitleButton
            onClick={() => summarizeFeedbackMutation.mutate(site.site_id)}
          >
            <SvgRobot />
            summarize
          </TitleButton>
        )}
        <TitleLinkButton href={`/sites/${site.site_id}/feedback/new`}>
          add new
        </TitleLinkButton>
      </Title>

      {(summarizing || site.summary) && (
        <SectionContent>
          <TableHolder>
            <div className="text-sky-800 italic bg-gray-50 flex ">
              <div className="bg-amber-100 p-6 text-3xl border-r border-gray-200 text-amber-600">
                <SvgRobot />
              </div>

              <div className="p-4 block overflow-auto whitespace-pre-line flex-1">
                <h1 className="text-xs font-bold pb-2 opacity-50">
                  AI Summary
                </h1>

                <div
                  className={cn(
                    !site.summary && "opacity-50",
                    summarizing && "animate-pulse"
                  )}
                >
                  {site.summary || "..."}
                </div>

                {!summarizing && (
                  <div className="italic text-xs text-right p-2">
                    generated&nbsp;
                    <Ago date={site.summary_updated_on!} />
                  </div>
                )}
                {summarizing && (
                  <div className="italic text-xs text-right p-2 animate-pulse">
                    summarizing, refresh page to update
                  </div>
                )}
              </div>
            </div>
          </TableHolder>
        </SectionContent>
      )}

      <SectionContent>
        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="alert alert-danger m-3">
              <h4>Something went wrong loading sites.</h4>
              <p>{error.message}</p>
              <button className="btn btn-primary" onClick={resetErrorBoundary}>
                Try Again
              </button>
            </div>
          )}
        >
          <Suspense
            fallback={<div className="text-center mt-4">Loading...</div>}
          >
            <Search
              searchQuery={search}
              setSearchQuery={handleSearch}
              placeholder="Filter feedback..."
              statusText={`feedback found: ${feedback.totalCount}`}
            />
            <FeedbackList feedback={feedback} user={user} />
            <PageNavigator
              onNext={handleNext}
              onPrev={handlePrev}
              currPage={Number(query.page || 1)}
              totalPages={Math.ceil(feedback.totalCount / FEEDBACK_PAGE_SIZE)}
            />
          </Suspense>
        </ErrorBoundary>
      </SectionContent>
    </>
  );
}
