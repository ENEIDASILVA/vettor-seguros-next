import { obterDadosFormularioApolice } from "@/lib/repositories/apolicesFormRepository";

export async function carregarFormularioApolice() {
  return obterDadosFormularioApolice();
}