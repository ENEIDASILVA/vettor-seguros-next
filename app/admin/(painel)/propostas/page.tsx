import BasePage from "@/components/admin/common/BasePage";
import PropostaTable from "@/components/admin/propostas/PropostaTable";

import {
  obterPropostas,
} from "@/lib/services/propostasService";

export const dynamic =
  "force-dynamic";

type Props = {
  searchParams: Promise<{
    sucesso?: string;
    excluido?: string;
    atualizado?: string;
  }>;
};

export default async function PropostasPage({
  searchParams,
}: Props) {
  const params =
    await searchParams;

  const propostas =
    await obterPropostas();

  return (
    <BasePage
      title="Propostas"
      description="Gerenciamento das propostas comerciais."
    >
      <div className="space-y-6">

        {(params.sucesso === "1" ||
          params.atualizado === "1" ||
          params.excluido === "1") && (
          <div
            className={`
              rounded-xl
              border
              px-5
              py-4
              font-medium
              ${
                params.sucesso === "1"
                  ? "border-green-200 bg-green-50 text-green-700"
                  : params.atualizado === "1"
                    ? "border-blue-200 bg-blue-50 text-blue-700"
                    : "border-red-200 bg-red-50 text-red-700"
              }
            `}
          >
            {params.sucesso === "1" &&
              "✅ Proposta criada com sucesso."}

            {params.atualizado === "1" &&
              "✅ Proposta atualizada com sucesso."}

            {params.excluido === "1" &&
              "🗑️ Proposta excluída com sucesso."}
          </div>
        )}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-xl font-bold text-slate-800">
                Propostas Comerciais
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Acompanhe as propostas enviadas aos clientes.
              </p>

            </div>

            <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
              {propostas.length} proposta
              {propostas.length !== 1
                ? "s"
                : ""}
            </div>

          </div>

        </div>

        <PropostaTable
          propostas={propostas}
        />

      </div>
    </BasePage>
  );
}