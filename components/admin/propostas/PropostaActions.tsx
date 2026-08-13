"use client";

import Link from "next/link";

import {
  Eye,
  FileText,
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
    if (
      possuiApolice
    ) {
      return;
    }

    if (
      !confirm(
        "Deseja excluir esta proposta?",
      )
    ) {
      return;
    }

    await excluirProposta(
      id,
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {/* VISUALIZAR PROPOSTA */}
      <Link
        href={`/admin/propostas/${id}/workspace`}
        className="text-slate-600 transition hover:text-slate-900"
        title="Visualizar Proposta"
      >
        <Eye
          size={18}
        />
      </Link>

      {possuiApolice ? (
        <>
          {/* PROPOSTA CONVERTIDA:
              não pode editar nem excluir */}
          {apoliceId && (
            <Link
              href={`/admin/apolices/${apoliceId}`}
              className="text-blue-700 transition hover:text-blue-900"
              title="Abrir Apólice"
            >
              <FileText
                size={18}
              />
            </Link>
          )}
        </>
      ) : (
        <>
          {/* EDITAR */}
          <Link
            href={`/admin/propostas/${id}/workspace?edit=true`}
            className="text-amber-600 transition hover:text-amber-700"
            title="Editar Proposta"
          >
            <Pencil
              size={18}
            />
          </Link>

          {/* CONVERTER EM APÓLICE */}
          <Link
            href={`/admin/apolices/nova?propostaId=${id}`}
            className="text-green-700 transition hover:text-green-900"
            title="Converter em Apólice"
          >
            <FilePlus2
              size={18}
            />
          </Link>

          {/* EXCLUIR */}
          <button
            type="button"
            onClick={
              handleExcluir
            }
            className="text-red-600 transition hover:text-red-800"
            title="Excluir Proposta"
          >
            <Trash2
              size={18}
            />
          </button>
        </>
      )}
    </div>
  );
}
