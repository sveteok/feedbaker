import { z } from "zod";

export const baseUserSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  picture: z.url().optional(),
  is_admin: z.boolean().optional().default(false),
});

export const userSchema = baseUserSchema.extend({
  user_id: z.uuid(),
});

export const authenticatedUserSchema = z.object({
  message: z.string(),
  userPayload: userSchema,
  token: z.string(),
});

export type BaseUser = z.infer<typeof baseUserSchema>;
export type GoogleUser = BaseUser;
export type User = z.infer<typeof userSchema>;

export const paginatedUsersSchema = z.object({
  users: z.array(userSchema),
  totalCount: z.number(),
});

export const searchUserUiQueryProps = z.object({
  page: z.preprocess(Number, z.number().int().min(0)).optional(),
  search: z.string().optional(),
});

export type SearchUserUiQueryProps = z.infer<typeof searchUserUiQueryProps>;

export const searchUserQueryProps = z.object({
  limit: z.preprocess(Number, z.number().int().positive()).optional(),
  offset: z.preprocess(Number, z.number().int().min(0)).optional(),
  searchText: z.string().optional(),
});

export type SearchuserQueryProps = z.infer<typeof searchUserQueryProps>;
