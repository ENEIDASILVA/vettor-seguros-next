"use client";

import { RotateCcw } from "lucide-react";

import ConfirmActionButton from "@/components/admin/common/ConfirmActionButton";
import { reativarClienteAction } from "@/app/admin/actions/clientes";

interface Props {
  id: string;
  nome: string;
}

export default function ReativarClienteButton({
  id,
  nome,
}: Props) {
  async function executar() {
    await reativarClienteAction(id);
  }

  return (
    <ConfirmActionButton
      title="Reativar cliente"
      message={`Deseja reativar ${nome}?`}
      confirmLabel="Reativar"
      action={executar}
    >
      <span
        className="text-slate-600 transition hover:text-emerald-600"
        title="Reativar"
      >
        <RotateCcw size={18} />
      </span>
    </ConfirmActionButton>
  );
}