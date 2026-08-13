import {
  obterCotacoesSeguradoras,
} from "@/lib/services/cotacoesSeguradorasService";

import {
  obterAssistencia24h,
  obterCarroReserva,
  obterSeguradorasOptions,
  obterStatusCotacao,
  obterTiposCasco,
  obterTiposCotacao,
} from "@/lib/services/cotacoesSeguradorasFormService";

import { createClient } from "@/lib/supabase/server";

import CotacaoSeguradorasWorkspace from "./CotacaoSeguradorasWorkspace";


type Props = {
  cotacaoId: string;
};


export default async function CotacaoSeguradorasTable({
  cotacaoId,
}: Props) {
  const supabase =
    await createClient();

  const {
    data: cotacaoOrigem,
    error: cotacaoOrigemError,
  } =
    await supabase
      .from("cotacoes")
      .select(`
        tipo_seguro:tipos_seguro(
          nome
        )
      `)
      .eq("id", cotacaoId)
      .single();

  if (cotacaoOrigemError) {
    throw new Error(
      `Não foi possível identificar o tipo de seguro da cotação: ${cotacaoOrigemError.message}`,
    );
  }

  const relacionamentoTipo =
    cotacaoOrigem?.tipo_seguro as
      | { nome?: string | null }
      | { nome?: string | null }[]
      | null
      | undefined;

  const tipoSeguro =
    (
      Array.isArray(relacionamentoTipo)
        ? relacionamentoTipo[0]?.nome
        : relacionamentoTipo?.nome
    ) ?? "";

  const [
    cotacoes,
    seguradoras,
  ] = await Promise.all([
    obterCotacoesSeguradoras(
      cotacaoId,
    ),

    obterSeguradorasOptions(),
  ]);


  const statusOptions =
    obterStatusCotacao();


  const tiposCotacao =
    obterTiposCotacao();


  const tiposCasco =
    obterTiposCasco();


  const carroReservaOptions =
    obterCarroReserva();


  const assistenciaOptions =
    obterAssistencia24h();


  return (
    <CotacaoSeguradorasWorkspace
      cotacaoId={cotacaoId}
      cotacoes={cotacoes}
      seguradoras={seguradoras}
      statusOptions={statusOptions}
      tiposCotacao={tiposCotacao}
      tiposCasco={tiposCasco}
      carroReservaOptions={
        carroReservaOptions
      }
      assistenciaOptions={
        assistenciaOptions
      }
      tipoSeguro={tipoSeguro}
    />
  );
}