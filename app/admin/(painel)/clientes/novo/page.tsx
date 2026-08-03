import ClienteForm from "@/components/admin/clientes/ClienteForm";
import PageHeader from "@/components/admin/common/PageHeader";

export default function NovoClientePage() {
  return (
    <main className="space-y-6">
      <PageHeader
        title="Novo cliente"
        description="Cadastre um novo cliente na Vettor Seguros."
      />

      <ClienteForm />
    </main>
  );
}