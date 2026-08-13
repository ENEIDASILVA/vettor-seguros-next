import type {
  PropostaLista,
} from "@/lib/repositories/propostasRepository";

import PropostaActions from "./PropostaActions";

type Props = {
  propostas: PropostaLista[];
};

function moeda(
  valor: number | null,
) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return "-";
  }

  return valor.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );
}

function obterSituacao(
  proposta: PropostaLista,
) {
  if (
    proposta.possuiApolice
  ) {
    return "Convertida em Apólice";
  }

  if (
    proposta.status ===
      "Enviada para o cliente" ||
    proposta.status ===
      "Enviada ao Cliente"
  ) {
    return "Enviada para o cliente";
  }

  return "Em elaboração";
}

function statusClass(
  status: string,
) {
  switch (
    status
  ) {
    case "Enviada para o cliente":
      return "bg-blue-100 text-blue-700";

    case "Convertida em Apólice":
      return "bg-emerald-100 text-emerald-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

export default function PropostaTable({
  propostas,
}: Props) {
  if (
    propostas.length === 0
  ) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
        Nenhuma proposta cadastrada.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="w-full table-fixed">
        <thead className="bg-slate-50">
          <tr>
            <th className="w-[22%] px-4 py-4 text-left">
              Cliente
            </th>

            <th className="w-[23%] px-4 py-4 text-left">
              Seguradoras
            </th>

            <th className="w-[14%] px-4 py-4 text-left">
              Seguro
            </th>

            <th className="w-[15%] px-4 py-4 text-left">
              Melhor Prêmio
            </th>

            <th className="w-[14%] px-4 py-4 text-left">
              Situação
            </th>

            <th className="w-[12%] px-4 py-4 text-center">
              Ações
            </th>
          </tr>
        </thead>

        <tbody>
          {propostas.map(
            (
              proposta,
            ) => {
              const situacao =
                obterSituacao(
                  proposta,
                );

              return (
                <tr
                  key={
                    proposta.id
                  }
                  className="border-t border-slate-100"
                >
                  <td className="px-4 py-4">
                    <div className="truncate font-medium">
                      {
                        proposta.cliente
                      }
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="text-sm leading-6">
                      {proposta
                        .seguradoras
                        .length
                        ? proposta.seguradoras.join(
                            " • ",
                          )
                        : "-"}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    {
                      proposta.tipoSeguro
                    }
                  </td>

                  <td className="px-4 py-4 font-semibold">
                    {moeda(
                      proposta.melhorPremio ??
                        proposta.premioTotal,
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${statusClass(
                        situacao,
                      )}`}
                    >
                      {
                        situacao
                      }
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <PropostaActions
                      id={
                        proposta.id
                      }
                      possuiApolice={
                        proposta.possuiApolice
                      }
                      apoliceId={
                        proposta.apoliceId
                      }
                    />
                  </td>
                </tr>
              );
            },
          )}
        </tbody>
      </table>
    </div>
  );
}
