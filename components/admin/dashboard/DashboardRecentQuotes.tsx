import Link from "next/link";

import DataTable from "@/components/admin/common/DataTable";
import EmptyState from "@/components/admin/common/EmptyState";
import CotacaoActions from "@/components/admin/cotacoes/CotacaoActions";
import CotacaoStatusBadge from "@/components/admin/cotacoes/CotacaoStatusBadge";

import { DashboardUltimaCotacao } from "@/lib/repositories/dashboardRepository";

type DashboardRecentQuotesProps = {
  cotacoes: DashboardUltimaCotacao[];
};

export default function DashboardRecentQuotes({
  cotacoes,
}: DashboardRecentQuotesProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Últimas Cotações
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            As cinco cotações mais recentes cadastradas.
          </p>
        </div>

        <Link
          href="/admin/cotacoes"
          className="text-sm font-medium text-[#0A2F5A] hover:underline"
        >
          Ver todas
        </Link>
      </div>

      <DataTable
        columns={[
          {
            key: "cliente",
            title: "Cliente",
          },
          {
            key: "seguro",
            title: "Seguro",
          },
          {
            key: "status",
            title: "Status",
          },
          {
            key: "data",
            title: "Criada em",
          },
          {
            key: "acoes",
            title: "",
            className: "w-20 text-center",
          },
        ]}
        data={cotacoes}
        getRowKey={(cotacao) => cotacao.id}
        emptyState={
          <EmptyState
            title="Nenhuma cotação encontrada"
            description="Cadastre a primeira cotação para começar."
            actionLabel="Nova Cotação"
            actionHref="/admin/cotacoes/nova"
          />
        }
        renderRow={(cotacao) => (
          <>
            <td className="px-5 py-4 font-medium text-slate-700">
              {cotacao.cliente}
            </td>

            <td className="px-5 py-4">
              {cotacao.tipoSeguro}
            </td>

            <td className="px-5 py-4">
              <CotacaoStatusBadge status={cotacao.status} />
            </td>

            <td className="px-5 py-4 whitespace-nowrap">
              {new Date(cotacao.created_at).toLocaleDateString("pt-BR")}
            </td>

            <td className="px-5 py-4 text-center">
              <CotacaoActions id={cotacao.id} />
            </td>
          </>
        )}
      />
    </div>
  );
}