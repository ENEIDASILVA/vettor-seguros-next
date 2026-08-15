import BasePage from "@/components/admin/common/BasePage";
import DashboardCards from "@/components/admin/dashboard/DashboardCards";
import DashboardTrabalho from "@/components/admin/dashboard/DashboardTrabalho";

import {
  obterDashboard,
} from "@/lib/services/dashboardService";

export default async function AdminPage() {
  const dashboard =
    await obterDashboard();

  return (
    <BasePage
      title="Dashboard"
      description="Veja primeiro o que precisa da sua atenção hoje."
    >
      <div className="space-y-7">
        <DashboardCards
          indicadores={
            dashboard.indicadores
          }
        />

        <DashboardTrabalho
          emProcessoCotacao={
            dashboard.emProcessoCotacao
          }
          propostasEmTratamento={
            dashboard.propostasEmTratamento
          }
          apoliceAEmitir={
            dashboard.apoliceAEmitir
          }
          renovacoes={
            dashboard.renovacoes
          }
        />
      </div>
    </BasePage>
  );
}
