import BasePage from "@/components/admin/common/BasePage";

import PropostaWorkspace from "@/components/admin/propostas/PropostaWorkspace";

import {
  carregarFormularioProposta,
} from "@/lib/services/propostasFormService";

type Props = {
  params: Promise<{
    id: string;
  }>;

  searchParams: Promise<{
    edit?: string;
  }>;
};

export default async function PropostaWorkspacePage({
  params,
  searchParams,
}: Props) {
  const { id } =
    await params;

  const { edit } =
    await searchParams;

  const dados =
    await carregarFormularioProposta(
      id,
    );

  const modoEdicao =
    edit === "true";

  return (
    <BasePage
      title={
        modoEdicao
          ? "Editar Proposta"
          : "Visualizar Proposta"
      }
      description={
        modoEdicao
          ? "Atualize a proposta comercial do cliente."
          : "Consulte as cotações e o documento enviado ao cliente."
      }
    >
      <PropostaWorkspace
        propostaId={id}
        cotacaoId={
          dados.cotacao.id
        }
        modoEdicao={
          modoEdicao
        }
        dados={
          dados
        }
      />
    </BasePage>
  );
}