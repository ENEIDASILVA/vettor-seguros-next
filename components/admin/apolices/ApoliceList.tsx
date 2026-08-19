"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import ApoliceTable from "./ApoliceTable";

import type { ApoliceLista } from "@/lib/repositories/apolicesRepository";

type Props = {
  apolices: ApoliceLista[];
};

type Filtro =
  | "todos"
  | "vigente"
  | "vencendo"
  | "vencida";

function normalizar(
  valor: string | null | undefined,
) {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function diasAteVencimento(
  fimVigencia: string,
) {
  const hoje = new Date();

  hoje.setHours(0, 0, 0, 0);

  const [ano, mes, dia] =
    fimVigencia.split("-").map(Number);

  const vencimento =
    new Date(ano, mes - 1, dia);

  vencimento.setHours(0, 0, 0, 0);

  return Math.ceil(
    (vencimento.getTime() - hoje.getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

export default function ApoliceList({
  apolices,
}: Props) {
  const [busca, setBusca] =
    useState("");

  const [filtro, setFiltro] =
    useState<Filtro>("todos");

  const contadores =
    useMemo(() => {
      let vigente = 0;
      let vencendo = 0;
      let vencida = 0;

      for (const apolice of apolices) {
        const dias =
          diasAteVencimento(
            apolice.fimVigencia,
          );

        if (dias < 0) {
          vencida += 1;
        } else if (dias <= 30) {
          vencendo += 1;
        } else {
          vigente += 1;
        }
      }

      return {
        todos: apolices.length,
        vigente,
        vencendo,
        vencida,
      };
    }, [apolices]);

  const apolicesFiltradas =
    useMemo(() => {
      const termo =
        normalizar(busca);

      return apolices.filter(
        (apolice) => {
          const correspondeBusca =
            !termo ||
            normalizar(
              apolice.cliente,
            ).includes(termo) ||
            normalizar(
              apolice.seguradora,
            ).includes(termo) ||
            normalizar(
              apolice.numeroApolice,
            ).includes(termo) ||
            normalizar(
              apolice.tipoSeguro,
            ).includes(termo);

          if (!correspondeBusca) {
            return false;
          }

          const dias =
            diasAteVencimento(
              apolice.fimVigencia,
            );

          if (filtro === "vigente") {
            return dias > 30;
          }

          if (filtro === "vencendo") {
            return (
              dias >= 0 &&
              dias <= 30
            );
          }

          if (filtro === "vencida") {
            return dias < 0;
          }

          return true;
        },
      );
    }, [
      apolices,
      busca,
      filtro,
    ]);

  const filtros = [
    {
      chave: "todos" as const,
      titulo: "Todas",
      total: contadores.todos,
    },
    {
      chave: "vigente" as const,
      titulo: "Vigente",
      total: contadores.vigente,
    },
    {
      chave: "vencendo" as const,
      titulo: "Vencendo",
      total: contadores.vencendo,
    },
    {
      chave: "vencida" as const,
      titulo: "Vencidas",
      total: contadores.vencida,
    },
  ];

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search
            size={20}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            value={busca}
            onChange={(event) =>
              setBusca(event.target.value)
            }
            placeholder="Pesquisar cliente, seguradora ou apólice..."
            className="w-full rounded-xl border border-slate-200 bg-white py-3.5 pl-12 pr-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0A2F5A] focus:ring-4 focus:ring-[#0A2F5A]/10"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {filtros.map((item) => {
            const ativo =
              filtro === item.chave;

            return (
              <button
                key={item.chave}
                type="button"
                onClick={() =>
                  setFiltro(item.chave)
                }
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                  ativo
                    ? "bg-[#0A2F5A] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>{item.titulo}</span>

                <span
                  className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold ${
                    ativo
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-600"
                  }`}
                >
                  {item.total}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <ApoliceTable
        apolices={apolicesFiltradas}
      />
    </div>
  );
}
