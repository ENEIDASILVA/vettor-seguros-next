import { notFound } from "next/navigation";

import ClienteForm from "@/components/admin/clientes/ClienteForm";
import PageHeader from "@/components/admin/common/PageHeader";

import { editarClienteAction } from "@/app/admin/actions/clientes";
import { obterCliente } from "@/lib/services/clientesService";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditarClientePage({
  params,
}: Props) {
  const { id } = await params;

  const cliente = await obterCliente(id);

  if (!cliente) {
    notFound();
  }

  const action = editarClienteAction.bind(null, id);

  return (
    <main className="space-y-6">
      <PageHeader
        title="Editar cliente"
        description="Atualize as informações do cliente."
      />

      <ClienteForm
        cliente={cliente}
        action={action}
        submitLabel="Salvar alterações"
        cancelHref={`/admin/clientes/${id}`}
        readOnlyCpf
      />
    </main>
  );
}