"use client";

import { useState } from "react";
import { SectionContent, TableHolder, Title } from "../Ui";

interface InputFormProps {
  site_id: string;
  src: string;
}

const WidgetInstructions = ({ site_id, src }: InputFormProps) => {
  const [state, setState] = useState<{ bg: string; fg: string }>({
    bg: "#0088aa",
    fg: "#ffffff",
  });
  return (
    <>
      <Title>Widget Instructions</Title>
      <SectionContent className={`bg-[${state.bg}] text-[${state.fg}]`}>
        <TableHolder>
          <div
            className={`p-4  break-keep m-4 ring-2 ring-gray-300 bg-(--${state.bg}) text-[${state.fg}]`}
          >
            {`
              <script
                src="${src}"
                data-site="${site_id}"
                data-bg="${state.bg}"
                data-fg=""${state.fg}"
              ></script>
              `}
          </div>
        </TableHolder>
        <button
          onClick={(e) => {
            e.preventDefault();
            setState({
              bg: "#0088aa",
              fg: "#ffffff",
            });
          }}
        >{`data-bg="#0088aa" data-fg="#ffffff"`}</button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setState({
              bg: "#ffffff",
              fg: "#0088aa",
            });
          }}
        >{`data-bg="#0088aa" data-fg="#ffffff"`}</button>
      </SectionContent>
    </>
  );
};

export default WidgetInstructions;
