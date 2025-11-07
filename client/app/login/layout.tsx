import { getUser } from "@/lib/providers/auth";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (user !== null) {
    redirect("/profile"); //authorized
  }

  return <>{children}</>;
}
