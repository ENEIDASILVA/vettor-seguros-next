type Props = {
  status: string;
};

const colors: Record<string, string> = {
  VIGENTE:
    "bg-emerald-100 text-emerald-700",

  CANCELADA:
    "bg-red-100 text-red-700",

  ENCERRADA:
    "bg-slate-100 text-slate-700",
};

export default function ApoliceStatusBadge({
  status,
}: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${
        colors[status] ??
        "bg-slate-100 text-slate-700"
      }`}
    >
      {status}
    </span>
  );
}