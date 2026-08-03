import type {
  InputHTMLAttributes,
} from "react";

import FormField from "./FormField";
import {
  baseFieldClassName,
  errorFieldClassName,
} from "./fieldStyles";

type MoneyFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "type"
> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
};

export default function MoneyField({
  id,
  label,
  required,
  error,
  helperText,
  className = "",
  min = 0,
  step = "0.01",
  ...inputProps
}: MoneyFieldProps) {
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
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500">
          R$
        </span>

        <input
          {...inputProps}
          id={id}
          type="number"
          inputMode="decimal"
          required={required}
          min={min}
          step={step}
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={`${baseFieldClassName} pl-11 ${
            error ? errorFieldClassName : ""
          } ${className}`}
        />
      </div>
    </FormField>
  );
}