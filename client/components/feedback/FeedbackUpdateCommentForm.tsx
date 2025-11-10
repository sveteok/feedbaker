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
  cancel: () => void;
}

const FeedbackUpdateCommentForm = ({
  feedback,
  onSubmit,
  disabled,
  cancel,
}: InputFormProps) => {
  const { handleSubmit, register } = useForm<FeedbackUpdateFormData>({
    resolver: zodResolver(feedbackUpdateSchema),
    values: { ...feedback, public: Boolean(feedback.public) },
  });

  return (
    <form
      className="flex bg-amber-100 flex-col p-0"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div
        className="bg-white ring-2 ring-sky-200 flex flex-col 
          focus-within:ring-sky-600 focus-within:bg-white -mx-2"
      >
        <textarea
          className="p-2 italic outline-none text-sky-700  resize-none
         focus:ring-sky-500
        disabled:saturate-0 disabled:text-neutral-500
         focus:bg-white placeholder:text-sm"
          placeholder="answer to the feedback"
          {...register("comment")}
          autoFocus
        />
        <div className="flex p-1 gap-1">
          <button
            type="button"
            onClick={cancel}
            className="flex-1 p-4 py-2 text-sky-600 bg-sky-100 outline-none text-sm xborder-l-2 border-sky-600
           focus:bg-sky-200 cursor-pointer active:bg-white 
           hover:bg-sky-200 "
          >
            cancel
          </button>
          <button
            type="submit"
            className="flex-1 p-4 py-2 text-sky-600 bg-sky-100 outline-none text-sm xborder-l-2 border-sky-600
           focus:bg-sky-200 cursor-pointer active:bg-white 
           hover:bg-sky-200 "
            disabled={disabled}
          >
            save
          </button>
        </div>
      </div>

      <input type="hidden" id="public" {...register("public")} />
      <input type="hidden" id="feedback" {...register("feedback_id")} />
    </form>
  );
};

export default FeedbackUpdateCommentForm;
