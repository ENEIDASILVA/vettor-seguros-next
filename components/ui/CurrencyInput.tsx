"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useMemo,
  useState,
} from "react";

type CurrencyInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> & {
  value: number | null;

  onValueChange: (
    value: number | null,
  ) => void;

  decimals?: number;

  allowNegative?: boolean;
};

function formatCurrency(
  value: number | null,
  decimals: number,
) {
  if (
    value === null ||
    Number.isNaN(value)
  ) {
    return "";
  }

  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits:
        decimals,
      maximumFractionDigits:
        decimals,
    },
  ).format(value);
}

function parseCurrency(
  text: string,
  decimals: number,
  allowNegative: boolean,
) {
  if (
    text.trim() === ""
  ) {
    return null;
  }

  let negative = false;

  if (
    allowNegative &&
    text.includes("-")
  ) {
    negative = true;
  }

  const digits =
    text.replace(
      /\D/g,
      "",
    );

  if (
    digits.length === 0
  ) {
    return null;
  }

  let value =
    Number(digits) /
    Math.pow(
      10,
      decimals,
    );

  if (
    negative
  ) {
    value *= -1;
  }

  return value;
}

export default forwardRef<
  HTMLInputElement,
  CurrencyInputProps
>(
  function CurrencyInput(
    {
      value,

      onValueChange,

      decimals = 2,

      allowNegative = false,

      className,

      onBlur,

      onFocus,

      ...props
    },
    ref,
  ) {
    const formattedValue =
      useMemo(
        () =>
          formatCurrency(
            value,
            decimals,
          ),
        [
          value,
          decimals,
        ],
      );

    const [
      displayValue,
      setDisplayValue,
    ] =
      useState(
        formattedValue,
      );

    useEffect(
      () => {
        setDisplayValue(
          formattedValue,
        );
      },
      [
        formattedValue,
      ],
    );

    function handleChange(
      event: React.ChangeEvent<HTMLInputElement>,
    ) {
      const raw =
        event.target.value;

      const parsed =
        parseCurrency(
          raw,
          decimals,
          allowNegative,
        );

      onValueChange(
        parsed,
      );

      setDisplayValue(
        formatCurrency(
          parsed,
          decimals,
        ),
      );
    }

    function handleBlur(
      event: React.FocusEvent<HTMLInputElement>,
    ) {
      setDisplayValue(
        formatCurrency(
          value,
          decimals,
        ),
      );

      onBlur?.(event);
    }

    function handleFocus(
      event: React.FocusEvent<HTMLInputElement>,
    ) {
      onFocus?.(event);
    }

        return (
      <input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onFocus={handleFocus}
        className={
          className ??
          "w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
        }
      />
    );
  },
);