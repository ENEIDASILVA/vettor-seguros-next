"use client";

import { ReactNode } from "react";

interface OptionCardProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  selected: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export default function OptionCard({
  title,
  description,
  icon,
  selected,
  disabled = false,
  onClick,
}: OptionCardProps) {
  const classes =
    selected
      ? "border-2 border-blue-900 bg-blue-50 shadow-md"
      : "border border-gray-300 bg-white hover:border-blue-400 hover:shadow-sm";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={selected}
      className={
        "flex w-full items-start gap-4 rounded-2xl p-5 text-left transition-all duration-200 " +
        classes +
        (disabled
          ? " cursor-not-allowed opacity-50"
          : " cursor-pointer")
      }
    >
      {icon && (
        <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-900">
          {icon}
        </div>
      )}

      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-blue-900">
            {title}
          </h3>

          {selected && (
            <span
              aria-hidden="true"
              className="text-lg font-bold text-blue-900"
            >
              ✓
            </span>
          )}
        </div>

        {description && (
          <p className="mt-1 text-sm text-gray-600">
            {description}
          </p>
        )}
      </div>
    </button>
  );
}