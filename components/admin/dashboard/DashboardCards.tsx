import {
  Clock3,
  FileCheck2,
  FileClock,
  RefreshCw,
} from "lucide-react";

import DashboardCard from "./DashboardCard";

import type {
  DashboardIndicadores,
} from "@/lib/repositories/dashboardRepository";

type Props = {
  indicadores: DashboardIndicadores;
};

export default function DashboardCards({
  indicadores,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardCard
        title="Em processo de cotação"
        value={
          indicadores.emProcessoCotacao
        }
        icon={Clock3}
        color="yellow"
        description="Cotações que exigem andamento"
        href="#em-processo-cotacao"
      />

      <DashboardCard
        title="Propostas em tratamento"
        value={
          indicadores.propostasEmTratamento
        }
        icon={FileClock}
        color="blue"
        description="Propostas ainda não convertidas em apólice"
        href="#propostas-em-tratamento"
      />

      <DashboardCard
        title="Apólice a emitir"
        value={
          indicadores.apoliceAEmitir
        }
        icon={FileCheck2}
        color="green"
        description="Propostas aceitas"
        href="#apolice-a-emitir"
      />

      <DashboardCard
        title="Seguros vencendo em 30 dias"
        value={
          indicadores.vencendo30Dias
        }
        icon={RefreshCw}
        color="red"
        description="Renovações que precisam de atenção"
        href="#vencendo-30-dias"
      />
    </div>
  );
}
