"use client";

import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileText,
  ShieldCheck,
} from "lucide-react";

import {
  useMemo,
  useState,
} from "react";

import Button from "@/components/ui/Button";

import StepDadosGerais from "./steps/StepDadosGerais";
import StepFinanceiro from "./steps/StepFinanceiro";
import useCotacaoSeguradoraForm from "./useCotacaoSeguradoraForm";

import StepCoberturas from "./steps/StepCoberturas";
import StepAssistencias from "./steps/StepAssistencias";
import StepArquivos from "./steps/StepArquivos";


export type CotacaoSeguradoraOption = {
  value: number;
  label: string;
  codigo: string | null;
};


export type CotacaoSeguradoraSelectOption = {
  value: string;
  label: string;
};


export type CotacaoSeguradoraFormData = {
  id?: string;

  cotacaoId: string;

  seguradoraId: number | null;

  numeroCotacao: string;

  codigoCalculo: string;

  tipoCotacao: string;

  classeBonus: string;

  status: string;

  premioLiquido: number | null;

  premioTotal: number | null;

  iof: number | null;

  custoApolice: number | null;

  franquiaNormal: number | null;

  franquiaReduzida: number | null;

  franquiaMajorada: number | null;

  percentualFipe: number | null;

  tipoCasco: string;

  danosMateriais: number | null;

  danosCorporais: number | null;

  danosMorais: number | null;

  appMorte: number | null;

  appInvalidez: number | null;

  appDespesasMedicas: number | null;

  comissaoPercentual: number | null;

  comissaoValor: number | null;

  formaPagamento: string;

  parcelamento: string;

  parcelaMaxima: number | null;

  valorParcela: number | null;

  vencimentoPrimeira: string;

  validade: string;

  origemCotacao: string;

  consultorNome: string;

  consultorTelefone: string;

  observacaoInterna: string;

  assistencia: string;

  assistencia24h: boolean;

  carroReserva: string;

  quilometragemGuincho: string;

  coberturaVidros: boolean;

  coberturaFarois: boolean;

  coberturaLanternas: boolean;

  coberturaRetrovisores: boolean;

  chaveiro: boolean;

  taxi: boolean;

  hotel: boolean;

  coberturas: string;

  observacoes: string;

  arquivoPdfFile: File | null;

  arquivoPdfPath: string | null;

  arquivoPdfNome: string | null;

  arquivoPdfTipo: string | null;

  arquivoPdfTamanho: number | null;

  recomendada: boolean;

  ordemExibicao: number;
};


type Props = {
  initialData: CotacaoSeguradoraFormData;

  seguradoras: CotacaoSeguradoraOption[];

  statusOptions:
    CotacaoSeguradoraSelectOption[];

  tiposCotacao:
    CotacaoSeguradoraSelectOption[];

  tiposCasco:
    CotacaoSeguradoraSelectOption[];

  carroReservaOptions:
    CotacaoSeguradoraSelectOption[];

  assistenciaOptions:
    CotacaoSeguradoraSelectOption[];

  onCancel: () => void;

  onSaved?: () => void;
};


type StepId =
  | "geral"
  | "financeiro"
  | "coberturas"
  | "assistencias"
  | "arquivos";


type Step = {
  id: StepId;
  label: string;
};


const steps: Step[] = [
  {
    id: "geral",
    label: "Dados Gerais",
  },
  {
    id: "financeiro",
    label: "Financeiro",
  },
  {
    id: "coberturas",
    label: "Coberturas",
  },
  
  {
    id: "assistencias",
    label: "Assistências",
  },
  {
    id: "arquivos",
    label: "PDF e Observações",
  },
];


function moeda(
  valor: number | null,
): string {
  if (
    valor === null ||
    valor === undefined
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


function EtapaEmConstrucao({
  tipo,
}: {
  tipo: "normal" | "arquivo";
}) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 text-center">
      {tipo === "arquivo" ? (
        <FileText
          size={40}
          className="mb-4 text-blue-300"
        />
      ) : (
        <ShieldCheck
          size={40}
          className="mb-4 text-blue-300"
        />
      )}

      <p className="font-semibold text-slate-700">
        Estrutura da etapa pronta.
      </p>

      <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
        Os campos desta etapa serão adicionados na
        próxima fase da Central Operacional.
      </p>
    </div>
  );
}


export default function CotacaoSeguradoraForm({
  initialData,
  seguradoras,
  statusOptions,
  tiposCotacao,
  tiposCasco,
  carroReservaOptions,
  assistenciaOptions,
  onCancel,
  onSaved,
}: Props) {
  const {
    form,
    loading,
    setValue,
    salvar,
  } = useCotacaoSeguradoraForm({
    initialData,
    onSaved,
  });


  const [
    currentStepIndex,
    setCurrentStepIndex,
  ] = useState(0);


  const currentStep =
    steps[currentStepIndex];


  const progress =
    Math.round(
      (
        (currentStepIndex + 1) /
        steps.length
      ) *
        100,
    );


  const seguradoraNome =
    useMemo(
      () =>
        seguradoras.find(
          (seguradora) =>
            seguradora.value ===
            form.seguradoraId,
        )?.label ??
        "Seguradora não selecionada",
      [
        form.seguradoraId,
        seguradoras,
      ],
    );


  function goPrevious() {
    setCurrentStepIndex(
      (current) =>
        Math.max(
          current - 1,
          0,
        ),
    );
  }


  function goNext() {
    setCurrentStepIndex(
      (current) =>
        Math.min(
          current + 1,
          steps.length - 1,
        ),
    );
  }


  function selectStep(
    index: number,
  ) {
    setCurrentStepIndex(index);
  }


  function renderCurrentStep() {
    if (
      currentStep.id ===
      "geral"
    ) {
      return (
        <StepDadosGerais
          form={form}
          setValue={setValue}
          seguradoras={seguradoras}
          statusOptions={statusOptions}
          tiposCotacao={tiposCotacao}
        />
      );
    }

  if (
      currentStep.id ===
      "financeiro"
    ) {
      return (
        <StepFinanceiro
          form={form}
          setValue={setValue}
        />
      );
    }

  if (
  currentStep.id ===
  "coberturas"
) {
  return (
    <StepCoberturas
      form={form}
      setValue={setValue}
      tiposCasco={tiposCasco}
    />
  );
}

if (
  currentStep.id ===
  "assistencias"
) {
  return (
    <StepAssistencias
      form={form}
      setValue={setValue}
      carroReservaOptions={carroReservaOptions}
      assistenciaOptions={assistenciaOptions}
    />
  );
}


    if (
        currentStep.id ===
        "arquivos"
      ) {
        return (
          <StepArquivos
            form={form}
            setValue={setValue}
          />
        );
    }


    return (
      <EtapaEmConstrucao
        tipo="normal"
      />
    );
  }


  return (
    <div className="space-y-6">
      <div>
        <div className="mb-2 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-blue-900">
            Progresso do preenchimento
          </p>

          <span className="text-sm font-bold text-blue-900">
            {progress}%
          </span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-900 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>
      </div>


      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="mb-6 overflow-x-auto">
            <div className="flex min-w-max gap-2">
              {steps.map(
                (
                  step,
                  index,
                ) => {
                  const active =
                    index ===
                    currentStepIndex;

                  const completed =
                    index <
                    currentStepIndex;

                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() =>
                        selectStep(index)
                      }
                      className={`
                        inline-flex
                        items-center
                        gap-2
                        rounded-xl
                        border
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        transition
                        ${
                          active
                            ? "border-blue-900 bg-blue-900 text-white"
                            : completed
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }
                      `}
                    >
                      {completed && (
                        <Check size={16} />
                      )}

                      {step.label}
                    </button>
                  );
                },
              )}
            </div>
          </div>


          <section className="min-h-[360px] rounded-2xl border border-slate-200 bg-slate-50/50 p-6">
            <div className="mb-5">
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-700">
                Etapa{" "}
                {currentStepIndex + 1} de{" "}
                {steps.length}
              </p>

              <h3 className="mt-1 text-xl font-bold text-slate-800">
                {currentStep.label}
              </h3>
            </div>

            {renderCurrentStep()}
          </section>


          <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={
                currentStepIndex === 0
                  ? onCancel
                  : goPrevious
              }
            >
              <ChevronLeft size={18} />

              {currentStepIndex === 0
                ? "Cancelar"
                : "Anterior"}
            </Button>


            {currentStepIndex <
            steps.length - 1 ? (
              <Button
                type="button"
                onClick={goNext}
              >
                Próximo

                <ChevronRight size={18} />
              </Button>
            ) : (
              <Button
                type="button"
                loading={loading}
                loadingText="Salvando..."
                onClick={salvar}
              >
                Salvar Cotação
              </Button>
            )}
          </div>
        </div>


        <aside className="h-fit rounded-2xl border border-blue-100 bg-blue-50/60 p-5 xl:sticky xl:top-4">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-700">
            Resumo
          </p>

          <h3 className="mt-2 text-lg font-bold text-blue-950">
            {seguradoraNome}
          </h3>


          <div className="mt-5 space-y-4">
            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Prêmio total
              </p>

              <p className="mt-1 text-lg font-bold text-slate-800">
                {moeda(
                  form.premioTotal,
                )}
              </p>
            </div>


            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Franquia normal
              </p>

              <p className="mt-1 font-bold text-slate-800">
                {moeda(
                  form.franquiaNormal,
                )}
              </p>
            </div>


            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Parcelamento
              </p>

              <p className="mt-1 font-bold text-slate-800">
                {form.parcelamento ||
                  "Não informado"}
              </p>
            </div>


            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Status
              </p>

              <p className="mt-1 font-bold text-slate-800">
                {form.status ||
                  "Não informado"}
              </p>
            </div>


            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Origem
              </p>

              <p className="mt-1 font-bold text-slate-800">
                {form.origemCotacao ||
                  "Não informada"}
              </p>
            </div>


            <div className="rounded-xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500">
                Validade
              </p>

              <p className="mt-1 font-bold text-slate-800">
                {form.validade ||
                  "Não informada"}
              </p>
            </div>
          </div>


          {form.recomendada && (
            <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4 font-semibold text-yellow-700">
              ⭐ Cotação recomendada
            </div>
          )}
        </aside>
      </div>


      <div className="hidden">
        {tiposCasco.length}

        {carroReservaOptions.length}

        {assistenciaOptions.length}
      </div>
    </div>
  );
}