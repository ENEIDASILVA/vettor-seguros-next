import "server-only";

import { createClient } from "@/lib/supabase/server";


export type ApoliceLista = {
  id: string;
  cliente: string;
  seguradora: string;
  tipoSeguro: string;
  numeroApolice: string;
  inicioVigencia: string;
  fimVigencia: string;
  status: string;
};


export type ApoliceDetalhe = {
  id: string;

  propostaId: string | null;
  numeroProposta: string | null;

  cliente: string;
  seguradora: string;
  tipoSeguro: string;

  numeroApolice: string;

  inicioVigencia: string;
  fimVigencia: string;

  premioLiquido: number | null;
  premioTotal: number | null;

  comissaoPercentual: number | null;
  comissaoValor: number | null;

  observacoes: string | null;
  status: string;

  arquivoPdfPath: string | null;
  arquivoPdfNome: string | null;
  arquivoPdfTamanho: number | null;
  arquivoPdfTipo: string | null;
  arquivoPdfUrl: string | null;
};


type Relacionamento = {
  nome: string;
};


type RelacionamentoSupabase =
  | Relacionamento
  | Relacionamento[]
  | null;


type ApoliceRow = {
  id: string;
  numero_apolice: string;
  inicio_vigencia: string;
  fim_vigencia: string;
  status: string;

  cliente: RelacionamentoSupabase;
  seguradora: RelacionamentoSupabase;
  tipo_seguro: RelacionamentoSupabase;
};


function obterNome(
  relacionamento: RelacionamentoSupabase,
): string {
  if (!relacionamento) {
    return "-";
  }

  if (Array.isArray(relacionamento)) {
    return relacionamento[0]?.nome ?? "-";
  }

  return relacionamento.nome ?? "-";
}


function obterNomeRelacionamento(
  relacionamento:
    | { nome?: string }
    | { nome?: string }[]
    | null
    | undefined,
): string {
  if (!relacionamento) {
    return "-";
  }

  if (Array.isArray(relacionamento)) {
    return relacionamento[0]?.nome ?? "-";
  }

  return relacionamento.nome ?? "-";
}


export async function listarApolices(): Promise<
  ApoliceLista[]
> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("apolices")
    .select(`
      id,
      numero_apolice,
      inicio_vigencia,
      fim_vigencia,
      status,

      cliente:clientes!apolices_cliente_id_fkey(nome),

      seguradora:seguradoras!apolices_seguradora_id_fkey(nome),

      tipo_seguro:tipos_seguro!apolices_tipo_seguro_id_fkey(nome)
    `)
    .order("fim_vigencia", {
      ascending: true,
    });

  if (error) {
    console.error(
      "Erro ao listar apólices:",
      error,
    );

    throw new Error(
      `Erro ao listar apólices: ${
        error.message || "erro não informado"
      }`,
    );
  }

  const rows = (data ?? []) as ApoliceRow[];

  return rows.map((apolice) => ({
    id: apolice.id,

    cliente:
      obterNome(apolice.cliente),

    seguradora:
      obterNome(apolice.seguradora),

    tipoSeguro:
      obterNome(apolice.tipo_seguro),

    numeroApolice:
      apolice.numero_apolice,

    inicioVigencia:
      apolice.inicio_vigencia,

    fimVigencia:
      apolice.fim_vigencia,

    status:
      apolice.status,
  }));
}


export async function buscarApolice(
  id: string,
): Promise<ApoliceDetalhe> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("apolices")
    .select(`
      id,
      proposta_id,
      numero_proposta,
      numero_apolice,
      inicio_vigencia,
      fim_vigencia,
      premio_liquido,
      premio_total,
      comissao_percentual,
      comissao_valor,
      observacoes,
      status,
      arquivo_pdf_path,
      arquivo_pdf_nome,
      arquivo_pdf_tamanho,
      arquivo_pdf_tipo,

      cliente:clientes!apolices_cliente_id_fkey(nome),

      seguradora:seguradoras!apolices_seguradora_id_fkey(nome),

      tipo_seguro:tipos_seguro!apolices_tipo_seguro_id_fkey(nome),

      proposta:propostas!apolices_proposta_id_fkey(
        numero_proposta
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Não foi possível buscar a apólice: ${error.message}`,
    );
  }

  const propostaRelacionada =
    data.proposta as
      | { numero_proposta?: string | null }
      | { numero_proposta?: string | null }[]
      | null;

  const numeroPropostaRelacionada =
    Array.isArray(propostaRelacionada)
      ? propostaRelacionada[0]?.numero_proposta
      : propostaRelacionada?.numero_proposta;

  let arquivoPdfUrl: string | null = null;

  if (data.arquivo_pdf_path) {
    const { data: signedData } =
      await supabase.storage
        .from("apolices-pdf")
        .createSignedUrl(
          data.arquivo_pdf_path,
          60 * 60,
        );

    arquivoPdfUrl =
      signedData?.signedUrl ??
      null;
  }

  return {
    id:
      data.id,

    propostaId:
      data.proposta_id ?? null,

    numeroProposta:
      data.numero_proposta ??
      numeroPropostaRelacionada ??
      null,

    cliente:
      obterNomeRelacionamento(
        data.cliente,
      ),

    seguradora:
      obterNomeRelacionamento(
        data.seguradora,
      ),

    tipoSeguro:
      obterNomeRelacionamento(
        data.tipo_seguro,
      ),

    numeroApolice:
      data.numero_apolice,

    inicioVigencia:
      data.inicio_vigencia,

    fimVigencia:
      data.fim_vigencia,

    premioLiquido:
      data.premio_liquido,

    premioTotal:
      data.premio_total,

    comissaoPercentual:
      data.comissao_percentual,

    comissaoValor:
      data.comissao_valor,

    observacoes:
      data.observacoes,

    status:
      data.status,

    arquivoPdfPath:
      data.arquivo_pdf_path ?? null,

    arquivoPdfNome:
      data.arquivo_pdf_nome ?? null,

    arquivoPdfTamanho:
      data.arquivo_pdf_tamanho ?? null,

    arquivoPdfTipo:
      data.arquivo_pdf_tipo ?? null,

    arquivoPdfUrl,
  };
}


export type ApoliceEdicao = {
  id: string;

  propostaId?: string | null;
  numeroProposta?: string | null;

  clienteId: string;
  cotacaoId: string | null;
  seguradoraId: number;
  tipoSeguroId: number;

  numeroApolice: string;

  inicioVigencia: string;
  fimVigencia: string;

  premioLiquido: number | null;
  premioTotal: number | null;

  comissaoPercentual: number | null;
  comissaoValor: number | null;

  status: string;
  observacoes: string | null;
};


export async function buscarApoliceEdicao(
  id: string,
): Promise<ApoliceEdicao> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("apolices")
    .select(`
      id,
      proposta_id,
      numero_proposta,
      cliente_id,
      cotacao_id,
      seguradora_id,
      tipo_seguro_id,
      numero_apolice,
      inicio_vigencia,
      fim_vigencia,
      premio_liquido,
      premio_total,
      comissao_percentual,
      comissao_valor,
      status,
      observacoes
    `)
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      `Não foi possível buscar a apólice: ${error.message}`,
    );
  }

  return {
    id:
      data.id,

    propostaId:
      data.proposta_id ?? null,

    numeroProposta:
      data.numero_proposta ?? null,

    clienteId:
      data.cliente_id,

    cotacaoId:
      data.cotacao_id,

    seguradoraId:
      data.seguradora_id,

    tipoSeguroId:
      data.tipo_seguro_id,

    numeroApolice:
      data.numero_apolice,

    inicioVigencia:
      data.inicio_vigencia,

    fimVigencia:
      data.fim_vigencia,

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

    observacoes:
      data.observacoes,
  };
}


export async function buscarApolicePorProposta(
  propostaId: string,
): Promise<{ id: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("apolices")
    .select("id")
    .eq("proposta_id", propostaId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Não foi possível verificar a apólice da proposta: ${error.message}`,
    );
  }

  return data;
}


export async function listarPropostasComApolice() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("apolices")
    .select("id, proposta_id");

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}