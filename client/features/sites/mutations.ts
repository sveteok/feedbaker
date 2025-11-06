"use client";

import { addSite, deleteSite, editSite } from "@/lib/fetchers/sites";
import { queryKeys } from "@/lib/react-query/queryKeys";
import { Site } from "@/types/sites";
import { SiteAddFormData } from "@/validations/sites";
import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const SITE_MUTATION = {
  CREATE: "onCreate",
  UPDATE: "onUpdate",
  DELETE: "onDelete",
} as const;

export type SiteMutationAction =
  (typeof SITE_MUTATION)[keyof typeof SITE_MUTATION];

export function useSiteMutation(
  action: "onCreate"
): UseMutationResult<Site | null, Error, SiteAddFormData>;
export function useSiteMutation(
  action: "onUpdate"
): UseMutationResult<Site | null, Error, Site>;
export function useSiteMutation(
  action: "onDelete"
): UseMutationResult<Site | null, Error, string>;

export function useSiteMutation(action: SiteMutationAction) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const invalidateSitesList = () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.sites.lists.root() });

  const createMutation = useMutation<Site | null, Error, SiteAddFormData>({
    mutationFn: addSite,
    onSuccess: (newSite) => {
      if (newSite === null) return;

      queryClient.setQueryData<Site[]>(
        queryKeys.sites.lists.root(),
        (old = []) => [newSite, ...old]
      );
      toast.success("Site Added!");
      invalidateSitesList();
      router.push(`/sites`);
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation<Site | null, Error, Site>({
    mutationFn: editSite,
    onSuccess: (updatedSite) => {
      if (!updatedSite) return;

      queryClient.setQueryData<Site[]>(
        queryKeys.sites.lists.root(),
        (old = []) =>
          old.map((prev) =>
            prev.site_id === updatedSite.site_id ? updatedSite : prev
          )
      );

      queryClient.setQueryData<Site>(
        queryKeys.sites.detail(updatedSite.site_id),
        updatedSite
      );

      toast.success("Site updated!");
      invalidateSitesList();
      router.push(`/sites/${updatedSite.site_id}`);
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation<Site | null, Error, string>({
    mutationFn: deleteSite,

    onSuccess: (_, id) => {
      queryClient.setQueryData<Site[]>(
        queryKeys.sites.lists.root(),
        (old = []) => old.filter((site) => site.site_id !== id)
      );
      toast.success("Site deleted!");
      invalidateSitesList();
      router.push(`/sites`);
    },
    onError: (error) => toast.error(error.message),
  });

  switch (action) {
    case "onCreate":
      return createMutation;
    case "onUpdate":
      return updateMutation;
    case "onDelete":
      return deleteMutation;
  }
}
