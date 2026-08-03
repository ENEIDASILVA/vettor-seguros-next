"use client";

import { useTransition } from "react";

import { UserRoundX } from "lucide-react";

import ConfirmActionButton from "@/components/admin/common/ConfirmActionButton";

import { inativarClienteAction } from "@/app/admin/actions/clientes";

interface Props {
  id: string;
  nome: string;
}

export default function InativarClienteButton({
  id,
  nome,
}: Props) {
  const [pending, startTransition] = useTransition();

  async function executar() {
    startTransition(async () => {
      await inativarClienteAction(id);
    });
  }

  return (
    <ConfirmActionButton
      title="Inativar cliente"
      message={`Deseja realmente inativar ${nome}?`}
      confirmLabel="Inativar"
      action={executar}
    >
      <span
        className="text-slate-600 transition hover:text-red-600"
        title="Inativar"
      >
        <UserRoundX size={18} />
      </span>
    </ConfirmActionButton>
  );
}