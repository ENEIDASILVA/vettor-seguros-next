import type {
  InputHTMLAttributes,
} from "react";

import FormField from "./FormField";
import {
  baseFieldClassName,
  errorFieldClassName,
} from "./fieldStyles";

type TextFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id"
> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
};

export default function TextField({
  id,
  label,
  required,
  error,
  helperText,
  className = "",
  ...inputProps
}: TextFieldProps) {
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