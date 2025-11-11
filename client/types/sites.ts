export type Site = {
  site_id: string;
  name: string;
  url?: string | null;
  description?: string | null;
  owner_id: string;
  created_on: Date;
  updated_on: Date;
  summary?: string | null;
  summary_started_on?: Date;
  summary_updated_on?: Date;
  summary_error?: string | null;
};

export type SiteWithFeedback = Site & { feedback_count: number };

export interface PaginatedSites {
  sites: SiteWithFeedback[];
  totalCount: number;
}
