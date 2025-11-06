import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function EditSiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (user === null) {
    redirect("/sites"); //unauthorized
  }

  return <>{children}</>;
}
