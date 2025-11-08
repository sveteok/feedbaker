export type Feedback = {
  feedback_id: string;
  site_id: string;
  author: string;
  body: string;
  public?: boolean;
  created_on?: string;
  updated_on: string;
  comment?: string;
};

export type FeedbackOwnerDetail = {
  feedback_id: string;
  site_id: string;
  owner_id: string;
};

export interface PaginatedFeedback {
  feedback: Feedback[];
  totalCount: number;
}
