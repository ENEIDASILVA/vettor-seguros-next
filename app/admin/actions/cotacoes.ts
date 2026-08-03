"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  criarCotacao,
  editarCotacao,
} from "@/lib/services/cotacoesService";

import type {
  AtualizarCotacao,
  NovaCotacao,
} from "@/lib/repositories/cotacoesRepository";

export async function criarCotacaoAction(
  dados: NovaCotacao
) {
  const id = await criarCotacao(dados);

  revalidatePath("/admin/cotacoes");

  redirect(`/admin/cotacoes/${id}`);
}

export async function editarCotacaoAction(
  id: string,
  dados: AtualizarCotacao
) {
  await editarCotacao(id, dados);

  revalidatePath("/admin/cotacoes");
  revalidatePath(`/admin/cotacoes/${id}`);

  redirect(`/admin/cotacoes/${id}`);
}