"use client";

import { useState } from "react";

export default function DeleteContent({
  onConfirm,
  confirmText,
  title = "Please, Confirm Deletion",
  onCancel,
}: {
  onConfirm: () => void;
  confirmText: string;
  title?: string;
  onCancel: () => void;
}) {
  const [state, setState] = useState("");

  return (
    <>
      <h1 className="text-center bg-amber-200 text-amber-800 font-bold p-4 mb-2 rounded-xs">
        {title}
      </h1>
      <div className="flex flex-col p-6 gap-4  bg-amber-200 h-full w-full rounded-xs">
        <div className="">
          Write
          <span className="bg-amber-100 whitespace-nowrap p-1 m-1 ring-1 ring-amber-300">
            {confirmText}
          </span>
          and press the &quot;Delete&quot; button to confirm delete operation!
        </div>
        <div className="">
          <input
            className="w-full p-2 bg-amber-50 ring-2 ring-amber-300 outline-none
          focus:bg-white focus:ring-amber-800"
            value={state}
            id="confirmText"
            onChange={(e) => setState(e.target.value)}
            placeholder={`Please, write "${confirmText}"`}
          />
        </div>
        <div className="flex gap-4 justify-center">
          <button
            className=" flex-1 p-2 bg-amber-600 text-white rounded-xs cursor-pointer 
            focus:ring-2 focus:ring-amber-800 outline-none
            hover:opacity-80"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            disabled={state !== confirmText}
            className="flex-1 p-2 bg-amber-600 text-white rounded-xs 
            disabled:opacity-50
            not-disabled:cursor-pointer not-disabled:hover:opacity-80"
            onClick={() => {
              if (state === confirmText) onConfirm();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
