"use client";

import { useState, useEffect } from "react";

type SearchProps = {
  searchQuery: string;
  setSearchQuery: (text: string) => void;
  isPending?: boolean;
  placeholder?: string;
  disabled?: boolean;
  statusText?: string;
};

const Search = ({
  searchQuery,
  setSearchQuery,
  isPending = false,
  placeholder = "Filter...",
  disabled = false,
  statusText = "",
}: SearchProps) => {
  const [text, setText] = useState("");

  useEffect(() => {
    setText(searchQuery);
  }, [searchQuery]);
  return (
    <div className=" p-4 bg-sky-100 gap-4 -mb-4 xx-mt-4 pt-6 border-b-4  border-sky-200">
      <div
        className="flex xgap-0.5 p-0.5 -m-0.5 bg-sky-200 items-xcenter pr-2x
    focus-within:bg-sky-600"
      >
        <input
          className="outline-none text-sky-700 p-2 w-full bg-sky-50 focus:bg-white placeholder:text-sm placeholder:text-ske-600/50"
          placeholder={isPending ? ">Updating…" : placeholder}
          id="SearchInput"
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          disabled={disabled || isPending}
        />
        {text !== searchQuery && (
          <button
            className="p-4 py-2 text-sky-600 bg-sky-100 outline-none text-sm xborder-l-2 border-sky-600
           focus:bg-sky-200 cursor-pointer active:bg-white 
           hover:bg-sky-200 "
            onClick={() => setSearchQuery(text)}
          >
            search
          </button>
        )}
        {text === searchQuery && text && (
          <button
            className="p-4 py-2 text-sky-600 bg-sky-100 outline-none text-sm xborder-l-2 border-sky-600
           focus:bg-sky-200 cursor-pointer active:bg-white whitespace-nowrap 
           hover:bg-sky-200 "
            onClick={() => setSearchQuery("")}
          >
            cancel
          </button>
        )}
        {isPending && <span className="text-sm text-gray-500">Updating…</span>}
      </div>
      <div
        className="text-xs text-right pt-2 px-2 italic text-sky-800"
        suppressHydrationWarning
      >
        {statusText}
      </div>
    </div>
  );
};
export default Search;
