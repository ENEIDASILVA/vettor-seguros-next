import type {
  SelectHTMLAttributes,
} from "react";

import FormField from "./FormField";
import {
  baseFieldClassName,
  errorFieldClassName,
} from "./fieldStyles";

export type SelectOption = {
  value: string | number;
  label: string;
  disabled?: boolean;
};

type SelectFieldProps = Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  "id" | "children"
> & {
  id: string;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  helperText?: string;
};

export default function SelectField({
  id,
  label,
  options,
  placeholder = "Selecione...",
  required,
  error,
  helperText,
  className = "",
  ...selectProps
}: SelectFieldProps) {
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
      <select
        {...selectProps}
        id={id}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={descriptionId}
        className={`${baseFieldClassName} ${
          error ? errorFieldClassName : ""
        } ${className}`}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={String(option.value)}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}