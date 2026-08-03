import { DashboardUltimoCliente } from "@/lib/repositories/dashboardUltimosClientesRepository";

type Props = {
  clientes: DashboardUltimoCliente[];
};

export default function UltimosClientes({
  clientes,
}: Props) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-6 py-4">
        <h2 className="text-lg font-bold text-slate-800">
          Últimos Clientes
        </h2>
      </div>

      {clientes.length === 0 ? (
        <p className="p-6 text-slate-500">
          Nenhum cliente encontrado.
        </p>
      ) : (
        <div className="divide-y divide-slate-100">
          {clientes.map((cliente) => (
            <div
              key={cliente.id}
              className="flex items-center justify-between px-6 py-4"
            >
              <div>
                <p className="font-semibold text-slate-800">
                  {cliente.nome}
                </p>

                <p className="text-sm text-slate-500">
                  {cliente.cidade || "Cidade não informada"}
                </p>
              </div>

              <span className="text-xs text-slate-400">
                {new Date(cliente.created_at).toLocaleDateString(
                  "pt-BR"
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}