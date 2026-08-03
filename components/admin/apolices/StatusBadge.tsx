type Props = {
  status: string;
};

export default function StatusBadge({
  status,
}: Props) {
  const value = status.toLowerCase();

  let classes =
    "bg-slate-100 text-slate-700";

  if (value.includes("ativa")) {
    classes =
      "bg-emerald-100 text-emerald-700";
  }

  if (value.includes("renovar")) {
    classes =
      "bg-amber-100 text-amber-700";
  }

  if (
    value.includes("cancel") ||
    value.includes("expir")
  ) {
    classes =
      "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${classes}`}
    >
      {status}
    </span>
  );
}