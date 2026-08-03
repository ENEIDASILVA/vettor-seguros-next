"use client";

import Link from "next/link";
import {
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import { excluirApolice } from "@/app/admin/actions/apolices";

type Props = {
  id: string;
};

export default function ApoliceActions({
  id,
}: Props) {
  async function handleExcluir() {
    const confirmar = window.confirm(
      "Deseja realmente excluir esta apólice?"
    );

    if (!confirmar) {
      return;
    }

    await excluirApolice(id);
  }

  return (
    <div className="flex items-center justify-center gap-1">

      <Link
        href={`/admin/apolices/${id}`}
        title="Visualizar"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#0A2F5A]"
      >
        <Eye size={17} />
      </Link>


      <Link
        href={`/admin/apolices/${id}/editar`}
        title="Editar"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
      >
        <Pencil size={17} />
      </Link>


      <button
        type="button"
        onClick={handleExcluir}
        title="Excluir"
        className="flex h-8 w-8 items-center justificar-center rounded-lg text-red-600 transition hover:bg-red-50"
      >
        <Trash2 size={17} />
      </button>

    </div>
  );
}