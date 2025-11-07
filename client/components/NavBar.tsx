"use client";

import Link from "next/link";
import { SvgLogo } from "@/components/Svg";
import { MenuLink } from "@/components/Ui";
import { UserPayload } from "@/types/users";
import { useAuth } from "@/lib/providers/AuthContext";

// export default function NavBar({ user }: { user: UserPayload | null }) {

export default function NavBar() {
  const { user } = useAuth();
  //   console.log(user);
  return (
    <nav
      className="min-w-xs bg-amber-100 text-amber-800 flex justify-between sticky top-0 xshadow-sm overflow-hidden
         z-20"
    >
      <Link
        className="flex gap-4 items-center px-4 font-bold xtext-amber-900 xtext-white stroke-amber-300 hover:bg-white/50"
        href="/"
      >
        <SvgLogo />
        <span className="hidden sm:block">Feedbaker</span>
      </Link>
      <MenuLink href="/sites">Sites</MenuLink>
      <MenuLink href="/help">Help</MenuLink>
      <div className="flex-1"></div>
      {user && <MenuLink href="/profile">Profile</MenuLink>}
      {!user && <MenuLink href="/login">Sign In</MenuLink>}
    </nav>
  );
}
