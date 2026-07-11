import { ReactNode } from "react";

type Variant =
  | "primary"
  | "secondary"
  | "whatsapp"
  | "outline";

interface ButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  className?: string;
  target?: "_blank" | "_self";
  type?: "button" | "submit";
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  ariaLabel?: string;
}

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  target = "_self",
  type = "button",
  disabled = false,
  loading = false,
  loadingText = "Carregando...",
  ariaLabel,
}: ButtonProps) {
  const variants: Record<Variant, string> = {
    primary:
      "bg-blue-900 text-white hover:bg-blue-800 focus-visible:ring-blue-300",

    secondary:
      "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-300",

    whatsapp:
      "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-300",

    outline:
      "border-2 border-blue-900 bg-transparent text-blue-900 hover:bg-blue-900 hover:text-white focus-visible:ring-blue-300",
  };

  const unavailable = disabled || loading;

  const baseClasses =
    "inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-4";

  const stateClasses = unavailable
    ? "cursor-not-allowed opacity-50"
    : "cursor-pointer";

  const classes =
    baseClasses +
    " " +
    variants[variant] +
    " " +
    stateClasses +
    " " +
    className;

  const content = loading ? (
    <>
      <span
        aria-hidden="true"
        className="h-5 w-5 animate-spin rounded-full border-2 border-current border-r-transparent"
      />

      <span>{loadingText}</span>
    </>
  ) : (
    children
  );

  if (href && !unavailable) {
    return (
      <a
        href={href}
        target={target}
        rel={
          target === "_blank"
            ? "noopener noreferrer"
            : undefined
        }
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={unavailable}
      className={classes}
      aria-label={ariaLabel}
      aria-busy={loading}
    >
      {content}
    </button>
  );
}