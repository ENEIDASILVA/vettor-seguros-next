import BasePage from "@/components/admin/common/BasePage";

import PropostaWorkspace from "@/components/admin/propostas/PropostaWorkspace";

import {
  carregarFormularioProposta,
} from "@/lib/services/propostasFormService";

export const dynamic =
  "force-dynamic";

type Props = {
  searchParams: Promise<{
    cotacaoId?: string;
    propostaId?: string;
  }>;
};

export default async function NovaPropostaPage({
  searchParams,
}: Props) {
  const {
    cotacaoId,
    propostaId,
  } = await searchParams;

  if (!cotacaoId) {
    throw new Error(
      "Cotação não informada.",
    );
  }

  const dados =
    await carregarFormularioProposta(
      cotacaoId,
    );

  return (
    <BasePage
      title="Proposta Comercial"
      description="Confira as cotações selecionadas antes da geração do PDF."
    >
      <PropostaWorkspace
        propostaId={propostaId}
        cotacaoId={cotacaoId}
        dados={dados}
      />
    </BasePage>
  );
}