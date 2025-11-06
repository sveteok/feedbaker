"use client";

import { useState } from "react";

export default function SiteDeleteContent({
  onConfirm,
  confirmText,
}: {
  onConfirm: () => void;
  confirmText: string;
}) {
  const [state, setState] = useState("");

  return (
    <div className="flex flex-col gap-5  bg-amber-200 h-full w-full">
      <div className="flex p-5">
        Please, write {confirmText} and press the button to confirm Delete
        operation
      </div>
      <div className="flex-1 p-5">
        <input
          className="w-full"
          value={state}
          id="confirmText"
          onChange={(e) => setState(e.target.value)}
          placeholder={`Please, write "${confirmText}"`}
        />
      </div>
      <button
        className="p-5"
        onClick={() => {
          if (state === confirmText) onConfirm();
        }}
      >
        Confirm
      </button>
    </div>
  );
}
