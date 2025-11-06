"use client";

import { useMemo, useCallback, useState } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import Search from "@/components/Search";
import SiteList from "@/components/sites/SiteList";

import {
  DefaultLink,
  OwnerLinkButton,
  Section,
  Title,
  TitleLinkButton,
} from "../Ui";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_QUERY } from "@/features/constants";

export default function SitesMainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const search = searchParams.get("search") || DEFAULT_QUERY.search;
  const page = Number(searchParams.get("page")) || DEFAULT_QUERY.page;

  const query = useMemo(
    () => ({
      ...DEFAULT_QUERY,
      page,
      search,
    }),
    [page, search]
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

  return (
    <Section>
      <Title>
        Sites
        <TitleLinkButton href={`/sites/new`}>register new site</TitleLinkButton>
        {/* <DefaultLink href={`/sites/new`}>register new site</DefaultLink> */}
      </Title>

      {/* <Search searchQuery={text} setSearchQuery={setText} /> */}
      <Search
        searchQuery={search}
        setSearchQuery={handleSearch}
        placeholder="search in name or description..."
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
        <Suspense fallback={<div className="text-center mt-4">Loading...</div>}>
          <SiteList query={query} onNext={handleNext} onPrev={handlePrev} />
        </Suspense>
      </ErrorBoundary>
    </Section>
  );
}
