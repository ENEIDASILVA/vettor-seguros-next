import {
  redirect,
} from "next/navigation";

import BasePage from "@/components/admin/common/BasePage";
import ApoliceForm from "@/components/admin/apolices/ApoliceForm";

import {
  carregarConversaoProposta,
  carregarFormularioApolice,
} from "@/lib/services/apolicesFormService";

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
  const params =
    await searchParams;

  if (
    params.propostaId
  ) {
    const apoliceExistente =
      await buscarApolicePorProposta(
        params.propostaId,
      );

    if (
      apoliceExistente
    ) {
      redirect(
        `/admin/apolices/${apoliceExistente.id}`,
      );
    }
  }

  const dados =
    await carregarFormularioApolice();

  const conversao =
    params.propostaId
      ? await carregarConversaoProposta(
          params.propostaId,
        )
      : null;

  return (
    <BasePage
      title={
        conversao
          ? "Converter Proposta em Apólice"
          : "Nova Apólice"
      }
      description={
        conversao
          ? "Selecione a cotação aceita pelo cliente e conclua a emissão da apólice."
          : "Cadastro de uma nova apólice."
      }
    >
      <ApoliceForm
        clientes={
          dados.clientes
        }
        cotacoes={
          dados.cotacoes
        }
        seguradoras={
          dados.seguradoras
        }
        tiposSeguro={
          dados.tiposSeguro
        }
        propostas={
          dados.propostas
        }
        proposta={
          conversao
            ?.proposta ??
          null
        }
        propostaId={
          params.propostaId
        }
        cotacoesProposta={
          conversao
            ?.cotacoesProposta ??
          []
        }
      />
    </BasePage>
  );
}
