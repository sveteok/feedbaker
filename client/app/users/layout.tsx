import { getUser } from "@/lib/providers/auth";
import { redirect } from "next/navigation";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (user === null || user.is_admin === false) {
    redirect("/"); //unauthorized
  }

  return <>{children}</>;
}
