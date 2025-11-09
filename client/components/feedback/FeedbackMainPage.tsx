"use client";

import { useMemo } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import Search from "@/components/Search";
import FeedbackList from "@/components/feedback/FeedbackList";
import PageNavigator, { SectionContent, Title, TitleLinkButton } from "../Ui";
import { DEFAULT_QUERY, FEEDBACK_PAGE_SIZE } from "@/config/constants";
import { useFeedbackQuery } from "@/features/feedback/useFeedbackQuery";
import { useAuth } from "@/lib/providers/AuthContext";

export default function FeedbackMainPage({
  site_id,
  initialPage,
  initialSearch,
}: {
  site_id: string;
  initialPage: number;
  initialSearch: string;
}) {
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
      site_id,
    }),
    [page, search, site_id]
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

  const { data: feedback } = useFeedbackQuery(query);
  return (
    <>
      <Title>
        Feedback
        <TitleLinkButton href={`/sites/${site_id}/feedback/new`}>
          add new feedback
        </TitleLinkButton>
      </Title>
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
              currPage={Number(query.page || 0)}
              totalPages={Math.ceil(feedback.totalCount / FEEDBACK_PAGE_SIZE)}
            />
          </Suspense>
        </ErrorBoundary>
      </SectionContent>
    </>
  );
}
