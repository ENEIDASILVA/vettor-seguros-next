"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  createClient,
} from "@/lib/supabase/server";

const BUCKET =
  "apolices-pdf";

const LIMITE_ARQUIVO =
  10 * 1024 * 1024;

function revalidar(
  apoliceId: string,
) {
  revalidatePath(
    "/admin/apolices",
  );

  revalidatePath(
    `/admin/apolices/${apoliceId}`,
  );
}

export async function enviarPdfApoliceAction(
  formData: FormData,
) {
  try {
    const apoliceId =
      String(
        formData.get(
          "apoliceId",
        ) ?? "",
      ).trim();

    const arquivo =
      formData.get(
        "arquivo",
      );

    if (!apoliceId) {
      throw new Error(
        "Apólice não informada.",
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

    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth
        .getUser();

    if (
      authError ||
      !authData.user
    ) {
      throw new Error(
        "Sua sessão expirou. Entre novamente no sistema.",
      );
    }

    const {
      data: apolice,
      error: apoliceError,
    } =
      await supabase
        .from("apolices")
        .select(`
          id,
          arquivo_pdf_path
        `)
        .eq(
          "id",
          apoliceId,
        )
        .maybeSingle();

    if (
      apoliceError
    ) {
      throw new Error(
        `Não foi possível localizar a apólice: ${apoliceError.message}`,
      );
    }

    if (!apolice) {
      throw new Error(
        "Apólice não encontrada.",
      );
    }

    const caminho =
      `${apoliceId}/apolice.pdf`;

    const buffer =
      await arquivo
        .arrayBuffer();

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

    if (
      uploadError
    ) {
      throw new Error(
        `Não foi possível enviar o PDF da apólice: ${uploadError.message}`,
      );
    }

    const {
      error: updateError,
    } =
      await supabase
        .from("apolices")
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
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          apoliceId,
        );

    if (
      updateError
    ) {
      if (
        !apolice
          .arquivo_pdf_path
      ) {
        await supabase.storage
          .from(BUCKET)
          .remove([
            caminho,
          ]);
      }

      throw new Error(
        `O PDF foi enviado, mas não foi possível vinculá-lo à apólice: ${updateError.message}`,
      );
    }

    revalidar(
      apoliceId,
    );

    return {
      success:
        true as const,

      message:
        "PDF da apólice enviado com sucesso.",
    };
  } catch (error) {
    return {
      success:
        false as const,

      message:
        error instanceof Error
          ? error.message
          : "Não foi possível enviar o PDF da apólice.",
    };
  }
}

export async function removerPdfApoliceAction(
  apoliceId: string,
) {
  try {
    if (
      !apoliceId
    ) {
      throw new Error(
        "Apólice não informada.",
      );
    }

    const supabase =
      await createClient();

    const {
      data: authData,
      error: authError,
    } =
      await supabase.auth
        .getUser();

    if (
      authError ||
      !authData.user
    ) {
      throw new Error(
        "Sua sessão expirou. Entre novamente no sistema.",
      );
    }

    const {
      data: apolice,
      error: apoliceError,
    } =
      await supabase
        .from("apolices")
        .select(
          "arquivo_pdf_path",
        )
        .eq(
          "id",
          apoliceId,
        )
        .maybeSingle();

    if (
      apoliceError
    ) {
      throw new Error(
        apoliceError.message,
      );
    }

    if (
      !apolice
    ) {
      throw new Error(
        "Apólice não encontrada.",
      );
    }

    if (
      apolice
        .arquivo_pdf_path
    ) {
      const {
        error: removeError,
      } =
        await supabase.storage
          .from(BUCKET)
          .remove([
            apolice
              .arquivo_pdf_path,
          ]);

      if (
        removeError
      ) {
        throw new Error(
          `Não foi possível remover o PDF: ${removeError.message}`,
        );
      }
    }

    const {
      error: updateError,
    } =
      await supabase
        .from("apolices")
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
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          apoliceId,
        );

    if (
      updateError
    ) {
      throw new Error(
        `Não foi possível limpar os dados do PDF: ${updateError.message}`,
      );
    }

    revalidar(
      apoliceId,
    );

    return {
      success:
        true as const,

      message:
        "PDF removido com sucesso.",
    };
  } catch (error) {
    return {
      success:
        false as const,

      message:
        error instanceof Error
          ? error.message
          : "Não foi possível remover o PDF.",
    };
  }
}
