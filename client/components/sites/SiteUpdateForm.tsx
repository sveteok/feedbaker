import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DeleteButton from "@/components/DeleteButton";
import {
  FormButtons,
  FormInput,
  FormText,
  OwnerLinkButton,
  Section,
  SectionContent,
  TableHolder,
  Title,
} from "../Ui";
import { Site } from "@/types/sites";
import { siteUpdateSchema } from "@/validations/sites";
import { formatDate } from "@/lib/utils/dateFormat";
import { SvgSite } from "../Svg";

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
    <Section>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Title>
          Site Details Editing
          {/* <OwnerLinkButton href={`/sites/${site.site_id}`}>
            back
          </OwnerLinkButton> */}
        </Title>
        <SectionContent>
          <TableHolder>
            <div className="flex justify-between items-center bg-gray-50">
              <div className="px-4 text-3xl text-sky-200">
                <SvgSite />
              </div>
              <div className="text-black/50 italic flex text-xs flex-col p-4 py-2 ">
                <div className="text-right">
                  created on {formatDate(site.created_on)}
                </div>
                <div className="text-right">
                  updated on {formatDate(site.updated_on)}
                </div>
              </div>
            </div>
          </TableHolder>
        </SectionContent>
        <SectionContent>
          <TableHolder>
            <div className="p-2 bg-sky-50">
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
            </div>
          </TableHolder>
          <TableHolder>
            <div className="p-2 bg-sky-100">
              <FormButtons
                busy={disabled}
                title={"Save"}
                onReset={() => reset({ ...site })}
              />
            </div>
          </TableHolder>
        </SectionContent>

        <Title>Widget Instructions</Title>
        <SectionContent>
          <TableHolder>
            <div className="p-4  break-keep bg-white m-4 ring-2 ring-gray-300">
              {`
              <script
                src="http://localhost:3000/feedbaker.js"
                data-site="52be079b-b0cf-4d75-94d2-2c3b86438fa2"
                data-bg="#0088aa"
                data-fg="#ffffff"
              ></script>
              `}
            </div>
          </TableHolder>
        </SectionContent>

        <Title>Danger Zone</Title>
        <SectionContent>
          <TableHolder>
            <div className="p-2 bg-sky-50">
              <FormInput
                title="Type Site Name to Confirm Deletion"
                placeholder="Site Name"
                required={true}
                disabled={disabled}
              />
            </div>
          </TableHolder>
          <TableHolder>
            <div className="p-2 bg-sky-100 flex justify-center">
              <DeleteButton
                href={`/sites/${site.site_id}/edit?modal=true`}
                disabled={disabled}
              />
            </div>
          </TableHolder>
        </SectionContent>
      </form>
    </Section>
  );
};

export default SiteUpdateForm;
