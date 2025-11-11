"use client";

import { useMemo, useState } from "react";

import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

import Search from "@/components/Search";

import { Section, SectionContent, Title } from "../Ui";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_QUERY } from "@/config/constants";
import PageNavigator from "../Ui";
import { SITE_PAGE_SIZE } from "@/config/constants";
import { useSiteUsersQuery } from "@/features/users/useUserQuery";
import UserList from "./UserList";

export default function UsersMainPage() {
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

  const { data: users } = useSiteUsersQuery(query);

  return (
    <Section>
      <Title>
        <div className="flex-1">Users</div>
      </Title>

      <SectionContent>
        <Search
          searchQuery={search}
          setSearchQuery={handleSearch}
          placeholder="search in name or description..."
          statusText={`users found: ${users.totalCount}`}
        />

        <ErrorBoundary
          fallbackRender={({ error, resetErrorBoundary }) => (
            <div className="alert alert-danger m-3">
              <h4>Something went wrong loading users.</h4>
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
            <UserList users={users} />

            <PageNavigator
              onNext={handleNext}
              onPrev={handlePrev}
              currPage={Number(page || 0)}
              totalPages={Math.ceil(users.totalCount / SITE_PAGE_SIZE)}
            />
          </Suspense>
        </ErrorBoundary>
      </SectionContent>
    </Section>
  );
}
