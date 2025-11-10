"use client";

import { Site } from "@/types/sites";
import SiteUpdateForm from "@/components/sites/SiteUpdateForm";
import { useSiteMutation } from "@/features/sites/mutations";

export default function SiteUpdateController({ site }: { site: Site }) {
  const updateSiteMutation = useSiteMutation("onUpdate");
  const deleteSiteMutation = useSiteMutation("onDelete");

  return (
    <>
      <SiteUpdateForm
        site={site}
        onSubmit={updateSiteMutation.mutate}
        onDelete={() => deleteSiteMutation.mutate(site.site_id)}
        disabled={updateSiteMutation.isPending || deleteSiteMutation.isPending}
      />
    </>
  );
}
