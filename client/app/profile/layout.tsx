import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (user === null) {
    redirect("/login"); //unauthorized
  }

  return <>{children}</>;
}
