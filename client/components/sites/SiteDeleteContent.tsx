"use client";

import { useState } from "react";
import { FormInput, SectionContent, TableHolder } from "../Ui";
import { Site } from "@/types/sites";

export default function SiteDeleteContent({
  site,
  disabled,
  onDelete,
}: {
  site: Site;
  disabled: boolean;
  onDelete: (site_id: string) => void;
}) {
  const [state, setState] = useState("");

  return (
    <SectionContent>
      <TableHolder>
        <div className="p-2 bg-sky-50">
          <FormInput
            title="Type Site Name to Confirm Deletion"
            required={true}
            disabled={disabled}
            onChange={(e) => setState(e.target.value)}
            placeholder={`Please, write "${site.name}"`}
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
              if (state === site.name) onDelete(site.site_id);
            }}
            disabled={disabled || state !== site.name}
          >
            Delete
          </button>
        </div>
      </TableHolder>
    </SectionContent>
  );
}
