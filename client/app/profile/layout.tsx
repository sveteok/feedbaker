import { getUser } from "@/lib/providers/auth";
import { redirect } from "next/navigation";

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();
  console.log("profile user", user);
  // if (user === null) {
  //   redirect("/login"); //unauthorized
  // }

  return <>{children}</>;
}
