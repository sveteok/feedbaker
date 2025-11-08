import { Controller, useForm } from "react-hook-form";
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

const FeedbackUpdateForm = ({
  feedback,
  onSubmit,
  disabled,
}: InputFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm<FeedbackUpdateFormData>({
    resolver: zodResolver(
      feedbackUpdateSchema
    ) as import("react-hook-form").Resolver<FeedbackUpdateFormData>,
    defaultValues: { ...feedback, public: Boolean(feedback.public) },
    // mode: "onBlur", // or "onChange" / "onSubmit"
  });
  return (
    <div>
      <form className="flex flex-col p-10" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="public">Public</label>
          <Controller
            name="public"
            control={control}
            render={({ field }) => {
              return (
                <input
                  type="checkbox"
                  id="public"
                  checked={field.value}
                  onChange={(e) => field.onChange(e.target.checked)}
                />
              );
            }}
          />
        </div>
        <label htmlFor="text">Comment</label>
        <textarea
          id="text"
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
        <input type="hidden" id="feedback_id" {...register("feedback_id")} />

        <button className="" type="submit" disabled={disabled}>
          {disabled ? "Wait.." : "Save"}
        </button>
      </form>
    </div>
  );
};

export default FeedbackUpdateForm;
