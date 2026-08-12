import "server-only";

import { createClient } from "@/lib/supabase/server";


export type DadosEspecificosCotacao =
  Record<string, unknown>;


export type CotacaoSeguradoraLista = {
  id: string;

  cotacaoId: string;

  seguradoraId: number;

  seguradora: string;

  numeroCotacao: string | null;

  codigoCalculo: string | null;

  tipoCotacao: string | null;

  classeBonus: string | null;

  premioLiquido: number | null;

  premioTotal: number | null;

  iof: number | null;

  custoApolice: number | null;

  franquiaNormal: number | null;

  franquiaReduzida: number | null;

  franquiaMajorada: number | null;

  percentualFipe: number | null;

  tipoCasco: string | null;

  danosMateriais: number | null;

  danosCorporais: number | null;

  danosMorais: number | null;

  appMorte: number | null;

  appInvalidez: number | null;

  appDespesasMedicas: number | null;

  comissaoPercentual: number | null;

  comissaoValor: number | null;

  formaPagamento: string | null;

  parcelamento: string | null;

  parcelaMaxima: number | null;

  valorParcela: number | null;

  vencimentoPrimeira: string | null;

  validade: string | null;

  origemCotacao: string | null;

  consultorNome: string | null;

  consultorTelefone: string | null;

  observacaoInterna: string | null;

  assistencia: string | null;

  assistencia24h: boolean;

  carroReserva: string | null;

  quilometragemGuincho: string | null;

  coberturaVidros: boolean;

  coberturaFarois: boolean;

  coberturaLanternas: boolean;

  coberturaRetrovisores: boolean;

  chaveiro: boolean;

  taxi: boolean;

  hotel: boolean;

  coberturas: string | null;

  observacoes: string | null;

  arquivoPdfPath: string | null;

  arquivoPdfNome: string | null;

  arquivoPdfTamanho: number | null;

  arquivoPdfTipo: string | null;

  dadosEspecificos:
    DadosEspecificosCotacao;

  recomendada: boolean;

  status: string;

  ordemExibicao: number;

  createdAt: string;

  updatedAt: string;
};


export type NovaCotacaoSeguradora = {
  cotacao_id: string;

  seguradora_id: number;

  numero_cotacao: string | null;

  codigo_calculo: string | null;

  tipo_cotacao: string | null;

  classe_bonus: string | null;

  premio_liquido: number | null;

  premio_total: number | null;

  iof: number | null;

  custo_apolice: number | null;

  franquia_normal: number | null;

  franquia_reduzida: number | null;

  franquia_majorada: number | null;

  percentual_fipe: number | null;

  tipo_casco: string | null;

  danos_materiais: number | null;

  danos_corporais: number | null;

  danos_morais: number | null;

  app_morte: number | null;

  app_invalidez: number | null;

  app_despesas_medicas: number | null;

  comissao_percentual: number | null;

  comissao_valor: number | null;

  forma_pagamento: string | null;

  parcelamento: string | null;

  parcela_maxima: number | null;

  valor_parcela: number | null;

  vencimento_primeira: string | null;

  validade: string | null;

  origem_cotacao: string | null;

  consultor_nome: string | null;

  consultor_telefone: string | null;

  observacao_interna: string | null;

  assistencia: string | null;

  assistencia_24h: boolean;

  carro_reserva: string | null;

  quilometragem_guincho: string | null;

  cobertura_vidros: boolean;

  cobertura_farois: boolean;

  cobertura_lanternas: boolean;

  cobertura_retrovisores: boolean;

  chaveiro: boolean;

  taxi: boolean;

  hotel: boolean;

  coberturas: string | null;

  observacoes: string | null;

  arquivo_pdf_path: string | null;

  arquivo_pdf_nome: string | null;

  arquivo_pdf_tamanho: number | null;

  arquivo_pdf_tipo: string | null;

  dados_especificos:
    DadosEspecificosCotacao;

  recomendada: boolean;

  status: string;

  ordem_exibicao: number;
};


export type AtualizarCotacaoSeguradora =
  Partial<
    Omit<
      NovaCotacaoSeguradora,
      "cotacao_id"
    >
  >;


type SeguradoraRelacionamento =
  | {
      nome: string;
    }
  | {
      nome: string;
    }[]
  | null;


type CotacaoSeguradoraRow = {
  id: string;

  cotacao_id: string;

  seguradora_id: number;

  numero_cotacao: string | null;

  codigo_calculo: string | null;

  tipo_cotacao: string | null;

  classe_bonus: string | null;

  premio_liquido: number | null;

  premio_total: number | null;

  iof: number | null;

  custo_apolice: number | null;

  franquia_normal: number | null;

  franquia_reduzida: number | null;

  franquia_majorada: number | null;

  percentual_fipe: number | null;

  tipo_casco: string | null;

  danos_materiais: number | null;

  danos_corporais: number | null;

  danos_morais: number | null;

  app_morte: number | null;

  app_invalidez: number | null;

  app_despesas_medicas: number | null;

  comissao_percentual: number | null;

  comissao_valor: number | null;

  forma_pagamento: string | null;

  parcelamento: string | null;

  parcela_maxima: number | null;

  valor_parcela: number | null;

  vencimento_primeira: string | null;

  validade: string | null;

  origem_cotacao: string | null;

  consultor_nome: string | null;

  consultor_telefone: string | null;

  observacao_interna: string | null;

  assistencia: string | null;

  assistencia_24h: boolean | null;

  carro_reserva: string | null;

  quilometragem_guincho: string | null;

  cobertura_vidros: boolean | null;

  cobertura_farois: boolean | null;

  cobertura_lanternas: boolean | null;

  cobertura_retrovisores: boolean | null;

  chaveiro: boolean | null;

  taxi: boolean | null;

  hotel: boolean | null;

  coberturas: string | null;

  observacoes: string | null;

  arquivo_pdf_path: string | null;

  arquivo_pdf_nome: string | null;

  arquivo_pdf_tamanho: number | null;

  arquivo_pdf_tipo: string | null;

  dados_especificos:
    | DadosEspecificosCotacao
    | null;

  recomendada: boolean | null;

  status: string | null;

  ordem_exibicao: number | null;

  created_at: string;

  updated_at: string;

  seguradora:
    SeguradoraRelacionamento;
};


function obterNomeSeguradora(
  relacionamento:
    SeguradoraRelacionamento,
): string {
  if (!relacionamento) {
    return "-";
  }

  if (
    Array.isArray(
      relacionamento,
    )
  ) {
    return (
      relacionamento[0]?.nome ??
      "-"
    );
  }

  return (
    relacionamento.nome ??
    "-"
  );
}


function mapearCotacaoSeguradora(
  item:
    CotacaoSeguradoraRow,
): CotacaoSeguradoraLista {
  return {
    id:
      item.id,

    cotacaoId:
      item.cotacao_id,

    seguradoraId:
      item.seguradora_id,

    seguradora:
      obterNomeSeguradora(
        item.seguradora,
      ),

    numeroCotacao:
      item.numero_cotacao,

    codigoCalculo:
      item.codigo_calculo,

    tipoCotacao:
      item.tipo_cotacao,

    classeBonus:
      item.classe_bonus,

    premioLiquido:
      item.premio_liquido,

    premioTotal:
      item.premio_total,

    iof:
      item.iof,

    custoApolice:
      item.custo_apolice,

    franquiaNormal:
      item.franquia_normal,

    franquiaReduzida:
      item.franquia_reduzida,

    franquiaMajorada:
      item.franquia_majorada,

    percentualFipe:
      item.percentual_fipe,

    tipoCasco:
      item.tipo_casco,

    danosMateriais:
      item.danos_materiais,

    danosCorporais:
      item.danos_corporais,

    danosMorais:
      item.danos_morais,

    appMorte:
      item.app_morte,

    appInvalidez:
      item.app_invalidez,

    appDespesasMedicas:
      item.app_despesas_medicas,

    comissaoPercentual:
      item.comissao_percentual,

    comissaoValor:
      item.comissao_valor,

    formaPagamento:
      item.forma_pagamento,

    parcelamento:
      item.parcelamento,

    parcelaMaxima:
      item.parcela_maxima,

    valorParcela:
      item.valor_parcela,

    vencimentoPrimeira:
      item.vencimento_primeira,

    validade:
      item.validade,

    origemCotacao:
      item.origem_cotacao,

    consultorNome:
      item.consultor_nome,

    consultorTelefone:
      item.consultor_telefone,

    observacaoInterna:
      item.observacao_interna,

    assistencia:
      item.assistencia,

    assistencia24h:
      item.assistencia_24h ??
      false,

    carroReserva:
      item.carro_reserva,

    quilometragemGuincho:
      item.quilometragem_guincho,

    coberturaVidros:
      item.cobertura_vidros ??
      false,

    coberturaFarois:
      item.cobertura_farois ??
      false,

    coberturaLanternas:
      item.cobertura_lanternas ??
      false,

    coberturaRetrovisores:
      item.cobertura_retrovisores ??
      false,

    chaveiro:
      item.chaveiro ??
      false,

    taxi:
      item.taxi ??
      false,

    hotel:
      item.hotel ??
      false,

    coberturas:
      item.coberturas,

    observacoes:
      item.observacoes,

    arquivoPdfPath:
      item.arquivo_pdf_path,

    arquivoPdfNome:
      item.arquivo_pdf_nome,

    arquivoPdfTamanho:
      item.arquivo_pdf_tamanho,

    arquivoPdfTipo:
      item.arquivo_pdf_tipo,

    dadosEspecificos:
      item.dados_especificos ??
      {},

    recomendada:
      item.recomendada ??
      false,

    status:
      item.status ??
      "Cotada",

    ordemExibicao:
      item.ordem_exibicao ??
      0,

    createdAt:
      item.created_at,

    updatedAt:
      item.updated_at,
  };
}


const selectCotacaoSeguradora = `
  id,
  cotacao_id,
  seguradora_id,
  numero_cotacao,
  codigo_calculo,
  tipo_cotacao,
  classe_bonus,
  premio_liquido,
  premio_total,
  iof,
  custo_apolice,
  franquia_normal,
  franquia_reduzida,
  franquia_majorada,
  percentual_fipe,
  tipo_casco,
  danos_materiais,
  danos_corporais,
  danos_morais,
  app_morte,
  app_invalidez,
  app_despesas_medicas,
  comissao_percentual,
  comissao_valor,
  forma_pagamento,
  parcelamento,
  parcela_maxima,
  valor_parcela,
  vencimento_primeira,
  validade,
  origem_cotacao,
  consultor_nome,
  consultor_telefone,
  observacao_interna,
  assistencia,
  assistencia_24h,
  carro_reserva,
  quilometragem_guincho,
  cobertura_vidros,
  cobertura_farois,
  cobertura_lanternas,
  cobertura_retrovisores,
  chaveiro,
  taxi,
  hotel,
  coberturas,
  observacoes,
  arquivo_pdf_path,
  arquivo_pdf_nome,
  arquivo_pdf_tamanho,
  arquivo_pdf_tipo,
  dados_especificos,
  recomendada,
  status,
  ordem_exibicao,
  created_at,
  updated_at,

  seguradora:seguradoras!cotacoes_seguradoras_seguradora_id_fkey(
    nome
  )
`;


export async function listarCotacoesSeguradoras(
  cotacaoId: string,
): Promise<
  CotacaoSeguradoraLista[]
> {
  if (!cotacaoId) {
    throw new Error(
      "ID da cotação não informado.",
    );
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "cotacoes_seguradoras",
      )
      .select(
        selectCotacaoSeguradora,
      )
      .eq(
        "cotacao_id",
        cotacaoId,
      )
      .order(
        "ordem_exibicao",
        {
          ascending: true,
        },
      )
      .order(
        "premio_total",
        {
          ascending: true,
          nullsFirst: false,
        },
      );

  if (error) {
    throw new Error(
      `Erro ao listar cotações das seguradoras: ${error.message}`,
    );
  }

  const rows =
    (data ?? []) as
      CotacaoSeguradoraRow[];

  return rows.map(
    mapearCotacaoSeguradora,
  );
}


export async function buscarCotacaoSeguradoraPorId(
  id: string,
): Promise<
  CotacaoSeguradoraLista | null
> {
  if (!id) {
    throw new Error(
      "ID da cotação da seguradora não informado.",
    );
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "cotacoes_seguradoras",
      )
      .select(
        selectCotacaoSeguradora,
      )
      .eq(
        "id",
        id,
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `Erro ao buscar a cotação da seguradora: ${error.message}`,
    );
  }

  if (!data) {
    return null;
  }

  return mapearCotacaoSeguradora(
    data as
      CotacaoSeguradoraRow,
  );
}


export async function inserirCotacaoSeguradora(
  dados:
    NovaCotacaoSeguradora,
): Promise<string> {
  if (!dados.cotacao_id) {
    throw new Error(
      "Cotação de origem não informada.",
    );
  }

  if (
    !Number.isFinite(
      dados.seguradora_id,
    ) ||
    dados.seguradora_id <= 0
  ) {
    throw new Error(
      "Seguradora não informada.",
    );
  }

  const supabase =
    await createClient();

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "cotacoes_seguradoras",
      )
      .insert(dados)
      .select("id")
      .single();

  if (error) {
    throw new Error(
      `Não foi possível cadastrar a cotação da seguradora: ${error.message}`,
    );
  }

  return String(
    data.id,
  );
}


export async function atualizarCotacaoSeguradoraRepository(
  id: string,
  dados:
    AtualizarCotacaoSeguradora,
): Promise<void> {
  if (!id) {
    throw new Error(
      "ID da cotação da seguradora não informado.",
    );
  }

  const supabase =
    await createClient();

  const {
    error,
  } =
    await supabase
      .from(
        "cotacoes_seguradoras",
      )
      .update({
        ...dados,

        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        id,
      );

  if (error) {
    throw new Error(
      `Não foi possível atualizar a cotação da seguradora: ${error.message}`,
    );
  }
}


export async function excluirCotacaoSeguradoraRepository(
  id: string,
): Promise<void> {
  if (!id) {
    throw new Error(
      "ID da cotação da seguradora não informado.",
    );
  }

  const supabase =
    await createClient();

  const {
    error,
  } =
    await supabase
      .from(
        "cotacoes_seguradoras",
      )
      .delete()
      .eq(
        "id",
        id,
      );

  if (error) {
    throw new Error(
      `Não foi possível excluir a cotação da seguradora: ${error.message}`,
    );
  }
}