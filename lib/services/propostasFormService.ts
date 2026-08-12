import "server-only";
import { createClient } from "@/lib/supabase/server";

const BUCKET_PDF = "propostas-pdf";

export async function carregarFormularioProposta(identificador: string) {
  const supabase = await createClient();

  const { data: proposta, error: propostaError } = await supabase
    .from("propostas")
    .select(`
      id,cotacao_id,observacoes,validade_dias,status,
      arquivo_pdf_path,arquivo_pdf_nome,arquivo_pdf_tamanho,arquivo_pdf_tipo,
      cliente:clientes(id,nome),
      tipo_seguro:tipos_seguro(id,nome)
    `)
    .eq("id", identificador)
    .maybeSingle();

  if (propostaError) throw new Error(propostaError.message);

  const cotacaoId = proposta?.cotacao_id ?? identificador;

  const { data: cotacao, error: cotacaoError } = await supabase
    .from("cotacoes")
    .select(`id,cliente:clientes(id,nome),tipo_seguro:tipos_seguro(id,nome)`)
    .eq("id", cotacaoId)
    .single();

  if (cotacaoError) throw new Error(cotacaoError.message);

  const { data: seguradoras, error: seguradorasError } = await supabase
    .from("seguradoras")
    .select("id,nome");

  if (seguradorasError) throw new Error(seguradorasError.message);

  const anexarSeguradora = (item: any) => ({
    ...item,
    seguradora: seguradoras?.find((s) => Number(s.id) === Number(item.seguradora_id)) ?? null,
  });

  const { data: todas, error: todasError } = await supabase
    .from("cotacoes_seguradoras")
    .select("*")
    .eq("cotacao_id", cotacaoId)
    .order("premio_total", { ascending: true, nullsFirst: false });

  if (todasError) throw new Error(todasError.message);

  const todasSeguradoras = (todas ?? []).map(anexarSeguradora);
  let seguradorasSelecionadas: any[] = [];

  if (proposta) {
    const { data: itens, error: itensError } = await supabase
      .from("propostas_itens")
      .select("cotacao_seguradora_id,ordem")
      .eq("proposta_id", proposta.id)
      .order("ordem", { ascending: true });

    if (itensError) throw new Error(itensError.message);

    const mapa = new Map(todasSeguradoras.map((item) => [String(item.id), item]));
    seguradorasSelecionadas = (itens ?? [])
      .map((item) => mapa.get(String(item.cotacao_seguradora_id)))
      .filter(Boolean);
  } else {
    seguradorasSelecionadas = todasSeguradoras.filter((item) => item.recomendada === true);
  }

  let pdfUrl: string | null = null;
  if (proposta?.arquivo_pdf_path) {
    const { data } = await supabase.storage
      .from(BUCKET_PDF)
      .createSignedUrl(proposta.arquivo_pdf_path, 3600);
    pdfUrl = data?.signedUrl ?? null;
  }

  let historicoPdfs: any[] = [];

  if (proposta) {
    const { data: historico, error: historicoError } =
      await supabase
        .from("propostas_pdfs")
        .select("id,proposta_id,versao,arquivo_pdf_path,arquivo_pdf_nome,arquivo_pdf_tamanho,arquivo_pdf_tipo,observacoes,validade_dias,created_at")
        .eq("proposta_id", proposta.id)
        .order("versao", { ascending: false });

    if (historicoError) {
      throw new Error(historicoError.message);
    }

    historicoPdfs = await Promise.all(
      (historico ?? []).map(async (item) => {
        const { data } = await supabase.storage
          .from(BUCKET_PDF)
          .createSignedUrl(item.arquivo_pdf_path, 3600);

        return {
          ...item,
          url: data?.signedUrl ?? null,
        };
      }),
    );
  }

  return {
    proposta,
    cotacao,
    seguradoras: seguradorasSelecionadas,
    todasSeguradoras,
    pdfUrl,
    historicoPdfs,
  };
}
