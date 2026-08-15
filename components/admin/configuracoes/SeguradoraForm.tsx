"use client";

import {
  Save,
  X,
} from "lucide-react";

import {
  useState,
  useTransition,
} from "react";

import {
  salvarSeguradoraAction,
} from "@/app/admin/actions/seguradoras";

import type {
  Seguradora,
} from "@/lib/repositories/seguradorasRepository";

type Props = {
  seguradora?: Seguradora | null;
  onClose: () => void;
  onSaved: () => void;
};

export default function SeguradoraForm({
  seguradora,
  onClose,
  onSaved,
}: Props) {
  const [
    nome,
    setNome,
  ] = useState(
    seguradora?.nome ?? "",
  );

  const [
    codigo,
    setCodigo,
  ] = useState(
    seguradora?.codigo ?? "",
  );

  const [
    erro,
    setErro,
  ] = useState<
    string | null
  >(null);

  const [
    isPending,
    startTransition,
  ] = useTransition();

  function submit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setErro(null);

    const formData =
      new FormData();

    if (
      seguradora?.id
    ) {
      formData.set(
        "id",
        String(
          seguradora.id,
        ),
      );
    }

    formData.set(
      "nome",
      nome,
    );

    formData.set(
      "codigo",
      codigo,
    );

    startTransition(
      async () => {
        const resultado =
          await salvarSeguradoraAction(
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

        onSaved();
      },
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              {seguradora
                ? "Editar Seguradora"
                : "Nova Seguradora"}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {seguradora
                ? "Atualize os dados da seguradora."
                : "Cadastre uma nova seguradora no sistema."}
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={
            submit
          }
          className="space-y-5 p-6"
        >
          <div>
            <label
              htmlFor="nome"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Nome da seguradora
            </label>

            <input
              id="nome"
              value={
                nome
              }
              onChange={(
                event,
              ) =>
                setNome(
                  event.target
                    .value,
                )
              }
              required
              autoFocus
              placeholder="Ex.: Porto Seguro"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-[#0A2F5A] focus:ring-4 focus:ring-[#0A2F5A]/10"
            />
          </div>

          <div>
            <label
              htmlFor="codigo"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Código
            </label>

            <input
              id="codigo"
              value={
                codigo
              }
              onChange={(
                event,
              ) =>
                setCodigo(
                  event.target
                    .value,
                )
              }
              placeholder="Opcional"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-[#0A2F5A] focus:ring-4 focus:ring-[#0A2F5A]/10"
            />

            <p className="mt-2 text-xs text-slate-500">
              O código é opcional, mas deve ser único quando informado.
            </p>
          </div>

          {erro && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {erro}
            </div>
          )}

          <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                isPending
              }
              className="rounded-xl border border-slate-200 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={
                isPending
              }
              className="inline-flex items-center gap-2 rounded-xl bg-[#0A2F5A] px-5 py-2.5 font-semibold text-white transition hover:bg-[#082648] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={17} />

              {isPending
                ? "Salvando..."
                : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
