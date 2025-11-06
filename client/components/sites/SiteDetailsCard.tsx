import { Site } from "@/types/sites";
import { DefaultLink, Title } from "../Ui";
import { formatDate } from "@/lib/utils/dateFormat";

const SiteDetailsCard = async ({ site }: { site: Site }) => {
  return (
    <>
      <Title>
        Site details
        <DefaultLink href={`/sites/${site.site_id}/edit`}>
          edit details
        </DefaultLink>
      </Title>
      <div className="flex flex-col gap-1 p-2">
        <div className="font-bold flex justify-between items-center">
          !!!{site.name}
          <div className="text-sm font-normal">
            {formatDate(site.created_on)}
          </div>
        </div>
        <DefaultLink href={site.url} external={true}>
          {site.url}
        </DefaultLink>
        <div className="text-sm italic">{site.description}</div>
      </div>
    </>
  );
};

export default SiteDetailsCard;
