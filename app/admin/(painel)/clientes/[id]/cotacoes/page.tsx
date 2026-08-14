import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { notFound } from "next/navigation";

import {
  listarCotacoesPorCliente,
} from "@/lib/repositories/cotacoesRepository";
import { obterCliente } from "@/lib/services/clientesService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatarData(valor: string) {
  return new Intl.DateTimeFormat("pt-BR").format(
    new Date(valor),
  );
}

export default async function ClienteCotacoesPage({
  params,
}: Props) {
  const { id } = await params;

  const [cliente, cotacoes] = await Promise.all([
    obterCliente(id),
    listarCotacoesPorCliente(id),
  ]);

  if (!cliente) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/admin/clientes/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0A2F5A] hover:underline"
        >
          <ArrowLeft size={16} />
          Voltar para o cliente
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-slate-900">
          Cotações de {cliente.nome}
        </h1>

        <p className="mt-1 text-slate-500">
          {cotacoes.length} cotação{cotacoes.length === 1 ? "" : "ões"} cadastrada{cotacoes.length === 1 ? "" : "s"}.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {cotacoes.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Este cliente ainda não possui cotações.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Seguro</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Seguradoras</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Data</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Ação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {cotacoes.map((cotacao) => (
                  <tr key={cotacao.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {cotacao.tipo_seguro?.nome ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {cotacao.status?.nome ?? "-"}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {cotacao.quantidadeCotacoesSeguradoras}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatarData(cotacao.created_at)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/cotacoes/${cotacao.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#0A2F5A] hover:bg-blue-50"
                        title="Ver cotação"
                      >
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
