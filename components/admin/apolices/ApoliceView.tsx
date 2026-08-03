import Link from "next/link";

import VigenciaBadge from "./VigenciaBadge";


type Props = {
  apolice: {
    id: string;

    propostaId: string | null;
    numeroProposta: string | null;

    cliente: string;
    seguradora: string;
    tipoSeguro: string;

    numeroApolice: string;

    inicioVigencia: string;
    fimVigencia: string;

    status: string;

    premioLiquido: number | null;
    premioTotal: number | null;

    comissaoPercentual: number | null;
    comissaoValor: number | null;

    observacoes: string | null;
  };
};


function moeda(
  valor: number | null,
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  ).format(valor ?? 0);
}


function data(
  valor: string,
) {
  if (!valor) {
    return "-";
  }

  return new Date(
    `${valor}T12:00:00`,
  ).toLocaleDateString("pt-BR");
}


function Campo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="mb-2 text-sm text-slate-500">
        {titulo}
      </p>

      <div className="text-lg font-medium text-slate-800">
        {valor}
      </div>
    </div>
  );
}


export default function ApoliceView({
  apolice,
}: Props) {
  return (
    <div className="space-y-6">

      <div className="grid gap-5 md:grid-cols-2">

        <Campo
          titulo="Cliente"
          valor={apolice.cliente}
        />

        <Campo
          titulo="Seguradora"
          valor={apolice.seguradora}
        />

        <Campo
          titulo="Seguro"
          valor={apolice.tipoSeguro}
        />

        <Campo
          titulo="Número da Apólice"
          valor={apolice.numeroApolice}
        />

        <Campo
          titulo="Início da Vigência"
          valor={data(
            apolice.inicioVigencia,
          )}
        />

        <Campo
          titulo="Fim da Vigência"
          valor={
            <div className="flex flex-wrap items-center gap-3">
              {data(
                apolice.fimVigencia,
              )}

              <VigenciaBadge
                fimVigencia={
                  apolice.fimVigencia
                }
              />
            </div>
          }
        />

      </div>


      <div className="grid gap-5 md:grid-cols-2">

        <Campo
          titulo="Prêmio Líquido"
          valor={moeda(
            apolice.premioLiquido,
          )}
        />

        <Campo
          titulo="Prêmio Total"
          valor={moeda(
            apolice.premioTotal,
          )}
        />

        <Campo
          titulo="Comissão (%)"
          valor={`${
            apolice.comissaoPercentual ??
            0
          }%`}
        />

        <Campo
          titulo="Comissão (R$)"
          valor={moeda(
            apolice.comissaoValor,
          )}
        />

      </div>


      <Campo
        titulo="Observações"
        valor={
          apolice.observacoes ||
          "Nenhuma observação."
        }
      />


      <div className="rounded-2xl border border-slate-200 bg-white p-6">

        <h3 className="text-lg font-bold text-slate-800">
          Proposta de origem
        </h3>


        {apolice.propostaId ? (

          <div className="mt-4 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-blue-200 bg-blue-50 p-5">

            <div>
              <p className="text-sm font-medium text-slate-500">
                Número da Proposta
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-800">
                {apolice.numeroProposta ??
                  "Número não informado"}
              </p>

              <p className="mt-2 text-sm text-blue-700">
                Esta apólice foi emitida a
                partir de uma proposta
                comercial.
              </p>
            </div>


            <Link
              href={`/admin/propostas/${apolice.propostaId}`}
              className="rounded-xl bg-[#0A2F5A] px-5 py-3 font-semibold text-white transition hover:bg-[#082648]"
            >
              Ver Proposta
            </Link>

          </div>

        ) : (

          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-slate-600">
            Esta apólice foi cadastrada sem
            vínculo com uma proposta.
          </div>

        )}

      </div>


      <div className="flex flex-wrap justify-end gap-3">

        <Link
          href="/admin/apolices"
          className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Voltar
        </Link>

        <Link
          href={`/admin/apolices/${apolice.id}/editar`}
          className="rounded-xl bg-[#0A2F5A] px-5 py-3 font-medium text-white transition hover:bg-[#082648]"
        >
          Editar
        </Link>

      </div>

    </div>
  );
}