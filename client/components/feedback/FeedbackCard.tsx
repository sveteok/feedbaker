"use client";

import { OwnerLinkButton } from "../Ui";
import { SvgAuthor } from "../Svg";
import { Feedback } from "@/types/feedback";
import { formatDate } from "@/lib/utils/dateFormat";
import { useState } from "react";
import FeedbackUpdateForm from "./FeedbackUpdateForm";
import { FeedbackUpdateFormData } from "@/validations/feedback";
import { useFeedbackMutation } from "@/features/feedback/mutations";
import FeedbackUpdateCommentForm from "./FeedbackUpdateCommentForm";
import Modal from "../Modal";
import DeleteContent from "../DeleteContent";

const FeedbackCard = ({ feedback }: { feedback: Feedback }) => {
  const [openUpdateForm, setOpenUpdateForm] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const updateFeedbackMutation = useFeedbackMutation("onUpdate");
  const removeFeedbackMutation = useFeedbackMutation("onDelete");

  const handleUpdateFeedback = (data: FeedbackUpdateFormData) => {
    updateFeedbackMutation.mutate(data);
    setOpenUpdateForm(false);
  };

  const handleToggleStatusFeedback = () => {
    updateFeedbackMutation.mutate({ ...feedback, public: !feedback.public });
    setOpenUpdateForm(false);
  };

  return (
    <div className="flex flex-col gap-1 p-4 px-6 crounded-md xxodd: bg-gray-50">
      <div className="flex gap-2 justify-between items-center -mr-2">
        <b className="flex-1 flex gap-1">
          <SvgAuthor /> {feedback.author}
        </b>
        <button onClick={handleToggleStatusFeedback}>
          {feedback.public ? "unpublish" : "pubish"}
        </button>
        <>
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
              />
            </Modal>
          )}
        </>
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
        {/* <OwnerLinkButton href={`/sites/${feedback.feedback_id}`}>
          {feedback.public ? "unpublish" : "pubish"}
        </OwnerLinkButton>
        <OwnerLinkButton href={`/sites/${feedback.feedback_id}`}>
          edit reply
        </OwnerLinkButton> */}
      </div>
      <div className="text-xs italic xfont-bold opacity-50 ">
        posted on {formatDate(feedback.created_on)}
      </div>
      <div className="flex gap-2 items-start ">
        <div className="italic flex-1 whitespace-precc whitespace-pre-wrap">
          {feedback.body}
        </div>
      </div>
      {!openUpdateForm ? (
        <div className="text-smx flex gap-2 items-start text-sky-700 italic">
          {feedback.comment}
        </div>
      ) : (
        <FeedbackUpdateCommentForm
          feedback={feedback}
          onSubmit={handleUpdateFeedback}
          disabled={
            updateFeedbackMutation.isPending || removeFeedbackMutation.isPending
          }
        />
      )}

      <div className="text-xs italic xtext-amber-700 xfont-bold  opacity-50 xpl-4">
        replied on {formatDate(feedback.updated_on)}
      </div>
    </div>
  );
};

export default FeedbackCard;
