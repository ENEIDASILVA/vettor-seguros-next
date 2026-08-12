"use client";

import Link from "next/link";
import { ArrowLeft, CalendarDays, Check, Download, ExternalLink, FilePlus2, FileText, MessageCircle, Pencil, Save, ShieldCheck, User } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { gerarPdfPropostaAction, prepararEnvioWhatsAppPropostaAction, salvarEdicaoPropostaAction } from "@/app/admin/actions/propostas";
import { abrirPdfCotacaoSeguradoraAction } from "@/app/admin/actions/cotacoesSeguradorasArquivos";

type Props = {
  propostaId?: string;
  cotacaoId: string;
  modoEdicao?: boolean;
  dados: {
    proposta?: any;
    cotacao: any;
    seguradoras: any[];
    todasSeguradoras?: any[];
    pdfUrl?: string | null;
    historicoPdfs?: Array<{
      id: string;
      proposta_id: string;
      versao: number;
      arquivo_pdf_path: string;
      arquivo_pdf_nome: string;
      arquivo_pdf_tamanho?: number | null;
      arquivo_pdf_tipo?: string | null;
      observacoes?: string | null;
      validade_dias?: number | null;
      created_at: string;
      url?: string | null;
    }>;
  };
};

function moeda(valor?: number | null) {
  if (valor === null || valor === undefined) return "-";
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function tamanhoArquivo(bytes?: number | null) {
  if (bytes === null || bytes === undefined || Number.isNaN(Number(bytes))) return null;
  const n = Number(bytes);
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default function PropostaWorkspace({ propostaId, cotacaoId, modoEdicao = false, dados }: Props) {
  const proposta = dados.proposta;
  const cliente = dados.cotacao?.cliente;
  const tipoSeguro = dados.cotacao?.tipo_seguro;
  const selecionadasIniciais = dados.seguradoras ?? [];
  const todas = dados.todasSeguradoras ?? selecionadasIniciais;
  const historicoPdfs = dados.historicoPdfs ?? [];

  const [observacoes, setObservacoes] = useState(proposta?.observacoes ?? "");
  const [validadeDias, setValidadeDias] = useState(Number(proposta?.validade_dias ?? 15));
  const [selecionadasIds, setSelecionadasIds] = useState<string[]>(selecionadasIniciais.map((c) => String(c.id)));
  const [pdfUrl, setPdfUrl] = useState<string | null>(dados.pdfUrl ?? null);
  const [pdfNome, setPdfNome] = useState<string | null>(proposta?.arquivo_pdf_nome ?? null);
  const [erro, setErro] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<string | null>(null);
  const [pdfCotacaoAbrindo, setPdfCotacaoAbrindo] = useState<string | null>(null);
  const [whatsappAbrindo, setWhatsappAbrindo] = useState(false);
  const [isPending, startTransition] = useTransition();

  const seguradorasExibidas = useMemo(() => {
    if (modoEdicao) return todas;
    return selecionadasIniciais;
  }, [modoEdicao, todas, selecionadasIniciais]);

  const possuiPdf = Boolean(proposta?.arquivo_pdf_path || pdfUrl);
  const tamanhoPdf = tamanhoArquivo(proposta?.arquivo_pdf_tamanho);

  function alternarCotacao(id: string) {
    setMensagem(null);
    setErro(null);
    setSelecionadasIds((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : [...atual, id],
    );
  }

  async function abrirPdfCotacao(id: string) {
    setErro(null);
    setPdfCotacaoAbrindo(id);
    try {
      const resultado = await abrirPdfCotacaoSeguradoraAction(id);
      if (!resultado.success || !resultado.url) {
        setErro(resultado.success ? "Não foi possível gerar o link para o PDF da cotação." : resultado.message);
        return;
      }
      window.open(resultado.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Não foi possível abrir o PDF da cotação.");
    } finally {
      setPdfCotacaoAbrindo(null);
    }
  }

  async function enviarPorWhatsApp() {
    if (!propostaId) {
      setErro(
        "Proposta não identificada.",
      );
      return;
    }

    setErro(null);
    setMensagem(null);
    setWhatsappAbrindo(true);

    const novaJanela =
      window.open(
        "",
        "_blank",
      );

    try {
      const resultado =
        await prepararEnvioWhatsAppPropostaAction(
          propostaId,
        );

      if (
        !resultado.success
      ) {
        novaJanela?.close();

        setErro(
          resultado.message,
        );

        return;
      }

      if (
        !resultado.whatsappUrl
      ) {
        novaJanela?.close();

        setErro(
          "Não foi possível montar o link do WhatsApp.",
        );

        return;
      }

      if (novaJanela) {
        novaJanela.location.href =
          resultado.whatsappUrl;
      } else {
        window.location.href =
          resultado.whatsappUrl;
      }

      setMensagem(
        resultado.quantidadeCotacoes > 0
          ? `WhatsApp preparado com o PDF da Vettor e ${resultado.quantidadeCotacoes} cotação(ões) de seguradora.`
          : "WhatsApp preparado com o PDF da proposta.",
      );
    } catch (error) {
      novaJanela?.close();

      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível abrir o WhatsApp.",
      );
    } finally {
      setWhatsappAbrindo(
        false,
      );
    }
  }

  async function salvarEdicao(gerarNovoPdf: boolean) {
    if (!propostaId) return setErro("Proposta não identificada.");
    if (selecionadasIds.length === 0) return setErro("Selecione pelo menos uma cotação para a proposta.");

    setErro(null);
    setMensagem(null);

    startTransition(async () => {
      const salvo = await salvarEdicaoPropostaAction(
        propostaId,
        cotacaoId,
        selecionadasIds,
        observacoes,
        validadeDias,
      );

      if (!salvo.success) {
        setErro(salvo.message);
        return;
      }

      if (!gerarNovoPdf) {
        setMensagem("Alterações salvas com sucesso.");
        return;
      }

      const resultado = await gerarPdfPropostaAction(propostaId, observacoes, validadeDias);
      if (!resultado.success) {
        setErro(`As alterações foram salvas, mas o PDF não pôde ser gerado: ${resultado.message}`);
        return;
      }

      setPdfUrl(resultado.url);
      setPdfNome(resultado.nome);
      setMensagem("Alterações salvas e novo PDF gerado com sucesso.");
      window.open(resultado.url, "_blank", "noopener,noreferrer");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/propostas" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft size={17} /> Voltar para Propostas
        </Link>
        {!modoEdicao && propostaId && (
          <Link href={`/admin/propostas/${propostaId}/workspace?edit=true`} className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-700 hover:bg-amber-100">
            <Pencil size={17} /> Editar proposta
          </Link>
        )}
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{modoEdicao ? "Editar Proposta Comercial" : "Proposta Comercial"}</h1>
            <p className="mt-1 text-slate-500">{modoEdicao ? "Selecione as cotações que farão parte da proposta e atualize o documento comercial." : "Visualize as cotações apresentadas ao cliente e o documento enviado."}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">Cotação #{cotacaoId.slice(0, 8)}</span>
            {propostaId && <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">{proposta?.status ?? "Proposta criada"}</span>}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2"><User size={18} className="text-[#0A2F5A]" /><h2 className="font-semibold text-slate-700">Cliente</h2></div>
          <p className="text-lg font-bold text-slate-800">{cliente?.nome ?? cliente?.[0]?.nome ?? "-"}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-3 flex items-center gap-2"><ShieldCheck size={18} className="text-[#0A2F5A]" /><h2 className="font-semibold text-slate-700">Seguro</h2></div>
          <p className="text-lg font-bold text-slate-800">{tipoSeguro?.nome ?? tipoSeguro?.[0]?.nome ?? "-"}</p>
        </div>
      </section>

      {erro && <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">{erro}</div>}
      {mensagem && <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm font-medium text-green-700">{mensagem}</div>}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{modoEdicao ? "Cotações disponíveis" : "Cotações da Proposta"}</h2>
            <p className="mt-1 text-sm text-slate-500">{modoEdicao ? "Marque as opções que devem permanecer ou entrar na proposta." : "Opções apresentadas ao cliente nesta proposta comercial."}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600">{modoEdicao ? selecionadasIds.length : seguradorasExibidas.length} selecionada(s)</span>
            {modoEdicao && (
              <Link href={`/admin/cotacoes/${cotacaoId}?propostaId=${propostaId}`} className="inline-flex items-center gap-2 rounded-xl bg-[#0A2F5A] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#082648]">
                <FilePlus2 size={17} /> Cadastrar nova cotação
              </Link>
            )}
          </div>
        </div>

        {seguradorasExibidas.length === 0 ? (
          <div className="p-8 text-center text-slate-600">Nenhuma cotação cadastrada.</div>
        ) : (
          <div className="grid gap-5 p-6 lg:grid-cols-2">
            {seguradorasExibidas.map((cotacao) => {
              const id = String(cotacao.id);
              const selecionada = selecionadasIds.includes(id);
              return (
                <article key={id} className={`rounded-2xl border p-5 ${selecionada ? "border-green-300 bg-green-50/40" : "border-slate-200 bg-slate-50"}`}>
                  <div className="mb-5 flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-[#0A2F5A]">{cotacao.seguradora?.nome ?? "Seguradora"}</h3>
                    {modoEdicao ? (
                      <button type="button" onClick={() => alternarCotacao(id)} className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${selecionada ? "bg-green-600 text-white" : "border border-slate-300 bg-white text-slate-600"}`}>
                        {selecionada && <Check size={14} />} {selecionada ? "Na proposta" : "Adicionar"}
                      </button>
                    ) : <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Na proposta</span>}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-xl bg-white p-3"><span className="text-slate-500">Prêmio Total</span><p className="mt-1 font-bold text-slate-800">{moeda(cotacao.premio_total)}</p></div>
                    <div className="rounded-xl bg-white p-3"><span className="text-slate-500">Franquia</span><p className="mt-1 font-bold text-slate-800">{moeda(cotacao.franquia_normal)}</p></div>
                    <div className="rounded-xl bg-white p-3"><span className="text-slate-500">FIPE</span><p className="mt-1 font-bold text-slate-800">{cotacao.percentual_fipe != null ? `${Number(cotacao.percentual_fipe).toLocaleString("pt-BR")}%` : "-"}</p></div>
                    <div className="rounded-xl bg-white p-3"><span className="text-slate-500">Assistência</span><p className="mt-1 font-bold text-slate-800">{cotacao.assistencia || (cotacao.assistencia_24h ? "Assistência 24h" : "-")}</p></div>
                    <div className="rounded-xl bg-white p-3"><span className="text-slate-500">Forma de Pagamento</span><p className="mt-1 font-bold text-slate-800">{cotacao.forma_pagamento ?? "-"}</p></div>
                    <div className="rounded-xl bg-white p-3"><span className="text-slate-500">Parcelamento</span><p className="mt-1 font-bold text-slate-800">{cotacao.parcelamento ?? (cotacao.parcela_maxima ? `Até ${cotacao.parcela_maxima}x` : "-")}</p></div>
                  </div>

                  {cotacao.arquivo_pdf_nome && (
                    <div className="mt-5 flex flex-col gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex min-w-0 items-center gap-2"><FileText size={17} className="shrink-0 text-blue-700" /><span className="truncate text-sm font-medium text-blue-700">{cotacao.arquivo_pdf_nome}</span></div>
                      <button type="button" disabled={pdfCotacaoAbrindo === id} onClick={() => abrirPdfCotacao(id)} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0A2F5A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#082648] disabled:bg-slate-400">
                        <ExternalLink size={16} /> {pdfCotacaoAbrindo === id ? "Abrindo..." : "Abrir cotação"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {modoEdicao ? (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <label htmlFor="observacoes" className="mb-2 block font-semibold text-slate-700">Observações comerciais</label>
            <p className="mb-4 text-sm text-slate-500">Este texto será apresentado no PDF enviado ao cliente.</p>
            <textarea id="observacoes" rows={5} value={observacoes} onChange={(e) => setObservacoes(e.target.value)} className="w-full rounded-xl border border-slate-300 p-4 outline-none focus:border-[#0A2F5A] focus:ring-2 focus:ring-blue-100" />
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <label htmlFor="validade" className="mb-2 flex items-center gap-2 font-semibold text-slate-700"><CalendarDays size={17} /> Validade da proposta</label>
            <select id="validade" value={validadeDias} onChange={(e) => setValidadeDias(Number(e.target.value))} className="w-56 rounded-xl border border-slate-300 p-3">
              {[7, 10, 15, 30].map((dias) => <option key={dias} value={dias}>{dias} dias</option>)}
            </select>
          </section>

          {pdfUrl && (
            <section className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div><p className="font-bold text-green-800">PDF atual da proposta</p><p className="mt-1 text-sm text-green-700">{pdfNome}</p></div>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white hover:bg-green-800"><ExternalLink size={18} /> Abrir PDF atual</a>
              </div>
            </section>
          )}

          <div className="flex flex-wrap justify-end gap-3">
            <button type="button" disabled={isPending || selecionadasIds.length === 0} onClick={() => salvarEdicao(false)} className="inline-flex items-center gap-2 rounded-xl border border-[#0A2F5A] bg-white px-6 py-3 font-semibold text-[#0A2F5A] hover:bg-slate-50 disabled:cursor-not-allowed disabled:border-slate-300 disabled:text-slate-400"><Save size={18} /> {isPending ? "Salvando..." : "Salvar alterações"}</button>
            <button type="button" disabled={isPending || selecionadasIds.length === 0} onClick={() => salvarEdicao(true)} className="inline-flex items-center gap-2 rounded-xl bg-[#0A2F5A] px-6 py-3 font-semibold text-white hover:bg-[#082648] disabled:cursor-not-allowed disabled:bg-slate-300"><FileText size={18} /> {isPending ? "Processando..." : "Salvar e gerar novo PDF"}</button>
          </div>
        </>
      ) : (
        <>
          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6"><h2 className="font-bold text-slate-800">Observações comerciais</h2><p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">{proposta?.observacoes?.trim() ? proposta.observacoes : "Nenhuma observação comercial registrada."}</p></div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6"><div className="flex items-center gap-2"><CalendarDays size={18} className="text-[#0A2F5A]" /><h2 className="font-bold text-slate-800">Validade da proposta</h2></div><p className="mt-3 text-lg font-bold text-slate-800">{proposta?.validade_dias ? `${proposta.validade_dias} dias` : "Não informada"}</p></div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5"><div className="flex items-center gap-2"><FileText size={20} className="text-[#0A2F5A]" /><h2 className="text-lg font-bold text-slate-800">PDF da Proposta</h2></div><p className="mt-1 text-sm text-slate-500">Documento comercial gerado para envio ao cliente.</p></div>
            {!possuiPdf ? (
              <div className="p-8 text-center"><FileText size={38} className="mx-auto mb-3 text-slate-300" /><p className="font-semibold text-slate-700">Nenhum PDF foi gerado para esta proposta.</p></div>
            ) : (
              <div className="p-6"><div className="flex flex-col gap-4 rounded-xl border border-green-200 bg-green-50 p-5 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><div className="flex items-center gap-2"><FileText size={19} className="shrink-0 text-green-700" /><p className="truncate font-bold text-green-800">{pdfNome ?? "Proposta.pdf"}</p></div><div className="mt-2 flex gap-4 text-sm text-green-700"><span>Documento da proposta</span>{tamanhoPdf && <span>{tamanhoPdf}</span>}</div></div>{pdfUrl && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={
                        enviarPorWhatsApp
                      }
                      disabled={
                        whatsappAbrindo
                      }
                      className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-wait disabled:bg-green-300"
                    >
                      <MessageCircle
                        size={18}
                      />

                      {whatsappAbrindo
                        ? "Preparando..."
                        : "Enviar por WhatsApp"}
                    </button>

                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#0A2F5A] px-5 py-3 text-sm font-semibold text-white hover:bg-[#082648]"
                    >
                      <ExternalLink
                        size={17}
                      />

                      Abrir PDF
                    </a>

                    <a
                      href={pdfUrl}
                      download={
                        pdfNome ??
                        undefined
                      }
                      className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Download
                        size={17}
                      />

                      Baixar
                    </a>
                  </div>
                )}</div></div>
            )}
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-lg font-bold text-slate-800">Histórico de PDFs</h2>
              <p className="mt-1 text-sm text-slate-500">
                Todas as versões geradas da proposta ficam preservadas para consulta.
              </p>
            </div>

            {historicoPdfs.length === 0 ? (
              <div className="p-8 text-center">
                <FileText size={36} className="mx-auto mb-3 text-slate-300" />
                <p className="font-medium text-slate-700">Ainda não há versões registradas no histórico.</p>
                <p className="mt-1 text-sm text-slate-500">Os próximos PDFs gerados serão arquivados automaticamente.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {historicoPdfs.map((item, index) => {
                  const atual =
                    item.arquivo_pdf_path === proposta?.arquivo_pdf_path;
                  const tamanho =
                    tamanhoArquivo(item.arquivo_pdf_tamanho);
                  const dataGeracao =
                    item.created_at
                      ? new Date(item.created_at).toLocaleString("pt-BR")
                      : "-";

                  return (
                    <div key={item.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <FileText size={18} className="text-[#0A2F5A]" />
                          <p className="font-bold text-slate-800">Versão {item.versao}</p>
                          {atual && (
                            <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">Atual</span>
                          )}
                        </div>
                        <p className="mt-2 truncate text-sm font-medium text-slate-600">{item.arquivo_pdf_nome}</p>
                        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                          <span>Gerado em {dataGeracao}</span>
                          {tamanho && <span>{tamanho}</span>}
                          {item.validade_dias && <span>Validade: {item.validade_dias} dias</span>}
                        </div>
                      </div>

                      {item.url ? (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                          <ExternalLink size={16} /> Abrir PDF
                        </a>
                      ) : (
                        <span className="text-sm text-amber-700">Link temporário indisponível</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
