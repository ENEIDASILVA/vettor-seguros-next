type Variant =
  | "success"
  | "danger"
  | "warning"
  | "info"
  | "neutral";

type Props = {
  label: string;
  variant?: Variant;
};

const variants: Record<Variant, string> = {
  success:
    "bg-emerald-100 text-emerald-700 border border-emerald-200",

  danger:
    "bg-red-100 text-red-700 border border-red-200",

  warning:
    "bg-amber-100 text-amber-700 border border-amber-200",

  info:
    "bg-blue-100 text-blue-700 border border-blue-200",

  neutral:
    "bg-slate-100 text-slate-700 border border-slate-200",
};

export default function StatusBadge({
  label,
  variant = "neutral",
}: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]}`}
    >
      {label}
    </span>
  );
}