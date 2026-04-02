import "server-only";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserPayload } from "@/types/users";

const COOKIE_NAME =
  process.env.COOKIE_NAME ||
  process.env.NEXT_PUBLIC_COOKIE_NAME ||
  "auth_token";
const JWT_SECRET = process.env.JWT_SECRET;

export type UserProfile = {
  user: UserPayload;
};

export async function getUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token || !JWT_SECRET) return null;

  try {
    const payload = jwt.verify(token, JWT_SECRET) as UserPayload;
    return payload;
  } catch {
    return null;
  }
}
