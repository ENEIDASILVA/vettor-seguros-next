"use client";

import {
  FileText,
  Star,
  Trophy,
} from "lucide-react";

import type {
  CotacaoSeguradoraLista,
} from "@/lib/repositories/cotacoesSeguradorasRepository";

import type {
  SeguradoraOption,
} from "@/lib/services/cotacoesSeguradorasFormService";

type Props = {
  cotacoes: CotacaoSeguradoraLista[];
  seguradoras: SeguradoraOption[];
  menorPremio: number | null;
  atualizando: boolean;

  onEditar: (
    cotacaoId: string,
    seguradoraId: number,
  ) => void;

  onSelecionar: (
    cotacaoId: string,
    recomendada: boolean,
  ) => void;
};

function moeda(
  valor: number | null,
): string {
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

export default function CotacaoSeguradorasComparativo({
  cotacoes,
  seguradoras,
  menorPremio,
  atualizando,
  onEditar,
  onSelecionar,
}: Props) {
  if (cotacoes.length === 0) {
    return null;
  }

  const seguradorasPorId =
    new Map(
      seguradoras.map(
        (seguradora) => [
          seguradora.value,
          seguradora.label,
        ],
      ),
    );

  const cotacoesOrdenadas =
    [...cotacoes].sort(
      (a, b) => {
        if (
          a.premioTotal === null &&
          b.premioTotal === null
        ) {
          return 0;
        }

        if (
          a.premioTotal === null
        ) {
          return 1;
        }

        if (
          b.premioTotal === null
        ) {
          return -1;
        }

        return (
          a.premioTotal -
          b.premioTotal
        );
      },
    );

  return (
    <div className="border-b border-slate-200 bg-slate-50/50 p-5">
      <div className="mb-4">
        <h3 className="text-base font-bold text-slate-800">
          Comparativo das Cotações
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          Selecione uma ou mais opções que poderão
          compor a proposta enviada ao cliente.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[980px] text-sm">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200 text-left text-slate-600">
              <th className="px-4 py-3 text-center font-semibold">
                Proposta
              </th>

              <th className="px-4 py-3 font-semibold">
                Seguradora
              </th>

              <th className="px-4 py-3 text-right font-semibold">
                Prêmio
              </th>

              <th className="px-4 py-3 text-right font-semibold">
                Franquia
              </th>

              <th className="px-4 py-3 text-center font-semibold">
                FIPE
              </th>

              <th className="px-4 py-3 font-semibold">
                Assistência
              </th>

              <th className="px-4 py-3 text-center font-semibold">
                PDF
              </th>

              <th className="px-4 py-3 text-center font-semibold">
                Destaque
              </th>
            </tr>
          </thead>

          <tbody>
            {cotacoesOrdenadas.map(
              (cotacao) => {
                const melhorPreco =
                  cotacao.premioTotal !==
                    null &&
                  menorPremio !== null &&
                  cotacao.premioTotal ===
                    menorPremio;

                const seguradoraNome =
                  seguradorasPorId.get(
                    cotacao.seguradoraId,
                  ) ??
                  "Seguradora";

                return (
                  <tr
                    key={cotacao.id}
                    className={`
                      border-b
                      border-slate-100
                      last:border-b-0
                      ${
                        cotacao.recomendada
                          ? "bg-yellow-50/60"
                          : melhorPreco
                            ? "bg-green-50/40"
                            : "bg-white"
                      }
                    `}
                  >
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={
                          cotacao.recomendada
                        }
                        disabled={
                          atualizando
                        }
                        onChange={(
                          event,
                        ) =>
                          onSelecionar(
                            cotacao.id,
                            event.target
                              .checked,
                          )
                        }
                        aria-label={`Selecionar ${seguradoraNome} para proposta`}
                        title="Selecionar para proposta"
                        className="
                          h-5
                          w-5
                          cursor-pointer
                          rounded
                          border-slate-300
                          accent-[#0A2F5A]
                          disabled:cursor-wait
                          disabled:opacity-50
                        "
                      />
                    </td>

                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() =>
                          onEditar(
                            cotacao.id,
                            cotacao.seguradoraId,
                          )
                        }
                        className="font-semibold text-[#0A2F5A] hover:underline"
                      >
                        {seguradoraNome}
                      </button>
                    </td>

                    <td className="px-4 py-3 text-right font-bold text-slate-800">
                      {moeda(
                        cotacao.premioTotal,
                      )}
                    </td>

                    <td className="px-4 py-3 text-right text-slate-700">
                      {moeda(
                        cotacao.franquiaNormal,
                      )}
                    </td>

                    <td className="px-4 py-3 text-center text-slate-700">
                      {cotacao.percentualFipe !==
                      null
                        ? `${cotacao.percentualFipe.toLocaleString(
                            "pt-BR",
                          )}%`
                        : "-"}
                    </td>

                    <td className="px-4 py-3 text-slate-700">
                      {cotacao.assistencia ||
                        (cotacao.assistencia24h
                          ? "Assistência 24h"
                          : "-")}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {cotacao.arquivoPdfPath ? (
                        <FileText
                          size={18}
                          className="mx-auto text-blue-700"
                        />
                      ) : (
                        <span className="text-slate-300">
                          -
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {melhorPreco && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                            <Trophy
                              size={13}
                            />

                            Menor preço
                          </span>
                        )}

                        {cotacao.recomendada && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-700">
                            <Star
                              size={13}
                              className="fill-current"
                            />

                            Selecionada
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              },
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}