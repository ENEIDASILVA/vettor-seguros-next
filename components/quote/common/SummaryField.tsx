interface SummaryFieldProps {
  label: string;
  value?: string;
}

export default function SummaryField({
  label,
  value = "",
}: SummaryFieldProps) {
  const displayValue =
    value.trim() !== "" ? value : "Não informado";

  return (
    <div className="grid gap-1 border-b border-gray-100 py-2 last:border-b-0 sm:grid-cols-[180px_1fr]">
      <span className="font-semibold text-gray-600">
        {label}
      </span>

      <span className="break-words text-gray-900">
        {displayValue}
      </span>
    </div>
  );
}