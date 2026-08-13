"use client";

import Link from "next/link";

import {
  Eye,
  Pencil,
} from "lucide-react";

type Props = {
  id: string;
};

export default function ApoliceActions({
  id,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-1">
      <Link
        href={`/admin/apolices/${id}`}
        title="Visualizar"
        aria-label="Visualizar"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-[#0A2F5A]"
      >
        <Eye size={17} />
      </Link>

      <Link
        href={`/admin/apolices/${id}/editar`}
        title="Editar"
        aria-label="Editar"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
      >
        <Pencil size={17} />
      </Link>
    </div>
  );
}
