import type {
  InputHTMLAttributes,
} from "react";

import FormField from "./FormField";
import {
  baseFieldClassName,
  errorFieldClassName,
} from "./fieldStyles";

type DateFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "type"
> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
};

export default function DateField({
  id,
  label,
  required,
  error,
  helperText,
  className = "",
  ...inputProps
}: DateFieldProps) {
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
      <input
        {...inputProps}
        id={id}
        type="date"
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`${baseFieldClassName} ${
          error ? errorFieldClassName : ""
        } ${className}`}
      />
    </FormField>
  );
}