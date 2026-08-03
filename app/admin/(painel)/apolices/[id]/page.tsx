import { notFound } from "next/navigation";

import BasePage from "@/components/admin/common/BasePage";
import ApoliceView from "@/components/admin/apolices/ApoliceView";

import { obterApolice } from "@/lib/services/apolicesService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ApolicePage({
  params,
}: Props) {
  const { id } = await params;

  let apolice;

  try {
    apolice = await obterApolice(id);
  } catch {
    notFound();
  }

  return (
    <BasePage
      title={`Apólice ${apolice.numeroApolice}`}
      description="Visualização completa da apólice."
      action={{
        label: "Editar",
        href: `/admin/apolices/${id}/editar`,
      }}
    >
      <ApoliceView apolice={apolice} />
    </BasePage>
  );
}