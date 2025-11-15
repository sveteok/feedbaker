import { cookies } from "next/headers";

const COOKIE_NAME = process.env.COOKIE_NAME || "auth_token";

export default async function Debug() {
  const cookieStore = await cookies();

  const token = cookieStore.get(COOKIE_NAME)?.value;
  console.log(" token ", token);
  console.log("SSR cookies:", cookieStore.getAll());
  return <pre>{JSON.stringify(cookieStore.getAll(), null, 2)}</pre>;
}
