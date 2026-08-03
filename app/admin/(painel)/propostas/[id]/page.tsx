import Link from "next/link";

import BasePage from "@/components/admin/common/BasePage";

import PropostaDetalheActions from "@/components/admin/propostas/PropostaDetalheActions";

import {
  buscarPropostaPorId,
} from "@/lib/repositories/propostasRepository";


function moeda(
  valor: number | null,
) {
  if (
    valor === null ||
    valor === undefined
  ) {
    return "R$ 0,00";
  }

  return valor.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );
}


function dataBrasileira(
  valor: string,
) {
  if (!valor) {
    return "-";
  }

  return new Date(
    `${valor}T12:00:00`,
  ).toLocaleDateString(
    "pt-BR",
  );
}


export default async function PropostaDetalhePage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } =
    await params;

  const proposta =
    await buscarPropostaPorId(id);

  if (!proposta) {
    return (
      <BasePage
        title="Proposta"
        description="Detalhes da proposta."
      >
        <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-600">
          Proposta não encontrada.
        </div>
      </BasePage>
    );
  }

  return (
    <BasePage
      title="Detalhes da Proposta"
      description="Visualização completa da proposta comercial."
    >
      <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-8">

        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>
            <h2 className="text-2xl font-bold text-slate-800">
              Proposta{" "}
              {proposta.numeroProposta}
            </h2>

            <p className="mt-2 text-slate-500">
              Status:

              <span className="ml-2 inline-flex rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                {proposta.status}
              </span>
            </p>
          </div>

          <PropostaDetalheActions
            id={proposta.id}
            status={proposta.status}
          />

        </div>


        <div className="grid gap-6 md:grid-cols-2">

          <div>
            <h3 className="font-bold text-slate-700">
              Cliente
            </h3>

            <p className="mt-1 text-slate-600">
              {proposta.cliente}
            </p>
          </div>


          <div>
            <h3 className="font-bold text-slate-700">
              Seguradora
            </h3>

            <p className="mt-1 text-slate-600">
              {proposta.seguradora}
            </p>
          </div>


          <div>
            <h3 className="font-bold text-slate-700">
              Tipo de Seguro
            </h3>

            <p className="mt-1 text-slate-600">
              {proposta.tipoSeguro}
            </p>
          </div>


          <div>
            <h3 className="font-bold text-slate-700">
              Número da Proposta
            </h3>

            <p className="mt-1 text-slate-600">
              {proposta.numeroProposta ??
                "-"}
            </p>
          </div>

        </div>


        <div className="grid gap-6 border-t border-slate-200 pt-6 md:grid-cols-3">

          <div>
            <h3 className="font-bold text-slate-700">
              Prêmio Líquido
            </h3>

            <p className="mt-1 text-slate-600">
              {moeda(
                proposta.premioLiquido,
              )}
            </p>
          </div>


          <div>
            <h3 className="font-bold text-slate-700">
              Prêmio Total
            </h3>

            <p className="mt-1 text-slate-600">
              {moeda(
                proposta.premioTotal,
              )}
            </p>
          </div>


          <div>
            <h3 className="font-bold text-slate-700">
              Comissão
            </h3>

            <p className="mt-1 text-slate-600">
              {moeda(
                proposta.comissaoValor,
              )}
            </p>
          </div>

        </div>


        <div className="border-t border-slate-200 pt-8">

          <h3 className="text-lg font-bold text-slate-800">
            Apólice vinculada
          </h3>


          {proposta.apolice ? (

            <div className="mt-4 rounded-2xl border border-blue-200 bg-blue-50 p-6">

              <div className="grid gap-6 md:grid-cols-4">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Número da Apólice
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {
                      proposta.apolice
                        .numeroApolice
                    }
                  </p>
                </div>


                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Status
                  </p>

                  <p className="mt-1 font-semibold text-blue-700">
                    {
                      proposta.apolice
                        .status
                    }
                  </p>
                </div>


                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Início da Vigência
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {dataBrasileira(
                      proposta.apolice
                        .inicioVigencia,
                    )}
                  </p>
                </div>


                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Fim da Vigência
                  </p>

                  <p className="mt-1 font-semibold text-slate-800">
                    {dataBrasileira(
                      proposta.apolice
                        .fimVigencia,
                    )}
                  </p>
                </div>

              </div>


              <div className="mt-6 flex justify-end">

                <Link
                  href={`/admin/apolices/${proposta.apolice.id}`}
                  className="rounded-xl bg-[#0A2F5A] px-5 py-3 font-semibold text-white transition hover:bg-[#082648]"
                >
                  Ver Apólice
                </Link>

              </div>

            </div>

          ) : (

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6">

              <p className="text-slate-600">
                Esta proposta ainda não possui uma apólice emitida.
              </p>

              <Link
                href={`/admin/apolices/nova?propostaId=${proposta.id}`}
                className="rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
              >
                Emitir Apólice
              </Link>

            </div>

          )}

        </div>

      </div>
    </BasePage>
  );
}