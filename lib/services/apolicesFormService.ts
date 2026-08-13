import "server-only";

import {
  createClient,
} from "@/lib/supabase/server";

import {
  obterDadosFormularioApolice,
} from "@/lib/repositories/apolicesFormRepository";

export type CotacaoPropostaApolice = {
  id: string;
  seguradoraId: number;
  seguradora: string;
  premioLiquido: number | null;
  premioTotal: number | null;
  comissaoPercentual: number | null;
  comissaoValor: number | null;
  franquiaNormal: number | null;
  percentualFipe: number | null;
  formaPagamento: string | null;
  parcelamento: string | null;
  arquivoPdfNome: string | null;
};

export type PropostaConversaoApolice = {
  id: string;
  clienteId: string;
  cotacaoId: string;
  tipoSeguroId: number;
  cliente: string;
  tipoSeguro: string;
  numeroProposta: string | null;
  status: string;
};

export async function carregarFormularioApolice() {
  return obterDadosFormularioApolice();
}

function nomeRelacionamento(
  valor:
    | { nome?: string | null }
    | { nome?: string | null }[]
    | null
    | undefined,
) {
  if (!valor) {
    return "-";
  }

  if (
    Array.isArray(
      valor,
    )
  ) {
    return (
      valor[0]?.nome ??
      "-"
    );
  }

  return (
    valor.nome ??
    "-"
  );
}

export async function carregarConversaoProposta(
  propostaId: string,
): Promise<{
  proposta: PropostaConversaoApolice;
  cotacoesProposta: CotacaoPropostaApolice[];
}> {
  if (
    !propostaId
  ) {
    throw new Error(
      "Proposta não informada.",
    );
  }

  const supabase =
    await createClient();

  const {
    data: proposta,
    error: propostaError,
  } =
    await supabase
      .from("propostas")
      .select(`
        id,
        cliente_id,
        cotacao_id,
        tipo_seguro_id,
        numero_proposta,
        status,
        cliente:clientes(
          nome
        ),
        tipo_seguro:tipos_seguro(
          nome
        )
      `)
      .eq(
        "id",
        propostaId,
      )
      .single();

  if (
    propostaError
  ) {
    throw new Error(
      `Não foi possível carregar a proposta: ${propostaError.message}`,
    );
  }

  const {
    data: itens,
    error: itensError,
  } =
    await supabase
      .from(
        "propostas_itens",
      )
      .select(`
        cotacao_seguradora_id,
        ordem
      `)
      .eq(
        "proposta_id",
        propostaId,
      )
      .order(
        "ordem",
        {
          ascending:
            true,
        },
      );

  if (
    itensError
  ) {
    throw new Error(
      `Não foi possível carregar as cotações da proposta: ${itensError.message}`,
    );
  }

  const ids =
    (
      itens ??
      []
    ).map(
      (item) =>
        String(
          item.cotacao_seguradora_id,
        ),
    );

  if (
    ids.length ===
    0
  ) {
    throw new Error(
      "A proposta não possui cotações vinculadas.",
    );
  }

  const {
    data: cotacoes,
    error: cotacoesError,
  } =
    await supabase
      .from(
        "cotacoes_seguradoras",
      )
      .select(`
        id,
        seguradora_id,
        premio_liquido,
        premio_total,
        comissao_percentual,
        comissao_valor,
        franquia_normal,
        percentual_fipe,
        forma_pagamento,
        parcelamento,
        arquivo_pdf_nome,
        seguradora:seguradoras!cotacoes_seguradoras_seguradora_id_fkey(
          nome
        )
      `)
      .in(
        "id",
        ids,
      );

  if (
    cotacoesError
  ) {
    throw new Error(
      `Não foi possível carregar as opções da proposta: ${cotacoesError.message}`,
    );
  }

  const mapa =
    new Map(
      (
        cotacoes ??
        []
      ).map(
        (item) => [
          String(
            item.id,
          ),
          item,
        ],
      ),
    );

  const cotacoesProposta =
    ids
      .map(
        (id) =>
          mapa.get(id),
      )
      .filter(
        Boolean,
      )
      .map(
        (item) => ({
          id:
            String(
              item!.id,
            ),

          seguradoraId:
            Number(
              item!
                .seguradora_id,
            ),

          seguradora:
            nomeRelacionamento(
              item!
                .seguradora,
            ),

          premioLiquido:
            item!
              .premio_liquido !==
            null
              ? Number(
                  item!
                    .premio_liquido,
                )
              : null,

          premioTotal:
            item!
              .premio_total !==
            null
              ? Number(
                  item!
                    .premio_total,
                )
              : null,

          comissaoPercentual:
            item!
              .comissao_percentual !==
            null
              ? Number(
                  item!
                    .comissao_percentual,
                )
              : null,

          comissaoValor:
            item!
              .comissao_valor !==
            null
              ? Number(
                  item!
                    .comissao_valor,
                )
              : null,

          franquiaNormal:
            item!
              .franquia_normal !==
            null
              ? Number(
                  item!
                    .franquia_normal,
                )
              : null,

          percentualFipe:
            item!
              .percentual_fipe !==
            null
              ? Number(
                  item!
                    .percentual_fipe,
                )
              : null,

          formaPagamento:
            item!
              .forma_pagamento ??
            null,

          parcelamento:
            item!
              .parcelamento ??
            null,

          arquivoPdfNome:
            item!
              .arquivo_pdf_nome ??
            null,
        }),
      );

  return {
    proposta: {
      id:
        String(
          proposta.id,
        ),

      clienteId:
        String(
          proposta.cliente_id,
        ),

      cotacaoId:
        String(
          proposta.cotacao_id,
        ),

      tipoSeguroId:
        Number(
          proposta.tipo_seguro_id,
        ),

      cliente:
        nomeRelacionamento(
          proposta.cliente,
        ),

      tipoSeguro:
        nomeRelacionamento(
          proposta.tipo_seguro,
        ),

      numeroProposta:
        proposta.numero_proposta ??
        null,

      status:
        proposta.status,
    },

    cotacoesProposta,
  };
}
