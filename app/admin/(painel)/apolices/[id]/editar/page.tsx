import { notFound } from "next/navigation";

import ApoliceForm from "@/components/admin/apolices/ApoliceForm";
import BasePage from "@/components/admin/common/BasePage";

import { carregarFormularioApolice } from "@/lib/services/apolicesFormService";
import { obterApoliceEdicao } from "@/lib/services/apolicesService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarApolicePage({
  params,
}: Props) {
  const { id } = await params;

  try {
    const [apolice, dados] = await Promise.all([
      obterApoliceEdicao(id),
      carregarFormularioApolice(),
    ]);

    return (
      <BasePage
        title={`Editar Apólice ${apolice.numeroApolice}`}
        description="Atualize os dados da apólice."
      >
        <ApoliceForm
          clientes={dados.clientes}
          cotacoes={dados.cotacoes}
          seguradoras={dados.seguradoras}
          tiposSeguro={dados.tiposSeguro}
          apolice={apolice}
          propostas={dados.propostas}
        />
      </BasePage>
    );
  } catch {
    notFound();
  }
}