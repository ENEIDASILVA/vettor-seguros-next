import "server-only";

import { createClient } from "@/lib/supabase/server";

export type DashboardUltimaCotacao = {
  id: string;
  cliente: string;
  tipoSeguro: string;
  status: string;
  created_at: string;
};

type Relacionamento = {
  nome: string;
};

type RelacionamentoSupabase =
  | Relacionamento
  | Relacionamento[]
  | null;

type CotacaoRow = {
  id: string;
  created_at: string;

  cliente: RelacionamentoSupabase;
  tipo_seguro: RelacionamentoSupabase;
  status: RelacionamentoSupabase;
};

function obterNome(
  relacionamento: RelacionamentoSupabase,
): string {
  if (!relacionamento) {
    return "-";
  }

  if (Array.isArray(relacionamento)) {
    return relacionamento[0]?.nome ?? "-";
  }

  return relacionamento.nome ?? "-";
}

export async function obterUltimasCotacoes(): Promise<
  DashboardUltimaCotacao[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("cotacoes")
    .select(`
      id,
      created_at,
      cliente:clientes!cotacoes_cliente_id_fkey (
        nome
      ),
      tipo_seguro:tipos_seguro!cotacoes_tipo_seguro_id_fkey (
        nome
      ),
      status:status_cotacao!cotacoes_status_id_fkey (
        nome
      )
    `)
    .order("created_at", {
      ascending: false,
    })
    .limit(5);

  if (error) {
    console.error(
      "Erro ao buscar últimas cotações:",
      error,
    );

    throw new Error(
      `Erro ao buscar últimas cotações: ${
        error.message || "erro não informado"
      }`,
    );
  }

  const cotacoes = (data ?? []) as CotacaoRow[];

  return cotacoes.map((cotacao) => ({
    id: cotacao.id,

    cliente: obterNome(
      cotacao.cliente,
    ),

    tipoSeguro: obterNome(
      cotacao.tipo_seguro,
    ),

    status: obterNome(
      cotacao.status,
    ),

    created_at: cotacao.created_at,
  }));
}