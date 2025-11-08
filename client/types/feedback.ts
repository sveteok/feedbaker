export type Feedback = {
  feedback_id: string;
  site_id: string;
  author: string;
  body: string;
  public: boolean;
  created_on: Date;
  updated_on: Date;
  comment?: string | null;
};
export interface PaginatedFeedback {
  feedback: Feedback[];
  totalCount: number;
}
