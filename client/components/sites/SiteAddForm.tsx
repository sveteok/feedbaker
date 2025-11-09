import { siteCreateSchema, SiteAddFormData } from "@/validations/sites";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DefaultLink,
  FormButtons,
  FormInput,
  FormText,
  SectionContent,
  TableHolder,
  Title,
} from "../Ui";

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
    <form className="flex flex-col gap-4 " onSubmit={handleSubmit(onSubmit)}>
      <Title>
        Register New Site
        {/* <DefaultLink href={`/sites`}>cancel</DefaultLink> */}
      </Title>
      <SectionContent>
        <TableHolder>
          <div className="p-2 bg-sky-50">
            <FormInput
              placeholder="e.g. Google - Search Engine"
              title="Name"
              required={true}
              disabled={disabled}
              error={errors?.name?.message}
              {...register("name")}
            />
            <FormInput
              placeholder="e.g. https://google.com"
              title="URL"
              required={true}
              disabled={disabled}
              error={errors?.url?.message}
              {...register("url")}
            />

            <FormText
              placeholder="few words about your site"
              title="Description"
              required={true}
              disabled={disabled}
              error={errors?.description?.message}
              {...register("description")}
            />

            {/* <button
        className=""
        type="reset"
        disabled={disabled}
        onClick={() => reset()}
      >
        Reset form
      </button> */}
          </div>
        </TableHolder>
        <TableHolder>
          <div className="p-2 bg-sky-100">
            <FormButtons busy={disabled} title={"Register"} />
          </div>
        </TableHolder>
      </SectionContent>
    </form>
  );
};

export default SiteAddForm;
