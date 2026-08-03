"use client";

import Link from "next/link";
import {
  ChangeEvent,
  useMemo,
  useState,
} from "react";

import {
  atualizarApolice,
  salvarApolice,
} from "@/app/admin/actions/apolices";

type Cliente = {
  id: string;
  nome: string;
};

type Cotacao = {
  id: string;
};

type Seguradora = {
  id: number;
  nome: string;
};

type TipoSeguro = {
  id: number;
  nome: string;
};

type PropostaListaFormulario = {
  id: string;
  numero_proposta: string | null;
  cliente: string;
};

type PropostaOrigem = {
  id: string;

  clienteId?: string | null;
  cotacaoId?: string | null;
  seguradoraId?: number | null;
  tipoSeguroId?: number | null;

  cliente?: string;
  seguradora?: string;
  tipoSeguro?: string;

  numeroProposta?: string | null;

  premioLiquido?: number | null;
  premioTotal?: number | null;

  comissaoPercentual?: number | null;
  comissaoValor?: number | null;

  status?: string;
};

export type ApoliceFormData = {
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

type ApoliceFormProps = {
  clientes: Cliente[];
  cotacoes: Cotacao[];
  seguradoras: Seguradora[];
  tiposSeguro: TipoSeguro[];
  propostas: PropostaListaFormulario[];

  apolice?: ApoliceFormData;
  proposta?: PropostaOrigem | null;
  propostaId?: string;
};

function formatarMoeda(valor: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valor);
}

function moedaParaNumero(valor: string): number {
  const numeros = valor.replace(/\D/g, "");

  if (!numeros) {
    return 0;
  }

  return Number(numeros) / 100;
}

function aplicarMascaraMoeda(
  event: ChangeEvent<HTMLInputElement>,
  atualizar: (valor: string) => void,
) {
  const valorNumerico = moedaParaNumero(
    event.target.value,
  );

  atualizar(formatarMoeda(valorNumerico));
}

function adicionarUmAno(
  dataInicial: string,
): string {
  if (!dataInicial) {
    return "";
  }

  const [ano, mes, dia] = dataInicial
    .split("-")
    .map(Number);

  const novoAno = ano + 1;

  const ultimoDiaDoMes = new Date(
    novoAno,
    mes,
    0,
  ).getDate();

  const diaAjustado = Math.min(
    dia,
    ultimoDiaDoMes,
  );

  return [
    novoAno,
    String(mes).padStart(2, "0"),
    String(diaAjustado).padStart(2, "0"),
  ].join("-");
}

const fieldClassName =
  "w-full rounded-xl border border-slate-300 bg-white p-3 text-slate-900 outline-none transition focus:border-[#0A2F5A] focus:ring-4 focus:ring-[#0A2F5A]/10";

const readOnlyFieldClassName =
  "w-full cursor-not-allowed rounded-xl border border-slate-300 bg-slate-100 p-3 text-slate-700 outline-none";

export default function ApoliceForm({
  clientes,
  cotacoes,
  seguradoras,
  tiposSeguro,
  propostas,
  apolice,
  proposta,
  propostaId,
}: ApoliceFormProps) {
  const editando = Boolean(apolice);

  const propostaVinculadaId =
    apolice?.propostaId ??
    propostaId ??
    proposta?.id ??
    "";

  const numeroProposta =
    apolice?.numeroProposta ??
    proposta?.numeroProposta ??
    "";

  const clienteInicial =
    apolice?.clienteId ??
    proposta?.clienteId ??
    "";

  const cotacaoInicial =
    apolice?.cotacaoId ??
    proposta?.cotacaoId ??
    "";

  const seguradoraInicial =
    apolice?.seguradoraId ??
    proposta?.seguradoraId ??
    "";

  const tipoSeguroInicial =
    apolice?.tipoSeguroId ??
    proposta?.tipoSeguroId ??
    "";

  const premioLiquidoInicial =
    apolice?.premioLiquido ??
    proposta?.premioLiquido ??
    0;

  const premioTotalInicial =
    apolice?.premioTotal ??
    proposta?.premioTotal ??
    proposta?.premioLiquido ??
    0;

  const comissaoPercentualInicial =
    apolice?.comissaoPercentual ??
    proposta?.comissaoPercentual ??
    null;

  const [numeroApolice, setNumeroApolice] =
    useState(apolice?.numeroApolice ?? "");

  const [inicioVigencia, setInicioVigencia] =
    useState(apolice?.inicioVigencia ?? "");

  const [fimVigencia, setFimVigencia] =
    useState(apolice?.fimVigencia ?? "");

  const [premioLiquido, setPremioLiquido] =
    useState(
      formatarMoeda(premioLiquidoInicial),
    );

  const [premioTotal, setPremioTotal] =
    useState(
      formatarMoeda(premioTotalInicial),
    );

  const [
    comissaoPercentual,
    setComissaoPercentual,
  ] = useState(
    comissaoPercentualInicial?.toString() ??
      "",
  );

  const premioLiquidoNumerico = useMemo(
    () => moedaParaNumero(premioLiquido),
    [premioLiquido],
  );

  const premioTotalNumerico = useMemo(
    () => moedaParaNumero(premioTotal),
    [premioTotal],
  );

  const comissaoPercentualNumerica =
    Number(
      comissaoPercentual.replace(",", "."),
    ) || 0;

  const comissaoValorNumerico =
    premioLiquidoNumerico *
    (comissaoPercentualNumerica / 100);

  const action = apolice
    ? atualizarApolice.bind(null, apolice.id)
    : salvarApolice;

  function alterarInicioVigencia(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const novaData = event.target.value;

    setInicioVigencia(novaData);

    if (!editando || !fimVigencia) {
      setFimVigencia(
        adicionarUmAno(novaData),
      );
      return;
    }

    setFimVigencia(
      adicionarUmAno(novaData),
    );
  }

  function alterarNumeroApolice(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    setNumeroApolice(
      event.target.value.replace(/\D/g, ""),
    );
  }

  return (
    <form
      action={action}
      className="grid gap-6 md:grid-cols-2"
    >
      <input
        type="hidden"
        name="proposta_id"
        value={propostaVinculadaId}
      />

      <input
        type="hidden"
        name="numero_proposta"
        value={numeroProposta ?? ""}
      />

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Proposta Comercial
        </label>

        <select
  name="proposta_id_visual"
  defaultValue={propostaVinculadaId}
  disabled={Boolean(proposta)}
  className={
    proposta
      ? readOnlyFieldClassName
      : fieldClassName
  }
>
  <option value="">
    Nenhuma proposta
  </option>

  {propostas.map((item) => (
    <option
      key={item.id}
      value={item.id}
    >
      {item.numero_proposta ?? item.id}
      {" - "}
      {item.cliente}
    </option>
  ))}
</select>

{proposta && (
  <p className="mt-1 text-xs text-slate-500">
    Esta apólice será emitida a partir desta proposta comercial.
  </p>
)}
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Cliente
        </label>

        <select
          name="cliente_id"
          required
          defaultValue={clienteInicial}
          className={fieldClassName}
        >
          <option value="" disabled>
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
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Cotação
        </label>

        <select
          name="cotacao_id"
          defaultValue={cotacaoInicial ?? ""}
          className={fieldClassName}
        >
          <option value="">
            Nenhuma cotação vinculada
          </option>

          {cotacoes.map((cotacao) => (
            <option
              key={cotacao.id}
              value={cotacao.id}
            >
              {cotacao.id}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Seguradora
        </label>

        <select
          name="seguradora_id"
          required
          defaultValue={seguradoraInicial}
          className={fieldClassName}
        >
          <option value="" disabled>
            Selecione...
          </option>

          {seguradoras.map((seguradora) => (
            <option
              key={seguradora.id}
              value={seguradora.id}
            >
              {seguradora.nome}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Tipo de Seguro
        </label>

        <select
          name="tipo_seguro_id"
          required
          defaultValue={tipoSeguroInicial}
          className={fieldClassName}
        >
          <option value="" disabled>
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
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Número da Apólice
        </label>

        <input
          name="numero_apolice"
          type="text"
          inputMode="numeric"
          pattern="[0-9]+"
          required
          value={numeroApolice}
          onChange={alterarNumeroApolice}
          className={fieldClassName}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Status
        </label>

        <select
          name="status"
          defaultValue={
            apolice?.status ?? "Ativa"
          }
          className={fieldClassName}
        >
          <option value="Ativa">
            Ativa
          </option>

          <option value="Cancelada">
            Cancelada
          </option>

          <option value="Vencida">
            Vencida
          </option>
        </select>
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Início da Vigência
        </label>

        <input
          name="inicio_vigencia"
          type="date"
          required
          value={inicioVigencia}
          onChange={alterarInicioVigencia}
          className={fieldClassName}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Fim da Vigência
        </label>

        <input
          name="fim_vigencia"
          type="date"
          required
          value={fimVigencia}
          onChange={(event) =>
            setFimVigencia(
              event.target.value,
            )
          }
          className={fieldClassName}
        />

        <p className="mt-1 text-xs text-slate-500">
          Preenchido automaticamente com um ano
          de vigência, mas pode ser alterado.
        </p>
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Prêmio Líquido
        </label>

        <input
          type="text"
          inputMode="numeric"
          value={premioLiquido}
          onChange={(event) =>
            aplicarMascaraMoeda(
              event,
              setPremioLiquido,
            )
          }
          className={fieldClassName}
        />

        <input
          type="hidden"
          name="premio_liquido"
          value={premioLiquidoNumerico}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Prêmio Total
        </label>

        <input
          type="text"
          inputMode="numeric"
          value={premioTotal}
          onChange={(event) =>
            aplicarMascaraMoeda(
              event,
              setPremioTotal,
            )
          }
          className={fieldClassName}
        />

        <input
          type="hidden"
          name="premio_total"
          value={premioTotalNumerico}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Comissão (%)
        </label>

        <input
          name="comissao_percentual"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={comissaoPercentual}
          onChange={(event) =>
            setComissaoPercentual(
              event.target.value,
            )
          }
          className={fieldClassName}
        />
      </div>

      <div>
        <label className="mb-2 block font-medium text-slate-700">
          Comissão (R$)
        </label>

        <input
          type="text"
          readOnly
          value={formatarMoeda(
            comissaoValorNumerico,
          )}
          className={readOnlyFieldClassName}
        />

        <input
          type="hidden"
          name="comissao_valor"
          value={comissaoValorNumerico.toFixed(
            2,
          )}
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block font-medium text-slate-700">
          Observações
        </label>

        <textarea
          name="observacoes"
          rows={5}
          defaultValue={
            apolice?.observacoes ?? ""
          }
          className={fieldClassName}
        />
      </div>

      <div className="flex justify-end gap-3 md:col-span-2">
        <Link
          href={
            apolice
              ? `/admin/apolices/${apolice.id}`
              : proposta
                ? `/admin/propostas/${proposta.id}`
                : "/admin/apolices"
          }
          className="rounded-xl border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          className="rounded-xl bg-[#0A2F5A] px-8 py-3 font-semibold text-white transition hover:bg-[#082648]"
        >
          {editando
            ? "Salvar Alterações"
            : proposta
              ? "Emitir Apólice"
              : "Salvar Apólice"}
        </button>
      </div>
    </form>
  );
}