"use client";

import { ReactNode } from "react";
import OptionCard from "./OptionCard";

interface Option {
  label: string;
  value: string;
  description?: string;
  icon?: ReactNode;
  disabled?: boolean;
}

interface OptionGroupProps {
  label: string;
  value: string;
  options: Option[];
  required?: boolean;
  error?: string;
  helperText?: string;
  columns?: 1 | 2 | 3;
  onChange: (value: string) => void;
}

export default function OptionGroup({
  label,
  value,
  options,
  required = false,
  error = "",
  helperText = "",
  columns = 2,
  onChange,
}: OptionGroupProps) {
  const hasError = error.trim() !== "";

  let gridClasses = "grid gap-4";

  if (columns === 2) {
    gridClasses += " md:grid-cols-2";
  }

  if (columns === 3) {
    gridClasses += " md:grid-cols-2 lg:grid-cols-3";
  }

  return (
    <div className="mb-6">
      <div className="mb-3">
        <span className="font-semibold text-blue-900">
          {label}

          {required && (
            <span className="ml-1 text-red-600">
              *
            </span>
          )}
        </span>
      </div>

      <div
        role="radiogroup"
        aria-label={label}
        aria-invalid={hasError}
        className={gridClasses}
      >
        {options.map((option) => (
          <div
            key={option.value}
            role="radio"
            aria-checked={value === option.value}
          >
            <OptionCard
              title={option.label}
              description={option.description}
              icon={option.icon}
              selected={value === option.value}
              disabled={option.disabled}
              onClick={() => onChange(option.value)}
            />
          </div>
        ))}
      </div>

      {helperText && !hasError && (
        <p className="mt-2 text-sm text-gray-500">
          {helperText}
        </p>
      )}

      {hasError && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}