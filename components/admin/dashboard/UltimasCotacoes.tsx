import { DashboardUltimaCotacao } from "@/lib/repositories/dashboardUltimasCotacoesRepository";

type Props = {
  cotacoes: DashboardUltimaCotacao[];
};

export default function UltimasCotacoes({
  cotacoes,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-bold text-slate-800">
          Últimas Cotações
        </h2>
      </div>

      {cotacoes.length === 0 ? (
        <p className="p-6 text-slate-500">
          Nenhuma cotação encontrada.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {cotacoes.map((cotacao) => (
            <div
              key={cotacao.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="font-semibold text-slate-800">
                  {cotacao.cliente}
                </p>

                <p className="text-sm text-slate-500">
                  {cotacao.tipoSeguro}
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                {cotacao.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}