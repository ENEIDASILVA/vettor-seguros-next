import "server-only";

import {
  createClient,
} from "@/lib/supabase/server";


export type PropostaLista = {
  id: string;

  cliente: string;

  seguradoras: string[];

  tipoSeguro: string;

  melhorPremio: number | null;

  premioTotal: number | null;

  status: string;

  possuiApolice: boolean;

  apoliceId?: string;

  arquivoPdfPath: string | null;
};


export type PropostaDetalhe = {
  id: string;

  clienteId: string;

  cotacaoId: string | null;

  seguradoraId: number;

  tipoSeguroId: number;

  cliente: string;

  seguradora: string;

  tipoSeguro: string;

  numeroProposta: string | null;

  premioLiquido: number | null;

  premioTotal: number | null;

  comissaoPercentual: number | null;

  comissaoValor: number | null;

  status: string;

  createdAt: string;

  apolice: {
    id: string;

    numeroApolice: string;

    status: string;

    inicioVigencia: string;

    fimVigencia: string;
  } | null;
};


export async function listarPropostas():
Promise<PropostaLista[]> {
  const supabase =
    await createClient();


  const [
    propostasResult,
    apolicesResult,
  ] =
    await Promise.all([
      supabase
        .from("propostas")
        .select(`
          id,
          premio_total,
          status,
          arquivo_pdf_path,
          created_at,

          cliente:clientes(
            nome
          ),

          tipo_seguro:tipos_seguro(
            nome
          )
        `)
        .order(
          "created_at",
          {
            ascending: false,
          },
        ),

      supabase
        .from("apolices")
        .select(`
          id,
          proposta_id
        `),
    ]);


  if (
    propostasResult.error
  ) {
    throw new Error(
      `Não foi possível listar as propostas: ${propostasResult.error.message}`,
    );
  }


  if (
    apolicesResult.error
  ) {
    throw new Error(
      `Não foi possível consultar as apólices: ${apolicesResult.error.message}`,
    );
  }


  const propostas =
    propostasResult.data ??
    [];


  if (
    propostas.length === 0
  ) {
    return [];
  }


  const mapaApolices =
    new Map<
      string,
      string
    >();


  for (
    const apolice
    of apolicesResult.data ??
      []
  ) {
    if (
      !apolice.proposta_id
    ) {
      continue;
    }

    mapaApolices.set(
      String(
        apolice.proposta_id,
      ),
      String(
        apolice.id,
      ),
    );
  }


  const propostasIds =
    propostas.map(
      (proposta) =>
        String(
          proposta.id,
        ),
    );


  /*
   * Primeiro buscamos apenas a relação
   * proposta -> cotação da seguradora.
   *
   * Evitamos relacionamento automático
   * com seguradoras porque a tabela
   * cotacoes_seguradoras possui mais de
   * uma FK apontando para seguradoras.
   */
  const {
    data: itens,
    error: itensError,
  } =
    await supabase
      .from(
        "propostas_itens",
      )
      .select(`
        proposta_id,
        cotacao_seguradora_id,
        ordem
      `)
      .in(
        "proposta_id",
        propostasIds,
      )
      .order(
        "ordem",
        {
          ascending: true,
        },
      );


  if (
    itensError
  ) {
    throw new Error(
      `Não foi possível consultar os itens das propostas: ${itensError.message}`,
    );
  }


  const cotacoesSeguradorasIds =
    [
      ...new Set(
        (
          itens ?? []
        ).map(
          (item) =>
            String(
              item.cotacao_seguradora_id,
            ),
        ),
      ),
    ];


  const mapaCotacoesSeguradoras =
    new Map<
      string,
      {
        seguradoraId:
          number;

        premioTotal:
          number | null;
      }
    >();


  const mapaNomesSeguradoras =
    new Map<
      number,
      string
    >();


  if (
    cotacoesSeguradorasIds.length >
    0
  ) {
    const {
      data:
        cotacoesSeguradoras,
      error:
        cotacoesSeguradorasError,
    } =
      await supabase
        .from(
          "cotacoes_seguradoras",
        )
        .select(`
          id,
          seguradora_id,
          premio_total
        `)
        .in(
          "id",
          cotacoesSeguradorasIds,
        );


    if (
      cotacoesSeguradorasError
    ) {
      throw new Error(
        `Não foi possível consultar as cotações das seguradoras: ${cotacoesSeguradorasError.message}`,
      );
    }


    const seguradorasIds =
      [
        ...new Set(
          (
            cotacoesSeguradoras ??
            []
          ).map(
            (item) =>
              Number(
                item.seguradora_id,
              ),
          ),
        ),
      ];


    if (
      seguradorasIds.length >
      0
    ) {
      const {
        data: seguradoras,
        error:
          seguradorasError,
      } =
        await supabase
          .from(
            "seguradoras",
          )
          .select(
            "id, nome",
          )
          .in(
            "id",
            seguradorasIds,
          );


      if (
        seguradorasError
      ) {
        throw new Error(
          `Não foi possível consultar as seguradoras: ${seguradorasError.message}`,
        );
      }


      for (
        const seguradora
        of seguradoras ?? []
      ) {
        mapaNomesSeguradoras.set(
          Number(
            seguradora.id,
          ),
          seguradora.nome,
        );
      }
    }


    for (
      const cotacao
      of cotacoesSeguradoras ??
        []
    ) {
      mapaCotacoesSeguradoras.set(
        String(
          cotacao.id,
        ),
        {
          seguradoraId:
            Number(
              cotacao.seguradora_id,
            ),

          premioTotal:
            cotacao.premio_total !==
            null
              ? Number(
                  cotacao.premio_total,
                )
              : null,
        },
      );
    }
  }


  const mapaSeguradoras =
    new Map<
      string,
      string[]
    >();


  const mapaMelhorPremio =
    new Map<
      string,
      number
    >();


  for (
    const item
    of itens ?? []
  ) {
    const propostaId =
      String(
        item.proposta_id,
      );


    const cotacao =
      mapaCotacoesSeguradoras.get(
        String(
          item.cotacao_seguradora_id,
        ),
      );


    if (!cotacao) {
      continue;
    }


    const nomeSeguradora =
      mapaNomesSeguradoras.get(
        cotacao.seguradoraId,
      );


    if (
      nomeSeguradora
    ) {
      const nomes =
        mapaSeguradoras.get(
          propostaId,
        ) ?? [];


      if (
        !nomes.includes(
          nomeSeguradora,
        )
      ) {
        nomes.push(
          nomeSeguradora,
        );
      }


      mapaSeguradoras.set(
        propostaId,
        nomes,
      );
    }


    if (
      cotacao.premioTotal !==
      null
    ) {
      const melhorAtual =
        mapaMelhorPremio.get(
          propostaId,
        );


      if (
        melhorAtual ===
          undefined ||
        cotacao.premioTotal <
          melhorAtual
      ) {
        mapaMelhorPremio.set(
          propostaId,
          cotacao.premioTotal,
        );
      }
    }
  }


  return propostas.map(
    (item: any) => {
      const melhorPremio =
        mapaMelhorPremio.get(
          String(
            item.id,
          ),
        ) ??
        (
          item.premio_total !==
          null
            ? Number(
                item.premio_total,
              )
            : null
        );


      return {
        id:
          String(
            item.id,
          ),

        cliente:
          item.cliente?.nome ??
          item.cliente?.[0]
            ?.nome ??
          "-",

        seguradoras:
          mapaSeguradoras.get(
            String(
              item.id,
            ),
          ) ?? [],

        melhorPremio,

        tipoSeguro:
          item.tipo_seguro
            ?.nome ??
          item.tipo_seguro?.[0]
            ?.nome ??
          "-",

          arquivoPdfPath:
          item.arquivo_pdf_path ?? null,


        /*
         * Mantido temporariamente
         * por compatibilidade com
         * componentes antigos.
         */
        premioTotal:
          melhorPremio,

        status:
          mapaApolices.has(
            String(
              item.id,
            ),
          )
            ? "Convertida em Apólice"
            : (
                item.status ===
                  "Enviada para o cliente" ||
                item.status ===
                  "Enviada ao Cliente"
              )
              ? "Enviada para o cliente"
              : "Em elaboração",

        possuiApolice:
          mapaApolices.has(
            String(
              item.id,
            ),
          ),

        apoliceId:
          mapaApolices.get(
            String(
              item.id,
            ),
          ),
      };
    },
  );
}


export async function buscarPropostaPorId(
  id: string,
): Promise<PropostaDetalhe | null> {
  if (!id) {
    throw new Error(
      "ID da proposta não informado.",
    );
  }


  const supabase =
    await createClient();


  const [
    propostaResult,
    apoliceResult,
  ] =
    await Promise.all([
      supabase
        .from("propostas")
        .select(`
          id,
          cliente_id,
          cotacao_id,
          seguradora_id,
          tipo_seguro_id,
          numero_proposta,
          premio_liquido,
          premio_total,
          comissao_percentual,
          comissao_valor,
          status,
          created_at,

          cliente:clientes(
            nome
          ),

          seguradora:seguradoras(
            nome
          ),

          tipo_seguro:tipos_seguro(
            nome
          )
        `)
        .eq(
          "id",
          id,
        )
        .maybeSingle(),

      supabase
        .from("apolices")
        .select(`
          id,
          numero_apolice,
          status,
          inicio_vigencia,
          fim_vigencia
        `)
        .eq(
          "proposta_id",
          id,
        )
        .maybeSingle(),
    ]);


  if (
    propostaResult.error
  ) {
    throw new Error(
      `Não foi possível buscar a proposta: ${propostaResult.error.message}`,
    );
  }


  if (
    apoliceResult.error
  ) {
    throw new Error(
      `Não foi possível consultar a apólice da proposta: ${apoliceResult.error.message}`,
    );
  }


  const data =
    propostaResult.data;


  if (!data) {
    return null;
  }


  const cliente =
    (
      data.cliente as any
    )?.nome ??
    (
      data.cliente as any
    )?.[0]?.nome ??
    "-";


  const seguradora =
    (
      data.seguradora as any
    )?.nome ??
    (
      data.seguradora as any
    )?.[0]?.nome ??
    "-";


  const tipoSeguro =
    (
      data.tipo_seguro as any
    )?.nome ??
    (
      data.tipo_seguro as any
    )?.[0]?.nome ??
    "-";


  const apoliceData =
    apoliceResult.data;


  return {
    id:
      String(
        data.id,
      ),

    clienteId:
      data.cliente_id
        ? String(
            data.cliente_id,
          )
        : "",

    cotacaoId:
      data.cotacao_id
        ? String(
            data.cotacao_id,
          )
        : null,

    /*
     * Mantido por compatibilidade
     * com a tela antiga de edição.
     * No fluxo novo a seguradora
     * pertence aos itens da proposta.
     */
    seguradoraId:
      data.seguradora_id !==
      null
        ? Number(
            data.seguradora_id,
          )
        : 0,

    tipoSeguroId:
      data.tipo_seguro_id !==
      null
        ? Number(
            data.tipo_seguro_id,
          )
        : 0,

    cliente,

    seguradora,

    tipoSeguro,

    numeroProposta:
      data.numero_proposta ??
      null,

    premioLiquido:
      data.premio_liquido !==
      null
        ? Number(
            data.premio_liquido,
          )
        : null,

    premioTotal:
      data.premio_total !==
      null
        ? Number(
            data.premio_total,
          )
        : null,

    comissaoPercentual:
      data.comissao_percentual !==
      null
        ? Number(
            data.comissao_percentual,
          )
        : null,

    comissaoValor:
      data.comissao_valor !==
      null
        ? Number(
            data.comissao_valor,
          )
        : null,

    status:
      data.status ??
      "Em elaboração",

    createdAt:
      String(
        data.created_at,
      ),

    apolice:
      apoliceData
        ? {
            id:
              String(
                apoliceData.id,
              ),

            numeroApolice:
              apoliceData.numero_apolice ??
              "",

            status:
              apoliceData.status ??
              "-",

            inicioVigencia:
              apoliceData.inicio_vigencia ??
              "",

            fimVigencia:
              apoliceData.fim_vigencia ??
              "",
          }
        : null,
  };
}


export async function gerarPropostaDaCotacao(
  cotacaoId: string,
): Promise<string> {
  if (!cotacaoId) {
    throw new Error(
      "Cotação não informada.",
    );
  }


  const supabase =
    await createClient();


  const {
    data:
      propostaExistente,
    error:
      propostaExistenteError,
  } =
    await supabase
      .from("propostas")
      .select("id")
      .eq(
        "cotacao_id",
        cotacaoId,
      )
      .maybeSingle();


  if (
    propostaExistenteError
  ) {
    throw new Error(
      `Não foi possível verificar a proposta existente: ${propostaExistenteError.message}`,
    );
  }


  /*
   * A cotação possui uma proposta única
   * na arquitetura atual. Se já existir,
   * sincronizamos os itens em vez de
   * tentar criar outra proposta.
   */
  if (
    propostaExistente
  ) {
    await sincronizarItensProposta(
      String(
        propostaExistente.id,
      ),
      cotacaoId,
    );

    return String(
      propostaExistente.id,
    );
  }


  const {
    data: cotacao,
    error: cotacaoError,
  } =
    await supabase
      .from("cotacoes")
      .select(`
        cliente_id,
        tipo_seguro_id
      `)
      .eq(
        "id",
        cotacaoId,
      )
      .single();


  if (
    cotacaoError
  ) {
    throw new Error(
      `Não foi possível carregar a cotação: ${cotacaoError.message}`,
    );
  }


  const {
    data:
      cotacoesSelecionadas,
    error:
      cotacoesSelecionadasError,
  } =
    await supabase
      .from(
        "cotacoes_seguradoras",
      )
      .select(`
        id,
        premio_liquido,
        premio_total,
        comissao_percentual,
        comissao_valor
      `)
      .eq(
        "cotacao_id",
        cotacaoId,
      )
      .eq(
        "recomendada",
        true,
      )
      .order(
        "premio_total",
        {
          ascending: true,
        },
      );


  if (
    cotacoesSelecionadasError
  ) {
    throw new Error(
      `Não foi possível carregar as cotações selecionadas: ${cotacoesSelecionadasError.message}`,
    );
  }


  if (
    !cotacoesSelecionadas ||
    cotacoesSelecionadas.length ===
      0
  ) {
    throw new Error(
      "Nenhuma seguradora foi selecionada para a proposta.",
    );
  }


  const primeiraOpcao =
    cotacoesSelecionadas[0];


  const {
    data: proposta,
    error: propostaError,
  } =
    await supabase
      .from("propostas")
      .insert({
        cotacao_id:
          cotacaoId,

        cliente_id:
          cotacao.cliente_id,

        tipo_seguro_id:
          cotacao.tipo_seguro_id,

        /*
         * A proposta ainda não foi enviada.
         * O status será alterado quando o
         * PDF comercial for gerado/enviado.
         */
        status:
          "Em elaboração",

        /*
         * Campos antigos preservados
         * temporariamente para telas
         * ainda não refatoradas.
         */
        premio_liquido:
          primeiraOpcao
            .premio_liquido,

        premio_total:
          primeiraOpcao
            .premio_total,

        comissao_percentual:
          primeiraOpcao
            .comissao_percentual,

        comissao_valor:
          primeiraOpcao
            .comissao_valor,
      })
      .select("id")
      .single();


  if (
    propostaError
  ) {
    throw new Error(
      `Não foi possível criar a proposta: ${propostaError.message}`,
    );
  }


  const propostaId =
    String(
      proposta.id,
    );


  const itens =
    cotacoesSelecionadas.map(
      (
        cotacaoSeguradora,
        index,
      ) => ({
        proposta_id:
          propostaId,

        cotacao_seguradora_id:
          cotacaoSeguradora.id,

        ordem:
          index,
      }),
    );


  const {
    error:
      itensInsertError,
  } =
    await supabase
      .from(
        "propostas_itens",
      )
      .insert(
        itens,
      );


  if (
    itensInsertError
  ) {
    /*
     * Evita deixar uma proposta vazia
     * caso a criação dos itens falhe.
     */
    await supabase
      .from("propostas")
      .delete()
      .eq(
        "id",
        propostaId,
      );

    throw new Error(
      `Não foi possível vincular as cotações à proposta: ${itensInsertError.message}`,
    );
  }


  return propostaId;
}


export async function sincronizarItensProposta(
  propostaId: string,
  cotacaoId: string,
): Promise<void> {
  if (
    !propostaId ||
    !cotacaoId
  ) {
    throw new Error(
      "Proposta ou cotação não informada.",
    );
  }


  const supabase =
    await createClient();


  const {
    data:
      cotacoesSelecionadas,
    error:
      cotacoesSelecionadasError,
  } =
    await supabase
      .from(
        "cotacoes_seguradoras",
      )
      .select(`
        id,
        premio_liquido,
        premio_total,
        comissao_percentual,
        comissao_valor
      `)
      .eq(
        "cotacao_id",
        cotacaoId,
      )
      .eq(
        "recomendada",
        true,
      )
      .order(
        "premio_total",
        {
          ascending: true,
        },
      );


  if (
    cotacoesSelecionadasError
  ) {
    throw new Error(
      `Não foi possível consultar as cotações selecionadas: ${cotacoesSelecionadasError.message}`,
    );
  }


  if (
    !cotacoesSelecionadas ||
    cotacoesSelecionadas.length ===
      0
  ) {
    throw new Error(
      "A proposta precisa possuir pelo menos uma cotação selecionada.",
    );
  }


  /*
   * Substituímos os itens da proposta
   * pela seleção atual da cotação.
   *
   * Isso permite adicionar/remover
   * seguradoras e gerar novamente
   * a proposta para o cliente.
   */
  const {
    error: deleteError,
  } =
    await supabase
      .from(
        "propostas_itens",
      )
      .delete()
      .eq(
        "proposta_id",
        propostaId,
      );


  if (
    deleteError
  ) {
    throw new Error(
      `Não foi possível atualizar os itens da proposta: ${deleteError.message}`,
    );
  }


  const itens =
    cotacoesSelecionadas.map(
      (
        cotacaoSeguradora,
        index,
      ) => ({
        proposta_id:
          propostaId,

        cotacao_seguradora_id:
          cotacaoSeguradora.id,

        ordem:
          index,
      }),
    );


  const {
    error: insertError,
  } =
    await supabase
      .from(
        "propostas_itens",
      )
      .insert(
        itens,
      );


  if (
    insertError
  ) {
    throw new Error(
      `Não foi possível gravar os novos itens da proposta: ${insertError.message}`,
    );
  }


  const primeiraOpcao =
    cotacoesSelecionadas[0];


  const {
    error: updateError,
  } =
    await supabase
      .from("propostas")
      .update({
        premio_liquido:
          primeiraOpcao
            .premio_liquido,

        premio_total:
          primeiraOpcao
            .premio_total,

        comissao_percentual:
          primeiraOpcao
            .comissao_percentual,

        comissao_valor:
          primeiraOpcao
            .comissao_valor,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        propostaId,
      );


  if (
    updateError
  ) {
    throw new Error(
      `Os itens foram atualizados, mas não foi possível atualizar a proposta: ${updateError.message}`,
    );
  }
}