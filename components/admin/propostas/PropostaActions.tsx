"use client";

import Link from "next/link";
import { Eye, Pencil, FilePlus2, Trash2 } from "lucide-react";
import { excluirProposta } from "@/app/admin/actions/propostas";

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
    if (!confirm("Deseja excluir esta proposta?")) {
      return;
    }

    await excluirProposta(id);
  }

  return (
    <div className="flex items-center justify-center gap-2">

      {/* VISUALIZAR */}

      <Link
        href={`/admin/propostas/${id}/workspace`}
        className="text-slate-600 hover:text-slate-900"
        title="Visualizar"
      >
        <Eye size={18} />
      </Link>

      {/* EDITAR */}

      <Link
        href={`/admin/propostas/${id}/workspace?edit=true`}
        className="text-amber-600 hover:text-amber-700"
        title="Editar"
      >
        <Pencil size={18} />
      </Link>

      {/* APÓLICE */}

      {possuiApolice ? (
        <Link
          href={`/admin/apolices/${apoliceId}`}
          className="text-blue-700 hover:text-blue-900"
          title="Abrir Apólice"
        >
          <FilePlus2 size={18} />
        </Link>
      ) : (
        <Link
          href={`/admin/apolices/nova?propostaId=${id}`}
          className="text-green-700 hover:text-green-900"
          title="Converter em Apólice"
        >
          <FilePlus2 size={18} />
        </Link>
      )}

      {/* EXCLUIR */}

      <button
        type="button"
        onClick={handleExcluir}
        className="text-red-600 hover:text-red-800"
        title="Excluir"
      >
        <Trash2 size={18} />
      </button>

    </div>
  );
}