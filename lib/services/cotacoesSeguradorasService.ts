import "server-only";

import {
  atualizarCotacaoSeguradoraRepository,
  excluirCotacaoSeguradoraRepository,
  inserirCotacaoSeguradora,
  listarCotacoesSeguradoras,
  type AtualizarCotacaoSeguradora,
  type CotacaoSeguradoraLista,
  type NovaCotacaoSeguradora,
} from "@/lib/repositories/cotacoesSeguradorasRepository";


export async function obterCotacoesSeguradoras(
  cotacaoId: string,
): Promise<CotacaoSeguradoraLista[]> {
  return listarCotacoesSeguradoras(
    cotacaoId,
  );
}


function validarCotacaoSeguradora(
  dados: NovaCotacaoSeguradora,
) {
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
      "Selecione uma seguradora.",
    );
  }

  if (
    dados.comissao_percentual !== null &&
    (
      dados.comissao_percentual < 0 ||
      dados.comissao_percentual > 100
    )
  ) {
    throw new Error(
      "A comissão percentual deve estar entre 0 e 100.",
    );
  }

  if (
    dados.percentual_fipe !== null &&
    dados.percentual_fipe < 0
  ) {
    throw new Error(
      "O percentual da FIPE não pode ser negativo.",
    );
  }

  if (
    dados.parcela_maxima !== null &&
    dados.parcela_maxima <= 0
  ) {
    throw new Error(
      "A quantidade de parcelas deve ser maior que zero.",
    );
  }

  if (
    dados.premio_total !== null &&
    dados.premio_total < 0
  ) {
    throw new Error(
      "O prêmio total não pode ser negativo.",
    );
  }

  if (
    dados.premio_liquido !== null &&
    dados.premio_liquido < 0
  ) {
    throw new Error(
      "O prêmio líquido não pode ser negativo.",
    );
  }

  if (
    dados.franquia_normal !== null &&
    dados.franquia_normal < 0
  ) {
    throw new Error(
      "A franquia não pode ser negativa.",
    );
  }
}


function calcularComissao(
  premioLiquido: number | null,
  percentual: number | null,
): number | null {
  if (
    premioLiquido === null ||
    percentual === null
  ) {
    return null;
  }

  return Number(
    (
      premioLiquido *
      (percentual / 100)
    ).toFixed(2),
  );
}


function calcularValorParcela(
  premioTotal: number | null,
  parcelaMaxima: number | null,
): number | null {
  if (
    premioTotal === null ||
    parcelaMaxima === null ||
    parcelaMaxima <= 0
  ) {
    return null;
  }

  return Number(
    (
      premioTotal /
      parcelaMaxima
    ).toFixed(2),
  );
}


function prepararDados(
  dados: NovaCotacaoSeguradora,
): NovaCotacaoSeguradora {
  return {
    ...dados,

    comissao_valor:
      calcularComissao(
        dados.premio_liquido,
        dados.comissao_percentual,
      ),

    valor_parcela:
      calcularValorParcela(
        dados.premio_total,
        dados.parcela_maxima,
      ),

    status:
      dados.status.trim() ||
      "Solicitada",

    ordem_exibicao:
      Number.isFinite(
        dados.ordem_exibicao,
      )
        ? dados.ordem_exibicao
        : 0,
  };
}


export async function criarCotacaoSeguradora(
  dados: NovaCotacaoSeguradora,
): Promise<string> {
  validarCotacaoSeguradora(
    dados,
  );

  const dadosPreparados =
    prepararDados(
      dados,
    );

  return inserirCotacaoSeguradora(
    dadosPreparados,
  );
}


export async function atualizarCotacaoSeguradora(
  id: string,
  dados: NovaCotacaoSeguradora,
): Promise<void> {
  if (!id) {
    throw new Error(
      "Cotação da seguradora não informada.",
    );
  }

  validarCotacaoSeguradora(
    dados,
  );

  const dadosPreparados =
    prepararDados(
      dados,
    );

  const {
    cotacao_id: _cotacaoId,
    ...dadosAtualizacao
  } = dadosPreparados;

  await atualizarCotacaoSeguradoraRepository(
    id,
    dadosAtualizacao satisfies AtualizarCotacaoSeguradora,
  );
}


export async function excluirCotacaoSeguradora(
  id: string,
): Promise<void> {
  if (!id) {
    throw new Error(
      "Cotação da seguradora não informada.",
    );
  }

  await excluirCotacaoSeguradoraRepository(
    id,
  );
}
export async function atualizarRecomendadaCotacaoSeguradora(
  id: string,
  recomendada: boolean,
): Promise<void> {
  if (!id) {
    throw new Error(
      "Cotação da seguradora não informada.",
    );
  }

  await atualizarCotacaoSeguradoraRepository(
    id,
    {
      recomendada,
    },
  );
}
