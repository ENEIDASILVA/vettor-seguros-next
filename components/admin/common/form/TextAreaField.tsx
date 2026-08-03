import type {
  TextareaHTMLAttributes,
} from "react";

import FormField from "./FormField";
import {
  baseFieldClassName,
  errorFieldClassName,
} from "./fieldStyles";

type TextAreaFieldProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "id"
> & {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
};

export default function TextAreaField({
  id,
  label,
  required,
  error,
  helperText,
  className = "",
  rows = 5,
  ...textareaProps
}: TextAreaFieldProps) {
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
      <textarea
        {...textareaProps}
        id={id}
        rows={rows}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`${baseFieldClassName} resize-y ${
          error ? errorFieldClassName : ""
        } ${className}`}
      />
    </FormField>
  );
}