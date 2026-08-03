import Link from "next/link";

import {
  Eye,
  FileCheck2,
  FilePlus2,
  Pencil,
} from "lucide-react";


type Props = {
  id: string;

  propostaId?: string | null;
};


export default function CotacaoActions({
  id,
  propostaId,
}: Props) {
  return (
    <div className="flex items-center justify-center gap-3">

      <Link
        href={`/admin/cotacoes/${id}`}
        title="Visualizar Cotação"
        aria-label="Visualizar Cotação"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-blue-600"
      >
        <Eye size={18} />
      </Link>


      <Link
        href={`/admin/cotacoes/${id}/editar`}
        title="Editar Cotação"
        aria-label="Editar Cotação"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
      >
        <Pencil size={18} />
      </Link>


      {propostaId ? (
        <Link
          href={`/admin/propostas/${propostaId}`}
          title="Ver Proposta"
          aria-label="Ver Proposta"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-blue-700 transition hover:bg-blue-50"
        >
          <FileCheck2 size={18} />
        </Link>
      ) : (
        <Link
          href={`/admin/propostas/nova?cotacaoId=${id}`}
          title="Gerar Proposta"
          aria-label="Gerar Proposta"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-green-700 transition hover:bg-green-50"
        >
          <FilePlus2 size={18} />
        </Link>
      )}

    </div>
  );
}