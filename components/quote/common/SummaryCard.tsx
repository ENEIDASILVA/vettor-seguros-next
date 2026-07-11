import { ReactNode } from "react";
import { CheckCircle2, Pencil } from "lucide-react";

interface SummaryCardProps {
  title: string;
  children: ReactNode;
  onEdit?: () => void;
  complete?: boolean;
}

export default function SummaryCard({
  title,
  children,
  onEdit,
  complete = true,
}: SummaryCardProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-gray-100 bg-gray-50 px-6 py-4">
        <div className="flex items-center gap-3">
          <CheckCircle2
            size={22}
            className={complete ? "text-green-600" : "text-amber-500"}
          />

          <h3 className="text-lg font-bold text-blue-900">
            {title}
          </h3>
        </div>

        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-blue-900 transition hover:bg-blue-100"
          >
            <Pencil size={16} />
            Editar
          </button>
        )}
      </div>

      <div className="space-y-2 px-6 py-5 text-gray-700">
        {children}
      </div>
    </section>
  );
}