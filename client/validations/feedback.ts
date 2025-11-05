import { z } from "zod";

export const feedbackSearchQueryProps = z.object({
  limit: z.preprocess(Number, z.number().int().positive()).optional(),
  offset: z.preprocess(Number, z.number().int().min(0)).optional(),
  searchText: z.string().optional(),
  site_id: z.uuid().optional(),
});

export type FeedbackSearchQueryProps = z.infer<typeof feedbackSearchQueryProps>;

// schemas
export const baseFeedbackSchema = z.object({
  feedback_id: z.uuid(),
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

export const paginatedFeedbacksSchema = z.object({
  feedbacks: z.array(baseFeedbackSchema),
  totalCount: z.number(),
});
