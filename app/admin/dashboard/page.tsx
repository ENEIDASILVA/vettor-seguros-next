import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="rounded-3xl bg-[#0A2F5A] px-6 py-7 text-white shadow-lg sm:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C9A227]">
            Vettor Seguros
          </p>

          <h1 className="mt-2 text-3xl font-bold">
            Painel Administrativo
          </h1>

          <p className="mt-2 text-sm text-slate-200">
            Acesso realizado como {user.email}.
          </p>
        </header>

        <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Cotações hoje"
            value="0"
            description="Solicitações recebidas hoje"
          />

          <DashboardCard
            title="Cotações no mês"
            value="0"
            description="Solicitações do mês atual"
          />

          <DashboardCard
            title="Em andamento"
            value="0"
            description="Propostas em análise"
          />

          <DashboardCard
            title="Fechadas"
            value="0"
            description="Negócios concluídos"
          />
        </section>

        <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-xl font-bold text-[#0A2F5A]">
            Bem-vinda ao painel
          </h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-600">
            A autenticação com o Supabase está funcionando. Na próxima
            etapa, vamos criar o banco de dados das cotações e conectar
            o formulário público ao painel administrativo.
          </p>
        </section>
      </div>
    </main>
  );
}

type DashboardCardProps = {
  title: string;
  value: string;
  description: string;
};

function DashboardCard({
  title,
  value,
  description,
}: DashboardCardProps) {
  return (
    <article className="rounded-3xl bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-500">
        {title}
      </p>

      <p className="mt-3 text-4xl font-bold text-[#0A2F5A]">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </article>
  );
}