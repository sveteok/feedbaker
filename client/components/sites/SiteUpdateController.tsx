"use client";

import dynamic from "next/dynamic";

import { useRouter } from "next/navigation";

import { Site } from "@/types/sites";
import SiteUpdateForm from "@/components/sites/SiteUpdateForm";
import DeleteContent from "@/components/DeleteContent";

import { useSiteMutation } from "@/features/sites/mutations";

const Modal = dynamic(() => import("@/components/Modal"), { ssr: false });

export default function SiteUpdateController({
  site,
  showModal,
}: {
  site: Site;
  showModal: boolean;
}) {
  const router = useRouter();

  const updateSiteMutation = useSiteMutation("onUpdate");
  const deleteSiteMutation = useSiteMutation("onDelete");

  return (
    <>
      <SiteUpdateForm
        site={site}
        onSubmit={updateSiteMutation.mutate}
        disabled={updateSiteMutation.isPending || deleteSiteMutation.isPending}
      />
      {showModal && (
        <Modal onClose={() => router.back()}>
          <DeleteContent
            onConfirm={() => deleteSiteMutation.mutate(site.site_id)}
            confirmText={`${site.site_id}`}
            title={`Deleting site "${site.name}"`}
            onCancel={() => router.back()}
          />
        </Modal>
      )}
    </>
  );
}
