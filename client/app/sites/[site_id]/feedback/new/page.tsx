import { notFound } from "next/navigation";

import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

import FeedbackAddFormController from "@/components/feedback/FeedbackAddFormController";
import SiteCard from "@/components/sites/SiteCard";
import { Section, SectionContent } from "@/components/Ui";
import { siteGetByIdSchema } from "@/validations/sites";
import { prefetchSiteQuery } from "@/features/sites/prefetchQuery";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { Site } from "@/types/sites";
import { getUser } from "@/lib/providers/auth";

export default async function AddNewFeedbackPage({
  params,
}: {
  params: Promise<{ site_id: string }>;
}) {
  const { site_id } = await params;

  const result = siteGetByIdSchema.safeParse({ site_id });
  if (!result.success) notFound();

  const queryClient = new QueryClient();
  await prefetchSiteQuery(queryClient, result.data.site_id);

  const site = queryClient.getQueryData<Site | null>(
    queryKeys.sites.detail(result.data.site_id)
  );

  if (!site) notFound();
  const user = await getUser();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {site && (
        <Section>
          <SectionContent>
            <SiteCard site={site} user={user} />
          </SectionContent>
          <FeedbackAddFormController site={site} />
        </Section>
      )}
    </HydrationBoundary>
  );
}
