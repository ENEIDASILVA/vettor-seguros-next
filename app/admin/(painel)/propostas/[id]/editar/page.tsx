import BasePage from "@/components/admin/common/BasePage";

import PropostaFormEdit from "@/components/admin/propostas/PropostaFormEdit";

import {
  buscarPropostaPorId,
} from "@/lib/repositories/propostasRepository";

import {
  carregarFormularioProposta,
} from "@/lib/services/propostasFormService";


export default async function EditarPropostaPage({

  params,

}: {

  params: Promise<{
    id:string;
  }>;

}) {


  const { id } =
    await params;



  const proposta =
    await buscarPropostaPorId(
      id
    );



  const formulario =
    await carregarFormularioProposta();



  return (

    <BasePage

      title="Editar Proposta"

      description="Alteração dos dados da proposta comercial."

    >


      <PropostaFormEdit

        proposta={proposta}

        clientes={
          formulario.clientes
        }


        seguradoras={
          formulario.seguradoras
        }


        tiposSeguro={
          formulario.tiposSeguro
        }


      />


    </BasePage>

  );

}