import BasePage from "@/components/admin/common/BasePage";

import PropostaForm from "@/components/admin/propostas/PropostaForm";

import {
  carregarFormularioProposta,
} from "@/lib/services/propostasFormService";


export const dynamic = "force-dynamic";


export default async function NovaPropostaPage(){


  const dados =
    await carregarFormularioProposta();



  return (

    <BasePage

      title="Nova Proposta"

      description="Cadastro de uma nova proposta comercial."

    >


      <div className="
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-8
      ">


        <PropostaForm

          clientes={dados.clientes}

          cotacoes={dados.cotacoes}

          seguradoras={dados.seguradoras}

          tiposSeguro={dados.tiposSeguro}

        />


      </div>


    </BasePage>

  );

}