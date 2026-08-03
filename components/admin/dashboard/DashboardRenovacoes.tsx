import type { DashboardRenovacao } from "@/lib/repositories/dashboardRepository";

type Props = {
  renovacoes: DashboardRenovacao[];
};

function formatarData(data: string) {
  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

function corDias(dias: number) {
  if (dias <= 10) {
    return "bg-red-100 text-red-700";
  }

  if (dias <= 20) {
    return "bg-yellow-100 text-yellow-700";
  }

  return "bg-green-100 text-green-700";
}


export default function DashboardRenovacoes({
  renovacoes,
}: Props) {

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-bold text-slate-800">
            Renovações próximas
          </h2>

          <p className="text-sm text-slate-500">
            Apólices vencendo nos próximos 30 dias
          </p>
        </div>


        <div className="rounded-xl bg-orange-100 px-5 py-3 text-2xl font-bold text-orange-700">
          {renovacoes.length}
        </div>

      </div>


      {renovacoes.length === 0 ? (

        <div className="py-8 text-center text-slate-500">
          Nenhuma renovação próxima.
        </div>

      ) : (

        <div className="space-y-4">

          {renovacoes.map((item) => (

            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-4"
            >

              <div>

                <h3 className="font-semibold text-slate-800">
                  {item.cliente}
                </h3>


                <p className="text-sm text-slate-500">
                  {item.seguradora}
                </p>


                <p className="text-sm text-slate-500">
                  {item.tipoSeguro}
                </p>

              </div>


              <div className="text-right">

                <p className="text-sm text-slate-600">
                  Vencimento:
                </p>

                <p className="font-semibold text-slate-800">
                  {formatarData(item.vencimento)}
                </p>


                <span
                  className={`
                    mt-2 inline-block rounded-full px-3 py-1 text-xs font-semibold
                    ${corDias(item.diasRestantes)}
                  `}
                >
                  {item.diasRestantes} dias
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}