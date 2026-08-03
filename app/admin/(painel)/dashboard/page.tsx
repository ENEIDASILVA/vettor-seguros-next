import DashboardCards from "@/components/admin/dashboard/DashboardCards";
import UltimasCotacoes from "@/components/admin/dashboard/UltimasCotacoes";
import UltimosClientes from "@/components/admin/dashboard/UltimosClientes";
import { obterDashboard } from "@/lib/services/dashboardService";
import DashboardRenovacoes from "@/components/admin/dashboard/DashboardRenovacoes";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const dashboard = await obterDashboard();

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-slate-800">
        Dashboard
      </h1>

      <DashboardRenovacoes
        renovacoes={dashboard.renovacoes}
      />
      
      <DashboardCards
        indicadores={dashboard.indicadores}
      />

      <UltimasCotacoes
        cotacoes={dashboard.ultimasCotacoes}
      />

      <UltimosClientes
        clientes={dashboard.ultimosClientes}
      />

      
    </main>
  );
}