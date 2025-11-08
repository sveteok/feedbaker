import { notFound } from "next/navigation";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

import { Site } from "@/types/sites";
import { siteGetByIdSchema } from "@/validations/sites";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { prefetchSiteQuery } from "@/features/sites/prefetchQuery";

import FeedbackMainPage from "@/components/feedback/FeedbackMainPage";
import SiteCard from "@/components/sites/SiteCard";
import { Section, Title, TitleLinkButton } from "@/components/Ui";
import { prefetchFeedbackQuery } from "@/features/feedback/prefetchQuery";

export default async function SiteDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ site_id: string }>;
  searchParams?: Promise<{ page?: string; search?: string }>;
}) {
  const { site_id } = await params;
  const resolvedSearchParams = await searchParams;

  const result = siteGetByIdSchema.safeParse({ site_id });
  if (!result.success) notFound();

  const queryClient = new QueryClient();

  const page = Number(resolvedSearchParams?.page ?? 1);
  const search = resolvedSearchParams?.search ?? "";

  await Promise.all([
    await prefetchSiteQuery(queryClient, site_id),
    await prefetchFeedbackQuery(queryClient, { page, search, site_id }),
  ]);

  const site = queryClient.getQueryData<Site | null>(
    queryKeys.sites.detail(site_id)
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {site && (
        <Section>
          <Title>
            Site Details
            <TitleLinkButton href={`/sites/${site.site_id}/edit`}>
              edit details
            </TitleLinkButton>
          </Title>
          <div className="flex flex-col border-y-4 gap-1 bg-gray-200  border-sky-200">
            <SiteCard site={site} />
          </div>
          <FeedbackMainPage
            site_id={site.site_id}
            initialPage={page}
            initialSearch={search}
          />
        </Section>
      )}
    </HydrationBoundary>
  );
}
