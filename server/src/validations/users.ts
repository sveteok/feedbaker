import { z } from "zod";

export const baseUserSchema = z.object({
  provider: z.string().min(1),
  provider_id: z.string().min(1),
  name: z.string().min(1),
  email: z.email(),
  picture: z.url().optional(),
  is_admin: z.boolean().optional().default(false),
});

export const userSchema = baseUserSchema.extend({
  user_id: z.uuid(),
});

export const userGetByIdSchema = z.object({
  user_id: z.uuid(),
});

export type BaseUser = z.infer<typeof baseUserSchema>;
export type GoogleUser = BaseUser;
export type User = z.infer<typeof userSchema>;
