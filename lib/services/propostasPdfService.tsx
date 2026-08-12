import "server-only";

import React from "react";

import {
  renderToBuffer,
} from "@react-pdf/renderer";

import {
  createClient,
} from "@/lib/supabase/server";

import PropostaPdf, {
  type PropostaPdfDados,
} from "@/lib/pdf/PropostaPdf";

const BUCKET =
  "propostas-pdf";

export async function gerarPdfDaProposta(
  propostaId: string,
  observacoes: string,
  validadeDias: number,
) {
  if (!propostaId) {
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
        cotacao_id,
        cliente_id,
        tipo_seguro_id
      `)
      .eq("id", propostaId)
      .single();

  if (propostaError) {
    throw new Error(
      `Não foi possível carregar a proposta: ${propostaError.message}`,
    );
  }

  const [
    clienteResponse,
    tipoSeguroResponse,
    itensResponse,
  ] =
    await Promise.all([
      supabase
        .from("clientes")
        .select("id,nome")
        .eq(
          "id",
          proposta.cliente_id,
        )
        .single(),

      supabase
        .from("tipos_seguro")
        .select("id,nome")
        .eq(
          "id",
          proposta.tipo_seguro_id,
        )
        .single(),

      supabase
        .from("propostas_itens")
        .select(`
          id,
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
            ascending: true,
          },
        ),
    ]);

  if (
    clienteResponse.error
  ) {
    throw new Error(
      `Não foi possível carregar o cliente: ${clienteResponse.error.message}`,
    );
  }

  if (
    tipoSeguroResponse.error
  ) {
    throw new Error(
      `Não foi possível carregar o tipo de seguro: ${tipoSeguroResponse.error.message}`,
    );
  }

  if (
    itensResponse.error
  ) {
    throw new Error(
      `Não foi possível carregar os itens da proposta: ${itensResponse.error.message}`,
    );
  }

  const idsCotacoes =
    (
      itensResponse.data ??
      []
    ).map(
      (item) =>
        item.cotacao_seguradora_id,
    );

  if (
    idsCotacoes.length === 0
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
        premio_total,
        franquia_normal,
        percentual_fipe,
        assistencia,
        forma_pagamento,
        parcelamento,
        parcela_maxima
      `)
      .in(
        "id",
        idsCotacoes,
      );

  if (
    cotacoesError
  ) {
    throw new Error(
      `Não foi possível carregar as cotações: ${cotacoesError.message}`,
    );
  }

  const seguradoraIds =
    [
      ...new Set(
        (
          cotacoes ??
          []
        ).map(
          (item) =>
            item.seguradora_id,
        ),
      ),
    ];

  const {
    data: seguradoras,
    error: seguradorasError,
  } =
    await supabase
      .from("seguradoras")
      .select("id,nome")
      .in(
        "id",
        seguradoraIds,
      );

  if (
    seguradorasError
  ) {
    throw new Error(
      `Não foi possível carregar as seguradoras: ${seguradorasError.message}`,
    );
  }

  const nomesSeguradoras =
    new Map(
      (
        seguradoras ??
        []
      ).map(
        (item) => [
          item.id,
          item.nome,
        ],
      ),
    );

  const cotacoesPorId =
    new Map(
      (
        cotacoes ??
        []
      ).map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  const seguradorasPdf =
    (
      itensResponse.data ??
      []
    )
      .map(
        (item) =>
          cotacoesPorId.get(
            item.cotacao_seguradora_id,
          ),
      )
      .filter(
        (
          item,
        ): item is NonNullable<
          typeof item
        > => Boolean(item),
      )
      .map(
        (item) => ({
          nome:
            nomesSeguradoras.get(
              item.seguradora_id,
            ) ??
            "Seguradora",

          premioTotal:
            item.premio_total !==
            null
              ? Number(
                  item.premio_total,
                )
              : null,

          franquiaNormal:
            item.franquia_normal !==
            null
              ? Number(
                  item.franquia_normal,
                )
              : null,

          percentualFipe:
            item.percentual_fipe !==
            null
              ? Number(
                  item.percentual_fipe,
                )
              : null,

          assistencia:
            item.assistencia,

          formaPagamento:
            item.forma_pagamento,

          parcelamento:
            item.parcelamento,

          parcelaMaxima:
            item.parcela_maxima,
        }),
      );

  const dadosPdf:
    PropostaPdfDados = {
      clienteNome:
        clienteResponse.data.nome,

      tipoSeguroNome:
        tipoSeguroResponse.data.nome,

      observacoes:
        observacoes.trim(),

      validadeDias,

      seguradoras:
        seguradorasPdf,
    };

  const documento =
  <PropostaPdf
    dados={dadosPdf}
  />;

const buffer =
  await renderToBuffer(
    documento as any,
  );

  const { data: ultimaVersao, error: ultimaVersaoError } =
    await supabase
      .from("propostas_pdfs")
      .select("versao")
      .eq("proposta_id", propostaId)
      .order("versao", { ascending: false })
      .limit(1)
      .maybeSingle();

  if (ultimaVersaoError) {
    throw new Error(
      `Não foi possível consultar o histórico de PDFs: ${ultimaVersaoError.message}`,
    );
  }

  const versao = Number(ultimaVersao?.versao ?? 0) + 1;
  const nomeArquivo = `proposta-${propostaId}-v${versao}.pdf`;
  const caminho = `${proposta.cotacao_id}/${propostaId}/v${versao}/${nomeArquivo}`;

  const {
    error: uploadError,
  } =
    await supabase.storage
      .from(BUCKET)
      .upload(
        caminho,
        buffer,
        {
          contentType:
            "application/pdf",

          upsert:
            false,

          cacheControl:
            "3600",
        },
      );

  if (
    uploadError
  ) {
    throw new Error(
      `Não foi possível salvar o PDF: ${uploadError.message}`,
    );
  }

  const { error: historicoError } =
    await supabase
      .from("propostas_pdfs")
      .insert({
        proposta_id: propostaId,
        versao,
        arquivo_pdf_path: caminho,
        arquivo_pdf_nome: nomeArquivo,
        arquivo_pdf_tamanho: buffer.length,
        arquivo_pdf_tipo: "application/pdf",
        observacoes: observacoes.trim() || null,
        validade_dias: validadeDias,
      });

  if (historicoError) {
    await supabase.storage.from(BUCKET).remove([caminho]);
    throw new Error(
      `Não foi possível registrar o PDF no histórico: ${historicoError.message}`,
    );
  }

  const {
    error: updateError,
  } =
    await supabase
      .from("propostas")
      .update({
        observacoes:
          observacoes.trim() ||
          null,

        validade_dias:
          validadeDias,

        arquivo_pdf_path:
          caminho,

        arquivo_pdf_nome:
          nomeArquivo,

        arquivo_pdf_tamanho:
          buffer.length,

        arquivo_pdf_tipo:
          "application/pdf",

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
    await supabase
      .from("propostas_pdfs")
      .delete()
      .eq("proposta_id", propostaId)
      .eq("versao", versao);

    await supabase.storage.from(BUCKET).remove([caminho]);

    throw new Error(
      `O PDF foi gerado, mas não foi possível atualizar a proposta: ${updateError.message}`,
    );
  }

  const {
    data: signedUrlData,
    error: signedUrlError,
  } =
    await supabase.storage
      .from(BUCKET)
      .createSignedUrl(
        caminho,
        300,
      );

  if (
    signedUrlError
  ) {
    throw new Error(
      `O PDF foi gerado, mas não foi possível criar o link: ${signedUrlError.message}`,
    );
  }

  return {
    path:
      caminho,

    nome:
      nomeArquivo,

    versao,

    url:
      signedUrlData.signedUrl,
  };
}