"use client";

import {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useRef,
} from "react";

type Props = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  | "value"
  | "onChange"
  | "type"
> & {
  value: number | null;

  onValueChange: (
    value: number | null,
  ) => void;

  decimals?: number;

  min?: number;

  max?: number;
};

function formatPercent(
  value: number | null,
  decimals: number,
) {
  if (
    value === null ||
    Number.isNaN(value)
  ) {
    return "";
  }

  return (
    value.toLocaleString(
      "pt-BR",
      {
        minimumFractionDigits:
          decimals,
        maximumFractionDigits:
          decimals,
      },
    ) + "%"
  );
}

function parsePercent(
  text: string,
  decimals: number,
) {
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

  return (
    Number(digits) /
    Math.pow(
      10,
      decimals,
    )
  );
}

export default forwardRef<
  HTMLInputElement,
  Props
>(
  function PercentInput(
    {
      value,

      onValueChange,

      decimals = 2,

      min = 0,

      max = 100,

      className,

      onBlur,

      onFocus,

      ...props
    },
    ref,
  ) {
    const inputRef =
      useRef<HTMLInputElement>(
        null,
      );

    const mergedRef =
      (
        node: HTMLInputElement,
      ) => {
        inputRef.current =
          node;

        if (
          typeof ref ===
          "function"
        ) {
          ref(node);

          return;
        }

        if (ref) {
          (
            ref as React.MutableRefObject<HTMLInputElement | null>
          ).current =
            node;
        }
      };

    useEffect(() => {
      if (
        !inputRef.current
      ) {
        return;
      }

      const formatted =
        formatPercent(
          value,
          decimals,
        );

      if (
        inputRef.current
          .value !==
        formatted
      ) {
        inputRef.current.value =
          formatted;
      }
    }, [
      value,
      decimals,
    ]);

    function handleChange(
      e: React.ChangeEvent<HTMLInputElement>,
    ) {
      let parsed =
        parsePercent(
          e.target.value,
          decimals,
        );

      if (
        parsed !== null
      ) {
        if (
          parsed < min
        ) {
          parsed = min;
        }

        if (
          parsed > max
        ) {
          parsed = max;
        }
      }

      onValueChange(
        parsed,
      );

      requestAnimationFrame(
        () => {
          if (
            inputRef.current
          ) {
            const formatted =
              formatPercent(
                parsed,
                decimals,
              );

            inputRef.current.value =
              formatted;

            const end =
              formatted.length;

            inputRef.current.setSelectionRange(
              end,
              end,
            );
          }
        },
      );
    }

    function handleFocus(
      e: React.FocusEvent<HTMLInputElement>,
    ) {
      requestAnimationFrame(
        () => {
          if (
            inputRef.current
          ) {
            const end =
              inputRef.current
                .value.length;

            inputRef.current.setSelectionRange(
              end,
              end,
            );
          }
        },
      );

      onFocus?.(e);
    }

    function handleBlur(
      e: React.FocusEvent<HTMLInputElement>,
    ) {
      if (
        value === null
      ) {
        e.target.value =
          "";
      } else {
        e.target.value =
          formatPercent(
            value,
            decimals,
          );
      }

      onBlur?.(e);
    }

    return (
      <input
        {...props}
        ref={mergedRef}
        type="text"
        inputMode="decimal"
        autoComplete="off"
        className={
          className ??
          "w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
        }
        defaultValue={formatPercent(
          value,
          decimals,
        )}
        onChange={
          handleChange
        }
        onFocus={
          handleFocus
        }
        onBlur={
          handleBlur
        }
      />
    );
  },
);