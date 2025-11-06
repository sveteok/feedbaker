"use client";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";

type ModalDialogProps = {
  readonly children: React.ReactNode;
  onClose: () => void;
};

export default dynamic(
  () =>
    Promise.resolve(function Modal({ children, onClose }: ModalDialogProps) {
      if (typeof window === "undefined") return null;

      return createPortal(
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={onClose}
        >
          <div
            className="bg-white p-4 rounded"
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </div>
        </div>,
        document.body
      );
    }),
  { ssr: false }
);
