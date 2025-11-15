import { cookies } from "next/headers";

export default async function Debug() {
  const cookieStore = await cookies();

  console.log("SSR cookies:", cookieStore.getAll());
  return <pre>{JSON.stringify(cookieStore.getAll(), null, 2)}</pre>;
}
