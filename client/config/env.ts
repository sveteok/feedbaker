import { z } from "zod";

const EnvSchema = z.object({
  API_URL: z.url().optional(),
  NEXT_PUBLIC_API_URL: z.url().optional(),
});

const env = EnvSchema.parse({
  API_URL: process.env.API_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
});

export const absoluteURL = env.NEXT_PUBLIC_API_URL;
// (typeof window === "undefined"
//   ? env.API_URL // server-side variable (optional)
//   : undefined) ||
// env.NEXT_PUBLIC_API_URL || // exposed to client & server
// "http://localhost:4000";
