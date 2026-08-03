import {
  DashboardData,
  obterDashboardData,
} from "@/lib/repositories/dashboardRepository";

import {
  obterUltimasCotacoes,
} from "@/lib/repositories/dashboardUltimasCotacoesRepository";

import {
  obterUltimosClientes,
} from "@/lib/repositories/dashboardUltimosClientesRepository";

export async function obterDashboard(): Promise<DashboardData> {
  const dashboard = await obterDashboardData();

  dashboard.ultimasCotacoes =
    await obterUltimasCotacoes();

  dashboard.ultimosClientes =
    await obterUltimosClientes();

  return dashboard;
}