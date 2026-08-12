"use client";

import {
  Car,
  CarTaxiFront,
  CheckCircle2,
  Hotel,
  KeyRound,
  Lightbulb,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import Input from "@/components/ui/Input";
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

  carroReservaOptions:
    CotacaoSeguradoraSelectOption[];

  assistenciaOptions:
    CotacaoSeguradoraSelectOption[];
};


type BooleanField =
  | "assistencia24h"
  | "coberturaVidros"
  | "coberturaFarois"
  | "coberturaLanternas"
  | "coberturaRetrovisores"
  | "chaveiro"
  | "taxi"
  | "hotel";


type CheckCardProps = {
  label: string;

  description?: string;

  checked: boolean;

  onChange: (
    checked: boolean,
  ) => void;

  icon:
    React.ReactNode;
};


function CheckCard({
  label,
  description,
  checked,
  onChange,
  icon,
}: CheckCardProps) {
  return (
    <label
      className={`
        flex
        cursor-pointer
        items-start
        gap-3
        rounded-2xl
        border
        p-4
        transition
        ${
          checked
            ? "border-green-300 bg-green-50"
            : "border-slate-200 bg-white hover:bg-slate-50"
        }
      `}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(
            event.target.checked,
          )
        }
        className="sr-only"
      />

      <div
        className={`
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          ${
            checked
              ? "bg-green-100 text-green-700"
              : "bg-slate-100 text-slate-500"
          }
        `}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-slate-800">
            {label}
          </p>

          {checked && (
            <CheckCircle2
              size={17}
              className="text-green-600"
            />
          )}
        </div>

        {description && (
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>
    </label>
  );
}


export default function StepAssistencias({
  form,
  setValue,
  carroReservaOptions,
  assistenciaOptions,
}: Props) {
  function alterarBooleano(
    field: BooleanField,
    checked: boolean,
  ) {
    setValue(
      field,
      checked,
    );
  }


  return (
    <div className="space-y-8">

      <section>
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-800">
            <ShieldCheck size={20} />
          </div>

          <div>
            <h4 className="text-lg font-bold text-slate-800">
              Assistência 24h
            </h4>

            <p className="text-sm text-slate-500">
              Registre o plano de assistência e os principais serviços incluídos.
            </p>
          </div>
        </div>


        <div className="grid gap-x-5 md:grid-cols-2">

          <Select
            label="Plano de Assistência"
            value={form.assistencia}
            options={assistenciaOptions}
            onChange={(valor) =>
              setValue(
                "assistencia",
                valor,
              )
            }
          />


          <Select
            label="Carro Reserva"
            value={form.carroReserva}
            options={carroReservaOptions}
            onChange={(valor) =>
              setValue(
                "carroReserva",
                valor,
              )
            }
          />


          <Input
            label="Quilometragem do Guincho"
            value={form.quilometragemGuincho}
            placeholder="Ex.: 200 km, 500 km ou ilimitado"
            onChange={(valor) =>
              setValue(
                "quilometragemGuincho",
                valor,
              )
            }
          />

        </div>


        <div className="mt-4">
          <CheckCard
            label="Assistência 24h inclusa"
            description="Marque quando a proposta oferecer assistência emergencial 24 horas."
            checked={form.assistencia24h}
            onChange={(checked) =>
              alterarBooleano(
                "assistencia24h",
                checked,
              )
            }
            icon={
              <Wrench size={19} />
            }
          />
        </div>
      </section>


      <section className="border-t border-slate-200 pt-7">
        <div className="mb-5">
          <h4 className="text-lg font-bold text-slate-800">
            Vidros e Acessórios
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Marque os itens contemplados na cobertura da seguradora.
          </p>
        </div>


        <div className="grid gap-4 md:grid-cols-2">

          <CheckCard
            label="Vidros"
            checked={form.coberturaVidros}
            onChange={(checked) =>
              alterarBooleano(
                "coberturaVidros",
                checked,
              )
            }
            icon={
              <ShieldCheck size={19} />
            }
          />


          <CheckCard
            label="Faróis"
            checked={form.coberturaFarois}
            onChange={(checked) =>
              alterarBooleano(
                "coberturaFarois",
                checked,
              )
            }
            icon={
              <Lightbulb size={19} />
            }
          />


          <CheckCard
            label="Lanternas"
            checked={form.coberturaLanternas}
            onChange={(checked) =>
              alterarBooleano(
                "coberturaLanternas",
                checked,
              )
            }
            icon={
              <Lightbulb size={19} />
            }
          />


          <CheckCard
            label="Retrovisores"
            checked={form.coberturaRetrovisores}
            onChange={(checked) =>
              alterarBooleano(
                "coberturaRetrovisores",
                checked,
              )
            }
            icon={
              <Car size={19} />
            }
          />

        </div>
      </section>


      <section className="border-t border-slate-200 pt-7">
        <div className="mb-5">
          <h4 className="text-lg font-bold text-slate-800">
            Serviços Adicionais
          </h4>

          <p className="mt-1 text-sm text-slate-500">
            Informe outros benefícios incluídos na assistência.
          </p>
        </div>


        <div className="grid gap-4 md:grid-cols-2">

          <CheckCard
            label="Chaveiro"
            checked={form.chaveiro}
            onChange={(checked) =>
              alterarBooleano(
                "chaveiro",
                checked,
              )
            }
            icon={
              <KeyRound size={19} />
            }
          />


          <CheckCard
            label="Táxi"
            checked={form.taxi}
            onChange={(checked) =>
              alterarBooleano(
                "taxi",
                checked,
              )
            }
            icon={
              <CarTaxiFront size={19} />
            }
          />


          <CheckCard
            label="Hotel"
            checked={form.hotel}
            onChange={(checked) =>
              alterarBooleano(
                "hotel",
                checked,
              )
            }
            icon={
              <Hotel size={19} />
            }
          />

        </div>
      </section>


      <section className="border-t border-slate-200 pt-7">
        <div className="rounded-2xl border border-blue-100 bg-blue-50/60 p-5">
          <p className="font-semibold text-blue-900">
            Resumo das Assistências
          </p>

          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">

            <div>
              <span className="text-slate-500">
                Assistência
              </span>

              <p className="font-semibold text-slate-800">
                {form.assistencia ||
                  "Não informada"}
              </p>
            </div>


            <div>
              <span className="text-slate-500">
                Carro reserva
              </span>

              <p className="font-semibold text-slate-800">
                {form.carroReserva ||
                  "Não informado"}
              </p>
            </div>


            <div>
              <span className="text-slate-500">
                Guincho
              </span>

              <p className="font-semibold text-slate-800">
                {form.quilometragemGuincho ||
                  "Não informado"}
              </p>
            </div>


            <div>
              <span className="text-slate-500">
                Assistência 24h
              </span>

              <p className="font-semibold text-slate-800">
                {form.assistencia24h
                  ? "Sim"
                  : "Não"}
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}