import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  FormButtons,
  FormInput,
  FormText,
  Section,
  SectionContent,
  TableHolder,
  Title,
} from "../Ui";
import { Site } from "@/types/sites";
import { siteUpdateSchema } from "@/validations/sites";
import { formatDate } from "@/lib/utils/dateFormat";
import { SvgSite } from "../Svg";
import SiteDeleteContent from "./SiteDeleteContent";
import WidgetInstructions from "./WidgetInstructions";

type UpdateFormData = z.infer<typeof siteUpdateSchema>;

interface InputFormProps {
  site: Site;
  disabled: boolean;
  onSubmit: (site: Site) => void;
  onDelete: (site_id: string) => void;
}

const SiteUpdateForm = ({
  site,
  onSubmit,
  disabled,
  onDelete,
}: InputFormProps) => {
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
  });

  return (
    <Section>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <Title>Site Details Editing</Title>
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
                onReset={() => reset()}
              />
            </div>
          </TableHolder>
        </SectionContent>

        <WidgetInstructions site_id={site.site_id} />

        <Title>Danger Zone</Title>
        <SiteDeleteContent
          site={site}
          onDelete={onDelete}
          disabled={disabled}
        />
      </form>
    </Section>
  );
};

export default SiteUpdateForm;
