"use client";

import Link from "next/link";
import { SvgLogo } from "@/components/Svg";
import { MenuLink } from "@/components/Ui";
import { UserPayload } from "@/types/users";
import { useAuth } from "@/lib/providers/AuthContext";
import { usePathname } from "next/navigation";

// export default function NavBar({ user }: { user: UserPayload | null }) {

export default function NavBar() {
  const pn = usePathname();
  const { user } = useAuth();
  //   console.log(user);
  return (
    <nav
      className="min-w-xs bg-amber-100 text-amber-800 flex justify-between sticky top-0 xshadow-sm overflow-hidden
         z-20 xxborder-b-4 border-amber-800/20"
    >
      <MenuLink href="/">
        <SvgLogo />
        <span className="hidden sm:block">Feedbaker</span>
      </MenuLink>
      <MenuLink href="/sites">Sites</MenuLink>
      <MenuLink href="/help">Help</MenuLink>
      <div className="flex-1 border-b-4 pb-3 border-amber-800/10"></div>
      {user && <MenuLink href="/profile">Profile</MenuLink>}
      {!user && <MenuLink href="/login">Sign In</MenuLink>}
    </nav>
  );
}
