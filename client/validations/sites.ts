import { z } from "zod";

export const searchUiQueryProps = z.object({
  page: z.preprocess(Number, z.number().int().min(0)).optional(),
  search: z.string().optional(),
  owner_id: z.uuid().optional(),
  site_public: z.union([z.string(), z.boolean()]).optional(),
});

export type SearchUiQueryProps = z.infer<typeof searchUiQueryProps>;

export const searchQueryProps = z.object({
  limit: z.preprocess(Number, z.number().int().positive()).optional(),
  offset: z.preprocess(Number, z.number().int().min(0)).optional(),
  searchText: z.string().optional(),
  owner_id: z.uuid().optional(),
  site_public: z.union([z.string(), z.boolean()]).optional(),
});

export type SearchQueryProps = z.infer<typeof searchQueryProps>;

//Schemas
export const baseSiteSchema = z.object({
  site_id: z.uuid(),
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Max 255 symbols" }),
  url: z.preprocess(
    (val) => (val === "" ? null : val),
    z.union([z.url(), z.null()]).optional()
  ),
  owner_id: z.uuid(),
  description: z.union([z.string(), z.null()]).optional(),
  created_on: z.coerce.date(),
  updated_on: z.coerce.date(),
});

export const siteSchema = baseSiteSchema;

export const siteCreateSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "Name is required" })
    .max(255, { message: "Max 255 symbols" }),
  url: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.url().optional()
  ),
  owner_id: z.uuid().optional(),
  description: z.string().optional(),
});

export type SiteAddFormData = z.infer<typeof siteCreateSchema>;

export const siteUpdateSchema = baseSiteSchema;

export const siteDetailSchema = baseSiteSchema.extend({
  feedback_count: z.number(),
});

export const paginatedSitesSchema = z.object({
  sites: z.array(siteDetailSchema),
  totalCount: z.number(),
});

export const siteGetByIdSchema = z.object({
  site_id: z.uuid(),
});

export type SiteGetByIdFormData = z.infer<typeof siteGetByIdSchema>;
