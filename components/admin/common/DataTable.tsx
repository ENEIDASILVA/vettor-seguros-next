import { ReactNode } from "react";

type Column = {
  key: string;
  title: string;
  className?: string;
};

type DataTableProps<T> = {
  columns: Column[];
  data: T[];
  renderRow: (item: T) => ReactNode;
  emptyState?: ReactNode;

  /**
   * Chave única da linha.
   * Se não informada, utiliza o índice.
   */
  getRowKey?: (item: T) => string | number;

  /**
   * Classe aplicada em cada <tr>.
   */
  rowClassName?: (item: T) => string;
};

export default function DataTable<T>({
  columns,
  data,
  renderRow,
  emptyState,
  getRowKey,
  rowClassName,
}: DataTableProps<T>) {
  if (data.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-5 py-3 text-left text-sm font-semibold text-slate-700 ${column.className ?? ""}`}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {data.map((item, index) => (
              <tr
                key={getRowKey ? getRowKey(item) : index}
                className={
                  rowClassName
                    ? rowClassName(item)
                    : "transition hover:bg-slate-50"
                }
              >
                {renderRow(item)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}