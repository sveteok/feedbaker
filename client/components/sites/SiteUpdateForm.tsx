import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DeleteButton from "@/components/DeleteButton";
import {
  FormButtons,
  FormInput,
  FormText,
  OwnerLinkButton,
  Title,
} from "../Ui";
import { Site } from "@/types/sites";
import { siteUpdateSchema } from "@/validations/sites";
import { formatDate } from "@/lib/utils/dateFormat";

type UpdateFormData = z.infer<typeof siteUpdateSchema>;

interface InputFormProps {
  site: Site;
  disabled: boolean;
  onSubmit: (site: Site) => void;
}

const SiteUpdateForm = ({ site, onSubmit, disabled }: InputFormProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<UpdateFormData>({
    resolver: zodResolver(
      siteUpdateSchema
    ) as import("react-hook-form").Resolver<UpdateFormData>,
    values: site,
    defaultValues: site,
    // mode: "onBlur", // or "onChange" / "onSubmit"
  });

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
      <Title>
        Site Details Editing
        <OwnerLinkButton href={`/sites/${site.site_id}`}>back</OwnerLinkButton>
      </Title>
      <div className="w-fitx text-black/50 flex text-sm flex-col p-4 py-2 bg-amber-50 rounded-md">
        <div className="text-right">Created: {formatDate(site.created_on)}</div>
        <div className="text-right">Updated: {formatDate(site.updated_on)}</div>
      </div>

      <FormInput
        title="Name"
        placeholder="Site Name"
        required={true}
        disabled={disabled}
        error={errors?.name?.message}
        {...register("name")}
      />

      <FormInput
        title="URL"
        placeholder="Site URL"
        required={false}
        disabled={disabled}
        error={errors?.url?.message}
        {...register("url")}
      />
      <FormText
        placeholder="Site Description"
        title="Description"
        required={false}
        disabled={disabled}
        error={errors?.description?.message}
        {...register("description")}
      />
      <FormButtons
        busy={disabled}
        title={"Save"}
        onReset={() => reset({ ...site })}
      />

      <Title>Danger Zone</Title>
      <FormInput
        title="Type Site Name to Confirm Deletion"
        placeholder="Site Name"
        required={true}
        disabled={disabled}
      />
      <div className="px-2 flex gap-2 mx-auto w-2/3 justify-center">
        <DeleteButton
          href={`/sites/${site.site_id}/edit?modal=true`}
          disabled={disabled}
        />
      </div>
    </form>
  );
};

export default SiteUpdateForm;
