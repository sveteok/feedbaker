import { notFound, redirect } from "next/navigation";
import SiteUpdateController from "@/components/sites/SiteUpdateController";
import {
  HydrationBoundary,
  dehydrate,
  QueryClient,
} from "@tanstack/react-query";

import { getUser } from "@/lib/providers/auth";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { siteGetByIdSchema } from "@/validations/sites";
import { Site } from "@/types/sites";
import { prefetchSiteQuery } from "@/features/sites/prefetchQuery";

export default async function EditSitePage({
  params,
  searchParams,
}: {
  params: Promise<{ site_id: string }>;
  searchParams: Promise<{ modal?: string }>;
}) {
  const { site_id } = await params;
  const { modal } = await searchParams;

  const result = siteGetByIdSchema.safeParse({ site_id });
  if (!result.success) notFound();

  const user = await getUser();
  if (!user) redirect("/login");

  const queryClient = new QueryClient();
  await prefetchSiteQuery(queryClient, site_id);

  const site = queryClient.getQueryData<Site | null>(
    queryKeys.sites.detail(site_id)
  );
  if (!site) notFound();

  const isOwner = site.owner_id === user.user_id;
  const isAdmin = user.is_admin;

  if (!isOwner && !isAdmin) {
    redirect("/unauthorized");
  }

  const showModal = modal === "true";

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {site && <SiteUpdateController site={site} showModal={showModal} />}
    </HydrationBoundary>
  );
}
