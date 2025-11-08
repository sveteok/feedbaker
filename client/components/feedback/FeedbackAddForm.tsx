import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormButtons, FormInput, FormText } from "../Ui";
import {
  FeedbackAddFormData,
  feedbackCreateSchema,
} from "@/validations/feedback";

interface InputFormProps {
  site_id: string;
  disabled: boolean;
  onSubmit: (newApp: FeedbackAddFormData) => void;
}

const FeedbackAddForm = ({ site_id, onSubmit, disabled }: InputFormProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FeedbackAddFormData>({
    resolver: zodResolver(
      feedbackCreateSchema
    ) as import("react-hook-form").Resolver<FeedbackAddFormData>,
    values: { site_id, author: "", body: "" },
  });

  return (
    <form className="flex flex-col gap-2 " onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        placeholder="Your Name"
        title="Name"
        required={true}
        disabled={disabled}
        error={errors?.author?.message}
        {...register("author")}
      />

      <FormText
        placeholder="Your Feedback"
        title="Feedback"
        required={true}
        disabled={disabled}
        error={errors?.body?.message}
        {...register("body")}
      />

      <FormButtons busy={disabled} title={"Add Feedback"} />
    </form>
  );
};

export default FeedbackAddForm;
