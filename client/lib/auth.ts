import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { UserPayload } from "@/types/users";

const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

export type UserProfile = {
  user: UserPayload;
};

export async function getUser(): Promise<UserPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, GOOGLE_CLIENT_SECRET) as UserPayload;
    return payload;
  } catch {
    return null;
  }
}
