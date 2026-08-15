"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import {
  CircleX,
  Eye,
  FilePlus2,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  excluirProposta,
  negarProposta,
} from "@/app/admin/actions/propostas";

type Props = {
  id: string;
  possuiApolice: boolean;
  apoliceId?: string;
  status?: string | null;
};

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
    .toUpperCase()
    .trim();
}

export default function PropostaActions({
  id,
  possuiApolice,
  apoliceId,
  status,
}: Props) {
  const router =
    useRouter();

  const [
    processando,
    setProcessando,
  ] = useState(false);
  const propostaNegada =
    normalizar(status) ===
    "NEGADA";

  async function handleExcluir() {
    if (
      !confirm(
        "Deseja excluir esta proposta?",
      )
    ) {
      return;
    }

    await excluirProposta(id);
  }

  async function handleNegar() {
    if (
      !confirm(
        "Deseja marcar esta proposta como Negada? Ela será mantida no histórico e retirada do Dashboard.",
      )
    ) {
      return;
    }

    try {
      setProcessando(true);

      await negarProposta(
        id,
      );

      router.refresh();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível negar a proposta.",
      );
    } finally {
      setProcessando(false);
    }
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

      {possuiApolice ? (
        <>
          {/* PROPOSTA CONVERTIDA: somente visualizar e abrir a apólice */}
          {apoliceId && (
            <Link
              href={`/admin/apolices/${apoliceId}`}
              className="text-blue-700 hover:text-blue-900"
              title="Abrir Apólice"
            >
              <FilePlus2
                size={18}
              />
            </Link>
          )}
        </>
      ) : propostaNegada ? (
        /*
         * Proposta negada permanece no histórico.
         * Não pode ser editada, convertida ou excluída
         * por esta tabela.
         */
        null
      ) : (
        <>
          {/* EDITAR */}
          <Link
            href={`/admin/propostas/${id}/workspace?edit=true`}
            className="text-amber-600 hover:text-amber-700"
            title="Editar"
          >
            <Pencil size={18} />
          </Link>

          {/* CONVERTER EM APÓLICE */}
          <Link
            href={`/admin/apolices/nova?propostaId=${id}`}
            className="text-green-700 hover:text-green-900"
            title="Converter em Apólice"
          >
            <FilePlus2
              size={18}
            />
          </Link>

          {/* NEGAR PROPOSTA */}
          <button
            type="button"
            onClick={
              handleNegar
            }
            disabled={
              processando
            }
            className="text-rose-600 transition hover:text-rose-800 disabled:cursor-not-allowed disabled:opacity-40"
            title={
              processando
                ? "Negando proposta..."
                : "Negar proposta"
            }
          >
            <CircleX size={18} />
          </button>

          {/* EXCLUIR */}
          <button
            type="button"
            onClick={
              handleExcluir
            }
            className="text-red-600 hover:text-red-800"
            title="Excluir"
          >
            <Trash2 size={18} />
          </button>
        </>
      )}
    </div>
  );
}
