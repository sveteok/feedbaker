"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import SiteCard from "@/components/sites/SiteCard";

import { useMemo, useCallback } from "react";
import { SearchUiQueryProps } from "@/validations/sites";

import PageNavigator from "../Ui";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { PaginatedSites, SiteWithFeedback } from "@/types/sites";
import { getSites } from "@/lib/fetchers/sites";
import { SITE_PAGE_SIZE } from "@/features/constants";
import { useSitesQuery } from "@/features/sites/useSitesQuery";

export default function SiteList({
  query,
  onNext,
  onPrev,
}: {
  query: SearchUiQueryProps;
  onNext: () => void;
  onPrev: () => void;
}) {
  const { data: sites } = useSitesQuery(query);

  return (
    <>
      <div className="flex flex-col gap-1 bg-gray-200">
        {/* <div className="p-0 text-center text-xs text-black/60">
          {sites.totalCount === 0 && "No Sites Found"}
          {sites.totalCount > 0 && `Found ${sites.totalCount} Sites`}
        </div> */}

        {sites.sites.map((site: SiteWithFeedback) => (
          <SiteCard
            key={site.site_id}
            site={site}
            feedbacks_count={site.feedback_count}
          />
        ))}
        {sites.totalCount === 0 && (
          <div className="p-6 text-center text-black/50 text-xs bg-gray-50">
            no sites found
          </div>
        )}
      </div>
      <PageNavigator
        onNext={onNext}
        onPrev={onPrev}
        currPage={Number(query.page || 0)}
        totalPages={Math.ceil(sites.totalCount / SITE_PAGE_SIZE)}
      />
    </>
  );
}
