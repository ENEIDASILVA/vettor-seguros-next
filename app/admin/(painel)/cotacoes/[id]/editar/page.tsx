import {
  notFound,
} from "next/navigation";

import { ArrowLeft } from "lucide-react";

import BasePage from "@/components/admin/common/BasePage";
import CotacaoForm from "@/components/admin/cotacoes/CotacaoForm";

import {
  buscarCotacao,
} from "@/lib/repositories/cotacoesRepository";

import type {
  Cotacao,
  NovaCotacao,
} from "@/lib/repositories/cotacoesRepository";

import {
  obterClientes,
} from "@/lib/services/clientesService";

import {
  obterTiposSeguro,
} from "@/lib/services/cotacoesService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function converterParaFormulario(
  cotacao: Cotacao,
): NovaCotacao {
  return {
    cliente_id: cotacao.cliente_id,

    tipo_seguro_id: cotacao.tipo_seguro_id,

    status_id: cotacao.status_id,

    origem:
      cotacao.origem ?? "Site",

    observacoes:
      cotacao.observacoes ?? "",

    dados:
      cotacao.dados ?? {},
  };
}

export default async function EditarCotacaoPage({
  params,
}: Props) {
  const { id } =
    await params;

  const [
    cotacao,
    clientes,
    tiposSeguro,
  ] = await Promise.all([
    buscarCotacao(id),
    obterClientes(),
    obterTiposSeguro(),
  ]);

  if (!cotacao) {
    notFound();
  }

  const clientesAtivos =
    clientes.filter(
      (cliente) => cliente.ativo,
    );

  return (
    <BasePage
      title="Editar Cotação"
      description="Altere os dados da cotação."
      action={{
        label: "Voltar",
        href: "/admin/cotacoes",
        icon: ArrowLeft,
      }}
    >
      <CotacaoForm
        cotacaoId={id}
        cotacao={converterParaFormulario(cotacao)}
        clientes={clientesAtivos.map((cliente) => ({
            id: cliente.id,
            nome: cliente.nome,
        }))}
        tiposSeguro={tiposSeguro}
      />
    </BasePage>
  );
}