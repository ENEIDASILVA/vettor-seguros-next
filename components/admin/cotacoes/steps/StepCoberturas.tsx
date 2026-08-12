"use client";

import {
  CarFront,
  Shield,
  Users,
} from "lucide-react";

import CurrencyInput from "@/components/ui/CurrencyInput";
import PercentInput from "@/components/ui/PercentInput";
import Select from "@/components/ui/Select";

import type {
  CotacaoSeguradoraFormData,
  CotacaoSeguradoraSelectOption,
} from "../CotacaoSeguradoraForm";


type Props = {
  form: CotacaoSeguradoraFormData;

  setValue: <
    K extends keyof CotacaoSeguradoraFormData,
  >(
    field: K,
    value: CotacaoSeguradoraFormData[K],
  ) => void;

  tiposCasco:
    CotacaoSeguradoraSelectOption[];
};


function CampoCobertura({
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


export default function StepCoberturas({
  form,
  setValue,
  tiposCasco,
}: Props) {
  return (
    <div className="space-y-8">

      {/* CASCO */}

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
            <CarFront size={20} />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-800">
              Casco
            </h4>

            <p className="text-sm text-slate-500">
              Informe a cobertura principal do veículo
              e as franquias oferecidas.
            </p>
          </div>
        </div>


        <div className="grid gap-x-5 md:grid-cols-2">

          <Select
            label="Tipo de Casco"
            value={form.tipoCasco}
            options={tiposCasco}
            onChange={(valor) =>
              setValue(
                "tipoCasco",
                valor,
              )
            }
          />


          <CampoCobertura
            label="% da FIPE"
            helperText="Percentual de indenização contratado sobre o valor da tabela FIPE."
          >
            <PercentInput
              value={
                form.percentualFipe
              }
              onValueChange={(
                valor,
              ) =>
                setValue(
                  "percentualFipe",
                  valor,
                )
              }
              min={0}
              max={200}
              placeholder="100,00%"
            />
          </CampoCobertura>


          <CampoCobertura
            label="Franquia Normal"
          >
            <CurrencyInput
              value={
                form.franquiaNormal
              }
              onValueChange={(
                valor,
              ) =>
                setValue(
                  "franquiaNormal",
                  valor,
                )
              }
              placeholder="R$ 0,00"
            />
          </CampoCobertura>


          <CampoCobertura
            label="Franquia Reduzida"
          >
            <CurrencyInput
              value={
                form.franquiaReduzida
              }
              onValueChange={(
                valor,
              ) =>
                setValue(
                  "franquiaReduzida",
                  valor,
                )
              }
              placeholder="R$ 0,00"
            />
          </CampoCobertura>


          <CampoCobertura
            label="Franquia Majorada"
          >
            <CurrencyInput
              value={
                form.franquiaMajorada
              }
              onValueChange={(
                valor,
              ) =>
                setValue(
                  "franquiaMajorada",
                  valor,
                )
              }
              placeholder="R$ 0,00"
            />
          </CampoCobertura>

        </div>


        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <div className="flex items-start gap-3">
            <Shield
              size={20}
              className="mt-0.5 text-blue-700"
            />

            <div>
              <p className="font-semibold text-blue-900">
                Resumo do Casco
              </p>

              <div className="mt-2 space-y-1 text-sm text-blue-800">
                <p>
                  Tipo:{" "}
                  <strong>
                    {form.tipoCasco ||
                      "Não informado"}
                  </strong>
                </p>

                <p>
                  FIPE:{" "}
                  <strong>
                    {form.percentualFipe !== null
                      ? `${form.percentualFipe.toLocaleString(
                          "pt-BR",
                        )}%`
                      : "Não informado"}
                  </strong>
                </p>

                <p>
                  Franquia normal:{" "}
                  <strong>
                    {moeda(
                      form.franquiaNormal,
                    )}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* RCF */}

      <section className="border-t border-slate-200 pt-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-700">
            <Shield size={20} />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-800">
              Responsabilidade Civil Facultativa
            </h4>

            <p className="text-sm text-slate-500">
              Limites contratados para danos causados
              a terceiros.
            </p>
          </div>
        </div>


        <div className="grid gap-x-5 md:grid-cols-3">

          <CampoCobertura
            label="Danos Materiais"
          >
            <CurrencyInput
              value={
                form.danosMateriais
              }
              onValueChange={(
                valor,
              ) =>
                setValue(
                  "danosMateriais",
                  valor,
                )
              }
              placeholder="R$ 0,00"
            />
          </CampoCobertura>


          <CampoCobertura
            label="Danos Corporais"
          >
            <CurrencyInput
              value={
                form.danosCorporais
              }
              onValueChange={(
                valor,
              ) =>
                setValue(
                  "danosCorporais",
                  valor,
                )
              }
              placeholder="R$ 0,00"
            />
          </CampoCobertura>


          <CampoCobertura
            label="Danos Morais"
          >
            <CurrencyInput
              value={
                form.danosMorais
              }
              onValueChange={(
                valor,
              ) =>
                setValue(
                  "danosMorais",
                  valor,
                )
              }
              placeholder="R$ 0,00"
            />
          </CampoCobertura>

        </div>
      </section>


      {/* APP começa na Parte 2 */}

      <section className="border-t border-slate-200 pt-7">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
            <Users size={20} />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-800">
              APP — Acidentes Pessoais de Passageiros
            </h4>

            <p className="text-sm text-slate-500">
              Limites de cobertura por passageiro.
            </p>
          </div>
        </div>

                <div className="grid gap-x-5 md:grid-cols-3">

          <CampoCobertura
            label="APP Morte"
          >
            <CurrencyInput
              value={
                form.appMorte
              }
              onValueChange={(
                valor,
              ) =>
                setValue(
                  "appMorte",
                  valor,
                )
              }
              placeholder="R$ 0,00"
            />
          </CampoCobertura>


          <CampoCobertura
            label="APP Invalidez"
          >
            <CurrencyInput
              value={
                form.appInvalidez
              }
              onValueChange={(
                valor,
              ) =>
                setValue(
                  "appInvalidez",
                  valor,
                )
              }
              placeholder="R$ 0,00"
            />
          </CampoCobertura>


          <CampoCobertura
            label="Despesas Médicas"
          >
            <CurrencyInput
              value={
                form.appDespesasMedicas
              }
              onValueChange={(
                valor,
              ) =>
                setValue(
                  "appDespesasMedicas",
                  valor,
                )
              }
              placeholder="R$ 0,00"
            />
          </CampoCobertura>

        </div>


        <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 p-5">

          <div className="flex items-start gap-3">

            <Users
              size={20}
              className="mt-0.5 text-purple-700"
            />

            <div>

              <p className="font-semibold text-purple-900">
                Resumo das Coberturas
              </p>

              <div className="mt-3 grid gap-2 text-sm md:grid-cols-2">

                <div>
                  <span className="text-slate-500">
                    Tipo Casco
                  </span>

                  <p className="font-semibold text-slate-800">
                    {form.tipoCasco ||
                      "-"}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">
                    FIPE
                  </span>

                  <p className="font-semibold text-slate-800">
                    {form.percentualFipe !==
                    null
                      ? `${form.percentualFipe}%`
                      : "-"}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">
                    Danos Materiais
                  </span>

                  <p className="font-semibold text-slate-800">
                    {moeda(
                      form.danosMateriais,
                    )}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">
                    Danos Corporais
                  </span>

                  <p className="font-semibold text-slate-800">
                    {moeda(
                      form.danosCorporais,
                    )}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">
                    Danos Morais
                  </span>

                  <p className="font-semibold text-slate-800">
                    {moeda(
                      form.danosMorais,
                    )}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">
                    APP Morte
                  </span>

                  <p className="font-semibold text-slate-800">
                    {moeda(
                      form.appMorte,
                    )}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">
                    APP Invalidez
                  </span>

                  <p className="font-semibold text-slate-800">
                    {moeda(
                      form.appInvalidez,
                    )}
                  </p>
                </div>

                <div>
                  <span className="text-slate-500">
                    Despesas Médicas
                  </span>

                  <p className="font-semibold text-slate-800">
                    {moeda(
                      form.appDespesasMedicas,
                    )}
                  </p>
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

