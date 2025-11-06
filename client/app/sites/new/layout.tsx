import { getUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AddNewSiteLayout({
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
