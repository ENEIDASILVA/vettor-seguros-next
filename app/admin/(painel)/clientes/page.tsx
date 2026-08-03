import Link from "next/link";
import { Plus } from "lucide-react";
import PageHeader from "@/components/admin/common/PageHeader";


import ClienteTable from "@/components/admin/clientes/ClienteTable";
import { obterClientes } from "@/lib/services/clientesService";

export default async function ClientesPage() {
  const clientes = await obterClientes();

  return (
    <main className="space-y-6">

     <PageHeader
        title="Clientes"
        description="Gerencie todos os clientes da Vettor Seguros."
        action={{
            label: "Novo Cliente",
            href: "/admin/clientes/novo",
            icon: Plus,
        }}
     />

      <ClienteTable clientes={clientes} />

    </main>
  );
}