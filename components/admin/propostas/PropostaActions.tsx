"use client";

import Link from "next/link";

import {
  Eye,
  FileCheck2,
  FilePlus2,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  excluirProposta,
} from "@/app/admin/actions/propostas";

type Props = {
  id: string;
  possuiApolice: boolean;
  apoliceId?: string;
};

export default function PropostaActions({
  id,
  possuiApolice,
  apoliceId,
}: Props) {
  async function handleExcluir() {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta proposta?",
    );

    if (!confirmar) {
      return;
    }

    await excluirProposta(id);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Visualizar proposta */}
      <Link
        href={`/admin/propostas/${id}`}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100"
        title="Visualizar proposta"
        aria-label="Visualizar proposta"
      >
        <Eye size={18} />
      </Link>

      {/* Editar proposta */}
      <Link
        href={`/admin/propostas/${id}/editar`}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
        title="Editar proposta"
        aria-label="Editar proposta"
      >
        <Pencil size={18} />
      </Link>

      {/* Proposta já possui apólice */}
      {possuiApolice && apoliceId ? (
        <Link
          href={`/admin/apolices/${apoliceId}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-700 transition hover:bg-blue-50"
          title="Ver Apólice"
          aria-label="Ver Apólice"
        >
          <FileCheck2 size={18} />
        </Link>
      ) : (
        /* Proposta ainda não possui apólice */
        <Link
          href={`/admin/apolices/nova?propostaId=${id}`}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-green-600 transition hover:bg-green-50"
          title="Emitir Apólice"
          aria-label="Emitir Apólice"
        >
          <FilePlus2 size={18} />
        </Link>
      )}

      {/* Excluir proposta */}
      <button
        type="button"
        onClick={handleExcluir}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
        title="Excluir proposta"
        aria-label="Excluir proposta"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}