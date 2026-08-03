"use client";

import { Search } from "lucide-react";

type Props = {
  busca: string;
  setBusca: (valor: string) => void;
  filtro: string;
  setFiltro: (valor: string) => void;
};

const filtros = [
  {
    id: "todos",
    label: "Todas",
  },
  {
    id: "ativa",
    label: "Ativas",
  },
  {
    id: "vencendo",
    label: "Vencendo",
  },
  {
    id: "vencida",
    label: "Vencidas",
  },
];

export default function ApoliceFilters({
  busca,
  setBusca,
  filtro,
  setFiltro,
}: Props) {
  return (
    <div className="space-y-4">

      <div className="relative">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={busca}
          onChange={(e) =>
            setBusca(e.target.value)
          }
          placeholder="Pesquisar cliente, seguradora ou apólice..."
          className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-4 outline-none transition focus:border-[#0A2F5A] focus:ring-4 focus:ring-[#0A2F5A]/10"
        />
      </div>


      <div className="flex flex-wrap gap-2">

        {filtros.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              setFiltro(item.id)
            }
            className={`
              rounded-xl px-4 py-2 text-sm font-medium transition
              ${
                filtro === item.id
                  ? "bg-[#0A2F5A] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }
            `}
          >
            {item.label}
          </button>
        ))}

      </div>

    </div>
  );
}