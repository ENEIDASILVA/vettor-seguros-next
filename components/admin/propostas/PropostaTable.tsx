"use client";

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

import type {
  PropostaLista,
} from "@/lib/repositories/propostasRepository";

import PropostaActions from "./PropostaActions";

type Props = {
  propostas: PropostaLista[];
};

type SortKey =
  | "cliente"
  | "seguradoras"
  | "seguro"
  | "premio"
  | "situacao";

type SortDirection =
  | "asc"
  | "desc";

type FiltroSituacao =
  | "todas"
  | "elaboracao"
  | "enviadas"
  | "convertidas";

function moeda(
  valor: number | null,
) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return "-";
  }

  return valor.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );
}

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

function obterSituacao(
  proposta: PropostaLista,
) {
  if (
    proposta.possuiApolice
  ) {
    return "Convertida em Apólice";
  }

  if (
    proposta.status ===
      "Enviada para o cliente" ||
    proposta.status ===
      "Enviada ao Cliente"
  ) {
    return "Enviada para o cliente";
  }

  return "Em elaboração";
}

function statusClass(
  status: string,
) {
  switch (
    status
  ) {
    case "Enviada para o cliente":
      return "bg-blue-100 text-blue-700";

    case "Convertida em Apólice":
      return "bg-emerald-100 text-emerald-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function valorOrdenacao(
  proposta: PropostaLista,
  chave: SortKey,
) {
  switch (chave) {
    case "cliente":
      return (
        proposta.cliente ??
        ""
      );

    case "seguradoras":
      return proposta
        .seguradoras
        .join(" ");

    case "seguro":
      return (
        proposta.tipoSeguro ??
        ""
      );

    case "premio":
      return Number(
        proposta.melhorPremio ??
          proposta.premioTotal ??
          0,
      );

    case "situacao":
      return obterSituacao(
        proposta,
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
  chaveAtual:
    SortKey | null;
  direcao: SortDirection;
  onOrdenar:
    (chave: SortKey) => void;
  className?: string;
}) {
  const ativo =
    chaveAtual === chave;

  return (
    <th
      className={`px-4 py-4 text-left ${className}`}
    >
      <button
        type="button"
        onClick={() =>
          onOrdenar(chave)
        }
        className="inline-flex items-center gap-1.5 rounded-md font-semibold text-slate-800 transition hover:text-[#0A2F5A] focus:outline-none focus:ring-2 focus:ring-[#0A2F5A]/20"
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

export default function PropostaTable({
  propostas,
}: Props) {
  const [
    busca,
    setBusca,
  ] =
    useState("");

  const [
    filtroSituacao,
    setFiltroSituacao,
  ] =
    useState<FiltroSituacao>(
      "todas",
    );

  const [
    sortKey,
    setSortKey,
  ] =
    useState<
      SortKey | null
    >(null);

  const [
    sortDirection,
    setSortDirection,
  ] =
    useState<SortDirection>(
      "asc",
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
        "premio"
        ? "asc"
        : "asc",
    );
  }

  const contadores =
    useMemo(
      () => {
        let elaboracao = 0;
        let enviadas = 0;
        let convertidas = 0;

        for (
          const proposta
          of propostas
        ) {
          const situacao =
            obterSituacao(
              proposta,
            );

          if (
            situacao ===
            "Convertida em Apólice"
          ) {
            convertidas += 1;
          } else if (
            situacao ===
            "Enviada para o cliente"
          ) {
            enviadas += 1;
          } else {
            elaboracao += 1;
          }
        }

        return {
          todas:
            propostas.length,
          elaboracao,
          enviadas,
          convertidas,
        };
      },
      [propostas],
    );

  const propostasExibidas =
    useMemo(
      () => {
        const termo =
          normalizar(
            busca,
          );

        const filtradas =
          propostas.filter(
            (
              proposta,
            ) => {
              const situacao =
                obterSituacao(
                  proposta,
                );

              const correspondeSituacao =
                filtroSituacao ===
                  "todas" ||
                (
                  filtroSituacao ===
                    "elaboracao" &&
                  situacao ===
                    "Em elaboração"
                ) ||
                (
                  filtroSituacao ===
                    "enviadas" &&
                  situacao ===
                    "Enviada para o cliente"
                ) ||
                (
                  filtroSituacao ===
                    "convertidas" &&
                  situacao ===
                    "Convertida em Apólice"
                );

              const correspondeBusca =
                !termo ||
                normalizar(
                  proposta.cliente,
                ).includes(
                  termo,
                );

              return (
                correspondeSituacao &&
                correspondeBusca
              );
            },
          );

        if (
          !sortKey
        ) {
          return filtradas;
        }

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
        filtroSituacao,
        propostas,
        sortDirection,
        sortKey,
      ],
    );

  if (
    propostas.length ===
    0
  ) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
        Nenhuma proposta cadastrada.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          {
            chave:
              "todas" as const,
            titulo:
              "Todas",
            total:
              contadores.todas,
          },
          {
            chave:
              "elaboracao" as const,
            titulo:
              "Em elaboração",
            total:
              contadores.elaboracao,
          },
          {
            chave:
              "enviadas" as const,
            titulo:
              "Enviadas ao cliente",
            total:
              contadores.enviadas,
          },
          {
            chave:
              "convertidas" as const,
            titulo:
              "Convertidas em Apólice",
            total:
              contadores.convertidas,
          },
        ].map(
          (card) => {
            const ativo =
              filtroSituacao ===
              card.chave;

            return (
              <button
                key={
                  card.chave
                }
                type="button"
                onClick={() =>
                  setFiltroSituacao(
                    card.chave,
                  )
                }
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  ativo
                    ? "bg-[#0A2F5A] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                <span>
                  {
                    card.titulo
                  }
                </span>

                <span
                  className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 py-0.5 text-xs font-bold ${
                    ativo
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-600"
                  }`}
                >
                  {
                    card.total
                  }
                </span>
              </button>
            );
          },
        )}
      </div>

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

      {propostasExibidas.length ===
      0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <p className="font-semibold text-slate-700">
            Nenhuma proposta encontrada.
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {busca
              ? `Nenhum cliente corresponde a “${busca}” dentro do filtro selecionado.`
              : "Não existem propostas nesta situação."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-fixed">
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
                    className="w-[22%]"
                  />

                  <CabecalhoOrdenavel
                    titulo="Seguradoras"
                    chave="seguradoras"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="w-[23%]"
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
                    className="w-[14%]"
                  />

                  <CabecalhoOrdenavel
                    titulo="Melhor Prêmio"
                    chave="premio"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="w-[15%]"
                  />

                  <CabecalhoOrdenavel
                    titulo="Situação"
                    chave="situacao"
                    chaveAtual={
                      sortKey
                    }
                    direcao={
                      sortDirection
                    }
                    onOrdenar={
                      ordenar
                    }
                    className="w-[14%]"
                  />

                  <th className="w-[12%] px-4 py-4 text-center font-semibold text-slate-800">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody>
                {propostasExibidas.map(
                  (
                    proposta,
                  ) => {
                    const situacao =
                      obterSituacao(
                        proposta,
                      );

                    return (
                      <tr
                        key={
                          proposta.id
                        }
                        className="border-t border-slate-100 transition hover:bg-slate-50"
                      >
                        <td className="px-4 py-4">
                          <div className="truncate font-medium">
                            {
                              proposta.cliente
                            }
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="text-sm leading-6">
                            {proposta
                              .seguradoras
                              .length
                              ? proposta.seguradoras.join(
                                  " • ",
                                )
                              : "-"}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          {
                            proposta.tipoSeguro
                          }
                        </td>

                        <td className="px-4 py-4 font-semibold">
                          {moeda(
                            proposta.melhorPremio ??
                              proposta.premioTotal,
                          )}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClass(
                              situacao,
                            )}`}
                          >
                            {
                              situacao
                            }
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <PropostaActions
                            id={
                              proposta.id
                            }
                            possuiApolice={
                              proposta.possuiApolice
                            }
                            apoliceId={
                              proposta.apoliceId
                            }
                          />
                        </td>
                      </tr>
                    );
                  },
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="text-right text-xs text-slate-500">
        {
          propostasExibidas.length
        }{" "}
        de{" "}
        {
          propostas.length
        }{" "}
        proposta
        {propostas.length !==
        1
          ? "s"
          : ""}
      </div>
    </div>
  );
}
