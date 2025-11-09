"use client";
import dynamic from "next/dynamic";
import { KeyboardEvent, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ModalDialogProps = {
  readonly children: React.ReactNode;
  onClose: () => void;
};

export default dynamic(
  () =>
    Promise.resolve(function Modal({ children, onClose }: ModalDialogProps) {
      const modal = useRef<HTMLDivElement>(null);

      useEffect(() => {
        if (modal.current) {
          // Focus the first focusable element inside the modal
          const focusableElements = modal.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
          }
        }
      }, []);

      const handleTabKey = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key !== "Tab") return;

        const focusableElements = modal.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (event.shiftKey && document.activeElement === firstElement) {
          // Shift + Tab on first element: move focus to last
          lastElement.focus();
          event.preventDefault();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          // Tab on last element: move focus to first
          firstElement.focus();
          event.preventDefault();
        }
      };

      if (typeof window === "undefined") return null;

      return createPortal(
        <div
          ref={modal}
          className="fixed z-50 inset-0 bg-black/50 flex items-center justify-center"
          onClick={onClose}
          onKeyDown={handleTabKey}
        >
          <div
            className="bg-white p-4 rounded max-w-lg m-8  shadow-lg shadow-black/30"
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
