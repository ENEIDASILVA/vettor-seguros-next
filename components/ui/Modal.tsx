"use client";

import { ReactNode, useEffect } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
  size?: "sm" | "md" | "lg";
}

export default function Modal({
  open,
  title,
  children,
  onClose,
  size = "md",
}: ModalProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  let widthClass = "max-w-xl";

  if (size === "sm") {
    widthClass = "max-w-md";
  }

  if (size === "lg") {
    widthClass = "max-w-3xl";
  }

  const modalClasses =
    "w-full rounded-2xl bg-white shadow-2xl " + widthClass;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className={modalClasses}>
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-bold text-blue-900">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="text-2xl font-bold text-gray-500 transition hover:text-red-600"
          >
            ×
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}