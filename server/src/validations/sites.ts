import { z } from "zod";

export const searchQueryProps = z.object({
  limit: z.preprocess(Number, z.number().int().positive()).optional(),
  offset: z.preprocess(Number, z.number().int().min(0)).optional(),
  searchText: z.string().optional(),
  is_admin: z.boolean().optional(),
  owner_id: z.uuid().optional(),
});

export type SearchQueryProps = z.infer<typeof searchQueryProps>;

export const siteGetByIdSchema = z.object({
  site_id: z.uuid(),
});

export const sitesSchema = z.object({
  site_id: z.uuid(),
  limit: z.number(),
  offset: z.number(),
});

export const siteCreateSchema = z.object({
  name: z.string().min(1),
  url: z.preprocess(
    (val) => (val === "" ? null : val),
    z.union([z.url(), z.null()]).optional()
  ),
  owner_id: z.uuid(),
  description: z.union([z.string(), z.null()]).optional(),
});

export const siteUpdateInputSchema = z.object({
  site_id: z.uuid(),
  name: z.string().trim().min(1).max(255).optional(),
  url: z.preprocess(
    (val) => (val === "" ? null : val),
    z.union([z.url(), z.null()]).optional()
  ),
  description: z.union([z.string(), z.null()]).optional(),
});

export type SiteAddFormData = z.infer<typeof siteCreateSchema>;
export type SiteUpdateFormData = z.infer<typeof siteUpdateInputSchema>;
export type SiteGetByIdFormData = z.infer<typeof siteGetByIdSchema>;
