import "server-only";

import { createClient } from "@/lib/supabase/server";



export type PropostaLista = {

  id:string;

  cliente:string;

  seguradora:string;

  tipoSeguro:string;

  numeroProposta:string;

  premioTotal:number | null;

  status:string;

  possuiApolice: boolean;
  apoliceId?: string;

};




export type PropostaDetalhe = {
  id: string;

  clienteId: string;
  cotacaoId: string | null;
  seguradoraId: number;
  tipoSeguroId: number;

  cliente: string;
  seguradora: string;
  tipoSeguro: string;

  numeroProposta: string | null;

  premioLiquido: number | null;
  premioTotal: number | null;

  comissaoPercentual: number | null;
  comissaoValor: number | null;

  status: string;
  createdAt: string;

  apolice: {
    id: string;
    numeroApolice: string;
    status: string;
    inicioVigencia: string;
    fimVigencia: string;
  } | null;
};

export async function listarPropostas(): Promise<PropostaLista[]> {

  const supabase = await createClient();

  const [
    propostasResult,
    apolicesResult,
  ] = await Promise.all([

    supabase
      .from("propostas")
      .select(`
        id,
        numero_proposta,
        premio_total,
        status,

        cliente:clientes(nome),

        seguradora:seguradoras(nome),

        tipo_seguro:tipos_seguro(nome)
      `)
      .order("created_at", {
        ascending: false,
      }),

    supabase
      .from("apolices")
      .select("id, proposta_id"),

  ]);

  if (propostasResult.error) {
    throw new Error(
      propostasResult.error.message,
    );
  }

  if (apolicesResult.error) {
    throw new Error(
      apolicesResult.error.message,
    );
  }

  const mapaApolices =
    new Map<string, string>();

  (apolicesResult.data ?? []).forEach(
    (apolice: any) => {

      if (apolice.proposta_id) {

        mapaApolices.set(
          apolice.proposta_id,
          apolice.id,
        );

      }

    },
  );

  return (propostasResult.data ?? []).map(
    (item: any) => ({

      id: item.id,

      cliente:
        item.cliente?.nome ??
        item.cliente?.[0]?.nome ??
        "-",

      seguradora:
        item.seguradora?.nome ??
        item.seguradora?.[0]?.nome ??
        "-",

      tipoSeguro:
        item.tipo_seguro?.nome ??
        item.tipo_seguro?.[0]?.nome ??
        "-",

      numeroProposta:
        item.numero_proposta ?? "-",

      premioTotal:
        item.premio_total,

      status:
        item.status,

      possuiApolice:
        mapaApolices.has(item.id),

      apoliceId:
        mapaApolices.get(item.id),

    }),
  );

}

export async function buscarPropostaPorId(
  id: string,
): Promise<PropostaDetalhe | null> {
  if (!id) {
    throw new Error(
      "ID da proposta não informado.",
    );
  }

  const supabase = await createClient();

  const [
    propostaResult,
    apoliceResult,
  ] = await Promise.all([
    supabase
      .from("propostas")
      .select(`
        id,
        cliente_id,
        cotacao_id,
        seguradora_id,
        tipo_seguro_id,
        numero_proposta,
        premio_liquido,
        premio_total,
        comissao_percentual,
        comissao_valor,
        status,
        created_at,

        cliente:clientes(nome),
        seguradora:seguradoras(nome),
        tipo_seguro:tipos_seguro(nome)
      `)
      .eq("id", id)
      .maybeSingle(),

    supabase
      .from("apolices")
      .select(`
        id,
        numero_apolice,
        status,
        inicio_vigencia,
        fim_vigencia
      `)
      .eq("proposta_id", id)
      .maybeSingle(),
  ]);

  if (propostaResult.error) {
    throw new Error(
      propostaResult.error.message,
    );
  }

  if (apoliceResult.error) {
    throw new Error(
      apoliceResult.error.message,
    );
  }

  const data = propostaResult.data;

  if (!data) {
    return null;
  }

  const cliente =
    (data.cliente as any)?.[0]?.nome ??
    (data.cliente as any)?.nome ??
    "-";

  const seguradora =
    (data.seguradora as any)?.[0]?.nome ??
    (data.seguradora as any)?.nome ??
    "-";

  const tipoSeguro =
    (data.tipo_seguro as any)?.[0]?.nome ??
    (data.tipo_seguro as any)?.nome ??
    "-";

  const apoliceData =
    apoliceResult.data;

  return {
    id: data.id,

    clienteId:
      data.cliente_id,

    cotacaoId:
      data.cotacao_id,

    seguradoraId:
      data.seguradora_id,

    tipoSeguroId:
      data.tipo_seguro_id,

    cliente,
    seguradora,
    tipoSeguro,

    numeroProposta:
      data.numero_proposta,

    premioLiquido:
      data.premio_liquido,

    premioTotal:
      data.premio_total,

    comissaoPercentual:
      data.comissao_percentual,

    comissaoValor:
      data.comissao_valor,

    status:
      data.status,

    createdAt:
      data.created_at,

    apolice: apoliceData
      ? {
          id: apoliceData.id,

          numeroApolice:
            apoliceData.numero_apolice,

          status:
            apoliceData.status,

          inicioVigencia:
            apoliceData.inicio_vigencia,

          fimVigencia:
            apoliceData.fim_vigencia,
        }
      : null,
  };
}












