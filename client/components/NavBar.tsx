"use client";

import { SvgLogo } from "@/components/Svg";
import { MenuLink } from "@/components/Ui";
import { useAuth } from "@/lib/providers/AuthContext";

export default function NavBar() {
  const { user } = useAuth();
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
