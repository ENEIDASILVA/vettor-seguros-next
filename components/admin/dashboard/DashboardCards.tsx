import {
  CircleCheckBig,
  Clock3,
  FileText,
  Users,
} from "lucide-react";

import DashboardCard from "./DashboardCard";

import type {
  DashboardIndicadores,
} from "@/lib/repositories/dashboardRepository";

type DashboardCardsProps = {
  indicadores: DashboardIndicadores;
};

export default function DashboardCards({
  indicadores,
}: DashboardCardsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Clientes"
        value={indicadores.clientes}
        icon={Users}
        color="blue"
        description="Clientes ativos"
      />

      <DashboardCard
        title="Cotações"
        value={indicadores.cotacoes}
        icon={FileText}
        color="yellow"
        description="Total de cotações"
      />

      <DashboardCard
        title="Em Cotação"
        value={indicadores.emCotacao}
        icon={Clock3}
        color="yellow"
        description="Em andamento"
      />

      <DashboardCard
        title="Fechadas"
        value={indicadores.fechadas}
        icon={CircleCheckBig}
        color="green"
        description="Cotações concluídas"
      />
    </div>
  );
}