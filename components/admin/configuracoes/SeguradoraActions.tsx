"use client";

import {
  CircleOff,
  CirclePlay,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  alterarStatusSeguradoraAction,
  excluirSeguradoraAction,
} from "@/app/admin/actions/seguradoras";

import type {
  Seguradora,
} from "@/lib/repositories/seguradorasRepository";

type Props = {
  seguradora: Seguradora;
  onEdit: (
    seguradora: Seguradora,
  ) => void;
  onChanged: () => void;
};

export default function SeguradoraActions({
  seguradora,
  onEdit,
  onChanged,
}: Props) {
  const [
    processando,
    setProcessando,
  ] =
    useState(false);

  async function alterarStatus() {
    const novoStatus =
      !seguradora.ativo;

    const acao =
      novoStatus
        ? "ativar"
        : "inativar";

    if (
      !confirm(
        `Deseja ${acao} a seguradora ${seguradora.nome}?`,
      )
    ) {
      return;
    }

    try {
      setProcessando(
        true,
      );

      const resultado =
        await alterarStatusSeguradoraAction(
          seguradora.id,
          novoStatus,
        );

      if (
        !resultado.success
      ) {
        alert(
          resultado.message,
        );
        return;
      }

      onChanged();

      // Garante que os dados vindos do Server Component
      // sejam recarregados imediatamente após a alteração.
      window.location.reload();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível alterar o status da seguradora.",
      );
    } finally {
      setProcessando(
        false,
      );
    }
  }

  async function excluir() {
    if (
      !confirm(
        `Deseja excluir a seguradora ${seguradora.nome}? Esta ação só será permitida se não houver vínculos no sistema.`,
      )
    ) {
      return;
    }

    try {
      setProcessando(
        true,
      );

      const resultado =
        await excluirSeguradoraAction(
          seguradora.id,
        );

      if (
        !resultado.success
      ) {
        alert(
          resultado.message,
        );
        return;
      }

      onChanged();

      window.location.reload();
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a seguradora.",
      );
    } finally {
      setProcessando(
        false,
      );
    }
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() =>
          onEdit(
            seguradora,
          )
        }
        disabled={
          processando
        }
        className="rounded-lg p-2 text-amber-600 transition hover:bg-amber-50 hover:text-amber-700 disabled:opacity-40"
        title="Editar"
      >
        <Pencil size={18} />
      </button>

      <button
        type="button"
        onClick={
          alterarStatus
        }
        disabled={
          processando
        }
        className={`rounded-lg p-2 transition disabled:opacity-40 ${
          seguradora.ativo
            ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            : "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
        }`}
        title={
          seguradora.ativo
            ? "Inativar"
            : "Ativar"
        }
      >
        {seguradora.ativo ? (
          <CircleOff
            size={18}
          />
        ) : (
          <CirclePlay
            size={18}
          />
        )}
      </button>

      <button
        type="button"
        onClick={
          excluir
        }
        disabled={
          processando
        }
        className="rounded-lg p-2 text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-40"
        title="Excluir"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
