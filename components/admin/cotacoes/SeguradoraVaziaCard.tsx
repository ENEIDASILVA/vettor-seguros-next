"use client";

import {
  Clock3,
  Plus,
} from "lucide-react";

import type {
  SeguradoraOption,
} from "@/lib/services/cotacoesSeguradorasFormService";

type Props = {
  seguradora: SeguradoraOption;

  onNova: (
    seguradoraId: number,
  ) => void;
};

export default function SeguradoraVaziaCard({
  seguradora,
  onNova,
}: Props) {
  return (
    <article
      className="
        flex
        min-h-64
        flex-col
        justify-between
        rounded-2xl
        border
        border-dashed
        border-slate-300
        bg-slate-50/60
        p-5
        transition
        hover:border-blue-300
        hover:bg-blue-50/40
      "
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-200 font-bold text-slate-600">
            {seguradora.label
              .charAt(0)
              .toUpperCase()}
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
            <Clock3 size={14} />

            Não cotada
          </span>
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-800">
          {seguradora.label}
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Ainda não há uma opção registrada
          para esta seguradora.
        </p>
      </div>

      <button
        type="button"
        onClick={() =>
          onNova(
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
          bg-[#0A2F5A]
          px-4
          py-2.5
          font-semibold
          text-white
          transition
          hover:bg-[#082648]
        "
      >
        <Plus size={18} />

        Nova Cotação
      </button>
    </article>
  );
}