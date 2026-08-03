import type {
  InputHTMLAttributes,
} from "react";

type CheckboxFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "id" | "type"
> & {
  id: string;
  label: string;
  description?: string;
  error?: string;
};

export default function CheckboxField({
  id,
  label,
  description,
  error,
  className = "",
  ...inputProps
}: CheckboxFieldProps) {
  const descriptionId =
    description || error
      ? `${id}-description`
      : undefined;

  return (
    <div>
      <label
        htmlFor={id}
        className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50"
      >
        <input
          {...inputProps}
          id={id}
          type="checkbox"
          aria-invalid={Boolean(error)}
          aria-describedby={descriptionId}
          className={`mt-1 h-4 w-4 rounded border-slate-300 text-[#0A2F5A] focus:ring-[#0A2F5A] ${className}`}
        />

        <span>
          <span className="block font-semibold text-slate-700">
            {label}
          </span>

          {description && (
            <span
              id={descriptionId}
              className="mt-1 block text-sm text-slate-500"
            >
              {description}
            </span>
          )}
        </span>
      </label>

      {error && (
        <p
          id={descriptionId}
          role="alert"
          className="mt-2 text-sm font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}