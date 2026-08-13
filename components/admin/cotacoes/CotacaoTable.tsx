import {
  obterCotacoes,
} from "@/lib/services/cotacoesService";

import CotacaoTableClient from "./CotacaoTableClient";

export default async function CotacaoTable() {
  const cotacoes =
    await obterCotacoes();

  return (
    <CotacaoTableClient
      cotacoes={cotacoes}
    />
  );
}
