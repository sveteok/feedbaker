"use client";

import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  addFeedback,
  deleteFeedback,
  editFeedback,
} from "@/lib/fetchers/feedback";

import { queryKeys } from "@/lib/react-query/queryKeys";
import { Feedback, PaginatedFeedback } from "@/types/feedback";

import {
  FeedbackAddFormData,
  FeedbackUpdateFormData,
} from "@/validations/feedback";

export const FEEDBACK_MUTATION = {
  CREATE: "onCreate",
  UPDATE: "onUpdate",
  DELETE: "onDelete",
} as const;

export type FeedbackMutationAction =
  (typeof FEEDBACK_MUTATION)[keyof typeof FEEDBACK_MUTATION];

export function useFeedbackMutation(
  action: "onCreate"
): UseMutationResult<Feedback | null, Error, FeedbackAddFormData>;

export function useFeedbackMutation(
  action: "onUpdate"
): UseMutationResult<Feedback | null, Error, FeedbackUpdateFormData>;

export function useFeedbackMutation(
  action: "onDelete"
): UseMutationResult<Feedback | null, Error, string>;

export function useFeedbackMutation(action: FeedbackMutationAction) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const invalidateFeedbackList = () =>
    queryClient.invalidateQueries({
      queryKey: queryKeys.feedback.lists.root(),
      exact: false,
    });

  const createMutation = useMutation<
    Feedback | null,
    Error,
    FeedbackAddFormData
  >({
    mutationFn: addFeedback,
    onSuccess: async (newFeedback) => {
      if (newFeedback === null) return;

      queryClient.setQueryData<PaginatedFeedback>(
        queryKeys.feedback.lists.filtered({
          site_id: newFeedback.site_id,
          page: 1,
          search: "",
        }),
        (old) => {
          const oldFeedback = old?.feedback ?? [];
          return {
            feedback: [newFeedback, ...oldFeedback],
            totalCount: (old?.totalCount ?? 0) + 1,
          };
        }
      );

      await queryClient.invalidateQueries({
        queryKey: queryKeys.feedback.lists.filtered({
          page: 1,
          search: "",
          site_id: newFeedback.site_id,
        }),
        exact: false,
      });

      toast.success("Feedback Added!");

      router.refresh();
      router.push(`/sites/${newFeedback.site_id}/feedback`);
    },
    onError: (error) => toast.error(error.message),
  });

  const updateMutation = useMutation<
    Feedback | null,
    Error,
    FeedbackUpdateFormData
  >({
    mutationFn: editFeedback,
    onSuccess: (updatedFeedback) => {
      if (!updatedFeedback) return;

      queryClient.setQueryData<Feedback[]>(
        queryKeys.feedback.lists.root(),
        (old = []) =>
          old.map((prev) =>
            prev.feedback_id === updatedFeedback.feedback_id
              ? updatedFeedback
              : prev
          )
      );

      queryClient.setQueryData<Feedback>(
        queryKeys.feedback.detail(updatedFeedback.feedback_id),
        updatedFeedback
      );

      toast.success("Feedback updated!");
      invalidateFeedbackList();
    },
    onError: (error) => toast.error(error.message),
  });

  const deleteMutation = useMutation<Feedback | null, Error, string>({
    mutationFn: deleteFeedback,

    onSuccess: (_, id) => {
      queryClient.setQueryData<Feedback[]>(
        queryKeys.feedback.lists.root(),
        (old = []) => old.filter((feedback) => feedback.feedback_id !== id)
      );
      toast.success("Feedback deleted!");
      invalidateFeedbackList();
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
