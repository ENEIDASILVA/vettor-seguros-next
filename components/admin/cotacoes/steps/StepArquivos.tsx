"use client";

import {
  Download,
  FileText,
  Trash2,
  Upload,
} from "lucide-react";

import {
  useRef,
  useState,
  useTransition,
} from "react";

import Button from "@/components/ui/Button";

import {
  abrirPdfCotacaoSeguradoraAction,
  enviarPdfCotacaoSeguradoraAction,
  removerPdfCotacaoSeguradoraAction,
} from "@/app/admin/actions/cotacoesSeguradorasArquivos";

import {
  useToast,
} from "@/components/ui/ToastProvider";

import type {
  CotacaoSeguradoraFormData,
} from "../CotacaoSeguradoraForm";

type Props = {
  form: CotacaoSeguradoraFormData;

  setValue: <
    K extends keyof CotacaoSeguradoraFormData,
  >(
    campo: K,
    valor: CotacaoSeguradoraFormData[K],
  ) => void;
};

function formatarTamanho(
  tamanho: number | null,
) {
  if (!tamanho) {
    return "-";
  }

  if (tamanho < 1024) {
    return `${tamanho} B`;
  }

  if (tamanho < 1024 * 1024) {
    return `${(
      tamanho / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    tamanho /
    1024 /
    1024
  ).toFixed(2)} MB`;
}

export default function StepArquivos({
  form,
  setValue,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  const toast =
    useToast();

  const [
    arquivoSelecionado,
    setArquivoSelecionado,
  ] =
    useState<File | null>(
      null,
    );

  const [
    isPending,
    startTransition,
  ] =
    useTransition();

  function selecionarArquivo() {
    inputRef.current?.click();
  }

  function alterarArquivo(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const arquivo =
      event.target.files?.[0];

    if (!arquivo) {
      return;
    }

    if (
      arquivo.type !==
      "application/pdf"
    ) {
      toast.warning(
        "Selecione um arquivo PDF.",
      );

      event.target.value = "";

      return;
    }

    if (
      arquivo.size >
      10 * 1024 * 1024
    ) {
      toast.warning(
        "O PDF deve possuir no máximo 10 MB.",
      );

      event.target.value = "";

      return;
    }

    setArquivoSelecionado(
      arquivo,
    );

    setValue(
      "arquivoPdfFile",
      arquivo,
    );

    setValue(
      "arquivoPdfNome",
      arquivo.name,
    );

    setValue(
      "arquivoPdfTipo",
      arquivo.type,
    );

    setValue(
      "arquivoPdfTamanho",
      arquivo.size,
    );
  }

  function enviarArquivo() {
    if (
      !arquivoSelecionado
    ) {
      toast.warning(
        "Selecione um PDF.",
      );

      return;
    }

    if (!form.id) {
      toast.warning(
        "Salve a cotação da seguradora antes de enviar o PDF.",
      );

      return;
    }

    startTransition(
      async () => {
        const data =
          new FormData();

        data.append(
          "cotacaoId",
          form.cotacaoId,
        );

        data.append(
          "cotacaoSeguradoraId",
          form.id!,
        );

        data.append(
          "arquivo",
          arquivoSelecionado,
        );

        const result =
          await enviarPdfCotacaoSeguradoraAction(
            data,
          );

        if (
          !result.success
        ) {
          toast.error(
            result.message,
          );

          return;
        }

        setValue(
          "arquivoPdfPath",
          result.path,
        );

        setValue(
          "arquivoPdfNome",
          result.nome,
        );

        setValue(
          "arquivoPdfTipo",
          result.tipo,
        );

        setValue(
          "arquivoPdfTamanho",
          result.tamanho,
        );

        setValue(
          "arquivoPdfFile",
          null,
        );

        setArquivoSelecionado(
          null,
        );

        if (
          inputRef.current
        ) {
          inputRef.current.value =
            "";
        }

        toast.success(
          result.message,
        );
      },
    );
  }

  function abrirArquivo() {
    if (!form.id) {
      return;
    }

    startTransition(
      async () => {
        const result =
          await abrirPdfCotacaoSeguradoraAction(
            form.id!,
          );

        if (
          !result.success
        ) {
          toast.error(
            result.message,
          );

          return;
        }

        window.open(
          result.url,
          "_blank",
          "noopener,noreferrer",
        );
      },
    );
  }

  function removerArquivo() {
    if (!form.id) {
      setArquivoSelecionado(
        null,
      );

      setValue(
        "arquivoPdfFile",
        null,
      );

      setValue(
        "arquivoPdfPath",
        null,
      );

      setValue(
        "arquivoPdfNome",
        null,
      );

      setValue(
        "arquivoPdfTipo",
        null,
      );

      setValue(
        "arquivoPdfTamanho",
        null,
      );

      return;
    }

    startTransition(
      async () => {
        const result =
          await removerPdfCotacaoSeguradoraAction(
            form.id!,
            form.cotacaoId,
          );

        if (
          !result.success
        ) {
          toast.error(
            result.message,
          );

          return;
        }

        setArquivoSelecionado(
          null,
        );

        setValue(
          "arquivoPdfFile",
          null,
        );

        setValue(
          "arquivoPdfPath",
          null,
        );

        setValue(
          "arquivoPdfNome",
          null,
        );

        setValue(
          "arquivoPdfTipo",
          null,
        );

        setValue(
          "arquivoPdfTamanho",
          null,
        );

        if (
          inputRef.current
        ) {
          inputRef.current.value =
            "";
        }

        toast.success(
          result.message,
        );
      },
    );
  }

  const possuiArquivoSalvo =
    Boolean(
      form.arquivoPdfPath,
    );

  const possuiArquivoSelecionado =
    Boolean(
      arquivoSelecionado,
    );

  return (
    <div className="space-y-8">
      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
            <FileText size={20} />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-800">
              PDF da Cotação
            </h4>

            <p className="text-sm text-slate-500">
              Anexe o PDF recebido da seguradora.
            </p>
          </div>
        </div>

        <input
          ref={inputRef}
          hidden
          type="file"
          accept="application/pdf,.pdf"
          onChange={
            alterarArquivo
          }
        />

        {!form.arquivoPdfNome && (
          <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10">
            <div className="flex flex-col items-center gap-4">
              <Upload
                size={46}
                className="text-slate-400"
              />

              <div className="text-center">
                <h3 className="font-semibold text-slate-800">
                  Nenhum PDF anexado
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Selecione o arquivo PDF da seguradora.
                </p>
              </div>

              <Button
                type="button"
                onClick={
                  selecionarArquivo
                }
                disabled={
                  isPending
                }
              >
                Selecionar PDF
              </Button>
            </div>
          </div>
        )}

        {form.arquivoPdfNome && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex gap-3">
                <FileText
                  size={40}
                  className="text-red-600"
                />

                <div>
                  <h4 className="font-semibold text-slate-800">
                    {form.arquivoPdfNome}
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    {form.arquivoPdfTipo ??
                      "application/pdf"}
                  </p>

                  <p className="text-sm text-slate-500">
                    {formatarTamanho(
                      form.arquivoPdfTamanho,
                    )}
                  </p>

                  {possuiArquivoSelecionado &&
                    !possuiArquivoSalvo && (
                      <p className="mt-2 text-sm font-medium text-amber-700">
                        Arquivo selecionado. Clique em Enviar PDF.
                      </p>
                    )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {possuiArquivoSelecionado && (
                  <Button
                    type="button"
                    onClick={
                      enviarArquivo
                    }
                    disabled={
                      isPending
                    }
                  >
                    <Upload size={16} />

                    {isPending
                      ? "Enviando..."
                      : "Enviar PDF"}
                  </Button>
                )}

                {possuiArquivoSalvo && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={
                      abrirArquivo
                    }
                    disabled={
                      isPending
                    }
                  >
                    <Download
                      size={16}
                    />

                    Abrir
                  </Button>
                )}

                <Button
                  type="button"
                  variant="outline"
                  onClick={
                    removerArquivo
                  }
                  disabled={
                    isPending
                  }
                >
                  <Trash2
                    size={16}
                  />

                  Remover
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-slate-200 pt-8">
        <div className="mb-5">
          <h4 className="text-lg font-bold text-slate-800">
            Observações da Seguradora
          </h4>

          <p className="text-sm text-slate-500">
            Informações importantes constantes na proposta da seguradora.
          </p>
        </div>

        <textarea
          rows={8}
          value={
            form.observacoes ?? ""
          }
          onChange={(e) =>
            setValue(
              "observacoes",
              e.target.value,
            )
          }
          placeholder="Ex.: Cotação válida por 15 dias. Sujeita à vistoria prévia."
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
        />
      </section>
    </div>
  );
}