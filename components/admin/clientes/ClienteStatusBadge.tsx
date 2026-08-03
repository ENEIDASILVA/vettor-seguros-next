type ClienteStatusBadgeProps = {
  ativo: boolean;
};

export default function ClienteStatusBadge({
  ativo,
}: ClienteStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
        ativo
          ? "bg-emerald-100 text-emerald-700"
          : "bg-slate-200 text-slate-600"
      }`}
    >
      {ativo ? "Ativo" : "Inativo"}
    </span>
  );
}