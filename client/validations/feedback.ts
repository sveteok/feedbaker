import { z } from "zod";

export const feedbackSearchQueryProps = z.object({
  limit: z.preprocess(Number, z.number().int().positive()).optional(),
  offset: z.preprocess(Number, z.number().int().min(0)).optional(),
  searchText: z.string().optional(),
  site_id: z.uuid().optional(),
});

export type FeedbackSearchQueryProps = z.infer<typeof feedbackSearchQueryProps>;

export type FeedbackSearchUiQueryProps = SearchUiQueryProps & {
  site_id: string;
};

export const searchUiQueryProps = z.object({
  page: z.preprocess(Number, z.number().int().min(0)).optional(),
  search: z.string().optional(),
});

export type SearchUiQueryProps = z.infer<typeof searchUiQueryProps>;

// schemas
export const baseFeedbackSchema = z.object({
  feedback_id: z.uuid(),
  site_id: z.uuid(),
  site_owner_id: z.uuid().optional(),
  author: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Max 255 symbols" }),
  body: z
    .string()
    .trim()
    .min(1, { message: "Text is required" })
    .max(1000, { message: "Max 1000 symbols" }),
  public: z.boolean(),
  comment: z.union([z.string(), z.null()]).optional(),
  created_on: z.coerce.date(),
  updated_on: z.coerce.date(),
});

export const feedbackCreateSchema = z.object({
  site_id: z.uuid(),
  author: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Max 255 symbols" }),
  body: z
    .string()
    .trim()
    .min(1, { message: "Text is required" })
    .max(1000, { message: "Max 1000 symbols" }),
});

export const feedbackUpdateSchema = z.object({
  feedback_id: z.uuid(),
  public: z.boolean(),
  comment: z.union([z.string(), z.null()]).optional(),
});

export type FeedbackAddFormData = z.infer<typeof feedbackCreateSchema>;
export type FeedbackUpdateFormData = z.infer<typeof feedbackUpdateSchema>;

export const paginatedFeedbackSchema = z.object({
  feedback: z.array(baseFeedbackSchema),
  totalCount: z.number(),
});
