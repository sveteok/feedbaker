import { z } from "zod";

const EnvSchema = z.object({
  API_URL: z.url().optional(),
  NEXT_PUBLIC_API_URL: z.url().optional(),
  NEXT_PUBLIC_ORIGIN: z.url().optional(),
});

const env = EnvSchema.parse({
  API_URL: process.env.API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_ORIGIN: process.env.NEXT_PUBLIC_ORIGIN,
});

export const absoluteURL = env.NEXT_PUBLIC_ORIGIN;
