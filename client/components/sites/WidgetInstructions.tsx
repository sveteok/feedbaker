"use client";

import { useState } from "react";
import { SectionContent, TableHolder, Title } from "../Ui";
import { CopyClipboard } from "../Svg";

interface InputFormProps {
  site_id: string;
  src: string;
}

type WidgetInstructionsColorsProps = {
  id: string;
  bg: string;
  fg: string;
};

const WidgetInstructionsColors = {
  style1: {
    id: "style1",
    bg: "#0088aa",
    fg: "#ffffff",
  },
  style2: {
    id: "style2",
    bg: "#ffffff",
    fg: "#0088aa",
  },
  style3: {
    id: "style3",
    bg: "#00ff00",
    fg: "#000000",
  },
};

const WidgetInstructions = ({ site_id, src }: InputFormProps) => {
  const [state, setState] = useState<WidgetInstructionsColorsProps>(
    WidgetInstructionsColors.style1
  );

  const colorStyles: WidgetInstructionsColorsProps[] = [
    WidgetInstructionsColors.style1,
    WidgetInstructionsColors.style2,
    WidgetInstructionsColors.style3,
  ];

  const scriptTxt = `<script src="${src}" data-site="${site_id}" data-bg="${state.bg}" data-fg="${state.fg}"></script>`;

  return (
    <>
      <Title>Widget Instructions</Title>
      <SectionContent>
        <TableHolder>
          <button
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(scriptTxt);
            }}
            className="flex w-full justify-end px-4 mt-2 z-10 text-3xl text-sky-800"
          >
            <CopyClipboard />
          </button>
          <div className="p-4 pt-0 bg-white break-keep m-4 -mt-0 ring-2 ring-gray-300 ">
            {scriptTxt}
          </div>
        </TableHolder>
        <h1 className="w-full flex text-center justify-center">
          Choose color:
        </h1>
        <div className="flex justify-items-center gap-2 px-2 my-2">
          {colorStyles.map((colorStyle) => (
            <button
              className={`p-2 bg-gray-200 border-2  w-fit text-xs mx-auto w-1/3
                ${colorStyle === state ? "border-amber-400" : "border-gray-200"}
                `}
              onClick={(e) => {
                e.preventDefault();
                setState(colorStyle);
              }}
              key={colorStyle.id}
            >
              <div
                className="border-2 p-2 flex flex-col gap-1 rounded-md"
                style={{
                  background: colorStyle.bg,
                  borderColor: colorStyle.fg,
                }}
              >
                <div
                  className="p-1 text-xs"
                  style={{
                    background: colorStyle.bg,
                    borderColor: colorStyle.fg,
                  }}
                >
                  Feedback
                </div>
                <div
                  className="border-2 p-1 rounded-sm"
                  style={{
                    background: colorStyle.bg,
                    borderColor: colorStyle.fg,
                  }}
                ></div>
                <div
                  className="border-2 p-1 rounded-sm"
                  style={{
                    background: colorStyle.bg,
                    borderColor: colorStyle.fg,
                  }}
                ></div>
                <div className="flex gap-1">
                  <div
                    className="flex-1 border-2 border-black/50 bg-black/10 p-1 rounded-sm"
                    style={{
                      background: colorStyle.bg,
                      borderColor: colorStyle.fg,
                    }}
                  ></div>
                  <div
                    className="flex-1 border-2 border-black/50 bg-black/10 p-1 rounded-sm"
                    style={{
                      background: colorStyle.bg,
                      borderColor: colorStyle.fg,
                    }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </SectionContent>
    </>
  );
};

export default WidgetInstructions;
