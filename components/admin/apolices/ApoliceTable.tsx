"use client";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import type {
  ApoliceLista,
} from "@/lib/repositories/apolicesRepository";

import ApoliceActions from "./ApoliceActions";
import VigenciaBadge from "./VigenciaBadge";

type Props = {
  apolices: ApoliceLista[];
};

type SortKey =
  | "cliente"
  | "seguradora"
  | "seguro"
  | "apolice"
  | "vigencia";

type SortDirection =
  | "asc"
  | "desc";

function formatarData(
  data: string,
): string {
  const [ano, mes, dia] =
    data.split("-");

  if (!ano || !mes || !dia) {
    return "-";
  }

  return `${dia}/${mes}/${ano}`;
}

function compararTexto(
  a: string | null | undefined,
  b: string | null | undefined,
) {
  return String(a ?? "").localeCompare(
    String(b ?? ""),
    "pt-BR",
    {
      sensitivity: "base",
      numeric: true,
    },
  );
}

function valorOrdenacao(
  apolice: ApoliceLista,
  chave: SortKey,
) {
  switch (chave) {
    case "cliente":
      return apolice.cliente ?? "";

    case "seguradora":
      return apolice.seguradora ?? "";

    case "seguro":
      return apolice.tipoSeguro ?? "";

    case "apolice":
      return apolice.numeroApolice ?? "";

    case "vigencia":
      return apolice.fimVigencia ?? "";
  }
}

function CabecalhoOrdenavel({
  titulo,
  chave,
  chaveAtual,
  direcao,
  onOrdenar,
}: {
  titulo: string;
  chave: SortKey;
  chaveAtual: SortKey | null;
  direcao: SortDirection;
  onOrdenar: (chave: SortKey) => void;
}) {
  const ativo =
    chaveAtual === chave;

  return (
    <th className="px-3 py-4 text-left text-sm font-semibold text-slate-700">
      <button
        type="button"
        onClick={() =>
          onOrdenar(chave)
        }
        className="inline-flex items-center gap-1.5 rounded-md transition hover:text-[#0A2F5A] focus:outline-none focus:ring-2 focus:ring-[#0A2F5A]/20"
        title={`Ordenar por ${titulo}`}
      >
        <span>{titulo}</span>

        {!ativo ? (
          <ArrowUpDown
            size={14}
            className="text-slate-400"
          />
        ) : direcao === "asc" ? (
          <ArrowUp
            size={14}
            className="text-[#0A2F5A]"
          />
        ) : (
          <ArrowDown
            size={14}
            className="text-[#0A2F5A]"
          />
        )}
      </button>
    </th>
  );
}

export default function ApoliceTable({
  apolices,
}: Props) {
  const [sortKey, setSortKey] =
    useState<SortKey | null>(null);

  const [
    sortDirection,
    setSortDirection,
  ] =
    useState<SortDirection>("asc");

  function ordenar(
    chave: SortKey,
  ) {
    if (sortKey === chave) {
      setSortDirection(
        (atual) =>
          atual === "asc"
            ? "desc"
            : "asc",
      );

      return;
    }

    setSortKey(chave);
    setSortDirection("asc");
  }

  const apolicesOrdenadas =
    useMemo(() => {
      if (!sortKey) {
        return apolices;
      }

      return [...apolices].sort(
        (a, b) => {
          const resultado =
            compararTexto(
              String(
                valorOrdenacao(
                  a,
                  sortKey,
                ) ?? "",
              ),
              String(
                valorOrdenacao(
                  b,
                  sortKey,
                ) ?? "",
              ),
            );

          return sortDirection ===
            "asc"
            ? resultado
            : -resultado;
        },
      );
    }, [
      apolices,
      sortDirection,
      sortKey,
    ]);

  if (
    apolicesOrdenadas.length ===
    0
  ) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-lg font-semibold text-slate-700">
          Nenhuma apólice encontrada
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Não existem apólices para a pesquisa ou filtro selecionado.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-[24%]" />
          <col className="w-[18%]" />
          <col className="w-[10%]" />
          <col className="w-[17%]" />
          <col className="w-[20%]" />
          <col className="w-[11%]" />
        </colgroup>

        <thead className="bg-slate-50">
          <tr>
            <CabecalhoOrdenavel
              titulo="Cliente"
              chave="cliente"
              chaveAtual={sortKey}
              direcao={sortDirection}
              onOrdenar={ordenar}
            />

            <CabecalhoOrdenavel
              titulo="Seguradora"
              chave="seguradora"
              chaveAtual={sortKey}
              direcao={sortDirection}
              onOrdenar={ordenar}
            />

            <CabecalhoOrdenavel
              titulo="Seguro"
              chave="seguro"
              chaveAtual={sortKey}
              direcao={sortDirection}
              onOrdenar={ordenar}
            />

            <CabecalhoOrdenavel
              titulo="Apólice"
              chave="apolice"
              chaveAtual={sortKey}
              direcao={sortDirection}
              onOrdenar={ordenar}
            />

            <CabecalhoOrdenavel
              titulo="Vigência"
              chave="vigencia"
              chaveAtual={sortKey}
              direcao={sortDirection}
              onOrdenar={ordenar}
            />

            <th className="px-2 py-4 text-center text-sm font-semibold text-slate-700">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {apolicesOrdenadas.map(
            (apolice) => (
              <tr
                key={apolice.id}
                className="transition hover:bg-slate-50"
              >
                <td className="px-3 py-4 align-middle">
                  <div className="whitespace-normal break-words text-[13px] font-semibold leading-5 text-slate-800">
                    {apolice.cliente}
                  </div>
                </td>

                <td className="px-3 py-4 align-middle">
                  <div className="whitespace-normal break-words text-sm leading-5 text-slate-700">
                    {apolice.seguradora}
                  </div>
                </td>

                <td className="px-3 py-4 text-sm text-slate-700">
                  {apolice.tipoSeguro}
                </td>

                <td className="px-3 py-4">
                  <div className="break-all text-sm font-medium text-slate-700">
                    {apolice.numeroApolice}
                  </div>
                </td>

                <td className="px-3 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="whitespace-nowrap text-sm text-slate-700">
                      {formatarData(
                        apolice.fimVigencia,
                      )}
                    </span>

                    <VigenciaBadge
                      fimVigencia={
                        apolice.fimVigencia
                      }
                    />
                  </div>
                </td>

                <td className="px-2 py-4">
                  <ApoliceActions
                    id={apolice.id}
                  />
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}
