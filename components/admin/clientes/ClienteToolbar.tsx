"use client";

import { Search } from "lucide-react";

type Props = {
  pesquisa: string;
  onPesquisaChange: (valor: string) => void;

  filtro: "todos" | "ativos" | "inativos";
  onFiltroChange: (
    valor: "todos" | "ativos" | "inativos"
  ) => void;
};

export default function ClienteToolbar({
  pesquisa,
  onPesquisaChange,
  filtro,
  onFiltroChange,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="relative w-full lg:max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            value={pesquisa}
            onChange={(e) =>
              onPesquisaChange(e.target.value)
            }
            placeholder="Buscar cliente..."
            className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none transition focus:border-[#0A2F5A] focus:ring-4 focus:ring-[#0A2F5A]/10"
          />
        </div>

        <div className="flex gap-2">

          {[
            ["todos", "Todos"],
            ["ativos", "Ativos"],
            ["inativos", "Inativos"],
          ].map(([valor, texto]) => (
            <button
              key={valor}
              type="button"
              onClick={() =>
                onFiltroChange(
                  valor as
                    | "todos"
                    | "ativos"
                    | "inativos"
                )
              }
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                filtro === valor
                  ? "bg-[#0A2F5A] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {texto}
            </button>
          ))}

        </div>

      </div>
    </div>
  );
}