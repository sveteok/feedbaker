import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { redirect } from "next/navigation";
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
      {/* <div className="flex flex-row gap-1">
        <label htmlFor="name">Site Name</label>
        <input
          type="text"
          id="name"
          placeholder="Add a New Site Name"
          {...register("name")}
          disabled={disabled}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
        {errors.name && <p>{errors.name.message}</p>}
      </div> 
      <div className="flex flex-row gap-1">
        <label htmlFor="url">App Url</label>
        <input
          type="text"
          id="url"
          placeholder="Add an Url"
          {...register("url")}
          disabled={disabled}
          aria-invalid={errors.url ? "true" : "false"}
          aria-describedby={errors.url ? "url-error" : undefined}
        />
        {errors.url && <p>{errors.url.message}</p>}
      </div>

      <label htmlFor="description">Description</label>
      <textarea
        id="description"
        aria-invalid={errors.description ? "true" : "false"}
        aria-describedby={errors.description ? "description-error" : undefined}
        rows={6}
        {...register("description")}
        placeholder="Write a description ..."
      ></textarea>
      {errors.description && (
        <p id="description-error" role="alert" style={{ color: "red" }}>
          {errors.description.message}
        </p>
      )}
        
      <input type="hidden" id="site_id" {...register("site_id")} />
      <input type="hidden" id="owner_id" {...register("owner_id")} />
      <button
        type="button"
        onClick={() => redirect(`/sites/${site.site_id}`)}
        disabled={disabled}
      >
        Cancel
      </button>
      <button className="" type="submit" disabled={disabled}>
        {disabled ? "Wait.." : "Save"}
      </button>
      */}
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
