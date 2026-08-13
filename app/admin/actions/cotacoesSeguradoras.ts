"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  atualizarCotacaoSeguradora,
  atualizarRecomendadaCotacaoSeguradora,
  criarCotacaoSeguradora,
  excluirCotacaoSeguradora,
} from "@/lib/services/cotacoesSeguradorasService";

import type {
  NovaCotacaoSeguradora,
} from "@/lib/repositories/cotacoesSeguradorasRepository";


export type CotacaoSeguradoraActionInput = {
  id?: string;

  cotacaoId: string;

  seguradoraId: number | null;

  numeroCotacao: string;

  codigoCalculo: string;

  tipoCotacao: string;

  classeBonus: string;

  premioLiquido: number | null;

  premioTotal: number | null;

  iof: number | null;

  custoApolice: number | null;

  franquiaNormal: number | null;

  franquiaReduzida: number | null;

  franquiaMajorada: number | null;

  percentualFipe: number | null;

  tipoCasco: string;

  danosMateriais: number | null;

  danosCorporais: number | null;

  danosMorais: number | null;

  appMorte: number | null;

  appInvalidez: number | null;

  appDespesasMedicas: number | null;

  comissaoPercentual: number | null;

  comissaoValor: number | null;

  formaPagamento: string;

  parcelamento: string;

  parcelaMaxima: number | null;

  valorParcela: number | null;

  vencimentoPrimeira: string;

  validade: string;

  origemCotacao: string;

  consultorNome: string;

  consultorTelefone: string;

  observacaoInterna: string;

  assistencia: string;

  assistencia24h: boolean;

  carroReserva: string;

  quilometragemGuincho: string;

  coberturaVidros: boolean;

  coberturaFarois: boolean;

  coberturaLanternas: boolean;

  coberturaRetrovisores: boolean;

  chaveiro: boolean;

  taxi: boolean;

  hotel: boolean;

  coberturas: string;

  observacoes: string;

  arquivoPdfTamanho: number | null;

  arquivoPdfPath: string | null;

  arquivoPdfNome: string | null;

  arquivoPdfTipo: string | null;
  
  dadosEspecificos: Record<string, unknown>;

  recomendada: boolean;

  ordemExibicao: number;

  status: string;
};


export type CotacaoSeguradoraActionResult = {
  success: boolean;

  id?: string;

  message: string;
};


function textoOuNull(
  valor: string | null | undefined,
): string | null {
  if (!valor) {
    return null;
  }

  const texto =
    valor.trim();

  return texto
    ? texto
    : null;
}


function prepararDados(
  input: CotacaoSeguradoraActionInput,
): NovaCotacaoSeguradora {
  if (
    input.seguradoraId === null ||
    !Number.isFinite(
      input.seguradoraId,
    ) ||
    input.seguradoraId <= 0
  ) {
    throw new Error(
      "Selecione uma seguradora.",
    );
  }

  if (!input.cotacaoId.trim()) {
    throw new Error(
      "Cotação de origem não informada.",
    );
  }

  return {
    cotacao_id:
      input.cotacaoId.trim(),

    seguradora_id:
      input.seguradoraId,

    numero_cotacao:
      textoOuNull(
        input.numeroCotacao,
      ),

    codigo_calculo:
      textoOuNull(
        input.codigoCalculo,
      ),

    tipo_cotacao:
      textoOuNull(
        input.tipoCotacao,
      ),

    classe_bonus:
      textoOuNull(
        input.classeBonus,
      ),

    premio_liquido:
      input.premioLiquido,

    premio_total:
      input.premioTotal,

    iof:
      input.iof,

    custo_apolice:
      input.custoApolice,

    franquia_normal:
      input.franquiaNormal,

    franquia_reduzida:
      input.franquiaReduzida,

    franquia_majorada:
      input.franquiaMajorada,

    percentual_fipe:
      input.percentualFipe,

    tipo_casco:
      textoOuNull(
        input.tipoCasco,
      ),

    danos_materiais:
      input.danosMateriais,

    danos_corporais:
      input.danosCorporais,

    danos_morais:
      input.danosMorais,

    app_morte:
      input.appMorte,

    app_invalidez:
      input.appInvalidez,

    app_despesas_medicas:
      input.appDespesasMedicas,

    comissao_percentual:
      input.comissaoPercentual,

    comissao_valor:
      input.comissaoValor,

    forma_pagamento:
      textoOuNull(
        input.formaPagamento,
      ),

    parcelamento:
      textoOuNull(
        input.parcelamento,
      ),

    parcela_maxima:
      input.parcelaMaxima,

    valor_parcela:
      input.valorParcela,

    vencimento_primeira:
      textoOuNull(
        input.vencimentoPrimeira,
      ),

    validade:
      textoOuNull(
        input.validade,
      ),

    origem_cotacao:
      textoOuNull(
        input.origemCotacao,
      ),

    consultor_nome:
      textoOuNull(
        input.consultorNome,
      ),

    consultor_telefone:
      textoOuNull(
        input.consultorTelefone,
      ),

    observacao_interna:
      textoOuNull(
        input.observacaoInterna,
      ),

    assistencia:
      textoOuNull(
        input.assistencia,
      ),

    assistencia_24h:
      input.assistencia24h,

    carro_reserva:
      textoOuNull(
        input.carroReserva,
      ),

    quilometragem_guincho:
      textoOuNull(
        input.quilometragemGuincho,
      ),

    cobertura_vidros:
      input.coberturaVidros,

    cobertura_farois:
      input.coberturaFarois,

    cobertura_lanternas:
      input.coberturaLanternas,

    cobertura_retrovisores:
      input.coberturaRetrovisores,

    chaveiro:
      input.chaveiro,

    taxi:
      input.taxi,

    hotel:
      input.hotel,

    coberturas:
      textoOuNull(
        input.coberturas,
      ),

    observacoes:
      textoOuNull(
        input.observacoes,
      ),

    arquivo_pdf_path:
      textoOuNull(
        input.arquivoPdfPath,
      ),

    arquivo_pdf_nome:
      textoOuNull(
        input.arquivoPdfNome,
      ),

    arquivo_pdf_tamanho:
      input.arquivoPdfTamanho,

    arquivo_pdf_tipo:
      textoOuNull(
        input.arquivoPdfTipo,
      ),

    dados_especificos:
      input.dadosEspecificos ?? {},

    recomendada:
      input.recomendada,

    status:
      input.status.trim() ||
      "Solicitada",

    ordem_exibicao:
      Number.isFinite(
        input.ordemExibicao,
      )
        ? input.ordemExibicao
        : 0,
  };
}


function revalidarCotacao(
  cotacaoId: string,
) {
  revalidatePath(
    "/admin",
  );

  revalidatePath(
    "/admin/cotacoes",
  );

  revalidatePath(
    `/admin/cotacoes/${cotacaoId}`,
  );
}


export async function salvarCotacaoSeguradoraAction(
  input: CotacaoSeguradoraActionInput,
): Promise<CotacaoSeguradoraActionResult> {
  try {
    const dados =
      prepararDados(
        input,
      );

    if (input.id) {
      await atualizarCotacaoSeguradora(
        input.id,
        dados,
      );

      revalidarCotacao(
        input.cotacaoId,
      );

      return {
        success: true,
        id: input.id,
        message:
          "Cotação atualizada com sucesso.",
      };
    }

    const id =
      await criarCotacaoSeguradora(
        dados,
      );

    revalidarCotacao(
      input.cotacaoId,
    );

    return {
      success: true,
      id,
      message:
        "Cotação cadastrada com sucesso.",
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível salvar a cotação.";

    return {
      success: false,
      message,
    };
  }
}


export async function excluirCotacaoSeguradoraAction(
  id: string,
  cotacaoId: string,
): Promise<CotacaoSeguradoraActionResult> {
  try {
    if (!id) {
      throw new Error(
        "Cotação da seguradora não informada.",
      );
    }

    if (!cotacaoId) {
      throw new Error(
        "Cotação de origem não informada.",
      );
    }

    await excluirCotacaoSeguradora(
      id,
    );

    revalidarCotacao(
      cotacaoId,
    );

    return {
      success: true,
      message:
        "Cotação excluída com sucesso.",
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Não foi possível excluir a cotação.";

    return {
      success: false,
      message,
    };
  }
}

export async function atualizarRecomendadaCotacaoSeguradoraAction(
  id: string,
  cotacaoId: string,
  recomendada: boolean,
): Promise<CotacaoSeguradoraActionResult> {
  try {
    if (!id) {
      throw new Error(
        "Cotação da seguradora não informada.",
      );
    }

    if (!cotacaoId) {
      throw new Error(
        "Cotação de origem não informada.",
      );
    }

    await atualizarRecomendadaCotacaoSeguradora(
  id,
  recomendada,
);

    revalidarCotacao(
      cotacaoId,
    );

    return {
      success: true,
      id,
      message: recomendada
        ? "Cotação selecionada para a proposta."
        : "Cotação removida da seleção.",
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar a seleção.",
    };
  }
}