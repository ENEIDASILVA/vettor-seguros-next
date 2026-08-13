"use client";

import Link from "next/link";

import {
  Check,
  FileText,
  ShieldCheck,
} from "lucide-react";

import {
  ChangeEvent,
  useMemo,
  useState,
} from "react";

import {
  atualizarApolice,
  salvarApolice,
} from "@/app/admin/actions/apolices";

import type {
  CotacaoPropostaApolice,
  PropostaConversaoApolice,
} from "@/lib/services/apolicesFormService";

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

type PropostaOrigem =
  | PropostaConversaoApolice
  | {
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
  cotacoesProposta?: CotacaoPropostaApolice[];
};

function formatarMoeda(
  valor: number,
): string {
  return new Intl.NumberFormat(
    "pt-BR",
    {
      style:
        "currency",
      currency:
        "BRL",
    },
  ).format(valor);
}

function moedaParaNumero(
  valor: string,
): number {
  const numeros =
    valor.replace(
      /\D/g,
      "",
    );

  if (
    !numeros
  ) {
    return 0;
  }

  return (
    Number(
      numeros,
    ) / 100
  );
}

function aplicarMascaraMoeda(
  event:
    ChangeEvent<HTMLInputElement>,
  atualizar:
    (valor: string) => void,
) {
  const valorNumerico =
    moedaParaNumero(
      event.target.value,
    );

  atualizar(
    formatarMoeda(
      valorNumerico,
    ),
  );
}

function adicionarUmAno(
  dataInicial: string,
): string {
  if (
    !dataInicial
  ) {
    return "";
  }

  const [
    ano,
    mes,
    dia,
  ] =
    dataInicial
      .split("-")
      .map(Number);

  const novoAno =
    ano + 1;

  const ultimoDiaDoMes =
    new Date(
      novoAno,
      mes,
      0,
    ).getDate();

  const diaAjustado =
    Math.min(
      dia,
      ultimoDiaDoMes,
    );

  return [
    novoAno,
    String(
      mes,
    ).padStart(
      2,
      "0",
    ),
    String(
      diaAjustado,
    ).padStart(
      2,
      "0",
    ),
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
  cotacoesProposta = [],
}: ApoliceFormProps) {
  const editando =
    Boolean(
      apolice,
    );

  const convertendoProposta =
    Boolean(
      proposta &&
        !apolice &&
        propostaId,
    );

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

  const tipoSeguroInicial =
    apolice?.tipoSeguroId ??
    proposta?.tipoSeguroId ??
    "";

  const cotacaoSelecionadaInicial =
    convertendoProposta &&
    cotacoesProposta.length ===
      1
      ? cotacoesProposta[0]
      : null;

  const [
    cotacaoSeguradoraId,
    setCotacaoSeguradoraId,
  ] =
    useState(
      cotacaoSelecionadaInicial
        ?.id ??
        "",
    );

  const [
    seguradoraId,
    setSeguradoraId,
  ] =
    useState<
      number | ""
    >(
      apolice
        ?.seguradoraId ??
        cotacaoSelecionadaInicial
          ?.seguradoraId ??
        ("seguradoraId" in
          (proposta ??
            {})
          ? proposta
              ?.seguradoraId ??
            ""
          : ""),
    );

  const [
    numeroApolice,
    setNumeroApolice,
  ] =
    useState(
      apolice
        ?.numeroApolice ??
        "",
    );

  const [
    inicioVigencia,
    setInicioVigencia,
  ] =
    useState(
      apolice
        ?.inicioVigencia ??
        "",
    );

  const [
    fimVigencia,
    setFimVigencia,
  ] =
    useState(
      apolice
        ?.fimVigencia ??
        "",
    );

  const premioLiquidoInicial =
    apolice
      ?.premioLiquido ??
    cotacaoSelecionadaInicial
      ?.premioLiquido ??
    ("premioLiquido" in
      (proposta ??
        {})
      ? proposta
          ?.premioLiquido ??
        0
      : 0);

  const premioTotalInicial =
    apolice
      ?.premioTotal ??
    cotacaoSelecionadaInicial
      ?.premioTotal ??
    ("premioTotal" in
      (proposta ??
        {})
      ? proposta
          ?.premioTotal ??
        0
      : 0);

  const comissaoPercentualInicial =
    apolice
      ?.comissaoPercentual ??
    cotacaoSelecionadaInicial
      ?.comissaoPercentual ??
    ("comissaoPercentual" in
      (proposta ??
        {})
      ? proposta
          ?.comissaoPercentual ??
        null
      : null);

  const [
    premioLiquido,
    setPremioLiquido,
  ] =
    useState(
      formatarMoeda(
        Number(
          premioLiquidoInicial ??
            0,
        ),
      ),
    );

  const [
    premioTotal,
    setPremioTotal,
  ] =
    useState(
      formatarMoeda(
        Number(
          premioTotalInicial ??
            0,
        ),
      ),
    );

  const [
    comissaoPercentual,
    setComissaoPercentual,
  ] =
    useState(
      comissaoPercentualInicial
        ?.toString() ??
        "",
    );

  const premioLiquidoNumerico =
    useMemo(
      () =>
        moedaParaNumero(
          premioLiquido,
        ),
      [
        premioLiquido,
      ],
    );

  const premioTotalNumerico =
    useMemo(
      () =>
        moedaParaNumero(
          premioTotal,
        ),
      [
        premioTotal,
      ],
    );

  const comissaoPercentualNumerica =
    Number(
      comissaoPercentual.replace(
        ",",
        ".",
      ),
    ) || 0;

  const comissaoValorNumerico =
    premioLiquidoNumerico *
    (
      comissaoPercentualNumerica /
      100
    );

  const action =
    apolice
      ? atualizarApolice.bind(
          null,
          apolice.id,
        )
      : salvarApolice;

  function alterarInicioVigencia(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    const novaData =
      event.target.value;

    setInicioVigencia(
      novaData,
    );

    setFimVigencia(
      adicionarUmAno(
        novaData,
      ),
    );
  }

  function alterarNumeroApolice(
    event:
      ChangeEvent<HTMLInputElement>,
  ) {
    setNumeroApolice(
      event.target.value.replace(
        /\D/g,
        "",
      ),
    );
  }

  function selecionarCotacao(
    cotacao:
      CotacaoPropostaApolice,
  ) {
    setCotacaoSeguradoraId(
      cotacao.id,
    );

    setSeguradoraId(
      cotacao.seguradoraId,
    );

    setPremioLiquido(
      formatarMoeda(
        Number(
          cotacao.premioLiquido ??
            0,
        ),
      ),
    );

    setPremioTotal(
      formatarMoeda(
        Number(
          cotacao.premioTotal ??
            0,
        ),
      ),
    );

    setComissaoPercentual(
      cotacao
        .comissaoPercentual
        ?.toString() ??
        "",
    );
  }

  const clienteNome =
    convertendoProposta
      ? proposta
          ?.cliente ??
        "-"
      : "";

  const tipoSeguroNome =
    convertendoProposta
      ? proposta
          ?.tipoSeguro ??
        "-"
      : "";

  return (
    <form
      action={action}
      className="space-y-6"
    >
      <input
        type="hidden"
        name="proposta_id"
        value={
          propostaVinculadaId
        }
      />

      <input
        type="hidden"
        name="numero_proposta"
        value={
          numeroProposta ??
          ""
        }
      />

      {convertendoProposta && (
        <>
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Dados da Proposta
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  A apólice será criada a partir da cotação escolhida pelo cliente.
                </p>
              </div>

              <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
                Proposta #
                {numeroProposta ||
                  propostaVinculadaId
                    .slice(
                      0,
                      8,
                    )
                    .toUpperCase()}
              </span>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Cliente
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {clienteNome}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-500">
                  Seguro
                </p>

                <p className="mt-1 font-bold text-slate-800">
                  {tipoSeguroNome}
                </p>
              </div>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={20}
                  className="text-[#0A2F5A]"
                />

                <h2 className="text-lg font-bold text-slate-800">
                  Cotação aceita pelo cliente
                </h2>
              </div>

              <p className="mt-1 text-sm text-slate-500">
                Selecione uma das opções que fizeram parte da proposta comercial.
              </p>
            </div>

            <div className="grid gap-4 p-6 lg:grid-cols-2">
              {cotacoesProposta.map(
                (cotacao) => {
                  const selecionada =
                    cotacaoSeguradoraId ===
                    cotacao.id;

                  return (
                    <button
                      key={
                        cotacao.id
                      }
                      type="button"
                      onClick={() =>
                        selecionarCotacao(
                          cotacao,
                        )
                      }
                      className={`rounded-2xl border p-5 text-left transition ${
                        selecionada
                          ? "border-green-400 bg-green-50 ring-2 ring-green-100"
                          : "border-slate-200 bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-bold text-[#0A2F5A]">
                          {
                            cotacao.seguradora
                          }
                        </h3>

                        {selecionada && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white">
                            <Check
                              size={14}
                            />
                            Selecionada
                          </span>
                        )}
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-white p-3">
                          <p className="text-slate-500">
                            Prêmio Total
                          </p>
                          <p className="mt-1 font-bold text-slate-800">
                            {formatarMoeda(
                              Number(
                                cotacao.premioTotal ??
                                  0,
                              ),
                            )}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-slate-500">
                            Franquia
                          </p>
                          <p className="mt-1 font-bold text-slate-800">
                            {cotacao.franquiaNormal !==
                            null
                              ? formatarMoeda(
                                  Number(
                                    cotacao.franquiaNormal,
                                  ),
                                )
                              : "-"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-slate-500">
                            FIPE
                          </p>
                          <p className="mt-1 font-bold text-slate-800">
                            {cotacao.percentualFipe !==
                            null
                              ? `${cotacao.percentualFipe}%`
                              : "-"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-slate-500">
                            Pagamento
                          </p>
                          <p className="mt-1 font-bold text-slate-800">
                            {cotacao.formaPagamento ||
                              "-"}
                            {cotacao.parcelamento
                              ? ` · ${cotacao.parcelamento}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      {cotacao.arquivoPdfNome && (
                        <div className="mt-4 flex items-center gap-2 text-sm font-medium text-blue-700">
                          <FileText
                            size={16}
                          />
                          <span className="truncate">
                            {
                              cotacao.arquivoPdfNome
                            }
                          </span>
                        </div>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </section>

          <input
            type="hidden"
            name="cotacao_seguradora_id"
            value={
              cotacaoSeguradoraId
            }
          />

          <input
            type="hidden"
            name="cliente_id"
            value={
              clienteInicial
            }
          />

          <input
            type="hidden"
            name="cotacao_id"
            value={
              cotacaoInicial ??
              ""
            }
          />

          <input
            type="hidden"
            name="seguradora_id"
            value={
              seguradoraId
            }
          />

          <input
            type="hidden"
            name="tipo_seguro_id"
            value={
              tipoSeguroInicial
            }
          />
        </>
      )}

      <section className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 md:grid-cols-2">
        {!convertendoProposta && (
          <>
            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Proposta Comercial
              </label>

              <select
                name="proposta_id_visual"
                defaultValue={
                  propostaVinculadaId
                }
                disabled={
                  Boolean(
                    proposta,
                  )
                }
                className={
                  proposta
                    ? readOnlyFieldClassName
                    : fieldClassName
                }
              >
                <option value="">
                  Nenhuma proposta
                </option>

                {propostas.map(
                  (item) => (
                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >
                      {item.numero_proposta ??
                        item.id}
                      {" - "}
                      {
                        item.cliente
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Cliente
              </label>

              <select
                name="cliente_id"
                required
                defaultValue={
                  clienteInicial
                }
                className={
                  fieldClassName
                }
              >
                <option
                  value=""
                  disabled
                >
                  Selecione...
                </option>

                {clientes.map(
                  (cliente) => (
                    <option
                      key={
                        cliente.id
                      }
                      value={
                        cliente.id
                      }
                    >
                      {
                        cliente.nome
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Cotação
              </label>

              <select
                name="cotacao_id"
                defaultValue={
                  cotacaoInicial ??
                  ""
                }
                className={
                  fieldClassName
                }
              >
                <option value="">
                  Nenhuma cotação vinculada
                </option>

                {cotacoes.map(
                  (cotacao) => (
                    <option
                      key={
                        cotacao.id
                      }
                      value={
                        cotacao.id
                      }
                    >
                      {
                        cotacao.id
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Seguradora
              </label>

              <select
                name="seguradora_id"
                required
                value={
                  seguradoraId
                }
                onChange={(
                  event,
                ) =>
                  setSeguradoraId(
                    Number(
                      event.target
                        .value,
                    ),
                  )
                }
                className={
                  fieldClassName
                }
              >
                <option
                  value=""
                  disabled
                >
                  Selecione...
                </option>

                {seguradoras.map(
                  (
                    seguradora,
                  ) => (
                    <option
                      key={
                        seguradora.id
                      }
                      value={
                        seguradora.id
                      }
                    >
                      {
                        seguradora.nome
                      }
                    </option>
                  ),
                )}
              </select>
            </div>

            <div>
              <label className="mb-2 block font-medium text-slate-700">
                Tipo de Seguro
              </label>

              <select
                name="tipo_seguro_id"
                required
                defaultValue={
                  tipoSeguroInicial
                }
                className={
                  fieldClassName
                }
              >
                <option
                  value=""
                  disabled
                >
                  Selecione...
                </option>

                {tiposSeguro.map(
                  (tipo) => (
                    <option
                      key={
                        tipo.id
                      }
                      value={
                        tipo.id
                      }
                    >
                      {
                        tipo.nome
                      }
                    </option>
                  ),
                )}
              </select>
            </div>
          </>
        )}

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
            value={
              numeroApolice
            }
            onChange={
              alterarNumeroApolice
            }
            className={
              fieldClassName
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Status
          </label>

          <select
            name="status"
            defaultValue={
              apolice?.status ??
              "Ativa"
            }
            className={
              fieldClassName
            }
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
            value={
              inicioVigencia
            }
            onChange={
              alterarInicioVigencia
            }
            className={
              fieldClassName
            }
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
            value={
              fimVigencia
            }
            onChange={(
              event,
            ) =>
              setFimVigencia(
                event.target
                  .value,
              )
            }
            className={
              fieldClassName
            }
          />

          <p className="mt-1 text-xs text-slate-500">
            Preenchido automaticamente com um ano de vigência, mas pode ser alterado.
          </p>
        </div>

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Prêmio Líquido
          </label>

          <input
            type="text"
            inputMode="numeric"
            value={
              premioLiquido
            }
            onChange={(
              event,
            ) =>
              aplicarMascaraMoeda(
                event,
                setPremioLiquido,
              )
            }
            className={
              convertendoProposta
                ? readOnlyFieldClassName
                : fieldClassName
            }
            readOnly={
              convertendoProposta
            }
          />

          <input
            type="hidden"
            name="premio_liquido"
            value={
              premioLiquidoNumerico
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Prêmio Total
          </label>

          <input
            type="text"
            inputMode="numeric"
            value={
              premioTotal
            }
            onChange={(
              event,
            ) =>
              aplicarMascaraMoeda(
                event,
                setPremioTotal,
              )
            }
            className={
              convertendoProposta
                ? readOnlyFieldClassName
                : fieldClassName
            }
            readOnly={
              convertendoProposta
            }
          />

          <input
            type="hidden"
            name="premio_total"
            value={
              premioTotalNumerico
            }
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
            value={
              comissaoPercentual
            }
            onChange={(
              event,
            ) =>
              setComissaoPercentual(
                event.target
                  .value,
              )
            }
            readOnly={
              convertendoProposta
            }
            className={
              convertendoProposta
                ? readOnlyFieldClassName
                : fieldClassName
            }
          />
        </div>

        <div>
          <label className="mb-2 block font-medium text-slate-700">
            Comissão (R$)
          </label>

          <input
            type="text"
            readOnly
            value={
              formatarMoeda(
                comissaoValorNumerico,
              )
            }
            className={
              readOnlyFieldClassName
            }
          />

          <input
            type="hidden"
            name="comissao_valor"
            value={
              comissaoValorNumerico.toFixed(
                2,
              )
            }
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
              apolice?.observacoes ??
              ""
            }
            className={
              fieldClassName
            }
          />
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Link
          href={
            apolice
              ? `/admin/apolices/${apolice.id}`
              : proposta
                ? `/admin/propostas/${proposta.id}/workspace`
                : "/admin/apolices"
          }
          className="rounded-xl border border-slate-300 px-8 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Cancelar
        </Link>

        <button
          type="submit"
          disabled={
            convertendoProposta &&
            !cotacaoSeguradoraId
          }
          className="rounded-xl bg-[#0A2F5A] px-8 py-3 font-semibold text-white transition hover:bg-[#082648] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {editando
            ? "Salvar Alterações"
            : convertendoProposta
              ? "Emitir Apólice"
              : "Salvar Apólice"}
        </button>
      </div>
    </form>
  );
}
