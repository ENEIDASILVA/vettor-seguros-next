"use server";

import {
  revalidatePath,
} from "next/cache";

import {
  alterarStatusSeguradora,
  atualizarSeguradora,
  excluirSeguradora,
  inserirSeguradora,
} from "@/lib/repositories/seguradorasRepository";

function limparTexto(
  valor: unknown,
) {
  return String(
    valor ?? "",
  ).trim();
}

function limparCodigo(
  valor: unknown,
) {
  const codigo =
    limparTexto(
      valor,
    );

  return codigo || null;
}

export async function salvarSeguradoraAction(
  formData: FormData,
) {
  try {
    const idRaw =
      limparTexto(
        formData.get("id"),
      );

    const nome =
      limparTexto(
        formData.get(
          "nome",
        ),
      );

    const codigo =
      limparCodigo(
        formData.get(
          "codigo",
        ),
      );

    if (!nome) {
      throw new Error(
        "Informe o nome da seguradora.",
      );
    }

    if (idRaw) {
      await atualizarSeguradora({
        id: Number(idRaw),
        nome,
        codigo,
      });
    } else {
      await inserirSeguradora({
        nome,
        codigo,
      });
    }

    revalidatePath(
      "/admin/configuracoes",
    );

    return {
      success:
        true as const,
      message:
        idRaw
          ? "Seguradora atualizada com sucesso."
          : "Seguradora cadastrada com sucesso.",
    };
  } catch (error) {
    return {
      success:
        false as const,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível salvar a seguradora.",
    };
  }
}

export async function alterarStatusSeguradoraAction(
  id: number,
  ativo: boolean,
) {
  try {
    await alterarStatusSeguradora({
      id,
      ativo,
    });

    revalidatePath(
      "/admin/configuracoes",
    );

    return {
      success:
        true as const,
      message:
        ativo
          ? "Seguradora ativada com sucesso."
          : "Seguradora inativada com sucesso.",
    };
  } catch (error) {
    return {
      success:
        false as const,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível alterar o status da seguradora.",
    };
  }
}

export async function excluirSeguradoraAction(
  id: number,
) {
  try {
    await excluirSeguradora(
      id,
    );

    revalidatePath(
      "/admin/configuracoes",
    );

    return {
      success:
        true as const,
      message:
        "Seguradora excluída com sucesso.",
    };
  } catch (error) {
    return {
      success:
        false as const,
      message:
        error instanceof Error
          ? error.message
          : "Não foi possível excluir a seguradora.",
    };
  }
}
