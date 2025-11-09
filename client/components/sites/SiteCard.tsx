import { Site } from "@/types/sites";
import { DefaultLink, LinkButton, OwnerLinkButton } from "../Ui";
import { SvgSite } from "../Svg";
import { formatDate } from "@/lib/utils/dateFormat";
import { UserPayload } from "@/types/users";

const SiteCard = ({
  site,
  feedback_count,
  user,
}: {
  site: Site;
  feedback_count?: number;
  user: UserPayload | null;
}) => {
  return (
    <div className="flex flex-col gap-1 p-4 px-6  bg-gray-50">
      <div className="font-bold flex gap-2 justify-between items-center">
        <div className="flex-1 flex gap-1">
          <SvgSite />
          {site.name}
        </div>
        {feedback_count !== undefined && (
          <div className="-mr-2 flex gap-2">
            {user && (user.user_id === site.owner_id || user.is_admin) && (
              <OwnerLinkButton href={`/sites/${site.site_id}/edit`}>
                edit site
              </OwnerLinkButton>
            )}
            <LinkButton href={`/sites/${site.site_id}/feedback`}>
              feedback
            </LinkButton>
          </div>
        )}
      </div>
      <div className="text-xs italic xfont-bold opacity-50 ">
        registred on {formatDate(site.created_on)}
      </div>
      <div className="flex justify-between items-center text-sm">
        <DefaultLink href={site.url || ""} external>
          {site.url}
        </DefaultLink>

        <div className="text-sm"></div>
      </div>
      {site.description && (
        <div className="text-smx italic">{site.description}</div>
      )}

      {feedback_count !== undefined && (
        <div className="text-xs text-right italic opacity-50">
          feedback: {feedback_count}
        </div>
      )}
    </div>
  );
};

export default SiteCard;
