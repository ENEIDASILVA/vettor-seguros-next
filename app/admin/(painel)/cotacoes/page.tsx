import { Plus } from "lucide-react";

import BasePage from "@/components/admin/common/BasePage";
import CotacaoTable from "@/components/admin/cotacoes/CotacaoTable";

export default function CotacoesPage() {
  return (
    <BasePage
      title="Cotações"
      description="Gerencie todas as cotações da corretora."
      action={{
        label: "Nova Cotação",
        href: "/admin/cotacoes/nova",
        icon: Plus,
      }}
    >
      <CotacaoTable />
    </BasePage>
  );
}