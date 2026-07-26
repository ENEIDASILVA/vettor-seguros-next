import { getDashboardData } from "@/lib/repositories/dashboardRepository";
import StatCard from "@/components/admin/StatCard";
import Header from "@/components/admin/Header";

import {
  Users,
  FileText,
  CalendarDays,
  CheckCircle,
  Clock,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  
  const dashboard =
    await getDashboardData();

  return (
    
      <div className="mx-auto max-w-7xl">
        <Header
          title="Dashboard"
          subtitle="Visão geral da operação da Vettor Seguros."
        />

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            title="Clientes cadastrados"
            value={dashboard.totalClients}
            description="Total de clientes no CRM"
            icon={<Users size={24} />}
          />

          <StatCard
            title="Total de cotações"
            value={
              dashboard.totalQuotes
            }
            description="Todas as solicitações recebidas"
            icon={<FileText size={24} />}
          />

          <StatCard
            title="Cotações hoje"
            value={
              dashboard.quotesToday
            }
            description="Solicitações recebidas hoje"
            icon={<CalendarDays size={24} />}
          />

          <StatCard
            title="Cotações no mês"
            value={
              dashboard.quotesThisMonth
            }
            description="Solicitações do mês atual"
            icon={<FileText size={24} />}
          />

          <StatCard
            title="Em andamento"
            value={
              dashboard.inProgressQuotes
            }
            description="Cotações em atendimento ou negociação"
            icon={<Clock size={24} />}
          />

          <StatCard
            title="Fechadas"
            value={
              dashboard.closedQuotes
            }
            description="Negócios concluídos"
            icon={<CheckCircle size={24} />}
          />
        </section>

        <section className="mt-8 overflow-hidden rounded-3xl bg-white shadow-sm">
          <div className="border-b border-slate-100 px-6 py-6 sm:px-8">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-[#0A2F5A]">
                  Últimas cotações
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  As solicitações mais recentes recebidas pelo site.
                </p>
              </div>

              <span className="text-sm font-semibold text-slate-500">
                Últimos 10 registros
              </span>
            </div>
          </div>

          {dashboard.latestQuotes.length ===
          0 ? (
            <div className="px-6 py-12 text-center sm:px-8">
              <p className="font-semibold text-slate-600">
                Nenhuma cotação foi encontrada.
              </p>

              <p className="mt-2 text-sm text-slate-500">
                As novas solicitações aparecerão aqui automaticamente.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-3 p-4 md:hidden">
                {dashboard.latestQuotes.map(
                  (quote) => (
                    <article
                      key={quote.id}
                      className="rounded-2xl border border-slate-100 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#0A2F5A]">
                            {
                              quote.clientName
                            }
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {
                              quote.insuranceType
                            }
                          </p>
                        </div>

                        <StatusBadge
                          status={
                            quote.status
                          }
                        />
                      </div>

                      <p className="mt-4 text-xs font-medium text-slate-400">
                        {formatDate(
                          quote.createdAt
                        )}
                      </p>
                    </article>
                  )
                )}
              </div>

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-sm text-slate-500">
                    <tr>
                      <th className="px-8 py-4 font-semibold">
                        Cliente
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Seguro
                      </th>

                      <th className="px-6 py-4 font-semibold">
                        Status
                      </th>

                      <th className="px-8 py-4 text-right font-semibold">
                        Recebida em
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {dashboard.latestQuotes.map(
                      (quote) => (
                        <tr
                          key={quote.id}
                          className="transition hover:bg-slate-50"
                        >
                          <td className="px-8 py-5 font-semibold text-[#0A2F5A]">
                            {
                              quote.clientName
                            }
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-600">
                            {
                              quote.insuranceType
                            }
                          </td>

                          <td className="px-6 py-5">
                            <StatusBadge
                              status={
                                quote.status
                              }
                            />
                          </td>

                          <td className="px-8 py-5 text-right text-sm text-slate-500">
                            {formatDate(
                              quote.createdAt
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    
  );
}

type DashboardCardProps = {
  title: string;
  value: number;
  description: string;
};

function DashboardCard({
  title,
  value,
  description,
}: DashboardCardProps) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md">
      <p className="text-sm font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-4xl font-bold text-[#0A2F5A]">
        {new Intl.NumberFormat(
          "pt-BR"
        ).format(value)}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </article>
  );
}

type StatusBadgeProps = {
  status: string;
};

function StatusBadge({
  status,
}: StatusBadgeProps) {
  const normalizedStatus =
    status.toLowerCase();

  let classes =
    "bg-slate-100 text-slate-700";

  if (
    normalizedStatus.includes("novo") ||
    normalizedStatus.includes("nova") ||
    normalizedStatus.includes(
      "recebida"
    )
  ) {
    classes =
      "bg-blue-100 text-blue-700";
  }

  if (
    normalizedStatus.includes(
      "andamento"
    ) ||
    normalizedStatus.includes(
      "atendimento"
    ) ||
    normalizedStatus.includes(
      "cotação"
    )
  ) {
    classes =
      "bg-amber-100 text-amber-700";
  }

  if (
    normalizedStatus.includes(
      "proposta"
    ) ||
    normalizedStatus.includes(
      "negociação"
    )
  ) {
    classes =
      "bg-purple-100 text-purple-700";
  }

  if (
    normalizedStatus.includes(
      "fechad"
    ) ||
    normalizedStatus.includes(
      "conclu"
    )
  ) {
    classes =
      "bg-emerald-100 text-emerald-700";
  }

  if (
    normalizedStatus.includes(
      "perdid"
    ) ||
    normalizedStatus.includes(
      "cancelad"
    )
  ) {
    classes =
      "bg-red-100 text-red-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${classes}`}
    >
      {status}
    </span>
  );
}

function formatDate(
  date: string
): string {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      timeZone:
        "America/Sao_Paulo",
      dateStyle: "short",
      timeStyle: "short",
    }
  ).format(new Date(date));
}