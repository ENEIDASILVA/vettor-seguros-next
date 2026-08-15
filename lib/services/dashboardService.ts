import {
  type DashboardData,
  obterDashboardData,
} from "@/lib/repositories/dashboardRepository";

export async function obterDashboard(): Promise<DashboardData> {
  return obterDashboardData();
}
