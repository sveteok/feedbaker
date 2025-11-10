"use client";

import { useState } from "react";
import { cn, SectionContent, TableHolder, Title } from "../Ui";
import { SvgCopyClipboard } from "../Svg";

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
    fg: "#000000",
  },
  style3: {
    id: "style3",
    bg: "#000000",
    fg: "#ffffff",
  },
  style4: {
    id: "style4",
    bg: "#ffff22",
    fg: "#008800",
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
    WidgetInstructionsColors.style4,
  ];

  const scriptTxt = `<script src="${src}" data-site="${site_id}" data-bg="${state.bg}" data-fg="${state.fg}"></script>`;

  return (
    <>
      <Title>Widget Instructions</Title>
      <SectionContent>
        <TableHolder className="bg-gray-50">
          <div className="p-6 text-smxxx text-sky-800 pb-0 italic">
            <b>Copy the Code</b>
            <br /> Copy the provided widget code snippet and paste it at the
            bottom of your webpage’s HTML, just before the closing BODY tag.
            <br />
            <br />
            <b>Validate the data-site Attribute</b>
            <br /> Ensure the data-site attribute is correctly set to match your
            site’s unique identifier.
            <br />
            <br />
            <b>Customize the Appearance (Optional)</b>
            <br /> Adjust the data-bg attribute to change the widget’s
            background color. <br />
            Adjust the data-fg attribute to change the widget’s foreground
            (text/icon) color. <br />
            Use the predefined color schemes below for quick customization.
            <br />
            <br />
            <b>Save and Test</b>
            <br /> Save your changes and refresh your webpage to see the widget
            in action. You’ll find the widget button in the bottom right corner
            of your site.
          </div>
          <div className="bg-white m-4 ring-2 ring-gray-200">
            <div className="flex justify-between bg-gray-200 p-4 text-xs">
              HTML
              <button
                onClick={(e) => {
                  e.preventDefault();
                  navigator.clipboard.writeText(scriptTxt);
                  const oldHtml = e.currentTarget.innerHTML;
                  const element = e.currentTarget;
                  element.innerHTML = "Copied";
                  element.disabled = true;
                  setTimeout(() => {
                    element.disabled = false;
                    element.innerHTML = oldHtml;
                  }, 1000);
                }}
                className="flex gap-1 cursor-pointer not-disabled:hover:text-sky-500
                disabled:opacity-50"
              >
                <div className="flex gap-1">
                  <SvgCopyClipboard />
                  Copy
                </div>
              </button>
            </div>
            <code className="p-4 block overflow-auto">{scriptTxt}</code>
          </div>
        </TableHolder>
        <TableHolder className="bg-sky-100 overflow-auto p-4x">
          <div className="flex justify-between xbg-amber-100">
            {colorStyles.map((colorStyle) => (
              <button
                className={cn(
                  "p-4 flex-1 text-xs cursor-pointer flex justify-center opacity-50",
                  colorStyle === state &&
                    "bg-white ring-sky-200 ring-4 opacity-100"
                )}
                onClick={(e) => {
                  e.preventDefault();
                  setState(colorStyle);
                }}
                key={colorStyle.id}
              >
                <div
                  className="border-2 p-2 flex flex-col gap-1 rounded-md shadow-lg w-fit"
                  style={{
                    background: colorStyle.bg,
                    borderColor: colorStyle.fg,
                  }}
                >
                  <div
                    className="p-1 text-xs"
                    style={{
                      background: colorStyle.bg,
                      color: colorStyle.fg,
                    }}
                  >
                    Feedback
                  </div>
                  <div
                    className="border-2 p-1 rounded-sm"
                    style={{
                      background: "#ffffffdd",
                      borderColor: colorStyle.fg,
                    }}
                  ></div>
                  <div
                    className="border-2 p-1 rounded-sm"
                    style={{
                      background: "#ffffffdd",
                      borderColor: colorStyle.fg,
                    }}
                  ></div>
                  <div className="flex gap-1">
                    <div
                      className="flex-1 border-2 border-black/50 bg-black/10 p-1 rounded-sm"
                      style={{
                        background: colorStyle.bg,
                        borderColor: colorStyle.fg,
                        opacity: 0.75,
                      }}
                    ></div>
                    <div
                      className="flex-1 border-2 border-black/50 bg-black/10 p-1 rounded-sm"
                      style={{
                        background: colorStyle.bg,
                        borderColor: colorStyle.fg,
                        opacity: 0.75,
                      }}
                    ></div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </TableHolder>
      </SectionContent>
    </>
  );
};

export default WidgetInstructions;
