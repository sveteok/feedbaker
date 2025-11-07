import SiteCard from "@/components/sites/SiteCard";
import { PaginatedSites, SiteWithFeedback } from "@/types/sites";

export default function SiteList({ sites }: { sites: PaginatedSites }) {
  return (
    <>
      <div className="flex flex-col gap-1 bg-gray-200">
        {sites.sites.map((site: SiteWithFeedback) => (
          <SiteCard
            key={site.site_id}
            site={site}
            feedbacks_count={site.feedback_count}
          />
        ))}
        {sites.totalCount === 0 && (
          <div className="p-6 text-center text-black/50 text-xs bg-gray-50">
            no sites found
          </div>
        )}
      </div>
    </>
  );
}
