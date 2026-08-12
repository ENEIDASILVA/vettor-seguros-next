"use client";

import {
  Calculator,
  CreditCard,
  DollarSign,
  Percent,
} from "lucide-react";

import CurrencyInput from "@/components/ui/CurrencyInput";
import Input from "@/components/ui/Input";
import PercentInput from "@/components/ui/PercentInput";
import Select from "@/components/ui/Select";

import type {
  CotacaoSeguradoraFormData,
} from "../CotacaoSeguradoraForm";


type Props = {
  form: CotacaoSeguradoraFormData;

  setValue: <
    K extends keyof CotacaoSeguradoraFormData,
  >(
    field: K,
    value: CotacaoSeguradoraFormData[K],
  ) => void;
};


const formasPagamento = [
  {
    value: "CartaoCredito",
    label: "Cartão de Crédito",
  },
  {
    value: "DebitoConta",
    label: "Débito em Conta",
  },
  {
    value: "Boleto",
    label: "Boleto",
  },
  {
    value: "Pix",
    label: "PIX",
  },
  {
    value: "Outros",
    label: "Outros",
  },
];


function moeda(
  valor: number | null,
): string {
  if (
    valor === null ||
    !Number.isFinite(valor)
  ) {
    return "R$ 0,00";
  }

  return valor.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );
}


function calcularComissao(
  premioLiquido: number | null,
  percentual: number | null,
): number | null {
  if (
    premioLiquido === null ||
    percentual === null
  ) {
    return null;
  }

  return Number(
    (
      premioLiquido *
      (percentual / 100)
    ).toFixed(2),
  );
}


function calcularParcela(
  premioTotal: number | null,
  quantidade: number | null,
): number | null {
  if (
    premioTotal === null ||
    quantidade === null ||
    quantidade <= 0
  ) {
    return null;
  }

  return Number(
    (
      premioTotal /
      quantidade
    ).toFixed(2),
  );
}

function calcularPremioTotal(
  premioLiquido: number | null,
  iof: number | null,
  custoApolice: number | null,
): number | null {
  const total =
    (premioLiquido ?? 0) +
    (iof ?? 0) +
    (custoApolice ?? 0);

  if (total <= 0) {
    return null;
  }

  return Number(total.toFixed(2));
}

function CampoFinanceiro({
  label,
  children,
  helperText,
}: {
  label: string;
  children: React.ReactNode;
  helperText?: string;
}) {
  return (
    <div className="mb-6">
      <label className="mb-2 block font-semibold text-blue-900">
        {label}
      </label>

      {children}

      {helperText && (
        <p className="mt-2 text-sm text-slate-500">
          {helperText}
        </p>
      )}
    </div>
  );
}


export default function StepFinanceiro({
  form,
  setValue,
}: Props) {
  const comissaoCalculada =
    calcularComissao(
      form.premioLiquido,
      form.comissaoPercentual,
    );


  const parcelaCalculada =
    calcularParcela(
      form.premioTotal,
      form.parcelaMaxima,
    );


  function alterarPremioLiquido(
  valor: number | null,
) {
  setValue("premioLiquido", valor);

  setValue(
    "comissaoValor",
    calcularComissao(
      valor,
      form.comissaoPercentual,
    ),
  );

  const novoTotal =
    calcularPremioTotal(
      valor,
      form.iof,
      form.custoApolice,
    );

  setValue(
    "premioTotal",
    novoTotal,
  );

  setValue(
    "valorParcela",
    calcularParcela(
      novoTotal,
      form.parcelaMaxima,
    ),
  );
}

function alterarIof(
  valor: number | null,
) {
  setValue("iof", valor);

  const novoTotal =
    calcularPremioTotal(
      form.premioLiquido,
      valor,
      form.custoApolice,
    );

  setValue(
    "premioTotal",
    novoTotal,
  );

  setValue(
    "valorParcela",
    calcularParcela(
      novoTotal,
      form.parcelaMaxima,
    ),
  );
}

  function alterarPercentualComissao(
    valor: number | null,
  ) {
    setValue(
      "comissaoPercentual",
      valor,
    );

    setValue(
      "comissaoValor",
      calcularComissao(
        form.premioLiquido,
        valor,
      ),
    );
  }


  function alterarPremioTotal(
    valor: number | null,
  ) {
    setValue(
      "premioTotal",
      valor,
    );

    setValue(
      "valorParcela",
      calcularParcela(
        valor,
        form.parcelaMaxima,
      ),
    );
  }

  function alterarCustoApolice(
  valor: number | null,
) {
  setValue(
    "custoApolice",
    valor,
  );

  const novoTotal =
    calcularPremioTotal(
      form.premioLiquido,
      form.iof,
      valor,
    );

  setValue(
    "premioTotal",
    novoTotal,
  );

  setValue(
    "valorParcela",
    calcularParcela(
      novoTotal,
      form.parcelaMaxima,
    ),
  );
}

  function alterarQuantidadeParcelas(
    valor: string,
  ) {
    const somenteNumeros =
      valor.replace(
        /\D/g,
        "",
      );

    if (!somenteNumeros) {
      setValue(
        "parcelaMaxima",
        null,
      );

      setValue(
        "parcelamento",
        "",
      );

      setValue(
        "valorParcela",
        null,
      );

      return;
    }

    const quantidade =
      Number(
        somenteNumeros,
      );

    if (
      !Number.isFinite(
        quantidade,
      ) ||
      quantidade <= 0
    ) {
      return;
    }

    const quantidadeLimitada =
      Math.min(
        quantidade,
        36,
      );

    setValue(
      "parcelaMaxima",
      quantidadeLimitada,
    );

    setValue(
      "parcelamento",
      `${quantidadeLimitada}x`,
    );

    setValue(
      "valorParcela",
      calcularParcela(
        form.premioTotal,
        quantidadeLimitada,
      ),
    );
  }


  return (
    <div className="space-y-8">

      {/* VALORES DA COTAÇÃO */}

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
            <DollarSign
              size={20}
            />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-800">
              Valores da Cotação
            </h4>

            <p className="text-sm text-slate-500">
              Informe os valores apresentados pela seguradora.
            </p>
          </div>
        </div>


        <div className="grid gap-x-5 md:grid-cols-2">

          <CampoFinanceiro
            label="Prêmio Líquido"
            helperText="Valor líquido utilizado para o cálculo da comissão."
          >
            <CurrencyInput
              value={
                form.premioLiquido
              }
              onValueChange={
                alterarPremioLiquido
              }
              placeholder="R$ 0,00"
            />
          </CampoFinanceiro>


          <CampoFinanceiro
            label="IOF"
          >
            <CurrencyInput
              value={form.iof}
              onValueChange={alterarIof}
            />
          </CampoFinanceiro>


          <CampoFinanceiro
            label="Custo da Apólice"
          >
            <CurrencyInput
              value={form.custoApolice}
              onValueChange={alterarCustoApolice}
            />
          </CampoFinanceiro>


          <CampoFinanceiro
            label="Prêmio Total"
            helperText="Valor final que será apresentado ao cliente."
          >
            <CurrencyInput
              value={
                form.premioTotal
              }
              onValueChange={
                alterarPremioTotal
              }
              placeholder="R$ 0,00"
            />
          </CampoFinanceiro>

        </div>
      </section>


      {/* COMISSÃO */}

      <section className="border-t border-slate-200 pt-7">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <Percent
              size={20}
            />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-800">
              Comissão
            </h4>

            <p className="text-sm text-slate-500">
              O valor é calculado automaticamente sobre o prêmio líquido.
            </p>
          </div>
        </div>


        <div className="grid gap-x-5 md:grid-cols-2">

          <CampoFinanceiro
            label="Percentual de Comissão"
          >
            <PercentInput
              value={
                form.comissaoPercentual
              }
              onValueChange={
                alterarPercentualComissao
              }
              placeholder="0,00%"
              min={0}
              max={100}
            />
          </CampoFinanceiro>


          <CampoFinanceiro
            label="Valor da Comissão"
            helperText="Calculado automaticamente."
          >
            <CurrencyInput
              value={
                comissaoCalculada
              }
              onValueChange={() => {
                // Campo calculado.
              }}
              disabled
              placeholder="R$ 0,00"
              className="
                w-full
                cursor-not-allowed
                rounded-xl
                border
                border-green-200
                bg-green-50
                px-3
                py-2
                font-semibold
                text-green-800
                outline-none
              "
            />
          </CampoFinanceiro>

        </div>


        {form.premioLiquido !== null &&
          form.comissaoPercentual !== null && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4">

              <div className="flex items-start gap-3">

                <Calculator
                  size={20}
                  className="mt-0.5 text-green-700"
                />

                <div>
                  <p className="font-semibold text-green-800">
                    Comissão estimada
                  </p>

                  <p className="mt-1 text-sm text-green-700">
                    {moeda(
                      form.premioLiquido,
                    )}
                    {" × "}
                    {form.comissaoPercentual.toLocaleString(
                      "pt-BR",
                    )}
                    {"% = "}
                    <strong>
                      {moeda(
                        comissaoCalculada,
                      )}
                    </strong>
                  </p>
                </div>

              </div>

            </div>
          )}

      </section>


      {/* PAGAMENTO */}

      <section className="border-t border-slate-200 pt-7">

        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <CreditCard
              size={20}
            />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-800">
              Pagamento
            </h4>

            <p className="text-sm text-slate-500">
              Registre a condição de pagamento oferecida.
            </p>
          </div>
        </div>


        <div className="grid gap-x-5 md:grid-cols-2">

          <Select
            label="Forma de Pagamento"
            value={
              form.formaPagamento
            }
            options={
              formasPagamento
            }
            onChange={(
              valor,
            ) =>
              setValue(
                "formaPagamento",
                valor,
              )
            }
          />


          <Input
            label="Quantidade de Parcelas"
            value={
              form.parcelaMaxima?.toString() ??
              ""
            }
            placeholder="Ex.: 12"
            maxLength={2}
            onChange={
              alterarQuantidadeParcelas
            }
          />


          <Input
            label="Parcelamento"
            value={
              form.parcelamento
            }
            placeholder="Gerado automaticamente"
            disabled
            onChange={() => {
              // Campo calculado.
            }}
          />


          <CampoFinanceiro
            label="Valor da Parcela"
            helperText="Calculado automaticamente com base no prêmio total."
          >
            <CurrencyInput
              value={
                parcelaCalculada
              }
              onValueChange={() => {
                // Campo calculado.
              }}
              disabled
              placeholder="R$ 0,00"
              className="
                w-full
                cursor-not-allowed
                rounded-xl
                border
                border-blue-200
                bg-blue-50
                px-3
                py-2
                font-semibold
                text-blue-900
                outline-none
              "
            />
          </CampoFinanceiro>


          <Input
            type="date"
            label="Vencimento da Primeira Parcela"
            value={
              form.vencimentoPrimeira
            }
            onChange={(
              valor,
            ) =>
              setValue(
                "vencimentoPrimeira",
                valor,
              )
            }
          />

        </div>


        {form.premioTotal !== null &&
          form.parcelaMaxima !== null &&
          form.parcelaMaxima > 0 && (
            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">

              <p className="text-sm font-medium text-blue-700">
                Condição apresentada ao cliente
              </p>

              <div className="mt-2 flex flex-wrap items-end gap-2">

                <span className="text-2xl font-bold text-blue-950">
                  {form.parcelaMaxima}x
                </span>

                <span className="pb-0.5 text-slate-500">
                  de
                </span>

                <span className="text-2xl font-bold text-blue-950">
                  {moeda(
                    parcelaCalculada,
                  )}
                </span>

              </div>

              <p className="mt-2 text-sm text-slate-500">
                Prêmio total:{" "}
                <strong className="text-slate-700">
                  {moeda(
                    form.premioTotal,
                  )}
                </strong>
              </p>

            </div>
          )}

      </section>

    </div>
  );
}