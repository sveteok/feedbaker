import { z } from "zod";

export const feedbackGetByIdSchema = z.object({
  feedback_id: z.uuid(),
});

export const feedbackSearchQueryProps = z.object({
  limit: z.preprocess(Number, z.number().int().positive()).optional(),
  offset: z.preprocess(Number, z.number().int().min(0)).optional(),
  search: z.string().optional(),
  site_id: z.uuid(),
  is_admin: z.boolean().optional(),
  owner_id: z.uuid().optional(),
});

export type FeedbackSearchQueryProps = z.infer<typeof feedbackSearchQueryProps>;

export const feedbackSchema = z.object({
  site_id: z.uuid().optional(),
  limit: z.string().optional(),
  offset: z.string().optional(),
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

export const feedbackDeleteSchema = z.object({
  feedback_id: z.uuid(),
  site_id: z.uuid(),
});

export type FeedbackAddFormData = z.infer<typeof feedbackCreateSchema>;
export type FeedbackUpdateFormData = z.infer<typeof feedbackUpdateSchema>;
export type FeedbackDeleteFormData = z.infer<typeof feedbackDeleteSchema>;
export type FeedbackGetByIdFormData = z.infer<typeof feedbackGetByIdSchema>;
