import "server-only";

import { createClient } from "@/lib/supabase/server";


export type CotacaoCliente = {
  id: string;
  nome: string;
};


export type CotacaoTipoSeguro = {
  id: number;
  nome: string;
};


export type CotacaoStatus = {
  id: number;
  nome: string;
};


export type CotacaoDados =
  Record<string, unknown>;


export type CotacaoProposta = {
  id: string;
  numeroProposta: string | null;
  status: string;
};


export type Cotacao = {
  id: string;

  cliente_id: string;
  tipo_seguro_id: number;
  status_id: number;

  origem: string | null;

  dados: CotacaoDados;

  quantidadeCotacoesSeguradoras: number;

  observacoes: string | null;

  created_at: string;
  updated_at: string;

  cliente?: CotacaoCliente | null;

  tipo_seguro?:
    CotacaoTipoSeguro | null;

  status?: CotacaoStatus | null;

  proposta?: CotacaoProposta | null;
};


export type NovaCotacao = {
  cliente_id: string;
  tipo_seguro_id: number;
  status_id: number;

  origem: string | null;

  dados: CotacaoDados;

  observacoes: string | null;
};


export type AtualizarCotacao =
  Partial<NovaCotacao>;


const cotacaoSelect = `
  *,

  cliente:clientes (
    id,
    nome
  ),

  tipo_seguro:tipos_seguro (
    id,
    nome
  ),

  status:status_cotacao (
    id,
    nome
  )
`;


function obterPrimeiroRelacionamento<T>(
  relacionamento:
    | T
    | T[]
    | null
    | undefined,
): T | null {
  if (!relacionamento) {
    return null;
  }

  if (Array.isArray(relacionamento)) {
    return relacionamento[0] ?? null;
  }

  return relacionamento;
}


function normalizarCotacao(
  item: any,
  proposta:
    CotacaoProposta | null,
): Cotacao {
  return {
    id:
      item.id,

    cliente_id:
      item.cliente_id,

    tipo_seguro_id:
      item.tipo_seguro_id,

    status_id:
      item.status_id,

    origem:
      item.origem ?? null,

    dados:
      item.dados ?? {},

    observacoes:
      item.observacoes ?? null,

    created_at:
      item.created_at,

    updated_at:
      item.updated_at,

    quantidadeCotacoesSeguradoras: 0,

    cliente:
      obterPrimeiroRelacionamento<
        CotacaoCliente
      >(item.cliente),

    tipo_seguro:
      obterPrimeiroRelacionamento<
        CotacaoTipoSeguro
      >(item.tipo_seguro),

    status:
      obterPrimeiroRelacionamento<
        CotacaoStatus
      >(item.status),

    proposta,
  };
}


export async function listarCotacoes():
Promise<Cotacao[]> {
  const supabase =
    await createClient();


  const cotacoesResponse =
    await supabase
      .from("cotacoes")
      .select(cotacaoSelect)
      .order(
        "created_at",
        {
          ascending: false,
        },
      );


  if (cotacoesResponse.error) {
    throw new Error(
      `Não foi possível listar as cotações: ${cotacoesResponse.error.message}`,
    );
  }


  const propostasResponse =
    await supabase
      .from("propostas")
      .select(`
        id,
        cotacao_id,
        numero_proposta,
        status
      `);


  if (propostasResponse.error) {
    throw new Error(
      `Não foi possível consultar as propostas: ${propostasResponse.error.message}`,
    );
  }

  const cotacoesSeguradorasResponse =
  await supabase
    .from("cotacoes_seguradoras")
    .select("cotacao_id");

if (cotacoesSeguradorasResponse.error) {
  throw new Error(
    `Não foi possível consultar as cotações das seguradoras: ${cotacoesSeguradorasResponse.error.message}`,
  );
}

const quantidadePorCotacao =
  new Map<string, number>();

for (const item of cotacoesSeguradorasResponse.data ?? []) {
  const id = String(item.cotacao_id);

  quantidadePorCotacao.set(
    id,
    (quantidadePorCotacao.get(id) ?? 0) + 1,
  );
}


  const propostasPorCotacao =
    new Map<
      string,
      CotacaoProposta
    >();


  for (
    const proposta
    of propostasResponse.data ?? []
  ) {
    if (!proposta.cotacao_id) {
      continue;
    }


    propostasPorCotacao.set(
      String(
        proposta.cotacao_id,
      ),
      {
        id:
          String(proposta.id),

        numeroProposta:
          proposta.numero_proposta ??
          null,

        status:
          proposta.status ?? "-",
      },
    );
  }


  return (
    cotacoesResponse.data ?? []
  ).map((item: any) => {
    const proposta =
      propostasPorCotacao.get(
        String(item.id),
      ) ?? null;


const cotacao =
  normalizarCotacao(
    item,
    proposta,
  );

cotacao.quantidadeCotacoesSeguradoras =
  quantidadePorCotacao.get(
    String(item.id),
  ) ?? 0;

if (cotacao.proposta) {
  cotacao.status = {
    id: 3,
    nome: "Proposta Gerada",
  };
} else if (
  cotacao.quantidadeCotacoesSeguradoras > 0
) {
  cotacao.status = {
    id: 2,
    nome: "Em Cotação",
  };
} else {
  cotacao.status = {
    id: 1,
    nome: "Nova",
  };
}

return cotacao;
  });
}


export async function buscarCotacao(
  id: string,
): Promise<Cotacao | null> {
  if (!id) {
    throw new Error(
      "ID da cotação não informado.",
    );
  }


  const supabase =
    await createClient();


  const cotacaoResponse =
    await supabase
      .from("cotacoes")
      .select(cotacaoSelect)
      .eq(
        "id",
        id,
      )
      .maybeSingle();


  if (cotacaoResponse.error) {
    throw new Error(
      `Não foi possível buscar a cotação: ${cotacaoResponse.error.message}`,
    );
  }


  if (!cotacaoResponse.data) {
    return null;
  }


  const propostaResponse =
    await supabase
      .from("propostas")
      .select(`
        id,
        numero_proposta,
        status
      `)
      .eq(
        "cotacao_id",
        id,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(1)
      .maybeSingle();


  if (propostaResponse.error) {
    throw new Error(
      `Não foi possível consultar a proposta vinculada: ${propostaResponse.error.message}`,
    );
  }


  const proposta:
    CotacaoProposta | null =
    propostaResponse.data
      ? {
          id:
            String(
              propostaResponse.data.id,
            ),

          numeroProposta:
            propostaResponse.data
              .numero_proposta ??
            null,

          status:
            propostaResponse.data
              .status ??
            "-",
        }
      : null;


  return normalizarCotacao(
    cotacaoResponse.data,
    proposta,
  );
}


export async function inserirCotacao(
  dados: NovaCotacao,
): Promise<string> {
  const supabase =
    await createClient();


  const { data, error } =
    await supabase
      .from("cotacoes")
      .insert(dados)
      .select("id")
      .single();


  if (error) {
    throw new Error(
      `Não foi possível cadastrar a cotação: ${error.message}`,
    );
  }


  return String(data.id);
}


export async function atualizarCotacao(
  id: string,
  dados: AtualizarCotacao,
): Promise<void> {
  if (!id) {
    throw new Error(
      "ID da cotação não informado.",
    );
  }


  const supabase =
    await createClient();


  const { error } =
  await supabase
    .from("cotacoes")
    .update({
      ...dados,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

if (error) {
  throw new Error(
    `Não foi possível atualizar a cotação: ${error.message}`,
  );
}
}


export async function listarTiposSeguro():
Promise<CotacaoTipoSeguro[]> {
  const supabase =
    await createClient();


  const { data, error } =
    await supabase
      .from("tipos_seguro")
      .select("id, nome")
      .order(
        "id",
        {
          ascending: true,
        },
      );


  if (error) {
    throw new Error(
      `Não foi possível listar os tipos de seguro: ${error.message}`,
    );
  }


  return (
    data ?? []
  ) as CotacaoTipoSeguro[];
}


export async function listarStatusCotacao():
Promise<CotacaoStatus[]> {
  const supabase =
    await createClient();


  const { data, error } =
    await supabase
      .from("status_cotacao")
      .select("id, nome")
      .order(
        "id",
        {
          ascending: true,
        },
      );


  if (error) {
    throw new Error(
      `Não foi possível listar os status das cotações: ${error.message}`,
    );
  }


  return (
    data ?? []
  ) as CotacaoStatus[];
}