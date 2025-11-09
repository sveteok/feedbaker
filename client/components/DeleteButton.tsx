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
      className="w-2/3 bg-red-500 p-2 text-white rounded-xs not-disabled:cursor-pointer"
      type="button"
      onClick={() => router.push(href)}
      disabled={disabled}
    >
      Delete
    </button>
  );
}
