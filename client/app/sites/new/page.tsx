"use client";

import SiteAddForm from "@/components/sites/SiteAddForm";

import { useSiteMutation } from "@/features/sites/mutations";

export default function SiteAddPage() {
  const createSiteMutation = useSiteMutation("onCreate");
  return (
    <SiteAddForm
      onSubmit={createSiteMutation.mutate}
      disabled={createSiteMutation.isPending}
    />
  );
}
