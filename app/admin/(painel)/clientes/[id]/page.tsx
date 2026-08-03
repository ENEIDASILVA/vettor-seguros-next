import { notFound } from "next/navigation";

import ClienteHeader from "@/components/admin/clientes/ClienteHeader";
import ClienteInfoCard from "@/components/admin/clientes/ClienteInfoCard";
import ClienteEnderecoCard from "@/components/admin/clientes/ClienteEnderecoCard";
import ClienteObservacoesCard from "@/components/admin/clientes/ClienteObservacoesCard";
import ClienteResumoCard from "@/components/admin/clientes/ClienteResumoCard";
import ClienteTimeline from "@/components/admin/clientes/ClienteTimeline";
import { obterCliente } from "@/lib/services/clientesService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ClientePage({ params }: Props) {
  const { id } = await params;

  const cliente = await obterCliente(id);

  if (!cliente) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <ClienteHeader cliente={cliente} />

      <ClienteResumoCard />

      <ClienteInfoCard cliente={cliente} />

      <ClienteEnderecoCard cliente={cliente} />

      <ClienteObservacoesCard cliente={cliente} />

      <ClienteTimeline
        criadoEm={cliente.created_at}
        atualizadoEm={cliente.updated_at}
       />

    </div>
  );
}