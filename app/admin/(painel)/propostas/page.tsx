import BasePage from "@/components/admin/common/BasePage";
import Link from "next/link";
import PropostaTable from "@/components/admin/propostas/PropostaTable";

import {
  obterPropostas,
} from "@/lib/services/propostasService";


export const dynamic = "force-dynamic";


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

  const params = await searchParams;

  const propostas =
    await obterPropostas();


  return (
    <BasePage
  title="Propostas"
  description="Gerenciamento das propostas comerciais."
>

  <div className="mb-6 flex justify-end">

    <Link
      href="/admin/propostas/nova"
      className="
        rounded-xl
        bg-[#0A2F5A]
        px-6
        py-3
        font-semibold
        text-white
        transition
        hover:bg-[#082648]
      "
    >
      + Nova Proposta
    </Link>

  </div>

      {params.sucesso === "1" && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-5 py-4 font-medium text-green-700">
          ✅ Proposta cadastrada com sucesso!
        </div>
      )}


      {params.atualizado === "1" && (
        <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-5 py-4 font-medium text-blue-700">
          ✅ Proposta atualizada com sucesso!
        </div>
      )}


      {params.excluido === "1" && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-5 py-4 font-medium text-red-700">
          🗑️ Proposta excluída com sucesso!
        </div>
      )}


      <PropostaTable
        propostas={propostas}
      />

    </BasePage>
  );
}