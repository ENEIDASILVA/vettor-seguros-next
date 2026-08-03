import {
  notFound,
} from "next/navigation";

import BasePage from "@/components/admin/common/BasePage";

import CotacaoView from "@/components/admin/cotacoes/CotacaoView";

import {
  buscarCotacao,
} from "@/lib/repositories/cotacoesRepository";


type Props = {
  params: Promise<{
    id: string;
  }>;
};


export default async function CotacaoDetalhePage({
  params,
}: Props) {
  const { id } =
    await params;


  const cotacao =
    await buscarCotacao(id);


  if (!cotacao) {
    notFound();
  }


  return (
    <BasePage
      title="Detalhes da Cotação"
      description="Informações completas enviadas pelo cliente."
      action={{
        label: "Editar",
        href:
          `/admin/cotacoes/${id}/editar`,
      }}
    >
      <CotacaoView
        cotacao={cotacao}
      />
    </BasePage>
  );
}