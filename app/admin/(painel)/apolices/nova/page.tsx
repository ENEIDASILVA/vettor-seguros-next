import { redirect } from "next/navigation";

import BasePage from "@/components/admin/common/BasePage";
import ApoliceForm from "@/components/admin/apolices/ApoliceForm";

import {
  carregarFormularioApolice,
} from "@/lib/services/apolicesFormService";

import {
  buscarPropostaPorId,
} from "@/lib/repositories/propostasRepository";

import {
  buscarApolicePorProposta,
} from "@/lib/repositories/apolicesRepository";

type Props = {
  searchParams: Promise<{
    propostaId?: string;
  }>;
};

export default async function NovaApolicePage({
  searchParams,
}: Props) {
  const params = await searchParams;

  if (params.propostaId) {
    const apoliceExistente =
      await buscarApolicePorProposta(
        params.propostaId,
      );

    if (apoliceExistente) {
      redirect(
        `/admin/apolices/${apoliceExistente.id}`,
      );
    }
  }

  const dados =
    await carregarFormularioApolice();

  const proposta = params.propostaId
    ? await buscarPropostaPorId(
        params.propostaId,
      )
    : null;

  return (
    <BasePage
      title="Nova Apólice"
      description="Cadastro de uma nova apólice."
    >
      <ApoliceForm
        clientes={dados.clientes}
        cotacoes={dados.cotacoes}
        seguradoras={dados.seguradoras}
        tiposSeguro={dados.tiposSeguro}
        propostas={dados.propostas}
        proposta={proposta}
        propostaId={params.propostaId}
      />
    </BasePage>
  );
}