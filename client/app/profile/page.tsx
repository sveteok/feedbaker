import { Suspense } from "react";
import ProfilePage from "@/components/users/ProfilePage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading profile...</div>}>
      <ProfilePage />
    </Suspense>
  );
}
