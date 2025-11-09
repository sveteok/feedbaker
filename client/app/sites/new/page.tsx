"use client";

import SiteAddForm from "@/components/sites/SiteAddForm";
import { Section } from "@/components/Ui";

import { useSiteMutation } from "@/features/sites/mutations";

export default function SiteAddPage() {
  const createSiteMutation = useSiteMutation("onCreate");
  return (
    <Section>
      <SiteAddForm
        onSubmit={createSiteMutation.mutate}
        disabled={createSiteMutation.isPending}
      />
    </Section>
  );
}
