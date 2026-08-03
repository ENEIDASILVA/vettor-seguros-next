import Link from "next/link";

import DataTable from "@/components/admin/common/DataTable";
import EmptyState from "@/components/admin/common/EmptyState";

import { DashboardUltimoCliente } from "@/lib/repositories/dashboardRepository";

type DashboardRecentClientsProps = {
  clientes: DashboardUltimoCliente[];
};

export default function DashboardRecentClients({
  clientes,
}: DashboardRecentClientsProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Últimos Clientes
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Clientes cadastrados recentemente.
          </p>
        </div>

        <Link
          href="/admin/clientes"
          className="text-sm font-medium text-[#0A2F5A] hover:underline"
        >
          Ver todos
        </Link>
      </div>

      <DataTable
        columns={[
          {
            key: "nome",
            title: "Cliente",
          },
          {
            key: "telefone",
            title: "Telefone",
          },
          {
            key: "cidade",
            title: "Cidade",
          },
          {
            key: "cadastro",
            title: "Cadastro",
          },
        ]}
        data={clientes}
        getRowKey={(cliente) => cliente.id}
        emptyState={
          <EmptyState
            title="Nenhum cliente encontrado"
            description="Cadastre seu primeiro cliente."
            actionLabel="Novo Cliente"
            actionHref="/admin/clientes/novo"
          />
        }
        renderRow={(cliente) => (
          <>
            <td className="px-5 py-4">
              <Link
                href={`/admin/clientes/${cliente.id}`}
                className="font-medium text-slate-700 hover:text-[#0A2F5A]"
              >
                {cliente.nome}
              </Link>
            </td>

            <td className="px-5 py-4">
              {cliente.telefone ?? "-"}
            </td>

            <td className="px-5 py-4">
              {cliente.cidade ?? "-"}
            </td>

            <td className="px-5 py-4 whitespace-nowrap">
              {new Date(cliente.created_at).toLocaleDateString("pt-BR")}
            </td>
          </>
        )}
      />
    </div>
  );
}