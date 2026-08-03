import type { ReactNode } from "react";

type FormFieldProps = {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: ReactNode;
  className?: string;
};

export default function FormField({
  id,
  label,
  required = false,
  error,
  helperText,
  children,
  className = "",
}: FormFieldProps) {
  const descriptionId =
    error || helperText
      ? `${id}-description`
      : undefined;

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span
            className="ml-1 text-red-600"
            aria-hidden="true"
          >
            *
          </span>
        )}
      </label>

      <div className="mt-2">
        {children}
      </div>

      {(error || helperText) && (
        <p
          id={descriptionId}
          role={error ? "alert" : undefined}
          className={`mt-2 text-sm ${
            error
              ? "font-medium text-red-600"
              : "text-slate-500"
          }`}
        >
          {error ?? helperText}
        </p>
      )}
    </div>
  );
}