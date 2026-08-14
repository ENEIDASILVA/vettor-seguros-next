import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { notFound } from "next/navigation";

import {
  listarApolicesPorCliente,
} from "@/lib/repositories/apolicesRepository";
import { obterCliente } from "@/lib/services/clientesService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatarData(valor: string) {
  const [ano, mes, dia] = valor.split("-");

  if (!ano || !mes || !dia) {
    return valor;
  }

  return `${dia}/${mes}/${ano}`;
}

export default async function ClienteApolicesPage({
  params,
}: Props) {
  const { id } = await params;

  const [cliente, apolices] = await Promise.all([
    obterCliente(id),
    listarApolicesPorCliente(id),
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
          Apólices de {cliente.nome}
        </h1>

        <p className="mt-1 text-slate-500">
          {apolices.length} apólice{apolices.length === 1 ? "" : "s"} cadastrada{apolices.length === 1 ? "" : "s"}.
        </p>
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {apolices.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            Este cliente ainda não possui apólices.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Apólice</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Seguradora</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Seguro</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Vigência</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Ação</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-200">
                {apolices.map((apolice) => (
                  <tr key={apolice.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {apolice.numeroApolice}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {apolice.seguradora}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {apolice.tipoSeguro}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {formatarData(apolice.inicioVigencia)} a {formatarData(apolice.fimVigencia)}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {apolice.status}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        href={`/admin/apolices/${apolice.id}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[#0A2F5A] hover:bg-blue-50"
                        title="Ver apólice"
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
