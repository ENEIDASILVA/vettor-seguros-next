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

export async function excluirApolice(
  _id: string,
) {
  throw new Error(
    "Apólices cadastradas não podem ser excluídas. O histórico deve ser preservado.",
  );
}
