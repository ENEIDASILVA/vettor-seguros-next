"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  redirect,
} from "next/navigation";

import {
  createClient,
} from "@/lib/supabase/server";

function textoOuNull(
  valor:
    FormDataEntryValue |
    null,
) {
  const texto =
    String(
      valor ??
      "",
    ).trim();

  return (
    texto ||
    null
  );
}

function numeroOuNull(
  valor:
    FormDataEntryValue |
    null,
) {
  const texto =
    String(
      valor ??
      "",
    ).trim();

  if (
    !texto
  ) {
    return null;
  }

  const numero =
    Number(
      texto,
    );

  return Number.isFinite(
    numero,
  )
    ? numero
    : null;
}

function dadosFormulario(
  formData:
    FormData,
) {
  return {
    proposta_id:
      textoOuNull(
        formData.get(
          "proposta_id",
        ),
      ),

    cliente_id:
      String(
        formData.get(
          "cliente_id",
        ) ??
        "",
      ),

    cotacao_id:
      textoOuNull(
        formData.get(
          "cotacao_id",
        ),
      ),

    seguradora_id:
      Number(
        formData.get(
          "seguradora_id",
        ),
      ),

    tipo_seguro_id:
      Number(
        formData.get(
          "tipo_seguro_id",
        ),
      ),

    numero_apolice:
      String(
        formData.get(
          "numero_apolice",
        ) ??
          "",
      ).trim(),

    inicio_vigencia:
      String(
        formData.get(
          "inicio_vigencia",
        ) ??
          "",
      ),

    fim_vigencia:
      String(
        formData.get(
          "fim_vigencia",
        ) ??
          "",
      ),

    premio_liquido:
      numeroOuNull(
        formData.get(
          "premio_liquido",
        ),
      ),

    premio_total:
      numeroOuNull(
        formData.get(
          "premio_total",
        ),
      ),

    comissao_percentual:
      numeroOuNull(
        formData.get(
          "comissao_percentual",
        ),
      ),

    comissao_valor:
      numeroOuNull(
        formData.get(
          "comissao_valor",
        ),
      ),

    metodo_pagamento:
      String(formData.get("metodo_pagamento") ?? "").trim(),

    quantidade_parcelas:
      Number(formData.get("quantidade_parcelas") ?? 1),

    primeiro_vencimento:
      String(formData.get("primeiro_vencimento") ?? ""),

    status:
      String(
        formData.get(
          "status",
        ) ??
          "Ativa",
      ),

    observacoes:
      textoOuNull(
        formData.get(
          "observacoes",
        ),
      ),

    updated_at:
      new Date()
        .toISOString(),
  };
}

function adicionarMeses(data: string, meses: number) {
  const [ano, mes, dia] = data.split("-").map(Number);
  const primeiroDia = new Date(ano, mes - 1 + meses, 1);
  const ultimoDia = new Date(primeiroDia.getFullYear(), primeiroDia.getMonth() + 1, 0).getDate();
  return [primeiroDia.getFullYear(), String(primeiroDia.getMonth() + 1).padStart(2, "0"), String(Math.min(dia, ultimoDia)).padStart(2, "0")].join("-");
}

function gerarPagamentos(apoliceId: string, quantidade: number, total: number, primeiroVencimento: string) {
  const totalCentavos = Math.round(total * 100);
  const valorBase = Math.floor(totalCentavos / quantidade);
  const restante = totalCentavos - valorBase * quantidade;

  return Array.from({ length: quantidade }, (_, indice) => ({
    apolice_id: apoliceId,
    numero_parcela: indice + 1,
    quantidade_parcelas: quantidade,
    valor: (valorBase + (indice < restante ? 1 : 0)) / 100,
    data_vencimento: adicionarMeses(primeiroVencimento, indice),
    status: "Pendente",
    data_pagamento: null,
    updated_at: new Date().toISOString(),
  }));
}

function validarPagamento(dados: ReturnType<typeof dadosFormulario>) {
  const quantidade = dados.metodo_pagamento === "À vista" ? 1 : dados.quantidade_parcelas;
  if (!dados.metodo_pagamento || !["À vista", "Parcelado"].includes(dados.metodo_pagamento)) throw new Error("Informe um método de pagamento válido.");
  if (!Number.isInteger(quantidade) || quantidade < 1 || quantidade > 60) throw new Error("Informe uma quantidade de parcelas entre 1 e 60.");
  if (!dados.primeiro_vencimento) throw new Error("Informe a data do primeiro pagamento.");
  if (dados.premio_total === null || dados.premio_total <= 0) throw new Error("Informe o prêmio total para gerar os pagamentos.");
  dados.quantidade_parcelas = quantidade;
}

async function validarCotacaoEscolhidaDaProposta(
  supabase:
    Awaited<
      ReturnType<
        typeof createClient
      >
    >,
  propostaId:
    string,
  cotacaoSeguradoraId:
    string,
) {
  const {
    data: item,
    error: itemError,
  } =
    await supabase
      .from(
        "propostas_itens",
      )
      .select(
        "cotacao_seguradora_id",
      )
      .eq(
        "proposta_id",
        propostaId,
      )
      .eq(
        "cotacao_seguradora_id",
        cotacaoSeguradoraId,
      )
      .maybeSingle();

  if (
    itemError
  ) {
    throw new Error(
      `Não foi possível validar a cotação escolhida: ${itemError.message}`,
    );
  }

  if (
    !item
  ) {
    throw new Error(
      "A cotação escolhida não faz parte desta proposta.",
    );
  }

  const {
    data: cotacao,
    error: cotacaoError,
  } =
    await supabase
      .from(
        "cotacoes_seguradoras",
      )
      .select(`
        cotacao_id,
        seguradora_id,
        premio_liquido,
        premio_total,
        comissao_percentual,
        comissao_valor
      `)
      .eq(
        "id",
        cotacaoSeguradoraId,
      )
      .single();

  if (
    cotacaoError
  ) {
    throw new Error(
      `Não foi possível carregar a cotação escolhida: ${cotacaoError.message}`,
    );
  }

  return cotacao;
}

export async function salvarApolice(
  formData:
    FormData,
) {
  const supabase =
    await createClient();

  const dados =
    dadosFormulario(
      formData,
    );

  const cotacaoSeguradoraId =
    textoOuNull(
      formData.get(
        "cotacao_seguradora_id",
      ),
    );

  if (
    !dados.cliente_id ||
    !dados.seguradora_id ||
    !dados.tipo_seguro_id ||
    !dados.numero_apolice ||
    !dados.inicio_vigencia ||
    !dados.fim_vigencia
  ) {
    throw new Error(
      "Preencha todos os dados obrigatórios da apólice.",
    );
  }

  if (
    dados.proposta_id
  ) {
    const {
      data: existente,
      error:
        erroConsulta,
    } =
      await supabase
        .from(
          "apolices",
        )
        .select(
          "id",
        )
        .eq(
          "proposta_id",
          dados.proposta_id,
        )
        .maybeSingle();

    if (
      erroConsulta
    ) {
      throw new Error(
        `Não foi possível verificar a proposta: ${erroConsulta.message}`,
      );
    }

    if (
      existente
    ) {
      redirect(
        `/admin/apolices/${existente.id}`,
      );
    }

    if (
      !cotacaoSeguradoraId
    ) {
      throw new Error(
        "Selecione a cotação aceita pelo cliente.",
      );
    }

    const cotacaoEscolhida =
      await validarCotacaoEscolhidaDaProposta(
        supabase,
        dados.proposta_id,
        cotacaoSeguradoraId,
      );

    /*
     * Durante uma conversão, os valores comerciais
     * vêm diretamente da cotação escolhida.
     * Isso evita divergências entre proposta e apólice.
     */
    dados.cotacao_id =
      String(
        cotacaoEscolhida.cotacao_id,
      );

    dados.seguradora_id =
      Number(
        cotacaoEscolhida.seguradora_id,
      );

    dados.premio_liquido =
      cotacaoEscolhida.premio_liquido !==
      null
        ? Number(
            cotacaoEscolhida.premio_liquido,
          )
        : null;

    dados.premio_total =
      cotacaoEscolhida.premio_total !==
      null
        ? Number(
            cotacaoEscolhida.premio_total,
          )
        : null;

    dados.comissao_percentual =
      cotacaoEscolhida.comissao_percentual !==
      null
        ? Number(
            cotacaoEscolhida.comissao_percentual,
          )
        : null;

    dados.comissao_valor =
      cotacaoEscolhida.comissao_valor !==
      null
        ? Number(
            cotacaoEscolhida.comissao_valor,
          )
        : null;
  }

  validarPagamento(dados);

  const {
    data: apoliceCriada,
    error,
  } =
    await supabase
      .from(
        "apolices",
      )
      .insert(
        dados,
      )
      .select(
        "id",
      )
      .single();

  if (
    error
  ) {
    throw new Error(
      `Não foi possível salvar a apólice: ${error.message}`,
    );
  }

  const { error: pagamentosError } = await supabase
    .from("apolice_pagamentos")
    .insert(gerarPagamentos(apoliceCriada.id, dados.quantidade_parcelas, Number(dados.premio_total), dados.primeiro_vencimento));

  if (pagamentosError) {
    await supabase.from("apolices").delete().eq("id", apoliceCriada.id);
    throw new Error(`Não foi possível gerar os pagamentos da apólice: ${pagamentosError.message}`);
  }

  if (
    dados.proposta_id
  ) {
    const {
      error:
        erroProposta,
    } =
      await supabase
        .from(
          "propostas",
        )
        .update({
          status:
            "Convertida em Apólice",
          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          dados.proposta_id,
        );

    if (
      erroProposta
    ) {
      throw new Error(
        `Apólice criada, porém não foi possível atualizar a proposta: ${erroProposta.message}`,
      );
    }

    revalidatePath(
      `/admin/propostas/${dados.proposta_id}/workspace`,
    );
  }

  revalidatePath(
    "/admin",
  );

  revalidatePath(
    "/admin/apolices",
  );

  revalidatePath(
    "/admin/propostas",
  );

  redirect(
    `/admin/apolices/${apoliceCriada.id}`,
  );
}

export async function atualizarApolice(
  id: string,
  formData:
    FormData,
) {
  if (
    !id
  ) {
    throw new Error(
      "Apólice inválida.",
    );
  }

  const supabase =
    await createClient();

  const dados =
    dadosFormulario(
      formData,
    );

  validarPagamento(dados);

  const { data: pagamentosAtuais, error: pagamentosConsultaError } = await supabase
    .from("apolice_pagamentos")
    .select("id, quantidade_parcelas, data_vencimento, data_pagamento, valor")
    .eq("apolice_id", id)
    .order("numero_parcela", { ascending: true });

  if (pagamentosConsultaError) throw new Error(`Não foi possível consultar os pagamentos: ${pagamentosConsultaError.message}`);

  const primeiroAtual = pagamentosAtuais?.[0];
  const totalAtualCentavos = (pagamentosAtuais ?? []).reduce(
    (total, pagamento) => total + Math.round(Number(pagamento.valor) * 100),
    0,
  );
  const configuracaoAlterada =
    !primeiroAtual ||
    Number(primeiroAtual.quantidade_parcelas) !== dados.quantidade_parcelas ||
    primeiroAtual.data_vencimento !== dados.primeiro_vencimento ||
    totalAtualCentavos !== Math.round(Number(dados.premio_total) * 100);

  if (configuracaoAlterada && pagamentosAtuais?.some((item) => item.data_pagamento)) {
    throw new Error("Não é possível alterar o parcelamento porque já existem pagamentos baixados.");
  }

  const {
    error,
  } =
    await supabase
      .from(
        "apolices",
      )
      .update(
        dados,
      )
      .eq(
        "id",
        id,
      );

  if (
    error
  ) {
    throw new Error(
      `Não foi possível atualizar a apólice: ${error.message}`,
    );
  }

  if (configuracaoAlterada) {
    const { error: deleteError } = await supabase.from("apolice_pagamentos").delete().eq("apolice_id", id);
    if (deleteError) throw new Error(`Não foi possível atualizar as parcelas: ${deleteError.message}`);
    const { error: insertError } = await supabase.from("apolice_pagamentos").insert(gerarPagamentos(id, dados.quantidade_parcelas, Number(dados.premio_total), dados.primeiro_vencimento));
    if (insertError) throw new Error(`Não foi possível gerar as novas parcelas: ${insertError.message}`);
  }

  revalidatePath(
    "/admin",
  );

  revalidatePath(
    "/admin/apolices",
  );

  revalidatePath(
    `/admin/apolices/${id}`,
  );

  revalidatePath(
    `/admin/apolices/${id}/editar`,
  );

  redirect(
    `/admin/apolices/${id}`,
  );
}

export async function baixarPagamentoApolice(apoliceId: string, pagamentoId: string, dataPagamento: string) {
  if (!apoliceId || !pagamentoId || !dataPagamento) return { success: false, message: "Informe a data da baixa." };
  const supabase = await createClient();
  const { error } = await supabase.from("apolice_pagamentos").update({ status: "Pago", data_pagamento: dataPagamento, updated_at: new Date().toISOString() }).eq("id", pagamentoId).eq("apolice_id", apoliceId);
  if (error) return { success: false, message: `Não foi possível baixar o pagamento: ${error.message}` };
  revalidatePath(`/admin/apolices/${apoliceId}`);
  revalidatePath("/admin/relatorios");
  return { success: true, message: "Pagamento baixado com sucesso." };
}

export async function atualizarPagamentoApolice(
  apoliceId: string,
  pagamentoId: string,
  dataVencimento: string,
  valor: number,
) {
  if (!apoliceId || !pagamentoId || !dataVencimento) {
    return { success: false, message: "Informe a data prevista do pagamento." };
  }

  if (!Number.isFinite(valor) || valor < 0) {
    return { success: false, message: "Informe um valor válido para a parcela." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("apolice_pagamentos")
    .update({
      data_vencimento: dataVencimento,
      valor: Math.round(valor * 100) / 100,
      updated_at: new Date().toISOString(),
    })
    .eq("id", pagamentoId)
    .eq("apolice_id", apoliceId);

  if (error) {
    return { success: false, message: `Não foi possível atualizar a parcela: ${error.message}` };
  }

  revalidatePath(`/admin/apolices/${apoliceId}`);
  revalidatePath("/admin/relatorios");
  return { success: true, message: "Data e valor atualizados com sucesso." };
}

export async function excluirApolice(
  _id: string,
) {
  throw new Error(
    "Apólices cadastradas não podem ser excluídas. O histórico deve ser preservado.",
  );
}
