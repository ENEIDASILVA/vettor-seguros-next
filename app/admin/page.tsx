import BasePage from "@/components/admin/common/BasePage";
import DashboardCards from "@/components/admin/dashboard/DashboardCards";
import DashboardRecentClients from "@/components/admin/dashboard/DashboardRecentClients";
import DashboardRecentQuotes from "@/components/admin/dashboard/DashboardRecentQuotes";

import { obterDashboard } from "@/lib/services/dashboardService";

export default async function AdminDashboardPage() {
  const dashboard = await obterDashboard();

  return (
    <BasePage
      title="Dashboard"
      description="Acompanhe os principais indicadores da Vettor Seguros."
    >
      <div className="space-y-6">
        <DashboardCards
          indicadores={dashboard.indicadores}
        />

        <div className="grid gap-6 xl:grid-cols-2">
          <DashboardRecentQuotes
            cotacoes={dashboard.ultimasCotacoes}
          />

          <DashboardRecentClients
            clientes={dashboard.ultimosClientes}
          />
        </div>
      </div>
    </BasePage>
  );
}