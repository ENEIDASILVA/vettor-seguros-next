"use server";

import { createClient } from "@/lib/supabase/server";

import { revalidatePath } from "next/cache";

import { redirect } from "next/navigation";

import { headers } from "next/headers";

import { randomBytes } from "crypto";

import {
  gerarPropostaDaCotacao,
  sincronizarItensProposta,
} from "@/lib/repositories/propostasRepository";

import { gerarPdfDaProposta } from "@/lib/services/propostasPdfService";


export async function salvarProposta(
  formData: FormData
) {

  const supabase =
    await createClient();



  const premioLiquido =
    Number(
      String(
        formData.get("premio_liquido")
      )
      .replace(/\D/g,"")
    ) / 100;



  const percentual =
    Number(
      formData.get(
        "comissao_percentual"
      )
    );



  const comissao =
    premioLiquido *
    percentual /
    100;



  const { error } =
    await supabase
      .from("propostas")
      .insert({

        cliente_id:
          formData.get(
            "cliente_id"
          ),


        cotacao_id:
          formData.get(
            "cotacao_id"
          ),


        seguradora_id:
          Number(
            formData.get(
              "seguradora_id"
            )
          ),


        tipo_seguro_id:
          Number(
            formData.get(
              "tipo_seguro_id"
            )
          ),


        numero_proposta:
          formData.get(
            "numero_proposta"
          ),


        premio_liquido:
          premioLiquido,


        premio_total:
          premioLiquido,


        comissao_percentual:
          percentual,


        comissao_valor:
          comissao,


        status:
          "Em análise",

      });



  if(error){

    throw new Error(
      error.message
    );

  }



  revalidatePath(
    "/admin/propostas"
  );


  redirect(
    "/admin/propostas?sucesso=1"
  );


}

export async function excluirProposta(
  id: string
) {

  const supabase =
    await createClient();


  const { error } =
    await supabase
      .from("propostas")
      .delete()
      .eq(
        "id",
        id
      );


  if(error){

    throw new Error(
      error.message
    );

  }


  revalidatePath(
    "/admin/propostas"
  );


  redirect(
    "/admin/propostas?excluido=1"
  );

}
export async function atualizarProposta(
  formData: FormData
) {

  const supabase =
    await createClient();



  const id =
    String(
      formData.get("id")
    );



  const premioLiquido =
    Number(
      String(
        formData.get("premio_liquido")
      )
      .replace(/\D/g,"")
    ) / 100;



  const percentual =
    Number(
      formData.get(
        "comissao_percentual"
      )
    );



  const comissao =
    premioLiquido *
    percentual /
    100;



  const { error } =
    await supabase
      .from("propostas")
      .update({

        cliente_id:
          formData.get(
            "cliente_id"
          ),


        cotacao_id:
          formData.get(
            "cotacao_id"
          ),


        seguradora_id:
          Number(
            formData.get(
              "seguradora_id"
            )
          ),


        tipo_seguro_id:
          Number(
            formData.get(
              "tipo_seguro_id"
            )
          ),


        numero_proposta:
          formData.get(
            "numero_proposta"
          ),


        premio_liquido:
          premioLiquido,


        premio_total:
          premioLiquido,


        comissao_percentual:
          percentual,


        comissao_valor:
          comissao,


        status:
          formData.get(
            "status"
          ),


      })
      .eq(
        "id",
        id
      );




  if(error){

    throw new Error(
      error.message
    );

  }



  revalidatePath(
    "/admin/propostas"
  );


  revalidatePath(
    `/admin/propostas/${id}`
  );


  redirect(
    "/admin/propostas?atualizado=1"
  );

}

export async function gerarPropostaAction(
  cotacaoId: string,
) {
  const propostaId =
    await gerarPropostaDaCotacao(
      cotacaoId,
    );

  revalidatePath(
    "/admin/propostas",
  );

  revalidatePath(
  `/admin/propostas/${propostaId}/workspace`,
);

  redirect(
  `/admin/propostas/${propostaId}/workspace`,
  );
}

export async function gerarPdfPropostaAction(
  propostaId: string,
  observacoes: string,
  validadeDias: number,
) {
  try {
    const resultado =
      await gerarPdfDaProposta(
        propostaId,
        observacoes,
        validadeDias,
      );

    revalidatePath(
      "/admin/propostas",
    );

    revalidatePath(
      `/admin/propostas/${propostaId}`,
    );

    return {
      success:
        true as const,

      url:
        resultado.url,

      nome:
        resultado.nome,
    };
  } catch (
    error
  ) {
    return {
      success:
        false as const,

      message:
        error instanceof Error
          ? error.message
          : "Não foi possível gerar o PDF.",
    };
  }
}


const WHATSAPP_LINK_VALIDITY_SECONDS =
  60 * 60 * 24 * 7;

function normalizarTelefoneWhatsApp(
  telefone: string,
) {
  const somenteNumeros =
    telefone.replace(
      /\D/g,
      "",
    );

  if (!somenteNumeros) {
    return "";
  }

  if (
    somenteNumeros.startsWith(
      "55",
    )
  ) {
    return somenteNumeros;
  }

  if (
    somenteNumeros.length ===
      10 ||
    somenteNumeros.length ===
      11
  ) {
    return `55${somenteNumeros}`;
  }

  return somenteNumeros;
}

function gerarTokenDocumento() {
  return randomBytes(12)
    .toString("base64url");
}

async function obterBaseUrlAplicacao() {
  const urlConfigurada =
    process.env.NEXT_PUBLIC_SITE_URL
      ?.trim()
      .replace(/\/+$/, "");

  if (urlConfigurada) {
    return urlConfigurada;
  }

  const requestHeaders =
    await headers();

  const host =
    requestHeaders.get(
      "x-forwarded-host",
    ) ??
    requestHeaders.get(
      "host",
    );

  if (!host) {
    throw new Error(
      "Não foi possível identificar o endereço da aplicação.",
    );
  }

  const protocolo =
    requestHeaders.get(
      "x-forwarded-proto",
    ) ??
    (host.includes(
      "localhost",
    )
      ? "http"
      : "https");

  return `${protocolo}://${host}`;
}

async function criarLinkCurtoDocumento({
  supabase,
  propostaId,
  tipo,
  rotulo,
  targetUrl,
  baseUrl,
}: {
  supabase: Awaited<
    ReturnType<
      typeof createClient
    >
  >;
  propostaId: string;
  tipo:
    | "proposta"
    | "cotacao";
  rotulo: string;
  targetUrl: string;
  baseUrl: string;
}) {
  const token =
    gerarTokenDocumento();

  const expiresAt =
    new Date(
      Date.now() +
        WHATSAPP_LINK_VALIDITY_SECONDS *
          1000,
    ).toISOString();

  const {
    error,
  } =
    await supabase
      .from(
        "documentos_links",
      )
      .insert({
        token,
        proposta_id:
          propostaId,
        tipo,
        rotulo,
        target_url:
          targetUrl,
        expires_at:
          expiresAt,
      });

  if (error) {
    throw new Error(
      `Não foi possível criar o link curto do documento: ${error.message}`,
    );
  }

  return `${baseUrl}/doc/${token}`;
}

export async function prepararEnvioWhatsAppPropostaAction(
  propostaId: string,
) {
  try {
    if (!propostaId) {
      throw new Error(
        "Proposta não informada.",
      );
    }

    const supabase =
      await createClient();

    const baseUrl =
      await obterBaseUrlAplicacao();

    /*
     * Limpeza simples dos links vencidos.
     * Se falhar, não bloqueia o envio.
     */
    await supabase
      .from(
        "documentos_links",
      )
      .delete()
      .lt(
        "expires_at",
        new Date().toISOString(),
      );

    const {
      data: proposta,
      error: propostaError,
    } =
      await supabase
        .from("propostas")
        .select(`
          id,
          arquivo_pdf_path,
          arquivo_pdf_nome,
          cliente:clientes(
            id,
            nome,
            telefone
          ),
          tipo_seguro:tipos_seguro(
            id,
            nome
          )
        `)
        .eq(
          "id",
          propostaId,
        )
        .single();

    if (propostaError) {
      throw new Error(
        `Não foi possível carregar a proposta: ${propostaError.message}`,
      );
    }

    const clienteRelacionamento =
      Array.isArray(
        proposta.cliente,
      )
        ? proposta.cliente[0]
        : proposta.cliente;

    const tipoSeguroRelacionamento =
      Array.isArray(
        proposta.tipo_seguro,
      )
        ? proposta.tipo_seguro[0]
        : proposta.tipo_seguro;

    const clienteNome =
      clienteRelacionamento
        ?.nome?.trim() ||
      "cliente";

    const telefone =
      normalizarTelefoneWhatsApp(
        clienteRelacionamento
          ?.telefone ??
          "",
      );

    if (!telefone) {
      throw new Error(
        "O cliente não possui telefone cadastrado.",
      );
    }

    if (
      !proposta.arquivo_pdf_path
    ) {
      throw new Error(
        "A proposta ainda não possui um PDF atual para envio.",
      );
    }

    const {
      data: propostaPdf,
      error: propostaPdfError,
    } =
      await supabase.storage
        .from(
          "propostas-pdf",
        )
        .createSignedUrl(
          proposta
            .arquivo_pdf_path,
          WHATSAPP_LINK_VALIDITY_SECONDS,
        );

    if (
      propostaPdfError ||
      !propostaPdf?.signedUrl
    ) {
      throw new Error(
        propostaPdfError
          ? `Não foi possível criar o link do PDF da proposta: ${propostaPdfError.message}`
          : "Não foi possível criar o link do PDF da proposta.",
      );
    }

    const linkProposta =
      await criarLinkCurtoDocumento({
        supabase,
        propostaId,
        tipo:
          "proposta",
        rotulo:
          proposta
            .arquivo_pdf_nome ??
          "Proposta Comercial Vettor Seguros",
        targetUrl:
          propostaPdf.signedUrl,
        baseUrl,
      });

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

    if (itensError) {
      throw new Error(
        `Não foi possível carregar as cotações da proposta: ${itensError.message}`,
      );
    }

    const idsCotacoes =
      (
        itens ??
        []
      ).map(
        (item) =>
          String(
            item.cotacao_seguradora_id,
          ),
      );

    let cotacoesComPdf:
      {
        nomeSeguradora: string;
        linkCurto: string;
      }[] = [];

    if (
      idsCotacoes.length >
      0
    ) {
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
            arquivo_pdf_path,
            arquivo_pdf_nome
          `)
          .in(
            "id",
            idsCotacoes,
          );

      if (cotacoesError) {
        throw new Error(
          `Não foi possível carregar os PDFs das seguradoras: ${cotacoesError.message}`,
        );
      }

      const seguradorasIds =
        [
          ...new Set(
            (
              cotacoes ??
              []
            ).map(
              (item) =>
                Number(
                  item.seguradora_id,
                ),
            ),
          ),
        ];

      const nomesSeguradoras =
        new Map<
          number,
          string
        >();

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
              "id,nome",
            )
            .in(
              "id",
              seguradorasIds,
            );

        if (
          seguradorasError
        ) {
          throw new Error(
            `Não foi possível carregar as seguradoras: ${seguradorasError.message}`,
          );
        }

        for (
          const seguradora
          of seguradoras ?? []
        ) {
          nomesSeguradoras.set(
            Number(
              seguradora.id,
            ),
            seguradora.nome,
          );
        }
      }

      const mapaCotacoes =
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

      const cotacoesOrdenadas =
        idsCotacoes
          .map(
            (id) =>
              mapaCotacoes.get(
                id,
              ),
          )
          .filter(
            Boolean,
          ) as NonNullable<
            (typeof cotacoes)[number]
          >[];

      for (
        const cotacao
        of cotacoesOrdenadas
      ) {
        if (
          !cotacao
            .arquivo_pdf_path
        ) {
          continue;
        }

        const {
          data: pdf,
          error: pdfError,
        } =
          await supabase.storage
            .from(
              "cotacoes-pdf",
            )
            .createSignedUrl(
              cotacao
                .arquivo_pdf_path,
              WHATSAPP_LINK_VALIDITY_SECONDS,
            );

        if (
          pdfError ||
          !pdf?.signedUrl
        ) {
          continue;
        }

        const nomeSeguradora =
          nomesSeguradoras.get(
            Number(
              cotacao.seguradora_id,
            ),
          ) ??
          "Seguradora";

        const linkCurto =
          await criarLinkCurtoDocumento({
            supabase,
            propostaId,
            tipo:
              "cotacao",
            rotulo:
              cotacao
                .arquivo_pdf_nome ??
              nomeSeguradora,
            targetUrl:
              pdf.signedUrl,
            baseUrl,
          });

        cotacoesComPdf.push(
          {
            nomeSeguradora,
            linkCurto,
          },
        );
      }
    }

    const tipoSeguroNome =
      tipoSeguroRelacionamento
        ?.nome?.trim() ||
      "seguro";

    const linhas:
      string[] = [
      `Olá, ${clienteNome}!`,
      "",
      `Segue sua proposta de ${tipoSeguroNome}, preparada pela Vettor Seguros.`,
      "",
      "📄 *Proposta Comercial — Vettor Seguros*",
      linkProposta,
    ];

    if (
      cotacoesComPdf.length >
      0
    ) {
      linhas.push(
        "",
        "📎 *Cotações das seguradoras*",
      );

      for (
        const cotacao
        of cotacoesComPdf
      ) {
        linhas.push(
          "",
          `• *${cotacao.nomeSeguradora}*`,
          cotacao.linkCurto,
        );
      }
    }

    linhas.push(
      "",
      "Os documentos ficam disponíveis por 7 dias.",
      "",
      "Caso tenha alguma dúvida ou queira conversar sobre as opções apresentadas, estou à disposição.",
      "",
      "*Vettor Seguros*",
    );

    const mensagem =
      linhas.join("\n");

    const whatsappUrl =
      `https://wa.me/${telefone}?text=${encodeURIComponent(
        mensagem,
      )}`;

    return {
      success:
        true as const,

      whatsappUrl,

      telefone,

      quantidadeCotacoes:
        cotacoesComPdf.length,

      message:
        "Mensagem preparada com sucesso.",
    };
  } catch (error) {
    return {
      success:
        false as const,

      message:
        error instanceof Error
          ? error.message
          : "Não foi possível preparar o envio por WhatsApp.",
    };
  }
}


export async function salvarSelecaoCotacaoNaPropostaAction(
  propostaId: string,
  cotacaoId: string,
) {
  try {
    if (!propostaId || !cotacaoId) {
      throw new Error(
        "Proposta ou cotação não informada.",
      );
    }

    await sincronizarItensProposta(
      propostaId,
      cotacaoId,
    );

    revalidatePath(
      "/admin/propostas",
    );

    revalidatePath(
      `/admin/propostas/${propostaId}/workspace`,
    );

    revalidatePath(
      `/admin/cotacoes/${cotacaoId}`,
    );

    return {
      success: true as const,
      message:
        "Cotações da proposta atualizadas com sucesso.",
    };
  } catch (error) {
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível atualizar as cotações da proposta.",
    };
  }
}

export async function salvarEdicaoPropostaAction(
  propostaId: string,
  cotacaoId: string,
  cotacoesSeguradorasIds: string[],
  observacoes: string,
  validadeDias: number,
) {
  try {
    if (!propostaId || !cotacaoId) {
      throw new Error("Proposta ou cotação não informada.");
    }

    const ids = [...new Set(cotacoesSeguradorasIds.map(String).filter(Boolean))];

    if (ids.length === 0) {
      throw new Error("A proposta precisa possuir pelo menos uma cotação.");
    }

    const supabase = await createClient();

    const { data: cotacoes, error: cotacoesError } = await supabase
      .from("cotacoes_seguradoras")
      .select("id,premio_liquido,premio_total,comissao_percentual,comissao_valor")
      .eq("cotacao_id", cotacaoId)
      .in("id", ids);

    if (cotacoesError) throw new Error(cotacoesError.message);
    if (!cotacoes || cotacoes.length !== ids.length) {
      throw new Error("Uma ou mais cotações selecionadas não pertencem a esta cotação.");
    }

    const mapa = new Map(cotacoes.map((item) => [String(item.id), item]));
    const ordenadas = ids.map((id) => mapa.get(id)).filter(Boolean) as typeof cotacoes;
    const primeira = ordenadas[0];

    const { error: deleteError } = await supabase
      .from("propostas_itens")
      .delete()
      .eq("proposta_id", propostaId);

    if (deleteError) throw new Error(deleteError.message);

    const { error: insertError } = await supabase
      .from("propostas_itens")
      .insert(ids.map((id, index) => ({
        proposta_id: propostaId,
        cotacao_seguradora_id: id,
        ordem: index,
      })));

    if (insertError) throw new Error(insertError.message);

    const { error: updateError } = await supabase
      .from("propostas")
      .update({
        observacoes: observacoes.trim() || null,
        validade_dias: validadeDias,
        premio_liquido: primeira.premio_liquido,
        premio_total: primeira.premio_total,
        comissao_percentual: primeira.comissao_percentual,
        comissao_valor: primeira.comissao_valor,
        updated_at: new Date().toISOString(),
      })
      .eq("id", propostaId)
      .eq("cotacao_id", cotacaoId);

    if (updateError) throw new Error(updateError.message);

    revalidatePath("/admin/propostas");
    revalidatePath(`/admin/propostas/${propostaId}/workspace`);
    revalidatePath(`/admin/cotacoes/${cotacaoId}`);

    return { success: true as const, message: "Proposta atualizada com sucesso." };
  } catch (error) {
    return {
      success: false as const,
      message: error instanceof Error ? error.message : "Não foi possível salvar a proposta.",
    };
  }
}
