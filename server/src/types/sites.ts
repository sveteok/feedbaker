export type Site = {
  site_id: string;
  name: string;
  url?: string | null;
  owner_id: string;
  description?: string | null;
  created_on: string;
  updated_on: string;
};

export type SiteWithFeedback = Site & { feedback_count: number };

export interface PaginatedSites {
  sites: SiteWithFeedback[];
  totalCount: number;
}
