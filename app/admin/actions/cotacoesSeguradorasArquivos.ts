"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

const BUCKET =
  "cotacoes-pdf";

const LIMITE_ARQUIVO =
  10 * 1024 * 1024;


function revalidar(
  cotacaoId: string,
) {
  revalidatePath(
    "/admin/cotacoes",
  );

  revalidatePath(
    `/admin/cotacoes/${cotacaoId}`,
  );
}


export async function enviarPdfCotacaoSeguradoraAction(
  formData: FormData,
) {
  try {
    const cotacaoId =
      String(
        formData.get(
          "cotacaoId",
        ) ?? "",
      ).trim();

    const cotacaoSeguradoraId =
      String(
        formData.get(
          "cotacaoSeguradoraId",
        ) ?? "",
      ).trim();

    const arquivo =
      formData.get("arquivo");

    if (!cotacaoId) {
      throw new Error(
        "Cotação de origem não informada.",
      );
    }

    if (!cotacaoSeguradoraId) {
      throw new Error(
        "Salve a cotação da seguradora antes de anexar o PDF.",
      );
    }

    if (
      !(arquivo instanceof File)
    ) {
      throw new Error(
        "Selecione um arquivo PDF.",
      );
    }

    if (
      arquivo.type !==
      "application/pdf"
    ) {
      throw new Error(
        "O arquivo deve estar no formato PDF.",
      );
    }

    if (
      arquivo.size <= 0
    ) {
      throw new Error(
        "O arquivo selecionado está vazio.",
      );
    }

    if (
      arquivo.size >
      LIMITE_ARQUIVO
    ) {
      throw new Error(
        "O PDF deve possuir no máximo 10 MB.",
      );
    }

    const supabase =
      await createClient();

    /*
     * Confirma que o usuário realmente
     * possui uma sessão válida antes
     * de manipular documentos privados.
     */
    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !authData.user
    ) {
      throw new Error(
        "Sua sessão expirou. Entre novamente no sistema.",
      );
    }

    /*
     * Confirma que a cotação da seguradora
     * existe e pertence à cotação informada.
     */
    const {
      data: registro,
      error: registroError,
    } =
      await supabase
        .from(
          "cotacoes_seguradoras",
        )
        .select(`
          id,
          cotacao_id,
          arquivo_pdf_path
        `)
        .eq(
          "id",
          cotacaoSeguradoraId,
        )
        .eq(
          "cotacao_id",
          cotacaoId,
        )
        .maybeSingle();

    if (registroError) {
      throw new Error(
        `Não foi possível localizar a cotação da seguradora: ${registroError.message}`,
      );
    }

    if (!registro) {
      throw new Error(
        "Cotação da seguradora não encontrada.",
      );
    }

    const caminho =
      `${cotacaoId}/${cotacaoSeguradoraId}.pdf`;

    const buffer =
      await arquivo.arrayBuffer();

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
              true,

            cacheControl:
              "3600",
          },
        );

    if (uploadError) {
      throw new Error(
        `Não foi possível enviar o PDF: ${uploadError.message}`,
      );
    }

    /*
     * Somente depois do upload concluído
     * gravamos os metadados no banco.
     */
    const {
      error: updateError,
    } =
      await supabase
        .from(
          "cotacoes_seguradoras",
        )
        .update({
          arquivo_pdf_path:
            caminho,

          arquivo_pdf_nome:
            arquivo.name,

          arquivo_pdf_tamanho:
            arquivo.size,

          arquivo_pdf_tipo:
            arquivo.type,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          cotacaoSeguradoraId,
        );

    if (updateError) {
      /*
       * Evita deixar arquivo órfão
       * caso o banco não consiga
       * registrar o caminho.
       */
      await supabase.storage
        .from(BUCKET)
        .remove([
          caminho,
        ]);

      throw new Error(
        `O PDF foi enviado, mas não foi possível vinculá-lo à cotação: ${updateError.message}`,
      );
    }

    revalidar(
      cotacaoId,
    );

    return {
      success: true as const,

      path:
        caminho,

      nome:
        arquivo.name,

      tipo:
        arquivo.type,

      tamanho:
        arquivo.size,

      message:
        "PDF enviado com sucesso.",
    };
  } catch (error) {
    return {
      success: false as const,

      message:
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o PDF.",
    };
  }
}


export async function abrirPdfCotacaoSeguradoraAction(
  cotacaoSeguradoraId: string,
) {
  try {
    if (!cotacaoSeguradoraId) {
      throw new Error(
        "Cotação da seguradora não informada.",
      );
    }

    const supabase =
      await createClient();

    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !authData.user
    ) {
      throw new Error(
        "Sua sessão expirou. Entre novamente no sistema.",
      );
    }

    const {
      data: registro,
      error: registroError,
    } =
      await supabase
        .from(
          "cotacoes_seguradoras",
        )
        .select(`
          cotacao_id,
          arquivo_pdf_path,
          arquivo_pdf_nome
        `)
        .eq(
          "id",
          cotacaoSeguradoraId,
        )
        .maybeSingle();

    if (registroError) {
      throw new Error(
        registroError.message,
      );
    }

    if (!registro) {
      throw new Error(
        "Cotação da seguradora não encontrada.",
      );
    }

    /*
     * Os PDFs sempre são gravados no Storage no padrão:
     * {cotacaoId}/{cotacaoSeguradoraId}.pdf
     *
     * Algumas cotações antigas podem ter o arquivo no bucket,
     * mas o campo arquivo_pdf_path ter ficado vazio no banco.
     * Nesse caso procuramos o arquivo pelo caminho padrão e
     * reparamos o vínculo automaticamente.
     */
    let caminho =
      registro.arquivo_pdf_path ??
      null;

    if (!caminho) {
      const nomeArquivoStorage =
        `${cotacaoSeguradoraId}.pdf`;

      const {
        data: arquivos,
        error: listError,
      } =
        await supabase.storage
          .from(BUCKET)
          .list(
            String(
              registro.cotacao_id,
            ),
            {
              search:
                nomeArquivoStorage,
              limit: 10,
            },
          );

      if (listError) {
        throw new Error(
          `Não foi possível localizar o PDF anexado: ${listError.message}`,
        );
      }

      const arquivoExiste =
        (arquivos ?? []).some(
          (arquivo) =>
            arquivo.name ===
            nomeArquivoStorage,
        );

      if (!arquivoExiste) {
        throw new Error(
          "Esta cotação não possui PDF anexado.",
        );
      }

      caminho =
        `${registro.cotacao_id}/${nomeArquivoStorage}`;

      const {
        error: repairError,
      } =
        await supabase
          .from(
            "cotacoes_seguradoras",
          )
          .update({
            arquivo_pdf_path:
              caminho,
            arquivo_pdf_tipo:
              "application/pdf",
            updated_at:
              new Date().toISOString(),
          })
          .eq(
            "id",
            cotacaoSeguradoraId,
          );

      if (repairError) {
        throw new Error(
          `O PDF foi encontrado, mas não foi possível corrigir o vínculo: ${repairError.message}`,
        );
      }
    }

    const {
      data,
      error,
    } =
      await supabase.storage
        .from(BUCKET)
        .createSignedUrl(
          caminho,
          300,
        );

    if (error) {
      throw new Error(
        `Não foi possível abrir o PDF: ${error.message}`,
      );
    }

    return {
      success: true as const,

      url:
        data.signedUrl,
    };
  } catch (error) {
    return {
      success: false as const,

      message:
        error instanceof Error
          ? error.message
          : "Não foi possível abrir o PDF.",
    };
  }
}


export async function removerPdfCotacaoSeguradoraAction(
  cotacaoSeguradoraId: string,
  cotacaoId: string,
) {
  try {
    if (
      !cotacaoSeguradoraId
    ) {
      throw new Error(
        "Cotação da seguradora não informada.",
      );
    }

    const supabase =
      await createClient();

    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth.getUser();

    if (
      authError ||
      !authData.user
    ) {
      throw new Error(
        "Sua sessão expirou. Entre novamente no sistema.",
      );
    }

    const {
      data: registro,
      error: registroError,
    } =
      await supabase
        .from(
          "cotacoes_seguradoras",
        )
        .select(
          "arquivo_pdf_path",
        )
        .eq(
          "id",
          cotacaoSeguradoraId,
        )
        .maybeSingle();

    if (registroError) {
      throw new Error(
        registroError.message,
      );
    }

    if (!registro) {
      throw new Error(
        "Cotação da seguradora não encontrada.",
      );
    }

    if (
      registro.arquivo_pdf_path
    ) {
      const {
        error: removeError,
      } =
        await supabase.storage
          .from(BUCKET)
          .remove([
            registro.arquivo_pdf_path,
          ]);

      if (removeError) {
        throw new Error(
          `Não foi possível remover o PDF: ${removeError.message}`,
        );
      }
    }

    const {
      error: updateError,
    } =
      await supabase
        .from(
          "cotacoes_seguradoras",
        )
        .update({
          arquivo_pdf_path:
            null,

          arquivo_pdf_nome:
            null,

          arquivo_pdf_tamanho:
            null,

          arquivo_pdf_tipo:
            null,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          cotacaoSeguradoraId,
        );

    if (updateError) {
      throw new Error(
        `Não foi possível limpar os dados do PDF: ${updateError.message}`,
      );
    }

    revalidar(
      cotacaoId,
    );

    return {
      success: true as const,

      message:
        "PDF removido com sucesso.",
    };
  } catch (error) {
    return {
      success: false as const,

      message:
        error instanceof Error
          ? error.message
          : "Não foi possível remover o PDF.",
    };
  }
}