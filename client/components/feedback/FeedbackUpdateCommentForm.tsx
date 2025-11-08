import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FeedbackUpdateFormData,
  feedbackUpdateSchema,
} from "@/validations/feedback";
import { Feedback } from "@/types/feedback";

interface InputFormProps {
  feedback: Feedback;
  disabled: boolean;
  onSubmit: (feedback: FeedbackUpdateFormData) => void;
}

const FeedbackUpdateCommentForm = ({
  feedback,
  onSubmit,
  disabled,
}: InputFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FeedbackUpdateFormData>({
    resolver: zodResolver(
      feedbackUpdateSchema
    ) as import("react-hook-form").Resolver<FeedbackUpdateFormData>,
    values: { ...feedback, public: Boolean(feedback.public) },
    // mode: "onBlur", // or "onChange" / "onSubmit"
  });

  return (
    <div>
      <form className="flex flex-col p-10" onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" id="public" {...register("public")} />
        <textarea
          id="comment"
          aria-invalid={errors.comment ? "true" : "false"}
          aria-describedby={errors.comment ? "comment-error" : undefined}
          rows={6}
          {...register("comment")}
          placeholder="Write a comment ..."
        ></textarea>
        {errors.comment && (
          <p id="comment-error" role="alert" style={{ color: "red" }}>
            {errors.comment.message}
          </p>
        )}
        <input type="hidden" id="feedback" {...register("feedback_id")} />

        <button className="" type="submit" disabled={disabled}>
          {disabled ? "Wait.." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackUpdateCommentForm;
