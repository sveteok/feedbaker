"use client";

import { SvgAuthor } from "../Svg";
import { Feedback } from "@/types/feedback";
import { formatDate } from "@/lib/utils/dateFormat";
import { useState } from "react";
import { FeedbackUpdateFormData } from "@/validations/feedback";
import { useFeedbackMutation } from "@/features/feedback/mutations";
import FeedbackUpdateCommentForm from "./FeedbackUpdateCommentForm";
import Modal from "../Modal";
import DeleteContent from "../DeleteContent";
import { UserPayload } from "@/types/users";
import { OwnerButton } from "../Ui";

const FeedbackCard = ({
  feedback,
  user,
}: {
  feedback: Feedback;
  user: UserPayload | null;
}) => {
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

  const canFeedbackEdit =
    user &&
    user.user_id &&
    (user.user_id === feedback.site_owner_id || user.is_admin);

  return (
    <>
      <div
        className={
          "flex flex-col gap-1 p-4 px-6 bg-gray-50 " +
          (openUpdateForm && " bg-sky-50 ")
        }
      >
        <div className="flex gap-2 justify-between items-center -mr-2">
          <b className="flex-1 flex gap-1">
            <SvgAuthor /> {feedback.author}
          </b>
          {canFeedbackEdit && (
            <>
              {!openUpdateForm && (
                <>
                  <OwnerButton
                    className={
                      (!feedback.public &&
                        "text-amber-600 bg-white ring-1 ring-amber-600") ||
                      ""
                    }
                    onClick={handleToggleStatusFeedback}
                  >
                    {feedback.public ? "unpublish" : "publish"}
                  </OwnerButton>
                  <OwnerButton onClick={() => setShowModal(true)}>
                    delete
                  </OwnerButton>
                  <OwnerButton
                    onClick={() => setOpenUpdateForm((prev) => !prev)}
                  >
                    reply
                  </OwnerButton>
                </>
              )}
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
          )}
        </div>
        <div className="text-xs italic xfont-bold opacity-50 ">
          posted on {formatDate(feedback.created_on)}
        </div>
        <div className="flex gap-2 items-start ">
          <div className="italic flex-1 whitespace-precc whitespace-pre-wrap">
            {feedback.body}
          </div>
        </div>
        {feedback.comment && (
          <div className="text-xs italic xtext-amber-700 xfont-bold  opacity-50 xpl-4">
            replied on {formatDate(feedback.updated_on)}
          </div>
        )}

        {!openUpdateForm && feedback.comment && (
          <div className="text-smx flex items-start text-sky-700 italic">
            {feedback.comment}
          </div>
        )}
        {openUpdateForm && (
          <FeedbackUpdateCommentForm
            feedback={feedback}
            onSubmit={handleUpdateFeedback}
            cancel={() => setOpenUpdateForm((prev) => !prev)}
            disabled={
              updateFeedbackMutation.isPending ||
              removeFeedbackMutation.isPending
            }
          />
        )}
      </div>
    </>
  );
};

export default FeedbackCard;
