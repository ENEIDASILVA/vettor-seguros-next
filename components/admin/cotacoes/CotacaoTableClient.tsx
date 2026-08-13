"use client";

import Link from "next/link";

import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Search,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import CotacaoActions from "./CotacaoActions";
import CotacaoStatusBadge from "./CotacaoStatusBadge";

type Cotacao = {
  id: string;
  cliente_id: string;
  origem?: string | null;
  created_at: string;
  quantidadeCotacoesSeguradoras: number;

  cliente?: {
    nome?: string | null;
  } | null;

  tipo_seguro?: {
    nome?: string | null;
  } | null;

  status?: {
    nome?: string | null;
  } | null;
};

type Props = {
  cotacoes: Cotacao[];
};

type SortKey =
  | "cliente"
  | "seguro"
  | "status"
  | "origem"
  | "created_at"
  | "cotacoes";

type SortDirection =
  | "asc"
  | "desc";

function normalizar(
  valor:
    | string
    | null
    | undefined,
) {
  return String(
    valor ?? "",
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLocaleLowerCase(
      "pt-BR",
    )
    .trim();
}

function compararTexto(
  a:
    | string
    | null
    | undefined,
  b:
    | string
    | null
    | undefined,
) {
  return String(
    a ?? "",
  ).localeCompare(
    String(
      b ?? "",
    ),
    "pt-BR",
    {
      sensitivity:
        "base",
      numeric:
        true,
    },
  );
}

function valorOrdenacao(
  cotacao: Cotacao,
  chave: SortKey,
) {
  switch (chave) {
    case "cliente":
      return (
        cotacao.cliente
          ?.nome ??
        ""
      );

    case "seguro":
      return (
        cotacao.tipo_seguro
          ?.nome ??
        ""
      );

    case "status":
      return (
        cotacao.status
          ?.nome ??
        ""
      );

    case "origem":
      return (
        cotacao.origem ??
        ""
      );

    case "created_at":
      return new Date(
        cotacao.created_at,
      ).getTime();

    case "cotacoes":
      return Number(
        cotacao.quantidadeCotacoesSeguradoras ??
          0,
      );
  }
}

function CabecalhoOrdenavel({
  titulo,
  chave,
  chaveAtual,
  direcao,
  onOrdenar,
  className = "",
}: {
  titulo: string;
  chave: SortKey;
  chaveAtual: SortKey;
  direcao: SortDirection;
  onOrdenar:
    (chave: SortKey) => void;
  className?: string;
}) {
  const ativo =
    chaveAtual ===
    chave;

  return (
    <th
      className={`px-5 py-3 text-left text-sm font-semibold text-slate-700 ${className}`}
    >
      <button
        type="button"
        onClick={() =>
          onOrdenar(chave)
        }
        className="inline-flex items-center gap-1.5 rounded-md transition hover:text-[#0A2F5A] focus:outline-none focus:ring-2 focus:ring-[#0A2F5A]/20"
        title={`Ordenar por ${titulo}`}
      >
        <span>
          {titulo}
        </span>

        {!ativo ? (
          <ArrowUpDown
            size={14}
            className="text-slate-400"
          />
        ) : direcao ===
          "asc" ? (
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

export default function CotacaoTableClient({
  cotacoes,
}: Props) {
  const [
    busca,
    setBusca,
  ] =
    useState("");

  /*
   * A listagem já chega normalmente
   * com as cotações mais recentes primeiro.
   * Mantemos "Criada em / decrescente"
   * como ordenação inicial explícita.
   */
  const [
    sortKey,
    setSortKey,
  ] =
    useState<SortKey>(
      "created_at",
    );

  const [
    sortDirection,
    setSortDirection,
  ] =
    useState<SortDirection>(
      "desc",
    );

  function ordenar(
    chave: SortKey,
  ) {
    if (
      sortKey ===
      chave
    ) {
      setSortDirection(
        (
          atual,
        ) =>
          atual ===
          "asc"
            ? "desc"
            : "asc",
      );

      return;
    }

    setSortKey(
      chave,
    );

    setSortDirection(
      chave ===
        "created_at"
        ? "desc"
        : "asc",
    );
  }

  const cotacoesExibidas =
    useMemo(
      () => {
        const termo =
          normalizar(
            busca,
          );

        const filtradas =
          !termo
            ? [
                ...cotacoes,
              ]
            : cotacoes.filter(
                (
                  cotacao,
                ) =>
                  normalizar(
                    cotacao
                      .cliente
                      ?.nome,
                  ).includes(
                    termo,
                  ),
              );

        filtradas.sort(
          (
            a,
            b,
          ) => {
            const valorA =
              valorOrdenacao(
                a,
                sortKey,
              );

            const valorB =
              valorOrdenacao(
                b,
                sortKey,
              );

            let resultado =
              0;

            if (
              typeof valorA ===
                "number" &&
              typeof valorB ===
                "number"
            ) {
              resultado =
                valorA -
                valorB;
            } else {
              resultado =
                compararTexto(
                  String(
                    valorA ??
                      "",
                  ),
                  String(
                    valorB ??
                      "",
                  ),
                );
            }

            return sortDirection ===
              "asc"
              ? resultado
              : -resultado;
          },
        );

        return filtradas;
      },
      [
        busca,
        cotacoes,
        sortDirection,
        sortKey,
      ],
    );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search
          size={19}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="search"
          value={
            busca
          }
          onChange={(
            event,
          ) =>
            setBusca(
              event.target
                .value,
            )
          }
          placeholder="Pesquisar cliente..."
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0A2F5A] focus:ring-4 focus:ring-[#0A2F5A]/10"
        />
      </div>

      {cotacoesExibidas.length ===
      0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-700">
            Nenhuma cotação encontrada.
          </p>

          {busca && (
            <p className="mt-1 text-sm text-slate-500">
              Nenhum cliente corresponde a “
              {busca}
              ”.
            </p>
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr>
                  <CabecalhoOrdenavel
                    titulo="Cliente"
                    chave="cliente"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                  />

                  <CabecalhoOrdenavel
                    titulo="Seguro"
                    chave="seguro"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                  />

                  <CabecalhoOrdenavel
                    titulo="Status"
                    chave="status"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                  />

                  <CabecalhoOrdenavel
                    titulo="Origem"
                    chave="origem"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                  />

                  <CabecalhoOrdenavel
                    titulo="Criada em"
                    chave="created_at"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                  />

                  <CabecalhoOrdenavel
                    titulo="Cotações"
                    chave="cotacoes"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="text-center"
                  />

                  <th className="px-5 py-3 text-center text-sm font-semibold text-slate-700">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {cotacoesExibidas.map(
                  (
                    cotacao,
                  ) => (
                    <tr
                      key={
                        cotacao.id
                      }
                      className="transition hover:bg-slate-50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/clientes/${cotacao.cliente_id}`}
                          className="font-medium text-slate-700 hover:text-[#0A2F5A]"
                        >
                          {cotacao
                            .cliente
                            ?.nome ??
                            "-"}
                        </Link>
                      </td>

                      <td className="px-5 py-4">
                        {cotacao
                          .tipo_seguro
                          ?.nome ??
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        <CotacaoStatusBadge
                          status={
                            cotacao
                              .status
                              ?.nome ??
                            ""
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        {cotacao.origem ??
                          "-"}
                      </td>

                      <td className="px-5 py-4">
                        {new Date(
                          cotacao.created_at,
                        ).toLocaleDateString(
                          "pt-BR",
                        )}
                      </td>

                      <td className="px-5 py-4 text-center">
                        <Link
                          href={`/admin/cotacoes/${cotacao.id}/seguradoras`}
                          className="inline-flex min-w-8 items-center justify-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-[#0A2F5A] transition hover:bg-blue-100"
                        >
                          {
                            cotacao.quantidadeCotacoesSeguradoras
                          }
                        </Link>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <CotacaoActions
                          id={
                            cotacao.id
                          }
                        />
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-right text-xs text-slate-500">
        {cotacoesExibidas.length} de{" "}
        {cotacoes.length} cotação
        {cotacoes.length !==
        1
          ? "ões"
          : ""}
      </div>
    </div>
  );
}
