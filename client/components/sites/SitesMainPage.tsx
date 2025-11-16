"use client";

import { useMemo, useState } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import Search from "@/components/Search";
import SiteList from "@/components/sites/SiteList";

import {
  Section,
  SectionContent,
  Title,
  TitleButton,
  TitleLinkButton,
} from "../Ui";
import { useRouter, useSearchParams } from "next/navigation";
import { SITE_QUERY } from "@/config/constants";
import { useSitesQuery } from "@/features/sites/useSitesQuery";
import PageNavigator from "../Ui";
import { SITE_PAGE_SIZE } from "@/config/constants";
import { useAuth } from "@/lib/providers/AuthContext";

export default function SitesMainPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || SITE_QUERY.search;
  const page = Number(searchParams.get("page")) || SITE_QUERY.page;
  const owner_id = searchParams.get("owner_id") || SITE_QUERY.owner_id;

  const [ownSite, setOwnSite] = useState(owner_id !== "");

  const query = useMemo(
    () => ({
      ...SITE_QUERY,
      page,
      search,
      owner_id,
    }),
    [page, search, owner_id]
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
    updateParams({ search: value, page: 0 });
  };

  const { data: sites } = useSitesQuery(query);

  return (
    <Section>
      <Title>
        <div className="flex-1">Sites</div>
        {user && (
          <>
            {ownSite && (
              <TitleButton
                onClick={() => {
                  updateParams({ owner_id: "", page: 0 });
                  setOwnSite(false);
                }}
              >
                show all
              </TitleButton>
            )}
            {!ownSite && (
              <TitleButton
                onClick={() => {
                  updateParams({ owner_id: user.user_id, page: 0 });
                  setOwnSite(true);
                }}
              >
                show own
              </TitleButton>
            )}
            <TitleLinkButton href={`/sites/new`}>register new</TitleLinkButton>
          </>
        )}
      </Title>

      <SectionContent>
        <Search
          searchQuery={search}
          setSearchQuery={handleSearch}
          placeholder="search in name or description..."
          statusText={`sites found: ${sites.totalCount}`}
        />

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
            <SiteList sites={sites} user={user} />

            <PageNavigator
              onNext={handleNext}
              onPrev={handlePrev}
              currPage={Number(page || 1)}
              totalPages={Math.ceil(sites.totalCount / SITE_PAGE_SIZE)}
            />
          </Suspense>
        </ErrorBoundary>
      </SectionContent>
    </Section>
  );
}
