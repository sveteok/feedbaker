"use client";

import { useState } from "react";
import { FormInput, SectionContent, TableHolder } from "../Ui";
import { SvgAlarm } from "../Svg";

import { UserPayload } from "@/types/users";

export default function UserDeleteContent({
  user,
  onDelete,
}: {
  user: UserPayload;
  onDelete: () => void;
}) {
  const [state, setState] = useState("");
  return (
    <SectionContent>
      <TableHolder>
        <div className="px-6 py-4 text-red-500 italic bg-gray-50 flex gap-6">
          <SvgAlarm />
          Once you remove yourself from Feedbaker all your sites and sites&apos;
          feedback will be permanently deleted!
        </div>
        <div className="p-2 bg-sky-50">
          <FormInput
            title="Type Your Name to Confirm Deletion"
            required={true}
            disabled={false}
            onChange={(e) => setState(e.target.value)}
            placeholder={`Please, write your name "${user.name}"`}
          />
        </div>
      </TableHolder>
      <TableHolder>
        <div className="p-2 bg-sky-100 flex justify-center">
          <button
            className="w-2/3 bg-red-500 p-2 text-white rounded-xs not-disabled:cursor-pointer
            disabled:opacity-50
            not-disabled:hover:opacity-80 "
            type="button"
            onClick={() => {
              if (state === user.name) {
                onDelete();
              }
            }}
            disabled={state !== user.name}
          >
            Delete
          </button>
        </div>
      </TableHolder>
    </SectionContent>
  );
}
