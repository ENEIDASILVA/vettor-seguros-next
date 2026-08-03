"use client";

import Link from "next/link";

import {
  ArrowLeft,
  FilePlus2,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  excluirProposta,
} from "@/app/admin/actions/propostas";

type Props = {
  id: string;
  status: string;
};

export default function PropostaDetalheActions({
  id,
  status,
}: Props) {
  async function handleExcluir() {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta proposta?"
    );

    if (!confirmar) {
      return;
    }

    await excluirProposta(id);
  }

  const propostaConvertida =
    status.toLowerCase() === "convertida";

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href={`/admin/propostas/${id}/editar`}
        className="flex items-center gap-2 rounded-lg bg-amber-500 px-4 py-2 font-medium text-white transition hover:bg-amber-600"
      >
        <Pencil size={18} />

        Editar
      </Link>

      {!propostaConvertida && (
        <Link
          href={`/admin/apolices/nova?propostaId=${id}`}
          className="flex items-center gap-2 rounded-lg bg-[#0A2F5A] px-4 py-2 font-medium text-white transition hover:bg-[#123f73]"
        >
          <FilePlus2 size={18} />

          Converter em Apólice
        </Link>
      )}

      <button
        type="button"
        onClick={handleExcluir}
        className="flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition hover:bg-red-700"
      >
        <Trash2 size={18} />

        Excluir
      </button>

      <Link
        href="/admin/propostas"
        className="flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-300"
      >
        <ArrowLeft size={18} />

        Voltar
      </Link>
    </div>
  );
}