import "server-only";

import { createClient } from "@/lib/supabase/server";

export type PagamentoPendenteRelatorio = {
  id: string;
  apoliceId: string;
  clienteId: string;
  cliente: string;
  cpfCliente: string;
  seguradora: string;
  numeroParcela: number;
  quantidadeParcelas: number;
  dataVencimento: string;
  valor: number;
};

type RelacaoApolice = {
  id: string;
  cliente_id: string;
  cliente: { nome?: string | null; cpf?: string | null } | { nome?: string | null; cpf?: string | null }[] | null;
  seguradora: { nome?: string | null } | { nome?: string | null }[] | null;
};

function primeiro<T>(valor: T | T[] | null): T | null {
  return Array.isArray(valor) ? valor[0] ?? null : valor;
}

export async function listarPagamentosPendentes(): Promise<PagamentoPendenteRelatorio[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("apolice_pagamentos")
    .select(`
      id,
      numero_parcela,
      quantidade_parcelas,
      valor,
      data_vencimento,
      apolice:apolices!apolice_pagamentos_apolice_id_fkey(
        id,
        cliente_id,
        cliente:clientes!apolices_cliente_id_fkey(nome, cpf),
        seguradora:seguradoras!apolices_seguradora_id_fkey(nome)
      )
    `)
    .eq("status", "Pendente")
    .is("data_pagamento", null)
    .order("data_vencimento", { ascending: true })
    .order("numero_parcela", { ascending: true });

  if (error) {
    throw new Error(`Não foi possível carregar os pagamentos pendentes: ${error.message}`);
  }

  return (data ?? []).flatMap((item) => {
    const apolice = primeiro(item.apolice as RelacaoApolice | RelacaoApolice[] | null);
    if (!apolice) return [];
    const cliente = primeiro(apolice.cliente);
    const seguradora = primeiro(apolice.seguradora);

    return [{
      id: String(item.id),
      apoliceId: String(apolice.id),
      clienteId: String(apolice.cliente_id),
      cliente: cliente?.nome ?? "-",
      cpfCliente: cliente?.cpf ?? "",
      seguradora: seguradora?.nome ?? "-",
      numeroParcela: Number(item.numero_parcela),
      quantidadeParcelas: Number(item.quantidade_parcelas),
      dataVencimento: item.data_vencimento,
      valor: Number(item.valor),
    }];
  });
}
