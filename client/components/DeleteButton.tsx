"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({
  href,
  disabled,
}: {
  href: string;
  disabled?: boolean;
}) {
  const router = useRouter();

  return (
    <button
      className="bg-red-500 p-2 text-white rounded-sm w-full not-disabled:cursor-pointer"
      type="button"
      onClick={() => router.push(href)}
      disabled={disabled}
    >
      Delete
    </button>
  );
}
