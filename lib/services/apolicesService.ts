import {
  buscarApolice,
  buscarApoliceEdicao,
  listarApolices,
  type ApoliceEdicao,
  type ApoliceLista,
} from "@/lib/repositories/apolicesRepository";

export async function obterApolices(): Promise<
  ApoliceLista[]
> {
  return listarApolices();
}

export async function obterApolice(
  id: string,
) {
  return buscarApolice(id);
}

export async function obterApoliceEdicao(
  id: string,
): Promise<ApoliceEdicao> {
  return buscarApoliceEdicao(id);
}