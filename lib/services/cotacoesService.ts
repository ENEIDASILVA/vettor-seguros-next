import {
  AtualizarCotacao,
  NovaCotacao,
  atualizarCotacao,
  buscarCotacao,
  inserirCotacao,
  listarCotacoes,
  listarStatusCotacao,
  listarTiposSeguro,
} from "@/lib/repositories/cotacoesRepository";

export async function obterCotacoes() {
  return listarCotacoes();
}

export async function obterCotacao(id: string) {
  if (!id) {
    throw new Error("Cotação inválida.");
  }

  return buscarCotacao(id);
}

export async function criarCotacao(
  dados: NovaCotacao
) {
  return inserirCotacao(dados);
}

export async function editarCotacao(
  id: string,
  dados: AtualizarCotacao
) {
  if (!id) {
    throw new Error("Cotação inválida.");
  }

  return atualizarCotacao(id, dados);
}

export async function obterTiposSeguro() {
  return listarTiposSeguro();
}

export async function obterStatusCotacao() {
  return listarStatusCotacao();
}