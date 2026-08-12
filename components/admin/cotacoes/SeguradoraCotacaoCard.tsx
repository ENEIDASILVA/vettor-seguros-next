"use client";

import {
  CheckCircle2,
  FileText,
  Pencil,
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
  seguradora: SeguradoraOption;

  cotacao: CotacaoSeguradoraLista;

  menorPremio: number | null;

  onEditar: (
    cotacaoId: string,
    seguradoraId: number,
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

function classeStatus(
  status: string,
): string {
  const normalizado =
    status
      .trim()
      .toLowerCase();

  if (
    normalizado.includes("aceita") ||
    normalizado.includes("recomendada")
  ) {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (
    normalizado.includes("recusada") ||
    normalizado.includes("cancelada")
  ) {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (
    normalizado.includes("solicitada") ||
    normalizado.includes("aguardando")
  ) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-blue-200 bg-blue-50 text-blue-700";
}

export default function SeguradoraCotacaoCard({
  seguradora,
  cotacao,
  menorPremio,
  onEditar,
}: Props) {
  const melhorPreco =
    cotacao.premioTotal !== null &&
    menorPremio !== null &&
    cotacao.premioTotal ===
      menorPremio;

  return (
    <article
      className={`
        relative
        flex
        min-h-64
        flex-col
        justify-between
        overflow-hidden
        rounded-2xl
        border
        bg-white
        p-5
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
        ${
          cotacao.recomendada
            ? "border-yellow-300 ring-2 ring-yellow-100"
            : "border-slate-200"
        }
      `}
    >
      {cotacao.recomendada && (
        <div className="absolute right-0 top-0 rounded-bl-xl bg-yellow-400 px-3 py-1.5 text-xs font-bold text-yellow-950">
          Selecionada
        </div>
      )}

      <div>
        <div className="flex items-start justify-between gap-3 pr-20">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 font-bold text-[#0A2F5A]">
            {seguradora.label
              .charAt(0)
              .toUpperCase()}
          </div>

          <span
            className={`
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              px-3
              py-1
              text-xs
              font-semibold
              ${classeStatus(
                cotacao.status,
              )}
            `}
          >
            <CheckCircle2
              size={14}
            />

            {cotacao.status}
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-800">
          {seguradora.label}
        </h3>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">
              Prêmio total
            </p>

            <p className="mt-1 font-bold text-slate-800">
              {moeda(
                cotacao.premioTotal,
              )}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs font-medium text-slate-500">
              Franquia
            </p>

            <p className="mt-1 font-bold text-slate-800">
              {moeda(
                cotacao.franquiaNormal,
              )}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {melhorPreco && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
              <Trophy size={14} />

              Melhor preço
            </span>
          )}

          {cotacao.recomendada && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
              <Star
                size={14}
                className="fill-current"
              />

              Selecionada
            </span>
          )}

          {cotacao.arquivoPdfPath && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
              <FileText size={14} />

              PDF anexado
            </span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={() =>
          onEditar(
            cotacao.id,
            seguradora.value,
          )
        }
        className="
          mt-5
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          border-slate-300
          px-4
          py-2.5
          font-semibold
          text-slate-700
          transition
          hover:bg-slate-50
        "
      >
        <Pencil size={17} />

        Editar Cotação
      </button>
    </article>
  );
}