import { siteCreateSchema, SiteAddFormData } from "@/validations/sites";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { DefaultLink, Title } from "../Ui";

interface InputFormProps {
  disabled: boolean;
  onSubmit: (newApp: SiteAddFormData) => void;
}

const SiteAddForm = ({ onSubmit, disabled }: InputFormProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm<SiteAddFormData>({
    // resolver: zodResolver(createSiteSchema),
    resolver: zodResolver(
      siteCreateSchema
    ) as import("react-hook-form").Resolver<SiteAddFormData>,
  });

  return (
    <form className="flex flex-col gap-2 " onSubmit={handleSubmit(onSubmit)}>
      <Title>
        Register New Site
        <DefaultLink href={`/sites`}>cancel</DefaultLink>
      </Title>

      <div className="flex flex-col gap-1 p-2">
        <div className="flex justify-between px-2">
          <label htmlFor="name" className="">
            Name*
          </label>
          <span className="text-red-500 text-sm">{errors?.name?.message}</span>
        </div>

        <input
          className="p-2 bg-sky-50 rounded-sm ring-2 ring-sky-200"
          type="text"
          id="name"
          placeholder="e.g. Google - Search Engine"
          {...register("name")}
          readOnly={disabled}
          aria-invalid={errors.name ? "true" : "false"}
          aria-describedby={errors.name ? "name-error" : undefined}
        />
      </div>
      <div className="flex flex-col gap-1 p-2">
        <div className="flex justify-between px-2">
          <label htmlFor="url" className="">
            URL
          </label>
          <span className="text-red-500 text-sm">{errors?.url?.message}</span>
        </div>
        <input
          className="p-2 bg-sky-50 rounded-sm ring-2 ring-sky-200"
          type="text"
          id="url"
          placeholder="e.g. https://google.com"
          {...register("url")}
          readOnly={disabled}
          aria-invalid={errors.url ? "true" : "false"}
          aria-describedby={errors.url ? "name-error" : undefined}
        />
      </div>
      <div className="flex flex-col gap-1 p-2">
        <label htmlFor="description" className="px-2">
          Description
        </label>
        <textarea
          className="p-2 bg-sky-50 rounded-sm ring-2 ring-sky-200"
          id="description"
          aria-invalid={errors.description ? "true" : "false"}
          aria-describedby={
            errors.description ? "description-error" : undefined
          }
          rows={6}
          {...register("description")}
          placeholder="few words about your site"
        ></textarea>
        {errors.description && (
          <p id="description-error" role="alert" style={{ color: "red" }}>
            {errors.description.message}
          </p>
        )}
      </div>
      {/* <button
        className=""
        type="reset"
        disabled={disabled}
        onClick={() => reset()}
      >
        Reset form
      </button> */}
      <div className="px-2 flex gap-2 mx-auto w-2/3">
        <button
          className="p-2 text-white bg-sky-600 rounded-sm m-2 w-1/2 mx-auto"
          type="reset"
        >
          Cancel
        </button>
        <button
          className="p-2 text-white bg-sky-600 rounded-sm m-2 w-1/2 mx-auto"
          type="submit"
        >
          {disabled ? "Wait.." : "Add"}
        </button>
      </div>
    </form>
  );
};

export default SiteAddForm;
