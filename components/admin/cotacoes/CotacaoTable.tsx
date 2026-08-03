import Link from "next/link";

import DataTable from "@/components/admin/common/DataTable";
import EmptyState from "@/components/admin/common/EmptyState";

import { obterCotacoes } from "@/lib/services/cotacoesService";

import CotacaoActions from "./CotacaoActions";
import CotacaoStatusBadge from "./CotacaoStatusBadge";

export default async function CotacaoTable() {
  const cotacoes = await obterCotacoes();

  return (
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
          key: "origem",
          title: "Origem",
        },
        {
          key: "created_at",
          title: "Criada em",
        },
        {
          key: "acoes",
          title: "Ações",
          className: "text-center",
        },
      ]}
      data={cotacoes}
      emptyState={
        <EmptyState
          title="Nenhuma cotação encontrada"
          description="Cadastre a primeira cotação."
          actionLabel="Nova Cotação"
          actionHref="/admin/cotacoes/nova"
        />
      }
      renderRow={(cotacao) => (
        <>
          <td className="px-5 py-4">
            <Link
              href={`/admin/clientes/${cotacao.cliente_id}`}
              className="font-medium text-slate-700 hover:text-[#0A2F5A]"
            >
              {cotacao.cliente?.nome}
            </Link>
          </td>

          <td className="px-5 py-4">
            {cotacao.tipo_seguro?.nome}
          </td>

          <td className="px-5 py-4">
            <CotacaoStatusBadge
              status={cotacao.status?.nome ?? ""}
            />
          </td>

          <td className="px-5 py-4">
            {cotacao.origem ?? "-"}
          </td>

          <td className="px-5 py-4">
            {new Date(cotacao.created_at).toLocaleDateString("pt-BR")}
          </td>

          <td className="px-5 py-4 text-center">
            <CotacaoActions
              id={cotacao.id}
              propostaId={
                cotacao.proposta?.id ?? null
              }
            />
          </td>
        </>
      )}
    />
  );
}