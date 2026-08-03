"use client";

import { useState, useTransition } from "react";

import FormActions from "@/components/admin/common/FormActions";
import FormField from "@/components/admin/common/FormField";

import { criarCotacaoAction } from "@/app/admin/actions/cotacoes";

import type {
  CotacaoCliente,
  CotacaoTipoSeguro,
  NovaCotacao,
} from "@/lib/repositories/cotacoesRepository";

type Props = {
  clientes: CotacaoCliente[];
  tiposSeguro: CotacaoTipoSeguro[];
};

const ORIGENS = [
  "Site",
  "WhatsApp",
  "Telefone",
  "Instagram",
  "Facebook",
  "Indicação",
  "Corretor",
  "Outro",
];

export default function CotacaoForm({
  clientes,
  tiposSeguro,
}: Props) {
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState<NovaCotacao>({
    cliente_id: "",
    tipo_seguro_id: 0,
    status_id: 1,
    origem: "Site",
    observacoes: "",
    dados: {},
  });

  function atualizar<K extends keyof NovaCotacao>(
    campo: K,
    valor: NovaCotacao[K]
  ) {
    setForm((old) => ({
      ...old,
      [campo]: valor,
    }));
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      await criarCotacaoAction(form);
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <FormField
        label="Cliente"
        required
      >
        <select
          value={form.cliente_id}
          onChange={(e) =>
            atualizar("cliente_id", e.target.value)
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
          required
        >
          <option value="">
            Selecione...
          </option>

          {clientes.map((cliente) => (
            <option
              key={cliente.id}
              value={cliente.id}
            >
              {cliente.nome}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Tipo de Seguro"
        required
      >
        <select
          value={form.tipo_seguro_id}
          onChange={(e) =>
            atualizar(
              "tipo_seguro_id",
              Number(e.target.value)
            )
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
          required
        >
          <option value={0}>
            Selecione...
          </option>

          {tiposSeguro.map((tipo) => (
            <option
              key={tipo.id}
              value={tipo.id}
            >
              {tipo.nome}
            </option>
          ))}
        </select>
      </FormField>

      <FormField
        label="Origem"
        required
      >
        <select
          value={form.origem ?? ""}
          onChange={(e) =>
            atualizar("origem", e.target.value)
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        >
          {ORIGENS.map((origem) => (
            <option
              key={origem}
              value={origem}
            >
              {origem}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label="Observações">
        <textarea
          rows={5}
          value={form.observacoes ?? ""}
          onChange={(e) =>
            atualizar(
              "observacoes",
              e.target.value
            )
          }
          className="w-full rounded-xl border border-slate-300 px-4 py-3"
        />
      </FormField>

      <FormActions
        cancelHref="/admin/cotacoes"
        submitLabel="Criar Cotação"
        submittingLabel="Criando..."
        isSubmitting={isPending}
      />
    </form>
  );
}