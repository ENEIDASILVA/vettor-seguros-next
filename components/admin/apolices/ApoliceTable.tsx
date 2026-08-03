import type { ApoliceLista } from "@/lib/repositories/apolicesRepository";

import ApoliceActions from "./ApoliceActions";
import VigenciaBadge from "./VigenciaBadge";

type Props = {
  apolices: ApoliceLista[];
};

function formatarData(data: string): string {
  const [ano, mes, dia] = data.split("-");

  if (!ano || !mes || !dia) {
    return "-";
  }

  return `${dia}/${mes}/${ano}`;
}

export default function ApoliceTable({
  apolices,
}: Props) {
  if (apolices.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
        <h2 className="text-lg font-semibold text-slate-700">
          Nenhuma apólice cadastrada
        </h2>

        <p className="mt-2 text-slate-500">
          Cadastre sua primeira apólice.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full table-fixed">
        <colgroup>
          <col className="w-[20%]" />
          <col className="w-[20%]" />
          <col className="w-[10%]" />
          <col className="w-[18%]" />
          <col className="w-[20%]" />
          <col className="w-[12%]" />
        </colgroup>

        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
              Cliente
            </th>

            <th className="px-4 py-4 text-left text-sm font-semibold text-slate-700">
              Seguradora
            </th>

            <th className="px-3 py-4 text-left text-sm font-semibold text-slate-700">
              Seguro
            </th>

            <th className="px-3 py-4 text-left text-sm font-semibold text-slate-700">
              Apólice
            </th>

            <th className="px-3 py-4 text-left text-sm font-semibold text-slate-700">
              Vigência
            </th>

            <th className="px-2 py-4 text-center text-sm font-semibold text-slate-700">
              Ações
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white">
          {apolices.map((apolice) => (
            <tr
              key={apolice.id}
              className="transition hover:bg-slate-50"
            >
              <td className="px-4 py-4">
                <p
                  className="truncate font-medium text-slate-800"
                  title={apolice.cliente}
                >
                  {apolice.cliente}
                </p>
              </td>

              <td className="px-4 py-4">
                <p
                  className="truncate text-slate-700"
                  title={apolice.seguradora}
                >
                  {apolice.seguradora}
                </p>
              </td>

              <td className="px-3 py-4">
                <p
                  className="truncate text-slate-700"
                  title={apolice.tipoSeguro}
                >
                  {apolice.tipoSeguro}
                </p>
              </td>

              <td className="px-3 py-4">
                <p
                  className="truncate font-medium text-slate-800"
                  title={apolice.numeroApolice}
                >
                  {apolice.numeroApolice}
                </p>
              </td>

              <td className="px-3 py-4">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-sm text-slate-700">
                    {formatarData(apolice.fimVigencia)}
                  </span>

                  <VigenciaBadge
                    fimVigencia={apolice.fimVigencia}
                  />
                </div>
              </td>

              <td className="px-2 py-4">
                <ApoliceActions id={apolice.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}