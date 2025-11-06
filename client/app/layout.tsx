"use client";

import "./globals.css";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Toaster } from "react-hot-toast";

import Link from "next/link";
import { usePathname } from "next/navigation";

import getQueryClient from "@/lib/react-query/getQueryClient";
import { SvgLogo } from "@/components/Svg";

function MenuLink({
  children,
  href,
}: Readonly<{
  children: React.ReactNode;
  href: string;
}>) {
  const current = usePathname() === href;
  return (
    <Link
      href={href}
      className={
        "p-4 whitespace-nowrap hover:bg-white/50 " +
        (current ? "border-b-4 pb-3 border-amber-800 " : "")
      }
    >
      {children}
    </Link>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <html lang="en">
      <body className="bg-gray-900 flex flex-col min-h-dvh">
        <Toaster position="top-right" />
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
          <MenuLink href="/login">Sign In</MenuLink>
          <MenuLink href="/profile">Profile</MenuLink>
        </nav>

        <QueryClientProvider client={queryClient}>
          <div className="grid bg-gray-200 gap-1 flex-1">{children}</div>
        </QueryClientProvider>
        <footer className="min-w-xs text-white text-sm text-center p-4">
          Feedbaker by Svetlana Teryaeva
          <br />
          2025
        </footer>
      </body>
    </html>
  );
}
