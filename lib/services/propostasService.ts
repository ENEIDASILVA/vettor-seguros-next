import {
  listarPropostas,
  type PropostaLista,
} from "@/lib/repositories/propostasRepository";


export async function obterPropostas(): Promise<
  PropostaLista[]
> {
  return listarPropostas();
}