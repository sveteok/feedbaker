import { Loading } from "@/components/Loading";
import { Suspense } from "react";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Suspense fallback={<Loading />}>{children}</Suspense>;
}
