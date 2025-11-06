import { notFound } from "next/navigation";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

import { Site } from "@/types/sites";
import SiteCard from "@/components/sites/SiteCard";
import { Title, TitleLinkButton } from "@/components/Ui";
import { siteGetByIdSchema } from "@/validations/sites";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { prefetchSiteQuery } from "@/features/sites/prefetchQuery";

export default async function SitePage({
  params,
}: {
  params: Promise<{ site_id: string }>;
}) {
  const { site_id } = await params;

  const result = siteGetByIdSchema.safeParse({ site_id });
  if (!result.success) notFound();

  const queryClient = new QueryClient();
  await prefetchSiteQuery(queryClient, site_id);

  const site = queryClient.getQueryData<Site | null>(
    queryKeys.sites.detail(site_id)
  );
  if (!site) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {site && (
        <>
          <Title>
            {site.name}
            <TitleLinkButton href={`/sites/${site.site_id}/edit`}>
              edit details
            </TitleLinkButton>
          </Title>
          <SiteCard site={site} />
        </>
      )}
    </HydrationBoundary>
  );
}
