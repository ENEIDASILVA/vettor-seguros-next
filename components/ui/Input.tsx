"use client";

import {
  cepMask,
  cpfMask,
  dateMask,
  phoneMask,
} from "../quote/utils/masks";

type MaskType = "cpf" | "cep" | "phone" | "date";

interface InputProps {
  label: string;
  placeholder?: string;
  value: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  maxLength?: number;
  mask?: MaskType;
  onChange: (value: string) => void;
}

export default function Input({
  label,
  placeholder = "",
  value,
  type = "text",
  required = false,
  disabled = false,
  error = "",
  helperText = "",
  maxLength,
  mask,
  onChange,
}: InputProps) {
  const hasError = error.trim() !== "";

  const errorId = label + "-error";
  const helperId = label + "-helper";

  function applyMask(inputValue: string) {
    if (mask === "cpf") {
      return cpfMask(inputValue);
    }

    if (mask === "cep") {
      return cepMask(inputValue);
    }

    if (mask === "phone") {
      return phoneMask(inputValue);
    }

    if (mask === "date") {
      return dateMask(inputValue);
    }

    return inputValue;
  }

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

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={hasError}
        aria-describedby={
          hasError
            ? errorId
            : helperText
            ? helperId
            : undefined
        }
        onChange={(event) =>
          onChange(applyMask(event.target.value))
        }
        className={
          hasError
            ? "w-full rounded-xl border-2 border-red-500 px-4 py-3 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-gray-100"
            : "w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-900 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-gray-100"
        }
      />

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