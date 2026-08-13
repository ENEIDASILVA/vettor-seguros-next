"use client";

import Link from "next/link";

import {
  Download,
  ExternalLink,
  FileText,
  Upload,
} from "lucide-react";

import {
  useRef,
  useState,
  useTransition,
} from "react";

import VigenciaBadge from "./VigenciaBadge";

import {
  enviarPdfApoliceAction,
} from "@/app/admin/actions/apolicesArquivos";

type Props = {
  apolice: {
    id: string;

    propostaId: string | null;
    numeroProposta: string | null;

    cliente: string;
    seguradora: string;
    tipoSeguro: string;

    numeroApolice: string;

    inicioVigencia: string;
    fimVigencia: string;

    status: string;

    premioLiquido: number | null;
    premioTotal: number | null;

    comissaoPercentual: number | null;
    comissaoValor: number | null;

    observacoes: string | null;

    arquivoPdfPath: string | null;
    arquivoPdfNome: string | null;
    arquivoPdfTamanho: number | null;
    arquivoPdfTipo: string | null;
    arquivoPdfUrl: string | null;
  };
};

function moeda(
  valor: number | null,
) {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  ).format(valor ?? 0);
}

function data(
  valor: string,
) {
  if (!valor) {
    return "-";
  }

  return new Date(
    `${valor}T12:00:00`,
  ).toLocaleDateString(
    "pt-BR",
  );
}

function tamanhoArquivo(
  bytes: number | null,
) {
  if (
    bytes === null ||
    Number.isNaN(
      Number(bytes),
    )
  ) {
    return null;
  }

  const numero =
    Number(bytes);

  if (
    numero < 1024
  ) {
    return `${numero} B`;
  }

  if (
    numero <
    1024 * 1024
  ) {
    return `${(
      numero / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    numero /
    (1024 * 1024)
  ).toFixed(1)} MB`;
}

function Campo({
  titulo,
  valor,
}: {
  titulo: string;
  valor: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="mb-2 text-sm text-slate-500">
        {titulo}
      </p>

      <div className="text-lg font-medium text-slate-800">
        {valor}
      </div>
    </div>
  );
}

export default function ApoliceView({
  apolice,
}: Props) {
  const [
    mensagem,
    setMensagem,
  ] =
    useState<string | null>(
      null,
    );

  const [
    erro,
    setErro,
  ] =
    useState<string | null>(
      null,
    );

  const [
    enviando,
    startTransition,
  ] =
    useTransition();

  const formRef =
    useRef<HTMLFormElement>(
      null,
    );

  const identificacaoProposta =
    apolice.numeroProposta ||
    (
      apolice.propostaId
        ? `Proposta #${apolice.propostaId
            .slice(0, 8)
            .toUpperCase()}`
        : "-"
    );

  const tamanhoPdf =
    tamanhoArquivo(
      apolice
        .arquivoPdfTamanho,
    );

  function enviarPdf(
    formData: FormData,
  ) {
    setMensagem(null);
    setErro(null);

    startTransition(
      async () => {
        const resultado =
          await enviarPdfApoliceAction(
            formData,
          );

        if (
          !resultado.success
        ) {
          setErro(
            resultado.message,
          );

          return;
        }

        setMensagem(
          resultado.message,
        );

        formRef.current
          ?.reset();

        window.location.reload();
      },
    );
  }

  return (
    <div className="space-y-6">
      {mensagem && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
          {mensagem}
        </div>
      )}

      {erro && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {erro}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <Campo
          titulo="Cliente"
          valor={
            apolice.cliente
          }
        />

        <Campo
          titulo="Seguradora"
          valor={
            apolice.seguradora
          }
        />

        <Campo
          titulo="Seguro"
          valor={
            apolice.tipoSeguro
          }
        />

        <Campo
          titulo="Número da Apólice"
          valor={
            apolice.numeroApolice
          }
        />

        <Campo
          titulo="Início da Vigência"
          valor={data(
            apolice.inicioVigencia,
          )}
        />

        <Campo
          titulo="Fim da Vigência"
          valor={
            <div className="flex flex-wrap items-center gap-3">
              {data(
                apolice.fimVigencia,
              )}

              <VigenciaBadge
                fimVigencia={
                  apolice.fimVigencia
                }
              />
            </div>
          }
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Campo
          titulo="Prêmio Líquido"
          valor={moeda(
            apolice.premioLiquido,
          )}
        />

        <Campo
          titulo="Prêmio Total"
          valor={moeda(
            apolice.premioTotal,
          )}
        />

        <Campo
          titulo="Comissão (%)"
          valor={`${
            apolice.comissaoPercentual ??
            0
          }%`}
        />

        <Campo
          titulo="Comissão (R$)"
          valor={moeda(
            apolice.comissaoValor,
          )}
        />
      </div>

      <Campo
        titulo="Observações"
        valor={
          apolice.observacoes ||
          "Nenhuma observação."
        }
      />

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-center gap-2">
            <FileText
              size={20}
              className="text-[#0A2F5A]"
            />

            <h3 className="text-lg font-bold text-slate-800">
              Documento da Apólice
            </h3>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Mantenha arquivado o PDF oficial emitido pela seguradora.
          </p>
        </div>

        <div className="p-6">
          {apolice.arquivoPdfPath ? (
            <div className="rounded-xl border border-green-200 bg-green-50 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <FileText
                      size={18}
                      className="shrink-0 text-green-700"
                    />

                    <p className="truncate font-bold text-green-800">
                      {apolice.arquivoPdfNome ||
                        "Apólice.pdf"}
                    </p>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-green-700">
                    <span>
                      Documento da apólice
                    </span>

                    {tamanhoPdf && (
                      <span>
                        {tamanhoPdf}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {apolice.arquivoPdfUrl && (
                    <>
                      <a
                        href={
                          apolice.arquivoPdfUrl
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#0A2F5A] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#082648]"
                      >
                        <ExternalLink
                          size={16}
                        />

                        Abrir PDF
                      </a>

                      <a
                        href={
                          apolice.arquivoPdfUrl
                        }
                        download={
                          apolice.arquivoPdfNome ||
                          "apolice.pdf"
                        }
                        className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                      >
                        <Download
                          size={16}
                        />

                        Baixar
                      </a>
                    </>
                  )}
                </div>
              </div>

              <form
                ref={
                  formRef
                }
                action={
                  enviarPdf
                }
                className="mt-5 border-t border-green-200 pt-5"
              >
                <input
                  type="hidden"
                  name="apoliceId"
                  value={
                    apolice.id
                  }
                />

                <div className="flex flex-col gap-3 md:flex-row md:items-end">
                  <div className="flex-1">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Substituir PDF
                    </label>

                    <input
                      type="file"
                      name="arquivo"
                      accept="application/pdf,.pdf"
                      required
                      className="block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={
                      enviando
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-green-700 bg-white px-5 py-3 font-semibold text-green-700 transition hover:bg-green-50 disabled:cursor-wait disabled:opacity-60"
                  >
                    <Upload
                      size={17}
                    />

                    {enviando
                      ? "Enviando..."
                      : "Substituir PDF"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <form
              ref={
                formRef
              }
              action={
                enviarPdf
              }
              className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5"
            >
              <input
                type="hidden"
                name="apoliceId"
                value={
                  apolice.id
                }
              />

              <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
                <div className="flex-1">
                  <p className="font-semibold text-slate-800">
                    Nenhum PDF da apólice foi anexado.
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Selecione o documento oficial emitido pela seguradora. Apenas PDF, até 10 MB.
                  </p>

                  <input
                    type="file"
                    name="arquivo"
                    accept="application/pdf,.pdf"
                    required
                    className="mt-4 block w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:font-semibold file:text-slate-700"
                  />
                </div>

                <button
                  type="submit"
                  disabled={
                    enviando
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-wait disabled:bg-green-400"
                >
                  <Upload
                    size={17}
                  />

                  {enviando
                    ? "Enviando..."
                    : "Enviar PDF da Apólice"}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="text-lg font-bold text-slate-800">
          Proposta de origem
        </h3>

        {apolice.propostaId ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-5 rounded-xl border border-blue-200 bg-blue-50 p-5">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Identificação da Proposta
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-800">
                {
                  identificacaoProposta
                }
              </p>

              <p className="mt-2 text-sm text-blue-700">
                Esta apólice foi emitida a partir de uma proposta comercial.
              </p>
            </div>

            <Link
              href={`/admin/propostas/${apolice.propostaId}/workspace`}
              className="rounded-xl bg-[#0A2F5A] px-5 py-3 font-semibold text-white transition hover:bg-[#082648]"
            >
              Ver Proposta
            </Link>
          </div>
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-slate-600">
            Esta apólice foi cadastrada sem vínculo com uma proposta.
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Link
          href="/admin/apolices"
          className="rounded-xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Voltar
        </Link>

        <Link
          href={`/admin/apolices/${apolice.id}/editar`}
          className="rounded-xl bg-[#0A2F5A] px-5 py-3 font-medium text-white transition hover:bg-[#082648]"
        >
          Editar
        </Link>
      </div>
    </div>
  );
}
