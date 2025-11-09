import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormButtons,
  FormInput,
  FormText,
  SectionContent,
  TableHolder,
} from "../Ui";
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
    // resolver: zodResolver(
    //   feedbackCreateSchema
    // ) as import("react-hook-form").Resolver<FeedbackAddFormData>,
    resolver: zodResolver(feedbackCreateSchema),
    values: { site_id, author: "", body: "" },
  });

  return (
    <form className="flex flex-col gap-2 " onSubmit={handleSubmit(onSubmit)}>
      <SectionContent>
        <TableHolder>
          <div className="p-2 bg-sky-50">
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
          </div>
        </TableHolder>
        <TableHolder>
          <div className="p-2 bg-sky-100">
            <FormButtons busy={disabled} title={"Add"} />
          </div>
        </TableHolder>
      </SectionContent>
    </form>
  );
};

export default FeedbackAddForm;
