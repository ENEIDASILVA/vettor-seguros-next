import type {
  InputHTMLAttributes,
} from "react";

import FormField from "./FormField";
import {
  baseFieldClassName,
  errorFieldClassName,
} from "./fieldStyles";

type PercentageFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "type"
> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
};

export default function PercentageField({
  id,
  label,
  required,
  error,
  helperText,
  className = "",
  min = 0,
  max = 100,
  step = "0.01",
  ...inputProps
}: PercentageFieldProps) {
  const descriptionId =
    error || helperText
      ? `${id}-description`
      : undefined;

  return (
    <FormField
      id={id}
      label={label}
      required={required}
      error={error}
      helperText={helperText}
    >
      <div className="relative">
        <input
          {...inputProps}
          id={id}
          type="number"
          inputMode="decimal"
          required={required}
          min={min}
          max={max}
          step={step}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={`${baseFieldClassName} pr-11 ${
            error ? errorFieldClassName : ""
          } ${className}`}
        />

        <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-medium text-slate-500">
          %
        </span>
      </div>
    </FormField>
  );
}