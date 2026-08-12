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

import CotacaoSeguradorasWorkspace from "./CotacaoSeguradorasWorkspace";


type Props = {
  cotacaoId: string;
};


export default async function CotacaoSeguradorasTable({
  cotacaoId,
}: Props) {
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
    />
  );
}