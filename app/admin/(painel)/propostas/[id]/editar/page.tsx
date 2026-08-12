import {
  notFound,
} from "next/navigation";

import BasePage from "@/components/admin/common/BasePage";

import PropostaFormEdit from "@/components/admin/propostas/PropostaFormEdit";

import {
  buscarPropostaPorId,
} from "@/lib/repositories/propostasRepository";

import {
  createClient,
} from "@/lib/supabase/server";


type Props = {
  params: Promise<{
    id: string;
  }>;
};


export default async function EditarPropostaPage({
  params,
}: Props) {
  const { id } =
    await params;

  const proposta =
    await buscarPropostaPorId(
      id,
    );

  if (!proposta) {
    notFound();
  }

  const supabase =
    await createClient();

  const [
    clientesResponse,
    seguradorasResponse,
    tiposSeguroResponse,
  ] =
    await Promise.all([
      supabase
        .from("clientes")
        .select("id, nome")
        .order(
          "nome",
          {
            ascending: true,
          },
        ),

      supabase
        .from("seguradoras")
        .select("id, nome")
        .eq(
          "ativo",
          true,
        )
        .order(
          "nome",
          {
            ascending: true,
          },
        ),

      supabase
        .from("tipos_seguro")
        .select("id, nome")
        .order(
          "nome",
          {
            ascending: true,
          },
        ),
    ]);

  if (
    clientesResponse.error
  ) {
    throw new Error(
      `Não foi possível carregar os clientes: ${clientesResponse.error.message}`,
    );
  }

  if (
    seguradorasResponse.error
  ) {
    throw new Error(
      `Não foi possível carregar as seguradoras: ${seguradorasResponse.error.message}`,
    );
  }

  if (
    tiposSeguroResponse.error
  ) {
    throw new Error(
      `Não foi possível carregar os tipos de seguro: ${tiposSeguroResponse.error.message}`,
    );
  }

  return (
    <BasePage
      title="Editar Proposta"
      description="Alteração dos dados da proposta comercial."
    >
      <PropostaFormEdit
        proposta={proposta}
        clientes={
          clientesResponse.data ??
          []
        }
        seguradoras={
          seguradorasResponse.data ??
          []
        }
        tiposSeguro={
          tiposSeguroResponse.data ??
          []
        }
      />
    </BasePage>
  );
}