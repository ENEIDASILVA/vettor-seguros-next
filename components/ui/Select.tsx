"use client";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  label: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  onChange: (value: string) => void;
}

export default function Select({
  label,
  value,
  options,
  placeholder = "Selecione...",
  required = false,
  disabled = false,
  error = "",
  helperText = "",
  onChange,
}: SelectProps) {
  const hasError = error.trim() !== "";

  const errorId = label + "-error";
  const helperId = label + "-helper";

  return (
    <div className="mb-6">
      <label className="mb-2 block font-semibold text-blue-900">
        {label}

        {required && (
          <span className="ml-1 text-red-600">
            *
          </span>
        )}
      </label>

      <select
        value={value}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={
          hasError
            ? errorId
            : helperText
            ? helperId
            : undefined
        }
        onChange={(event) =>
          onChange(event.target.value)
        }
        className={
          hasError
            ? "w-full rounded-xl border-2 border-red-500 bg-white px-4 py-3 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            : "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        }
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {helperText && !hasError && (
        <p
          id={helperId}
          className="mt-2 text-sm text-gray-500"
        >
          {helperText}
        </p>
      )}

      {hasError && (
        <p
          id={errorId}
          className="mt-2 text-sm font-medium text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  );
}