"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useQueryClient } from "@tanstack/react-query";

import { useFeedbackMutation } from "@/features/feedback/mutations";
import { queryKeys } from "@/lib/react-query/queryKeys";

import FeedbackUpdateForm from "@/components/feedback/FeedbackUpdateForm";
import DeleteContent from "@/components/DeleteContent";
import { Feedback } from "@/types/feedback";
import { FeedbackUpdateFormData } from "@/validations/feedback";
const Modal = dynamic(() => import("@/components/Modal"), { ssr: false });

export default function FeedbackUpdateController({
  feedback,
}: {
  feedback: Feedback;
}) {
  const [openUpdateForm, setOpenUpdateForm] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const queryClient = useQueryClient();

  const cachedFeedback = queryClient.getQueryData<Feedback>(
    queryKeys.feedback.detail(feedback.feedback_id)
  );
  const displayFeedback = cachedFeedback ?? feedback;

  const updateFeedbackMutation = useFeedbackMutation("onUpdate");
  const removeFeedbackMutation = useFeedbackMutation("onDelete");

  const handleUpdateFeedback = (data: FeedbackUpdateFormData) => {
    updateFeedbackMutation.mutate(data);
    setOpenUpdateForm(false);
  };

  return (
    <>
      <button
        className="border-red-600 border-2 w-50"
        onClick={() => setOpenUpdateForm((prev) => !prev)}
      >
        {openUpdateForm
          ? `Cancel`
          : feedback.comment
          ? `Update Comment`
          : `Add Comment`}
      </button>
      {!openUpdateForm && (
        <>
          <div>
            <label htmlFor="public">Public</label>
            <input
              type="checkbox"
              id="public"
              checked={displayFeedback.public}
              readOnly
            />
          </div>
          <label htmlFor="text">Comment</label>
          <textarea
            id="comment"
            rows={6}
            readOnly
            value={displayFeedback.comment || ""}
          ></textarea>
        </>
      )}
      {openUpdateForm && (
        <FeedbackUpdateForm
          feedback={feedback}
          onSubmit={handleUpdateFeedback}
          disabled={
            updateFeedbackMutation.isPending || removeFeedbackMutation.isPending
          }
        />
      )}
      <button
        className="border-red-600 border-2 w-50"
        onClick={() => setShowModal(true)}
      >
        Delete Feedback
      </button>
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <DeleteContent
            onConfirm={() =>
              removeFeedbackMutation.mutate(feedback.feedback_id)
            }
            confirmText={`${feedback.feedback_id}`}
            onCancel={() => setShowModal(false)}
          />
        </Modal>
      )}
    </>
  );
}
